"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CareerCard, OpportunityCard, ScoreCard } from "@/components/common/Cards";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { personalizeOpportunity } from "@/lib/personalization";
import { apiFetch } from "@/services/api";
import type { Career, Opportunity } from "@/types";

type DbRecommendation = { career: { id: string; title: string; description: string | null; demand: string | null; url: string | null }; score: number; requiredSkills: string[] };
type DbOpportunity = { id: string; title: string; company: string | null; location: string | null; type: string; url: string | null; skills: string | null };
type DbCourse = { id: string; title: string };
type CourseState = { courseId: string; completed: boolean };
type DbNotification = { id: string; title: string; message: string; read: boolean; createdAt: string };
export default function Dashboard() {
  const { user, profile, loading } = useCurrentUser(); const [careers, setCareers] = useState<Career[]>([]); const [opportunities, setOpportunities] = useState<Opportunity[]>([]); const [courses, setCourses] = useState<DbCourse[]>([]); const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set()); const [updates, setUpdates] = useState<DbNotification[]>([]); const [dataError, setDataError] = useState("");
  useEffect(() => {
    if (!user) return;
    Promise.all([
      apiFetch<DbRecommendation[]>(`/api/careers/recommendations/${user.id}`),
      apiFetch<DbOpportunity[]>("/api/opportunities"),
      apiFetch<DbCourse[]>("/api/courses"),
      apiFetch<CourseState[]>(`/api/course-progress/${user.id}`),
      apiFetch<DbNotification[]>(`/api/notifications/${user.id}`),
    ]).then(([careerData, opportunityData, courseData, progress, notificationData]) => {
      setCareers(careerData.map(item => ({ id: item.career.id, name: item.career.title, description: item.career.description || "", matchScore: item.score, demandScore: 0, salaryMin: 0, salaryMax: 0, requiredSkills: item.requiredSkills, preferredSkills: [], growth: item.career.demand || "Not specified", url: item.career.url || undefined })));
      setOpportunities(opportunityData.map(item => ({ id: item.id, title: item.title, company: item.company || "", location: item.location || "", type: item.type.replace("_", " "), url: item.url || undefined, skills: (item.skills || "").split(",").map(skill => skill.trim()).filter(Boolean), matchScore: 0 })));
      setCourses(courseData);
      setCompletedCourses(new Set(progress.filter(item => item.completed).map(item => item.courseId)));
      setUpdates(notificationData);
    }).catch(() => setDataError("Some dashboard data is temporarily unavailable."));
  }, [user]);
  if (loading) return <main className="p-7">Loading your dashboard...</main>;
  const skills = profile?.skills || []; const requiredFields = [profile?.degree, profile?.branch, profile?.graduationYear, profile?.college, profile?.location, skills.length ? "skills" : "", profile?.bio]; const profileCompletion = Math.round(requiredFields.filter(Boolean).length / requiredFields.length * 100); const rankedCareers = careers.filter(career => career.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore); const rankedOpportunities = opportunities.map(item => personalizeOpportunity(item, skills)).sort((a, b) => b.matchScore - a.matchScore); const matchingJobs = rankedOpportunities.filter(item => item.type === "JOB" || item.type === "JOB".replace("_", " ")); const matchingInternships = rankedOpportunities.filter(item => item.type === "INTERNSHIP"); const topCareer = rankedCareers[0]; const skillGaps = topCareer?.requiredSkills.filter(skill => !skills.some(known => known.toLowerCase() === skill.toLowerCase())).length || 0; const roadmapProgress = courses.length ? Math.round(completedCourses.size / courses.length * 100) : 0;
  return <main className="mx-auto max-w-[1500px] space-y-8 p-5 md:p-7"><div><p className="text-sm muted">Career dashboard</p><h1 className="text-3xl font-black">Hi, {user?.name.split(" ")[0] || "there"}</h1><p className="mt-2 muted">Live recommendations based on your saved profile and administrator-published opportunities.</p></div>{dataError && <div className="card p-4 text-sm text-amber-700">{dataError}</div>}<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><ScoreCard label="Profile completion" value={`${profileCompletion}%`} note={profileCompletion < 100 ? "Complete your profile to improve matches" : "Profile is up to date"} /><ScoreCard label="Top career match" value={topCareer ? `${topCareer.matchScore}%` : "—"} note={topCareer?.name || "Add skills to generate matches"} /><ScoreCard label="Skill gaps" value={skillGaps} note="For your top match" /><ScoreCard label="Roadmap progress" value={`${roadmapProgress}%`} note={`${completedCourses.size} of ${courses.length} courses completed`} /></div><div className="grid gap-4 sm:grid-cols-2"><ScoreCard label="Matching jobs" value={matchingJobs.filter(job => job.matchScore > 0).length} note="Published by administrators" /><ScoreCard label="Matching internships" value={matchingInternships.filter(item => item.matchScore > 0).length} note="Published by administrators" /></div><section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-bold">Recommended careers</h2><p className="text-sm muted">Only careers matching your saved skills.</p></div><Link href="/careers/recommendations" className="text-sm font-bold text-indigo-600">View all</Link></div>{rankedCareers.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{rankedCareers.slice(0, 4).map(career => <CareerCard key={career.id} career={career} showMatch />)}</div> : <div className="card p-6 text-sm muted">Add skills to your profile or wait for an administrator to publish matching careers.</div>}</section><section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-bold">Matching opportunities</h2><p className="text-sm muted">Live listings with administrator application links.</p></div><Link href="/jobs" className="text-sm font-bold text-indigo-600">Explore jobs</Link></div>{rankedOpportunities.length ? <div className="grid gap-4 md:grid-cols-2">{rankedOpportunities.slice(0, 4).map(item => <OpportunityCard key={item.id} item={item} />)}</div> : <div className="card p-6 text-sm muted">No opportunities have been published yet.</div>}</section><section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-xl font-bold">Important updates</h2><p className="text-sm muted">Recent announcements from your administrator.</p></div><Link href="/notifications" className="text-sm font-bold text-indigo-600">View all</Link></div>{updates.length ? <div className="card divide-y">{updates.slice(0, 3).map(update => <div key={update.id} className="p-4"><p className="font-semibold">{update.title}</p><p className="mt-1 text-sm muted">{update.message}</p></div>)}</div> : <div className="card p-6 text-sm muted">No important updates yet.</div>}</section></main>;
}
