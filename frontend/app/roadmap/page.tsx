"use client";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { apiFetch } from "@/services/api";
import { Button } from "@/components/ui/button";

type Course = { id: string; title: string; provider: string | null; url: string | null; level: string | null; duration: string | null; skills: string | null; description: string | null };
type CourseState = { courseId: string; completed: boolean };

export default function Roadmap() {
  const { user, profile, loading } = useCurrentUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  useEffect(() => {
    apiFetch<Course[]>("/api/courses").then(setCourses).catch(() => setError("Unable to load the course roadmap."));
  }, []);
  useEffect(() => {
    if (user) apiFetch<CourseState[]>(`/api/course-progress/${user.id}`).then(data => setDone(new Set(data.filter(item => item.completed).map(item => item.courseId)))).catch(() => setError("Unable to load course progress."));
  }, [user]);
  const profileSkills = profile?.skills || [];
  const ordered = useMemo(() => courses.map(course => {
    const skills = (course.skills || "").split(",").map(skill => skill.trim()).filter(Boolean);
    const matches = skills.filter(skill => profileSkills.some(known => known.toLowerCase() === skill.toLowerCase()));
    return { course, skills, matches, completed: done.has(course.id) };
  }).sort((a, b) => Number(b.completed) - Number(a.completed) || b.matches.length - a.matches.length), [courses, done, profileSkills]);
  async function toggle(courseId: string, completed: boolean) {
    if (!user) return;
    try {
      await apiFetch(`/api/course-progress/${user.id}/${courseId}`, { method: "PATCH", body: JSON.stringify({ completed }) });
      setDone(current => { const next = new Set(current); completed ? next.add(courseId) : next.delete(courseId); return next; });
    } catch { setError("Unable to update course progress."); }
  }
  if (loading) return <main className="p-7">Loading roadmap...</main>;
  const completedCount = ordered.filter(item => item.completed).length;
  const remainingCount = ordered.length - completedCount;
  const percent = ordered.length ? Math.round((completedCount / ordered.length) * 100) : 0;
  const nextCourse = ordered.find(item => !item.completed);
  return <main className="mx-auto max-w-6xl space-y-7 p-5 md:p-7">
    <PageHeader title="Learning Roadmap" description={`${profile?.branch || "Your learning plan"} · built from administrator-published courses and your saved skills.`} />
    {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
    <section className="card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm muted">Course completion</p><p className="mt-1 text-3xl font-black">{completedCount} of {ordered.length} courses completed</p></div><p className="text-2xl font-black text-indigo-600">{percent}%</p></div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${percent}%` }} /></div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><p><span className="font-semibold">{remainingCount}</span> remaining</p><p><span className="font-semibold">{profileSkills.length}</span> profile skills</p><p><span className="font-semibold">{nextCourse ? "Next step ready" : "All complete"}</span></p></div>
    </section>
    {nextCourse && <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5"><p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Recommended next step</p><h2 className="mt-2 text-xl font-bold">{nextCourse.course.title}</h2><p className="mt-1 text-sm text-indigo-900">{nextCourse.matches.length ? `Matches your skills: ${nextCourse.matches.join(", ")}` : "Build the skills listed in this course to strengthen your target career."}</p>{nextCourse.course.url && <a href={nextCourse.course.url} target="_blank" rel="noreferrer" className="mt-4 inline-block"><Button>Start course</Button></a>}</section>}
    <section className="space-y-3"><div><h2 className="text-xl font-bold">Your course plan</h2><p className="text-sm muted">Mark a course completed only after you finish it. The roadmap updates from your saved actions.</p></div>{ordered.length ? ordered.map((item, index) => <article key={item.course.id} className={`card p-5 ${item.completed ? "border-emerald-200" : ""}`}><div className="flex items-start gap-4"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black ${item.completed ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>{item.completed ? "✓" : index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{item.course.title}</h3><p className="mt-1 text-sm muted">{item.course.provider || "Administrator course"} · {item.course.level || "All levels"} · {item.course.duration || "Self-paced"}</p></div><span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.completed ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-700"}`}>{item.completed ? "Completed" : "Not completed"}</span></div><p className="mt-3 text-sm">{item.course.description || "Follow the linked course content and record completion when finished."}</p><div className="mt-3 flex flex-wrap gap-2">{item.skills.length ? item.skills.map(skill => <span key={skill} className={`rounded-full px-2.5 py-1 text-xs ${item.matches.some(match => match.toLowerCase() === skill.toLowerCase()) ? "bg-indigo-50 font-semibold text-indigo-700" : "bg-slate-100"}`}>{skill}</span>) : <span className="text-xs muted">Skills not specified</span>}</div><div className="mt-4 flex flex-wrap gap-2">{item.course.url && <a href={item.course.url} target="_blank" rel="noreferrer"><Button variant="outline">{item.completed ? "Review course" : "Open course"}</Button></a>}    <Button variant={item.completed ? "outline" : "primary"} onClick={() => toggle(item.course.id, !item.completed)}>{item.completed ? "Mark as incomplete" : "Mark as completed"}</Button></div></div></div></article>) : <div className="card p-10 text-center"><p className="font-semibold">No courses are available yet.</p><p className="mt-2 text-sm muted">Your roadmap will appear when an administrator publishes courses.</p></div>}</section>
  </main>;
}
