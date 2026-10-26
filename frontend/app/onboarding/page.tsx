"use client";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";

export default function Onboarding() {
  const [form, setForm] = useState({ name: "", degree: "", branch: "", graduationYear: "", college: "", location: "", skills: "", bio: "" });
  const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  function update(field: keyof typeof form, value: string) { setForm(current => ({ ...current, [field]: value })); setError(""); }
  async function submit(event: FormEvent) {
    event.preventDefault(); const stored = localStorage.getItem("auth_user"); if (!stored) { setError("Your session has expired. Please sign in again."); return; }
    setSaving(true);
    try { const user = JSON.parse(stored) as { id: string }; await apiFetch(`/api/profile/${user.id}`, { method: "PATCH", body: JSON.stringify({ ...form, graduationYear: Number(form.graduationYear), skills: form.skills.split(",").map(skill => skill.trim()).filter(Boolean) }) }); window.location.href = "/dashboard"; }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to save your profile"); } finally { setSaving(false); }
  }
  const field = (label: string, key: keyof typeof form, props: Record<string, string> = {}) => <label className="text-sm font-semibold">{label} <span className="text-rose-600">*</span><input required value={form[key]} onChange={event => update(key, event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" {...props} /></label>;
  return <main className="mx-auto max-w-4xl px-5 py-12"><p className="text-sm font-bold text-indigo-600">Profile setup</p><h1 className="mt-2 text-3xl font-black">Create your professional profile</h1><p className="mt-2 muted">These details power your recommendations, skill gaps, roadmap, and assistant.</p><form onSubmit={submit} className="card mt-8 grid gap-5 p-7 md:grid-cols-2">{field("Full name", "name", { minLength: "2", placeholder: "Your full name" })}{field("Degree", "degree", { placeholder: "B.Tech, BCA, MBA..." })}{field("Branch", "branch", { placeholder: "Computer Science..." })}{field("Graduation year", "graduationYear", { type: "number", min: "1900", max: "2100" })}{field("College", "college", { placeholder: "College or university" })}{field("Location", "location", { placeholder: "City, country" })}<label className="text-sm font-semibold md:col-span-2">Technical skills <span className="text-rose-600">*</span><span className="mt-1 block text-xs font-normal muted">Separate skills with commas</span><input required value={form.skills} onChange={event => update("skills", event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" placeholder="React, Python, SQL" /></label><label className="text-sm font-semibold md:col-span-2">Professional summary <span className="text-rose-600">*</span><textarea required minLength={10} value={form.bio} onChange={event => update("bio", event.target.value)} className="mt-2 min-h-32 w-full rounded-xl border bg-transparent px-4 py-3" placeholder="Describe your interests and experience" /></label>{error && <p className="text-sm font-semibold text-rose-600 md:col-span-2">{error}</p>}<Button disabled={saving} className="md:col-span-2">{saving ? "Saving profile..." : "Save professional profile"}</Button></form></main>;
}
