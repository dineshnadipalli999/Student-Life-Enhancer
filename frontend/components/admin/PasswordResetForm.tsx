"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";

type PasswordResetFormProps = {
  endpoint: string;
  targetLabel: string;
  backHref: string;
};

export default function PasswordResetForm({ endpoint, targetLabel, backHref }: PasswordResetFormProps) {
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
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await apiFetch(endpoint, { method: "PATCH", body: JSON.stringify({ newPassword }) });
      setNewPassword("");
      setConfirmPassword("");
      setMessage(`${targetLabel} password reset successfully.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to reset password");
    } finally {
      setLoading(false);
    }
  }

  return <main className="mx-auto max-w-2xl space-y-7 p-5 md:p-7">
    <PageHeader title={`Reset ${targetLabel} password`} description={`Set a new password for this ${targetLabel.toLowerCase()} account.`} />
    <form onSubmit={submit} className="card space-y-5 p-6">
      <label className="block text-sm font-semibold">New password<input required minLength={6} type="password" value={newPassword} onChange={event => setNewPassword(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label>
      <label className="block text-sm font-semibold">Confirm new password<input required minLength={6} type="password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></label>
      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
      {message && <p className="text-sm font-semibold text-emerald-600">{message}</p>}
      <div className="flex items-center gap-3"><Button disabled={loading}>{loading ? "Resetting..." : "Reset password"}</Button><Link href={backHref} className="text-sm font-semibold muted">Cancel</Link></div>
    </form>
  </main>;
}
