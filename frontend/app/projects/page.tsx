"use client";

import { FormEvent, useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { ProjectCard } from "@/components/common/Cards";
import type { Project } from "@/types";
import { apiFetch } from "@/services/api";
import { Button } from "@/components/ui/button";

type DbProject = { id: string; ownerId: string | null; title: string; description: string | null; difficulty: string | null; skills: string | null; url: string | null };

export default function Projects() {
  const [items, setItems] = useState<Project[]>([]);
  const [ownedIds, setOwnedIds] = useState<string[]>([]);
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [skills, setSkills] = useState(""); const [url, setUrl] = useState(""); const [message, setMessage] = useState("");
  async function load() { const stored = localStorage.getItem("auth_user"); if (!stored) return; const userId = JSON.parse(stored).id; const data = await apiFetch<DbProject[]>(`/api/projects/${userId}`); setOwnedIds(data.filter((project) => project.ownerId === userId).map((project) => project.id)); setItems(data.map((project) => ({ id: project.id, title: project.title, description: project.description || "Project", difficulty: project.difficulty || "Intermediate", skills: (project.skills || "").split(",").map((skill) => skill.trim()).filter(Boolean), matchScore: 0, duration: "Self-paced", url: project.url || undefined }))); }
  useEffect(() => { load(); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); const stored = localStorage.getItem("auth_user"); if (!stored) return; await apiFetch(`/api/projects/${JSON.parse(stored).id}`, { method: "POST", body: JSON.stringify({ title, description, skills, url, difficulty: "Intermediate" }) }); setTitle(""); setDescription(""); setSkills(""); setUrl(""); setMessage("Project added successfully."); await load(); }
  async function remove(id: string) { const stored = localStorage.getItem("auth_user"); if (!stored) return; const result = await apiFetch<{ count: number }>(`/api/projects/${JSON.parse(stored).id}/${id}`, { method: "DELETE" }); setMessage(result.count ? "Project deleted successfully." : "Only your own projects can be deleted."); await load(); }
  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7"><PageHeader title="Projects" description="Add and manage your own portfolio projects." /><form onSubmit={submit} className="card grid gap-4 p-5 md:grid-cols-2"><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Project name *" className="rounded-xl border bg-transparent px-4 py-3" /><input required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Project URL *" className="rounded-xl border bg-transparent px-4 py-3" /><input required value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="Skills, separated by commas *" className="rounded-xl border bg-transparent px-4 py-3 md:col-span-2" /><textarea required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description *" className="min-h-24 rounded-xl border bg-transparent px-4 py-3 md:col-span-2" /><Button className="md:col-span-2">Add my project</Button>{message && <p className="text-sm font-semibold md:col-span-2">{message}</p>}</form><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((project) => <div key={project.id}><ProjectCard project={project} />{ownedIds.includes(project.id) && <button onClick={() => remove(project.id)} className="mt-2 text-sm font-semibold text-rose-600">Delete project</button>}</div>)}</div></main>;
}
