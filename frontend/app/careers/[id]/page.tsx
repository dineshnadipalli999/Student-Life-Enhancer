"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/services/api";

type Career = { id: string; title: string; description: string | null; category: string | null; demand: string | null; url: string | null; skills: { skill: { name: string } }[] };

export default function CareerDetails() {
  const { id } = useParams<{ id: string }>();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => { apiFetch<Career>(`/api/careers/${id}`).then(setCareer).catch(() => setError("Career not found or unavailable.")).finally(() => setLoading(false)); }, [id]);
  if (loading) return <main className="p-7">Loading career details...</main>;
  if (error || !career) return <main className="mx-auto max-w-4xl p-7"><div className="card p-8 text-center text-rose-600">{error || "Career not found."}</div></main>;
  return <main className="mx-auto max-w-5xl space-y-7 p-5 md:p-7">
    <PageHeader title={career.title} description={career.category || "Career path"} />
    <section className="card space-y-5 p-6"><p className="leading-7">{career.description}</p><p><span className="font-semibold">Demand / growth:</span> {career.demand || "Not specified"}</p><div><h2 className="font-bold">Required skills</h2><div className="mt-3 flex flex-wrap gap-2">{career.skills.map(link => <span key={link.skill.name} className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700">{link.skill.name}</span>)}</div></div>{career.url && <a href={career.url} target="_blank" rel="noreferrer"><Button variant="outline">Open career information</Button></a>}</section>
    <div className="flex flex-wrap gap-3"><Link href={`/careers/recommendations?careerId=${career.id}`}><Button>Check My Career Match</Button></Link><Link href={`/skills?careerId=${career.id}`}><Button variant="outline">View Skill Gap</Button></Link><Link href={`/roadmap?careerId=${career.id}`}><Button variant="outline">Start Learning Roadmap</Button></Link><Link href="/courses"><Button variant="outline">Explore Courses</Button></Link><Link href="/jobs"><Button variant="outline">Find Jobs</Button></Link><Link href="/internships"><Button variant="outline">Find Internships</Button></Link></div>
  </main>;
}
