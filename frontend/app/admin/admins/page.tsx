"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { apiFetch } from "@/services/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type AdminUser = { id: string; name: string; email: string; createdAt: string };

export default function Administrators() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");
  const { user, loading } = useCurrentUser();
  useEffect(() => {
    if (loading || user?.role !== "SUPER_ADMIN") return;
    apiFetch<AdminUser[]>("/api/admin/admins").then(setAdmins).catch(requestError => setError(requestError instanceof Error ? requestError.message : "Unable to load administrators"));
  }, [loading, user]);
  async function remove(admin: AdminUser) {
    if (!window.confirm(`Delete ${admin.name}'s administrator account and all data?`)) return;
    try {
      await apiFetch(`/api/admin/admins/${admin.id}`, { method: "DELETE" });
      setAdmins(items => items.filter(item => item.id !== admin.id));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to delete administrator");
    }
  }
  if (loading) return <main className="p-7">Loading administrators...</main>;
  if (user?.role !== "SUPER_ADMIN") return <main className="p-7 text-sm font-semibold text-rose-600">Only super administrators can access this page.</main>;
  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7"><PageHeader title="Administrators" description="Only super administrators can reset administrator passwords or delete administrator accounts." />{error && <p className="text-sm font-semibold text-rose-600">{error}</p>}<div className="card overflow-hidden"><div className="overflow-x-auto">{admins.length ? <table className="w-full text-left text-sm"><thead className="border-b bg-slate-50"><tr><th className="p-4">Administrator</th><th className="p-4">Email</th><th className="p-4">Joined</th><th className="p-4">Actions</th></tr></thead><tbody>{admins.map(admin => <tr key={admin.id} className="border-b"><td className="p-4 font-semibold">{admin.name}</td><td className="p-4">{admin.email}</td><td className="p-4">{new Date(admin.createdAt).toLocaleDateString()}</td><td className="p-4"><div className="flex flex-wrap gap-2"><Link href={`/admin/admins/${admin.id}/password`} className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-600">Reset password</Link><button onClick={() => remove(admin)} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600">Delete</button></div></td></tr>)}</tbody></table> : <p className="p-8 text-center muted">No administrator accounts found.</p>}</div></div></main>;
}
