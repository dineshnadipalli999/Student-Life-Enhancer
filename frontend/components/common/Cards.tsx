"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Career, Course, Opportunity, Project } from "@/types";

export function ScoreCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return <div className="card p-5"><p className="text-xs font-medium muted">{label}</p><p className="mt-2 text-2xl font-extrabold">{value}</p>{note && <p className="mt-1 text-xs muted">{note}</p>}</div>;
}

export function CareerCard({ career, showMatch = false }: { career: Career; showMatch?: boolean }) {
  return <div className="card p-5 transition hover:-translate-y-1 hover:shadow-lg"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{career.name}</h3><p className="mt-1 text-sm muted">{career.description}</p></div>{showMatch && <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">{career.matchScore}%</span>}</div><div className="mt-5 grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs muted">Demand</p><p className="mt-1 font-semibold">{career.demandScore || "Not specified"}</p></div><div><p className="text-xs muted">Growth</p><p className="mt-1 font-semibold">{career.growth}</p></div></div>{career.url ? <a href={career.url} target="_blank" rel="noreferrer" className="mt-5 block"><Button variant="outline" className="w-full">Explore Career <ArrowRight size={16} className="ml-2" /></Button></a> : <p className="mt-5 text-sm font-semibold text-rose-600">Career link unavailable</p>}</div>;
}

export function OpportunityCard({ item }: { item: Opportunity }) {
  return <div className="card p-5 transition hover:-translate-y-1 hover:shadow-lg"><div className="flex justify-between gap-3"><div><p className="text-xs font-semibold text-indigo-600">{item.type}</p><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-1 text-sm muted">{item.company}</p></div></div><div className="mt-4 flex flex-wrap gap-2 text-xs muted"><span className="inline-flex items-center gap-1"><MapPin size={13} />{item.location}</span>{item.remote && <span className="rounded-full bg-slate-100 px-2 py-1">Remote</span>}</div><div className="mt-4 flex flex-wrap gap-2">{item.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">{skill}</span>)}</div><p className="mt-4 text-sm font-semibold">{item.salary || item.stipend || "Flexible compensation"}</p><div className="mt-5">{item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="block"><Button className="w-full">Apply</Button></a> : <p className="text-sm font-semibold text-rose-600">Application link unavailable</p>}</div></div>;
}

export function CourseCard({ course }: { course: Course }) {
  return <div className="card p-5"><div className="flex justify-between"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">{course.matchScore}% match</span><span className="text-xs muted">{course.level}</span></div><h3 className="mt-4 font-bold">{course.title}</h3><p className="mt-1 text-sm muted">{course.provider}</p><div className="mt-4 flex gap-4 text-xs"><span className="inline-flex items-center gap-1"><Star size={13} />{course.rating}</span><span>{course.duration}</span><span>{course.free ? "Free" : "Paid"}</span></div>{course.url ? <a href={course.url} target="_blank" rel="noreferrer" className="block"><Button className="mt-5 w-full">Start Learning</Button></a> : <Button className="mt-5 w-full">Start Learning</Button>}</div>;
}

export function ProjectCard({ project }: { project: Project }) {
  return <div className="card p-5"><div className="flex justify-between"><span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">{project.difficulty}</span><span className="text-sm font-bold">{project.matchScore}%</span></div><h3 className="mt-4 font-bold">{project.title}</h3><p className="mt-2 text-sm muted">{project.description}</p><div className="mt-4 flex flex-wrap gap-2">{project.skills.map((skill) => <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">{skill}</span>)}</div><p className="mt-4 text-xs muted">Estimated: {project.duration}</p>{project.url ? <a href={project.url} target="_blank" rel="noreferrer" className="block"><Button variant="outline" className="mt-4 w-full">Open Project</Button></a> : <Button variant="outline" className="mt-4 w-full">View Project</Button>}</div>;
}
