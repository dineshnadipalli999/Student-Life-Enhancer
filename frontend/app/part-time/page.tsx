"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { OpportunityCard } from "@/components/common/Cards";
import type { Opportunity } from "@/types";
import { apiFetch } from "@/services/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { personalizeOpportunity } from "@/lib/personalization";

type DbOpportunity = { id: string; title: string; company: string | null; location: string | null; type: string; url: string | null; skills: string | null };
export default function Page() { const { profile, loading } = useCurrentUser(); const [items, setItems] = useState<Opportunity[]>([]); useEffect(() => { apiFetch<DbOpportunity[]>("/api/opportunities?type=PART_TIME").then((data) => setItems(data.map((item) => ({ id: item.id, title: item.title, company: item.company || "", location: item.location || "", type: "Part-time", url: item.url || undefined, skills: (item.skills || "").split(",").filter(Boolean), matchScore: 0 })))); }, []); if (loading) return <main className="p-7">Loading opportunities...</main>; return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7"><PageHeader title="Earn. Learn. Grow." description="Part-time opportunities added by administrators." /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map((item) => <OpportunityCard key={item.id} item={personalizeOpportunity(item, profile?.skills || [])} />)}</div></main>; }
