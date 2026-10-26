"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";

type DbCareer = { id: string; title: string; description: string | null; category: string | null; demand: string | null; url: string | null; skills: { skill: { name: string } }[] };

export default function Careers() {
  const [items, setItems] = useState<DbCareer[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [skill, setSkill] = useState("");
  const [sort, setSort] = useState("title");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch<DbCareer[]>("/api/careers").then(setItems).catch(() => setError("Unable to load careers right now.")).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => [...new Set(items.map(item => item.category).filter(Boolean))] as string[], [items]);
  const skills = useMemo(() => [...new Set(items.flatMap(item => item.skills.map(link => link.skill.name)))].sort(), [items]);
  const filtered = useMemo(() => items.filter(item => {
    const text = `${item.title} ${item.description || ""}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) &&
      (!category || item.category === category) &&
      (!skill || item.skills.some(link => link.skill.name === skill));
  }).sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : (b.demand || "").localeCompare(a.demand || "")), [items, query, category, skill, sort]);

  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7">
    <PageHeader title="Career Explorer" description="Browse career paths published by administrators and find your next direction." />
    <section className="card grid gap-3 p-4 md:grid-cols-[2fr_1fr_1fr_1fr]">
      <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search careers..." className="rounded-xl border bg-transparent px-4 py-3 outline-none" />
      <select value={category} onChange={event => setCategory(event.target.value)} className="rounded-xl border bg-transparent px-4 py-3"><option value="">All categories</option>{categories.map(item => <option key={item}>{item}</option>)}</select>
      <select value={skill} onChange={event => setSkill(event.target.value)} className="rounded-xl border bg-transparent px-4 py-3"><option value="">All skills</option>{skills.map(item => <option key={item}>{item}</option>)}</select>
      <select value={sort} onChange={event => setSort(event.target.value)} className="rounded-xl border bg-transparent px-4 py-3"><option value="title">Sort by title</option><option value="demand">Sort by demand/growth</option></select>
    </section>
    {loading && <div className="card p-8 text-center muted">Loading careers...</div>}
    {error && <div className="card p-8 text-center text-rose-600">{error}</div>}
    {!loading && !error && <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.length ? filtered.map(career => <article key={career.id} className="card flex flex-col p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">{career.category || "Career path"}</p>
      <h2 className="mt-2 text-xl font-bold">{career.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm muted">{career.description}</p>
      <p className="mt-4 text-sm"><span className="font-semibold">Demand / growth:</span> {career.demand || "Not specified"}</p>
      <div className="mt-4 flex flex-wrap gap-2">{career.skills.length ? career.skills.map(link => <span key={link.skill.name} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">{link.skill.name}</span>) : <span className="text-xs muted">Skills not specified</span>}</div>
      <Link href={`/careers/${career.id}`} className="mt-5"><Button className="w-full">View Details</Button></Link>
    </article>) : <div className="card p-8 text-center muted md:col-span-3">No careers match your filters yet.</div>}</div>}
  </main>;
}
