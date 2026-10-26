"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";

export default function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/auth/password", { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated successfully.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update password");
    } finally {
      setLoading(false);
    }
  }

  return <main className="mx-auto max-w-2xl space-y-7 p-5 md:p-7"><PageHeader title="Change password" description="Use your current password to set a new password." /><form onSubmit={submit} className="card space-y-5 p-6"><label className="block text-sm font-semibold">Current password<input required minLength={6} type="password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label><label className="block text-sm font-semibold">New password<input required minLength={6} type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label><label className="block text-sm font-semibold">Confirm new password<input required minLength={6} type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label>{error && <p className="text-sm font-semibold text-rose-600">{error}</p>}{message && <p className="text-sm font-semibold text-emerald-600">{message}</p>}<div className="flex items-center gap-3"><Button disabled={loading}>{loading ? "Updating..." : "Update password"}</Button><Link href="/settings" className="text-sm font-semibold muted">Cancel</Link></div></form></main>;
}
