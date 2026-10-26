"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { ScoreCard } from "@/components/common/Cards";
import { apiFetch } from "@/services/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

type Overview = {
  students: number;
  admins: number;
  applications: number;
  opportunities: number;
  opportunityBreakdown: { jobs: number; internships: number; partTime: number };
  recentOpportunities: { id: string; title: string; company: string | null; type: string; createdAt: string; _count: { applications: number } }[];
};

const managementLinks = [
  { label: "Manage jobs", href: "/admin/jobs", type: "JOB" },
  { label: "Manage internships", href: "/admin/internships", type: "INTERNSHIP" },
  { label: "Manage part-time work", href: "/admin/part-time", type: "PART_TIME" },
];

export default function Admin() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const { user } = useCurrentUser();
  useEffect(() => { apiFetch<Overview>("/api/admin/overview").then(setData).catch(() => setError("Unable to load admin overview.")); }, []);
  if (error) return <main className="p-7 text-sm font-semibold text-rose-600">{error}</main>;
  if (!data) return <main className="p-7">Loading admin overview...</main>;
  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7">
    <PageHeader title="Admin Dashboard" description="Monitor and manage the opportunities students can discover and apply to." />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><ScoreCard label="Students" value={data.students}/><ScoreCard label="Applications" value={data.applications}/><ScoreCard label="Total opportunities" value={data.opportunities}/>{user?.role === "SUPER_ADMIN" && <ScoreCard label="Administrators" value={data.admins}/>}</div>
    <section className="grid gap-4 md:grid-cols-3">
      <div className="card p-5"><p className="text-xs muted">Jobs</p><p className="mt-2 text-3xl font-extrabold">{data.opportunityBreakdown.jobs}</p><Link href="/admin/jobs" className="mt-4 inline-block text-sm font-semibold text-indigo-600">Manage jobs →</Link></div>
      <div className="card p-5"><p className="text-xs muted">Internships</p><p className="mt-2 text-3xl font-extrabold">{data.opportunityBreakdown.internships}</p><Link href="/admin/internships" className="mt-4 inline-block text-sm font-semibold text-indigo-600">Manage internships →</Link></div>
      <div className="card p-5"><p className="text-xs muted">Part-time</p><p className="mt-2 text-3xl font-extrabold">{data.opportunityBreakdown.partTime}</p><Link href="/admin/part-time" className="mt-4 inline-block text-sm font-semibold text-indigo-600">Manage part-time →</Link></div>
    </section>
    <section className="card p-5">
      <div className="flex items-center justify-between gap-4"><div><h2 className="font-bold">Recent opportunities</h2><p className="mt-1 text-sm muted">Listings currently available to students.</p></div><Link href="/admin/jobs" className="text-sm font-semibold text-indigo-600">Open management</Link></div>
      <div className="mt-4 space-y-3">{data.recentOpportunities.length ? data.recentOpportunities.map(item => <div key={item.id} className="flex items-center justify-between gap-4 rounded-xl border p-4"><div><p className="font-semibold">{item.title}</p><p className="text-sm muted">{item.company || "No company"} · {item.type.replace("_", " ")}</p></div><p className="shrink-0 text-xs muted">{item._count.applications} application(s)</p></div>) : <p className="py-6 text-center text-sm muted">No opportunities have been added yet.</p>}</div>
    </section>
    <section className="card p-5"><h2 className="font-bold">Opportunity management</h2><p className="mt-1 text-sm muted">Create, edit, or delete listings. Changes are reflected on student pages immediately.</p><div className="mt-4 flex flex-wrap gap-3">{managementLinks.map(link => <Link key={link.type} href={link.href} className="rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50">{link.label} →</Link>)}</div></section>
    {user?.role === "SUPER_ADMIN" && <section className="card p-5"><h2 className="font-bold">Administrator management</h2><p className="mt-1 text-sm muted">Review and remove administrator accounts. This area is restricted to super administrators.</p><Link href="/admin/admins" className="mt-4 inline-block rounded-xl border px-4 py-3 text-sm font-semibold hover:bg-slate-50">Manage administrators →</Link></section>}
  </main>;
}
