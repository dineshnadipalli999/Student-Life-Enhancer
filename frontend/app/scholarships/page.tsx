"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";

type Scholarship = { id: string; title: string; provider: string | null; description: string | null; amount: string | null; eligibility: string | null; url: string | null; deadline: string | null };
export default function Page() {
  const [items, setItems] = useState<Scholarship[]>([]); const [query, setQuery] = useState("");
  useEffect(() => { apiFetch<Scholarship[]>("/api/scholarships").then(setItems); }, []);
  const filtered = items.filter(item => [item.title, item.provider, item.description, item.eligibility].filter(Boolean).join(" ").toLowerCase().includes(query.toLowerCase()));
  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7"><PageHeader title="Scholarships & Opportunities" description="Funding opportunities published by administrators." /><div className="card p-4"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search scholarships..." className="w-full bg-transparent p-2 outline-none" /></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.length ? filtered.map(item => <div key={item.id} className="card p-5"><p className="text-xs font-semibold text-indigo-600">Scholarship</p><h2 className="mt-2 text-xl font-bold">{item.title}</h2><p className="mt-1 text-sm muted">{item.provider}</p><p className="mt-4 text-sm">{item.description}</p><p className="mt-4 font-semibold">{item.amount}</p><p className="mt-2 text-xs muted">Eligibility: {item.eligibility}</p>{item.deadline && <p className="mt-2 text-xs muted">Deadline: {new Date(item.deadline).toLocaleDateString()}</p>}{item.url && <a href={item.url} target="_blank" rel="noreferrer" className="mt-5 block"><Button className="w-full">Apply</Button></a>}</div>) : <div className="card p-8 text-center muted md:col-span-2 xl:col-span-3">No scholarships have been published yet.</div>}</div></main>;
}
