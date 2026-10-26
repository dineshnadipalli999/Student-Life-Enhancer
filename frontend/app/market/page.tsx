"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { apiFetch } from "@/services/api";

type Trend = { id: string; career: string; skill: string | null; demand: string | null; growth: number | null; description: string | null };

export default function Market() {
  const [items, setItems] = useState<Trend[]>([]);
  useEffect(() => { apiFetch<Trend[]>("/api/market").then(setItems); }, []);
  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7"><PageHeader title="Career Market Intelligence" description="Market updates published by administrators." /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.length ? items.map((item) => <div key={item.id} className="card p-5"><p className="text-sm font-bold text-indigo-600">{item.career}</p><h2 className="mt-2 text-xl font-bold">{item.skill || "Market update"}</h2><p className="mt-2 text-sm muted">{item.demand || "Demand information unavailable"}</p>{item.growth !== null && <p className="mt-4 text-2xl font-black">{item.growth}% growth</p>}<p className="mt-3 text-sm">{item.description}</p></div>) : <div className="card p-8 text-center muted md:col-span-2 xl:col-span-3">No market updates have been published yet.</div>}</div></main>;
}
