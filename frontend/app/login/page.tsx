"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";

type AuthResponse = { user: { id: string; name: string; email: string; role: string } };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await apiFetch<AuthResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      localStorage.setItem("auth_user", JSON.stringify(result.user));
      window.location.href = result.user.role === "ADMIN" || result.user.role === "SUPER_ADMIN" ? "/admin" : "/dashboard";
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  return <div className="flex min-h-screen items-center justify-center p-5"><div className="card w-full max-w-md p-8"><p className="text-sm font-bold text-indigo-600">Student Life Enhancer+</p><h1 className="mt-2 text-3xl font-black">Welcome back</h1><p className="mt-2 text-sm muted">Continue your career journey.</p><form onSubmit={handleSubmit} className="mt-7 space-y-4"><label className="block text-sm font-semibold">Email <span className="text-rose-600">*</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none" placeholder="you@example.com" /></label><label className="block text-sm font-semibold">Password <span className="text-rose-600">*</span><input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3 outline-none" placeholder="********" /></label>{error && <p className="text-sm font-semibold text-rose-600">{error}</p>}<Button disabled={loading} className="w-full">{loading ? "Signing in..." : "Login"}</Button></form><p className="mt-6 text-center text-sm muted">New student? <Link className="font-semibold text-indigo-600" href="/signup">Create an account</Link></p></div></div>;
}
