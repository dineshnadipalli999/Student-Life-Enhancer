"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";

type AuthResponse = { user: { id: string; name: string; email: string; role: string } };

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch<AuthResponse>("/api/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) });
      localStorage.setItem("auth_user", JSON.stringify(result.user));
      window.location.href = "/onboarding";
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  }

  return <div className="flex min-h-screen items-center justify-center p-5"><div className="card w-full max-w-lg p-8"><p className="text-sm font-bold text-indigo-600">Student Life Enhancer+</p><h1 className="mt-2 text-3xl font-black">Build your career profile</h1><form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2"><label className="text-sm font-semibold">Full Name <span className="text-rose-600">*</span><input required minLength={2} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3 bg-transparent" /></label><label className="text-sm font-semibold">Email <span className="text-rose-600">*</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3 bg-transparent" /></label><label className="text-sm font-semibold">Password <span className="text-rose-600">*</span><input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3 bg-transparent" /></label><label className="text-sm font-semibold">Confirm Password <span className="text-rose-600">*</span><input required minLength={6} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="mt-2 w-full rounded-xl border px-4 py-3 bg-transparent" /></label><label className="flex gap-2 text-sm md:col-span-2"><input required type="checkbox" /> I agree to the terms and privacy policy. <span className="text-rose-600">*</span></label>{error && <p className="text-sm font-semibold text-rose-600 md:col-span-2">{error}</p>}<Button disabled={loading} className="md:col-span-2">{loading ? "Creating account..." : "Create account"}</Button></form><p className="mt-6 text-center text-sm muted">Already registered? <Link className="font-semibold text-indigo-600" href="/login">Login</Link></p></div></div>;
}
