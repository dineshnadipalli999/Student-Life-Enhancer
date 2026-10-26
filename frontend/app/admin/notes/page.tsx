"use client";
import { FormEvent, useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { apiFetch } from "@/services/api";
import { Button } from "@/components/ui/button";

type Note = { id: string; title: string; message: string; createdAt: string };

export default function NotesPage() {
  const [items, setItems] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setItems(await apiFetch<Note[]>("/api/notifications/admin/updates"));
  }

  useEffect(() => { load(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const endpoint = editingId ? `/api/notifications/admin/updates/${editingId}` : "/api/notifications/admin/broadcast";
      const result = await apiFetch<{ recipients?: number }>(endpoint, {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify({ title, message }),
      });
      setStatus(editingId ? "Note updated for all students." : `Note sent to ${result.recipients || 0} student(s).`);
      setTitle("");
      setMessage("");
      setEditingId(null);
      await load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save note");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this note for all students?")) return;
    await apiFetch(`/api/notifications/admin/updates/${id}`, { method: "DELETE" });
    await load();
    setStatus("Note deleted for all students.");
  }

  return <main className="mx-auto max-w-4xl space-y-7 p-5 md:p-7">
    <PageHeader title="Notes" description="Publish career, market, and AI notes to every student." />
    <form onSubmit={submit} className="card space-y-4 p-6">
      <input required value={title} onChange={event => setTitle(event.target.value)} placeholder="Note title *" className="w-full rounded-xl border bg-transparent px-4 py-3" />
      <textarea required value={message} onChange={event => setMessage(event.target.value)} placeholder="Write a market, career, or learning note *" className="min-h-40 w-full rounded-xl border bg-transparent px-4 py-3" />
      <Button disabled={saving}>{saving ? "Saving..." : editingId ? "Update note for students" : "Send note to all students"}</Button>
      {editingId && <button type="button" onClick={() => { setEditingId(null); setTitle(""); setMessage(""); }} className="ml-3 text-sm muted">Cancel edit</button>}
      {status && <p className="text-sm font-semibold">{status}</p>}
    </form>
    <section className="card space-y-3 p-5">
      <h2 className="font-bold">Published notes</h2>
      {items.length ? items.map(item => <div key={item.id} className="flex items-start justify-between gap-4 rounded-xl border p-4">
        <div><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm muted">{item.message}</p></div>
        <div className="flex shrink-0 gap-2"><button onClick={() => { setEditingId(item.id); setTitle(item.title); setMessage(item.message); }} className="rounded-lg border px-3 py-2 text-xs font-semibold">Edit</button><button onClick={() => remove(item.id)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600">Delete</button></div>
      </div>) : <p className="p-6 text-center muted">No notes published yet.</p>}
    </section>
  </main>;
}
