"use client";
import { FormEvent, useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { apiFetch } from "@/services/api";
import { Button } from "@/components/ui/button";

type Course = { id: string; title: string; url: string | null; description: string | null; skills: string | null };

export default function Page() {
  const [items, setItems] = useState<Course[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState(""); const [editingId, setEditingId] = useState<string | null>(null);
  async function load() { setItems(await apiFetch<Course[]>("/api/courses")); }
  useEffect(() => { load(); }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    await apiFetch(editingId ? `/api/admin/courses/${editingId}` : "/api/admin/courses", { method: editingId ? "PATCH" : "POST", body: JSON.stringify({ title, url, description, skills, provider: "Admin", level: "Intermediate", duration: "Self-paced" }) });
    setTitle(""); setUrl(""); setDescription(""); setSkills(""); setEditingId(null); setMessage(editingId ? "Course updated successfully." : "Course added successfully."); await load();
  }
  async function remove(id: string) {
    if (!window.confirm("Delete this course?")) return;
    await apiFetch(`/api/admin/courses/${id}`, { method: "DELETE" }); await load(); setMessage("Course deleted.");
  }
  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7"><PageHeader title="Course Management" description="Add courses with direct links for students." /><form onSubmit={submit} className="card grid gap-4 p-5 md:grid-cols-2"><input required value={title} onChange={event => setTitle(event.target.value)} placeholder="Course name *" className="rounded-xl border bg-transparent px-4 py-3" /><input required type="url" value={url} onChange={event => setUrl(event.target.value)} placeholder="Course URL *" className="rounded-xl border bg-transparent px-4 py-3" /><input required value={skills} onChange={event => setSkills(event.target.value)} placeholder="Skills, separated by commas *" className="rounded-xl border bg-transparent px-4 py-3 md:col-span-2" /><textarea required value={description} onChange={event => setDescription(event.target.value)} placeholder="Description *" className="min-h-24 rounded-xl border bg-transparent px-4 py-3 md:col-span-2" /><Button className="md:col-span-2">{editingId ? "Update course" : "Add course"}</Button>{editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(""); setUrl(""); setSkills(""); setDescription(""); }} className="text-sm muted md:col-span-2">Cancel edit</button>}{message && <p className="text-sm font-semibold md:col-span-2">{message}</p>}</form><div className="card space-y-3 p-5">{items.map(item => <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border p-4"><a href={item.url || "#"} target="_blank" rel="noreferrer"><p className="font-semibold">{item.title}</p><p className="text-xs muted">Open course link</p></a><div className="flex gap-2"><button onClick={() => { setEditingId(item.id); setTitle(item.title); setUrl(item.url || ""); setSkills(item.skills || ""); setDescription(item.description || ""); }} className="rounded-lg border px-3 py-2 text-xs font-semibold">Edit</button><button onClick={() => remove(item.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600">Delete</button></div></div>)}</div></main>;
}
