"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { apiFetch } from "@/services/api";

type Recommendation = {
  career: { id: string; title: string; description: string | null; category: string | null; demand: string | null; url: string | null };
  score: number;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  modelSource: string;
};

export default function Recommendations() {
  const { user, profile, loading } = useCurrentUser();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    apiFetch<Recommendation[]>(`/api/careers/recommendations/${user.id}`)
      .then(setRecommendations)
      .catch(() => setError("Unable to load recommendations right now."));
  }, [user]);
  if (loading) return <main className="p-7">Loading recommendations...</main>;
  const insufficient = !profile || !profile.skills.length;
  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7">
    <PageHeader title={`Career Recommendations${user?.name ? ` for ${user.name}` : ""}`} description="Recommendations are ranked from the skills saved in your profile and each career's requirements." />
    {error && <div className="card p-8 text-center text-rose-600">{error}</div>}
    {insufficient && !error && <section className="card p-8 text-center"><p className="font-semibold">Complete your profile to receive more personalized career recommendations.</p><Link href="/profile"><Button className="mt-4">Complete My Profile</Button></Link></section>}
    {!insufficient && !error && (recommendations.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{recommendations.map((item, index) => <article key={item.career.id} className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3"><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">Rank #{index + 1}</span><span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">{item.score}% Match</span></div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wide text-indigo-600">{item.career.category || "Career path"}</p><h2 className="mt-1 text-xl font-bold">{item.career.title}</h2>
      <p className="mt-3 text-sm muted">Weighted recommendation based on {item.matchedSkills.length} of {item.requiredSkills.length} required skills.</p>
      <div className="mt-4"><p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Matched skills</p><div className="mt-2 flex flex-wrap gap-2">{item.matchedSkills.length ? item.matchedSkills.map(skill => <span key={skill} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">{skill}</span>) : <span className="text-xs muted">None yet</span>}</div></div>
      <div className="mt-4"><p className="text-xs font-bold uppercase tracking-wide text-rose-700">Missing skills</p><div className="mt-2 flex flex-wrap gap-2">{item.missingSkills.length ? item.missingSkills.map(skill => <span key={skill} className="rounded-full bg-rose-50 px-2.5 py-1 text-xs text-rose-700">{skill}</span>) : <span className="text-xs muted">No gaps identified</span>}</div></div>
      <div className="mt-auto flex flex-wrap gap-2 pt-5"><Link href={`/careers/${item.career.id}`}><Button>View Career</Button></Link><Link href={`/skills?careerId=${item.career.id}`}><Button variant="outline">View Skill Gap</Button></Link><Link href={`/roadmap?careerId=${item.career.id}`}><Button variant="outline">Start Learning Roadmap</Button></Link></div>
    </article>)}</div> : <section className="card p-8 text-center"><p className="font-semibold">No strong career matches found yet.</p><Link href="/careers"><Button className="mt-4">Explore Careers</Button></Link></section>)}
  </main>;
}
