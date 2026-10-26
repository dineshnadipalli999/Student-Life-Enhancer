"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import type { Course } from "@/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getOpportunityMatch } from "@/lib/personalization";
import { apiFetch } from "@/services/api";
import { Button } from "@/components/ui/button";

type DbCourse = { id: string; title: string; provider: string | null; url: string | null; level: string | null; duration: string | null; skills: string | null };
type CourseState = { courseId: string; completed: boolean };

export default function Courses() {
  const { profile, user, loading: userLoading } = useCurrentUser();
  const [items, setItems] = useState<Course[]>([]); const [completed, setCompleted] = useState<Set<string>>(new Set());
  useEffect(() => { apiFetch<DbCourse[]>("/api/courses").then(data => setItems(data.map(course => { const skills = (course.skills || "").split(",").map(skill => skill.trim()).filter(Boolean); return { id: course.id, title: course.title, provider: course.provider || "Admin", rating: 0, duration: course.duration || "Self-paced", skills, matchScore: getOpportunityMatch({ id: course.id, title: course.title, company: course.provider || "", location: "", type: "Course", skills, matchScore: 0 }, profile?.skills || []), level: course.level || "All levels", free: true, url: course.url || undefined }; }))); }, [profile?.skills]);
  useEffect(() => { if (user) apiFetch<CourseState[]>(`/api/course-progress/${user.id}`).then(data => setCompleted(new Set(data.filter(item => item.completed).map(item => item.courseId)))); }, [user]);
  async function toggle(courseId: string) { if (!user) return; const next = !completed.has(courseId); await apiFetch(`/api/course-progress/${user.id}/${courseId}`, { method: "PATCH", body: JSON.stringify({ completed: next }) }); setCompleted(current => { const result = new Set(current); next ? result.add(courseId) : result.delete(courseId); return result; }); }
  if (userLoading) return <main className="p-7">Loading courses...</main>;
  return <main className="mx-auto max-w-7xl space-y-7 p-5 md:p-7"><PageHeader title="Courses" description="Complete courses to unlock the corresponding roadmap progress." /><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{items.map(course => <div id={course.id} key={course.id} className={`card p-5 ${completed.has(course.id) ? "border-emerald-300" : ""}`}><div className="flex justify-between"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">{course.matchScore}% match</span><span className="text-xs muted">{course.level}</span></div><h3 className="mt-4 font-bold">{course.title}</h3><p className="mt-1 text-sm muted">{course.provider}</p><p className="mt-4 text-xs muted">{course.duration} · {course.skills.join(", ") || "General"}</p>{course.url && <a href={course.url} target="_blank" rel="noreferrer" className="block"><Button className="mt-5 w-full">Open course</Button></a>}<Button variant="outline" onClick={() => toggle(course.id)} className="mt-2 w-full">{completed.has(course.id) ? "Mark as in progress" : "Mark as completed"}</Button></div>)}</div></main>;
}
