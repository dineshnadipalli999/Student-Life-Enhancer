"use client";
import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { apiFetch } from "@/services/api";
import { BookOpen, CheckCircle2, Target, TrendingUp } from "lucide-react";

type DbCareer = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  skills: { skill: { name: string }; importance: number }[];
};

type DbCourse = {
  id: string;
  title: string;
  url: string | null;
  skills: string | null;
};

const skillAliases: Record<string, string> = {
  ai: "artificial intelligence",
  "artificial intelligence": "artificial intelligence",
  "node js": "node.js",
  node: "node.js",
  "rest api": "rest apis",
  "rest apis": "rest apis",
};

function normalizeSkill(value: string) {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, " ");
  return skillAliases[normalized] || normalized;
}

export default function Skills() {
  const { profile, loading } = useCurrentUser();
  const [careers, setCareers] = useState<DbCareer[]>([]);
  const [courses, setCourses] = useState<DbCourse[]>([]);
  const [selectedCareerId, setSelectedCareerId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch<DbCareer[]>("/api/careers"), apiFetch<DbCourse[]>("/api/courses")])
      .then(([careerData, courseData]) => {
        setCareers(careerData);
        setCourses(courseData);
        const careerId = new URLSearchParams(window.location.search).get("careerId");
        setSelectedCareerId(careerId || careerData[0]?.id || "");
      })
      .catch(() => setError("Unable to load the skill analysis right now."));
  }, []);

  const effectiveTarget = useMemo(() => {
    const known = new Set((profile?.skills || []).map(normalizeSkill));
    return careers
      .map(career => ({ career, score: career.skills.reduce((total, item) => total + (known.has(normalizeSkill(item.skill.name)) ? item.importance : 0), 0) }))
      .sort((a, b) => b.score - a.score)
      .find(item => item.career.id === selectedCareerId)?.career
      || careers.find(career => career.id === selectedCareerId)
      || careers[0];
  }, [careers, profile, selectedCareerId]);

  const gaps = useMemo(() => {
    if (!effectiveTarget) return [];
    const known = new Set((profile?.skills || []).map(normalizeSkill));
    return effectiveTarget.skills.map(({ skill, importance }) => ({
      skill: skill.name,
      importance: importance || 1,
      current: known.has(normalizeSkill(skill.name)) ? 100 : 0,
    }));
  }, [profile, effectiveTarget]);

  const recommendedCourses = useMemo(() => {
    const result: Record<string, DbCourse | undefined> = {};
    for (const gap of gaps) {
      if (gap.current) continue;
      const targetSkill = normalizeSkill(gap.skill);
      result[gap.skill] = courses.find(course =>
        (course.skills || "").split(",").some(courseSkill => normalizeSkill(courseSkill) === targetSkill),
      );
    }
    return result;
  }, [courses, gaps]);

  if (loading) return <main className="p-7">Loading skill analysis...</main>;
  if (error) return <main className="mx-auto max-w-6xl p-5 md:p-7"><div className="card p-8 text-center text-rose-600">{error}</div></main>;
  if (!effectiveTarget) return <main className="mx-auto max-w-6xl space-y-7 p-5 md:p-7"><PageHeader title="Skill Gap Analysis" description="Compare your saved skills with administrator-published careers." /><div className="card p-8 text-center"><p className="font-semibold">No careers are available yet.</p><p className="mt-2 text-sm muted">Your analysis will appear when an administrator publishes career paths.</p></div></main>;
  const totalImportance = gaps.reduce((total, gap) => total + gap.importance, 0);
  const coveredImportance = gaps.reduce((total, gap) => total + (gap.current ? gap.importance : 0), 0);
  const coveragePercent = totalImportance ? Math.round((coveredImportance / totalImportance) * 100) : 0;
  const missingGaps = gaps.filter(gap => !gap.current).sort((a, b) => b.importance - a.importance);
  return <main className="mx-auto max-w-6xl space-y-7 p-5 md:p-7"><PageHeader title="Skill Gap Analysis" description={`${effectiveTarget.title} · a weighted comparison with your saved profile skills.`} /><div className="card p-6"><div className="mb-6 flex flex-wrap gap-2">{careers.map(career => <button key={career.id} onClick={() => setSelectedCareerId(career.id)} className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${effectiveTarget.id === career.id ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "hover:border-indigo-300"}`}>{career.title}</button>)}</div><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-indigo-50 p-4"><Target className="h-5 w-5 text-indigo-600" /><p className="mt-2 text-2xl font-bold text-indigo-900">{coveragePercent}%</p><p className="text-xs text-indigo-700">Weighted coverage</p></div><div className="rounded-xl bg-emerald-50 p-4"><CheckCircle2 className="h-5 w-5 text-emerald-600" /><p className="mt-2 text-2xl font-bold text-emerald-900">{gaps.filter(gap => gap.current).length}</p><p className="text-xs text-emerald-700">Skills covered</p></div><div className="rounded-xl bg-rose-50 p-4"><TrendingUp className="h-5 w-5 text-rose-600" /><p className="mt-2 text-2xl font-bold text-rose-900">{missingGaps.length}</p><p className="text-xs text-rose-700">Priority gaps</p></div></div><div className="mt-8 space-y-7">{gaps.map(({ skill, current, importance }) => { const course = recommendedCourses[skill]; return <div key={skill}><div className="flex items-center justify-between text-sm"><span className="font-semibold">{skill}</span><span className={current ? "font-semibold text-emerald-700" : "font-semibold text-rose-700"}>{current ? "Covered" : "Priority gap"}</span></div><div className="mt-2 h-3 rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${current ? "bg-emerald-500" : "bg-rose-400"}`} style={{ width: `${current || 8}%` }} /></div><div className="mt-2 flex items-center justify-between text-xs muted"><span>{importance > 1 ? "High importance" : "Core requirement"}</span>{!current && <Button variant="outline" className="py-1 text-xs" onClick={() => (window.location.href = course ? `/courses#${course.id}` : "/courses")}><BookOpen className="mr-1 h-3 w-3" />{course?.title || "Find a course"}</Button>}</div></div>; })}</div></div><div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6"><h2 className="font-bold text-indigo-900">Recommended focus</h2><p className="mt-2 text-sm text-indigo-800">{missingGaps[0]?.skill ? `Start with ${missingGaps[0].skill}; it has the highest importance among your missing requirements for ${effectiveTarget.title}.` : `You have all weighted requirements for ${effectiveTarget.title}. Build a project to demonstrate them.`}</p><Button className="mt-4" onClick={() => (window.location.href = "/roadmap")}>Generate Personalized Roadmap</Button></div></main>;
}
