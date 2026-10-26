"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";

type Career = { id: string; title: string; description: string | null; category: string | null; demand: string | null; url: string | null; skills: { skill: { name: string } }[] };

export default function CareersAdmin() {
  const [items, setItems] = useState<Career[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [category, setCategory] = useState(""); const [demand, setDemand] = useState(""); const [url, setUrl] = useState(""); const [skills, setSkills] = useState("");
  const [query, setQuery] = useState(""); const [categoryFilter, setCategoryFilter] = useState(""); const [message, setMessage] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);

  async function load() {
    try { setItems(await apiFetch<Career[]>("/api/careers")); } catch { setError("Unable to load careers."); } finally { setLoading(false); }
  }
  useEffect(() => {
    apiFetch<Career[]>("/api/careers").then(setItems).catch(() => setError("Unable to load careers.")).finally(() => setLoading(false));
  }, []);
  function reset() { setEditingId(null); setTitle(""); setDescription(""); setCategory(""); setDemand(""); setUrl(""); setSkills(""); }
  function edit(item: Career) { setEditingId(item.id); setTitle(item.title); setDescription(item.description || ""); setCategory(item.category || ""); setDemand(item.demand || ""); setUrl(item.url || ""); setSkills(item.skills.map(link => link.skill.name).join(", ")); setMessage(""); setError(""); }
  function normalizedSkills() { return [...new Map(skills.split(",").map(item => item.trim()).filter(Boolean).map(skill => [skill.toLowerCase(), skill])).values()]; }
  async function submit(event: FormEvent) {
    event.preventDefault(); setMessage(""); setError("");
    const parsedSkills = normalizedSkills();
    if (!title.trim() || !description.trim() || !url.trim() || !parsedSkills.length) { setError("Title, description, URL, and at least one required skill are required."); return; }
    try {
      new URL(url);
      await apiFetch(editingId ? `/api/careers/${editingId}` : "/api/careers", { method: editingId ? "PATCH" : "POST", body: JSON.stringify({ title, description, category, demand, url, skills: parsedSkills }) });
      setMessage(editingId ? "Career updated." : "Career added."); reset(); setLoading(true); await load();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to save career."); }
  }
  async function remove(id: string) {
    if (!window.confirm("Are you sure you want to delete this career?")) return;
    try { await apiFetch(`/api/careers/${id}`, { method: "DELETE" }); setMessage("Career deleted."); setItems(current => current.filter(item => item.id !== id)); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to delete career."); }
  }
  const categories = [...new Set(items.map(item => item.category).filter(Boolean))] as string[];
  const filtered = useMemo(() => items.filter(item => (!query || `${item.title} ${item.description || ""}`.toLowerCase().includes(query.toLowerCase())) && (!categoryFilter || item.category === categoryFilter)), [items, query, categoryFilter]);

  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7"><PageHeader title="Career Management" description="Publish career paths used by Explorer and skill-based recommendations." />
    <form onSubmit={submit} className="card grid gap-4 p-5 md:grid-cols-2"><input required value={title} onChange={event => setTitle(event.target.value)} placeholder="Career title *" className="rounded-xl border bg-transparent px-4 py-3" /><input value={category} onChange={event => setCategory(event.target.value)} placeholder="Category" className="rounded-xl border bg-transparent px-4 py-3" /><textarea required value={description} onChange={event => setDescription(event.target.value)} placeholder="Description *" className="min-h-24 rounded-xl border bg-transparent px-4 py-3 md:col-span-2" /><input value={demand} onChange={event => setDemand(event.target.value)} placeholder="Demand or growth note" className="rounded-xl border bg-transparent px-4 py-3" /><input required type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="Career information URL *" className="rounded-xl border bg-transparent px-4 py-3" /><input required value={skills} onChange={event => setSkills(event.target.value)} placeholder="Required skills, comma separated *" className="rounded-xl border bg-transparent px-4 py-3 md:col-span-2" /><Button disabled={loading}>{editingId ? "Update career" : "Add career"}</Button>{editingId && <button type="button" onClick={reset} className="text-sm muted">Cancel edit</button>}{message && <p className="text-sm font-semibold text-emerald-700 md:col-span-2">{message}</p>}{error && <p className="text-sm font-semibold text-rose-600 md:col-span-2">{error}</p>}</form>
    <section className="card space-y-4 p-5"><div className="flex flex-col gap-3 md:flex-row"><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search careers..." className="flex-1 rounded-xl border bg-transparent px-4 py-3" /><select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)} className="rounded-xl border bg-transparent px-4 py-3"><option value="">All categories</option>{categories.map(item => <option key={item}>{item}</option>)}</select></div><h2 className="font-bold">Published careers</h2>{loading ? <p className="muted">Loading careers...</p> : filtered.length ? <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead><tr className="border-b"><th className="p-3">Career title</th><th className="p-3">Category</th><th className="p-3">Demand / growth</th><th className="p-3">Required skills</th><th className="p-3">Actions</th></tr></thead><tbody>{filtered.map(item => <tr key={item.id} className="border-b last:border-0"><td className="p-3 font-semibold">{item.title}</td><td className="p-3">{item.category || "—"}</td><td className="p-3">{item.demand || "—"}</td><td className="p-3">{item.skills.map(link => link.skill.name).join(", ") || "—"}</td><td className="p-3"><div className="flex gap-2"><button onClick={() => edit(item)} className="rounded-lg border px-3 py-2 text-xs font-semibold">Edit</button><button onClick={() => remove(item.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600">Delete</button></div></td></tr>)}</tbody></table></div> : <p className="py-5 text-center muted">No careers match your filters.</p>}</section>
  </main>;
}
