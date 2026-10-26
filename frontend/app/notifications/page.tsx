"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { apiFetch } from "@/services/api";

type Notification = { id: string; title: string; message: string; read: boolean; createdAt: string };

export default function Notifications() {
  const { user, loading: userLoading } = useCurrentUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    apiFetch<Notification[]>(`/api/notifications/${user.id}`)
      .then(setNotifications)
      .finally(() => setLoading(false));
  }, [user]);

  async function markRead(notification: Notification) {
    if (!user || notification.read) return;
    await apiFetch(`/api/notifications/${user.id}/${notification.id}/read`, { method: "PATCH" });
    setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, read: true } : item));
  }

  if (userLoading || loading) return <main className="p-7">Loading notifications...</main>;
  return <main className="mx-auto max-w-4xl space-y-7 p-5 md:p-7"><PageHeader title="Important Updates" description="Notes and updates published by your administrator."/><div className="space-y-3">{notifications.length ? notifications.map((notification) => <button key={notification.id} onClick={() => markRead(notification)} className={`card flex w-full gap-4 p-5 text-left ${notification.read ? "opacity-70" : ""}`}><div className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${notification.read ? "bg-slate-300" : "bg-indigo-600"}`} /><div><p className="font-bold">{notification.title}</p><p className="mt-1 text-sm muted">{notification.message}</p><p className="mt-2 text-xs muted">{new Date(notification.createdAt).toLocaleString()}</p></div></button>) : <div className="card p-8 text-center muted">No important updates yet.</div>}</div></main>;
}
