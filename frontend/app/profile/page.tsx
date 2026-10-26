"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/layout/PageHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { apiFetch } from "@/services/api";
import { getInitials } from "@/lib/personalization";

export default function Profile() {
  const { user, profile, loading, refresh } = useCurrentUser();
  const [name, setName] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [college, setCollege] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setName(user?.name || "");
    setDegree(profile?.degree || "");
    setBranch(profile?.branch || "");
    setYear(profile?.graduationYear ? String(profile.graduationYear) : "");
    setCollege(profile?.college || "");
    setLocation(profile?.location || "");
    setSkills(profile?.skills.join(", ") || "");
  }, [user, profile]);

  async function saveProfile() {
    if (!user) return;
    if (!name.trim() || !degree.trim() || !branch.trim() || !year || !college.trim() || !location.trim() || !skills.trim()) {
      setError("Complete every profile field, including at least one technical skill.");
      return;
    }
    setError("");
    setSaved(false);
    try {
      await apiFetch(`/api/profile/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          degree,
          branch,
          graduationYear: year ? Number(year) : undefined,
          college,
          location,
          skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        }),
      });
      await refresh();
      setSaved(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save profile");
    }
  }

  if (loading) return <main className="p-7">Loading profile...</main>;

  const completion = [name, degree, branch, year, college, skills].filter(Boolean).length;
  const profileCompletion = Math.round((completion / 6) * 100);

  return <main className="mx-auto max-w-6xl space-y-7 p-5 md:p-7"><PageHeader title="My Profile" description="All fields are required because recommendations use this data." action={<Button onClick={saveProfile}>{saved ? "Saved" : "Save Changes"}</Button>} />{error && <p className="text-sm font-semibold text-rose-600">{error}</p>}<div className="grid gap-6 lg:grid-cols-[.35fr_.65fr]"><div className="card p-6"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-2xl font-black text-white">{getInitials(name)}</div><h2 className="mt-4 text-center text-xl font-bold">{name || "Your name"}</h2><p className="text-center text-sm muted">{branch || "Add your branch"}</p><div className="mt-6"><div className="flex justify-between text-sm"><span>Profile completion</span><b>{profileCompletion}%</b></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${profileCompletion}%` }} /></div></div></div><div className="card p-6"><div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-semibold">Full Name *<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label><label className="text-sm font-semibold">Email *<input required value={user?.email || ""} readOnly className="mt-2 w-full rounded-xl border bg-slate-50 px-4 py-3" /></label><label className="text-sm font-semibold">Education *<input required value={degree} onChange={(event) => setDegree(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label><label className="text-sm font-semibold">Branch *<input required value={branch} onChange={(event) => setBranch(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label><label className="text-sm font-semibold">Graduation Year *<input required value={year} onChange={(event) => setYear(event.target.value)} type="number" className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label><label className="text-sm font-semibold">College *<input required value={college} onChange={(event) => setCollege(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label><label className="text-sm font-semibold md:col-span-2">Location *<input required value={location} onChange={(event) => setLocation(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label></div><label className="mt-5 block text-sm font-semibold">Technical Skills *<span className="mt-2 block text-xs font-normal muted">Separate skills with commas</span><input required value={skills} onChange={(event) => setSkills(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label></div></div></main>;
}
