"use client";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { careers } from "@/data";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getCareerMatch } from "@/lib/personalization";

export default function WhatIfSimulator() {
  const { profile, loading } = useCurrentUser();
  const [careerId, setCareerId] = useState(careers[0].id); const [selected, setSelected] = useState<string[]>([]);
  const career = careers.find(item => item.id === careerId) || careers[0]; const currentSkills = profile?.skills || [];
  const available = useMemo(() => Array.from(new Set([...career.requiredSkills, ...career.preferredSkills])), [career]);
  const before = getCareerMatch(career, currentSkills); const after = getCareerMatch(career, [...currentSkills, ...selected]); const toggle = (skill: string) => setSelected(items => items.includes(skill) ? items.filter(item => item !== skill) : [...items, skill]);
  if (loading) return <p className="muted">Loading your profile...</p>;
  return <div className="space-y-6"><div className="flex flex-wrap gap-2">{careers.map(item => <button key={item.id} onClick={() => { setCareerId(item.id); setSelected([]); }} className={`rounded-full border px-3 py-2 text-sm font-semibold ${item.id === career.id ? "border-indigo-600 bg-indigo-50 text-indigo-700" : ""}`}>{item.name}</button>)}</div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{available.map(skill => <button key={skill} onClick={() => toggle(skill)} className={`rounded-2xl border p-4 text-left text-sm font-semibold transition ${selected.includes(skill) ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "bg-[var(--card)] hover:-translate-y-0.5"}`}>{selected.includes(skill) ? "✓ " : "+ "}{skill}<span className="mt-1 block text-xs muted">{currentSkills.some(item => item.toLowerCase() === skill.toLowerCase()) ? "Already in profile" : "Test this skill"}</span></button>)}</div><div className="card p-7"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><p className="text-sm muted">{career.name} simulated readiness</p><p className="mt-2 text-5xl font-extrabold">{after}%</p><p className="mt-2 text-sm muted">Current: {before}% · After selected skills: {selected.length}</p></div><Button onClick={() => setSelected([])} variant="outline">Reset simulation</Button></div><div className="mt-7 h-4 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600 transition-all duration-700" style={{ width: `${after}%` }} /></div></div></div>;
}
