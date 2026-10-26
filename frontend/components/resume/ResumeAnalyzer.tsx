"use client";
import { useState } from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { apiFetch } from "@/services/api";

type Analysis = { fileName: string; targetRole: string; score: number; detectedSkills: string[]; matchedSkills: string[]; missingSkills: string[]; recommendations: string[] };

export default function ResumeAnalyzer() {
  const { user } = useCurrentUser();
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [status, setStatus] = useState("");
  async function analyze() {
    if (!user || !file || !targetRole.trim()) { setStatus("Target role and resume file are required."); return; }
    setStatus("Analyzing resume..."); setAnalysis(null);
    try {
      const form = new FormData(); form.append("file", file); form.append("targetRole", targetRole.trim());
      setAnalysis(await apiFetch<Analysis>(`/api/resume/${user.id}/analyze`, { method: "POST", body: form }));
      setStatus("Resume analyzed and saved.");
    } catch (error) { setStatus(error instanceof Error ? error.message : "Unable to analyze resume"); }
  }
  return <div className="space-y-6"><div className="card border-dashed p-10 text-center"><Upload className="mx-auto h-10 w-10 text-indigo-600" /><h2 className="mt-4 text-xl font-bold">Resume Intelligence</h2><p className="mt-2 text-sm muted">Tell us the role you want, then upload a text-based resume for a role-specific analysis.</p><div className="mx-auto mt-5 max-w-xl text-left"><label htmlFor="target-role" className="text-sm font-semibold">Target role <span className="text-rose-600">*</span></label><input id="target-role" required value={targetRole} onChange={event => setTargetRole(event.target.value)} placeholder="e.g. Data Analyst, Frontend Developer" className="mt-2 w-full rounded-xl border bg-transparent px-4 py-3" /></div><input id="resume" type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" onChange={event => { setFile(event.target.files?.[0] || null); setStatus(""); setAnalysis(null); }} /><label htmlFor="resume" className="mt-5 inline-block cursor-pointer rounded-xl border px-4 py-2 text-sm font-semibold">{file?.name || "Choose File"}</label><p className="mt-2 text-xs muted">Scanned or completely blank PDFs cannot be analyzed without readable text.</p><div><Button onClick={analyze} className="mt-4" disabled={!file || !targetRole.trim() || status === "Analyzing resume..."}>Analyze for this role</Button></div>{status && <p className={`mt-3 text-sm font-semibold ${status.includes("analyzed") ? "text-emerald-700" : "text-rose-700"}`}>{status}</p>}</div>{analysis && <div className="grid gap-4 md:grid-cols-2"><div className="card p-6"><p className="text-sm muted">Analysis for</p><p className="mt-1 text-xl font-bold">{analysis.targetRole}</p><p className="mt-4 text-sm muted">Role match score</p><p className="mt-2 text-5xl font-extrabold">{analysis.score}%</p><div className="mt-5 h-3 rounded-full bg-slate-100"><div className="h-full rounded-full bg-indigo-600" style={{ width: `${analysis.score}%` }} /></div><p className="mt-4 text-xs muted">Based only on skills explicitly found in {analysis.fileName}.</p></div><div className="card p-6"><h3 className="font-bold">Matched skills</h3><div className="mt-4 flex flex-wrap gap-2">{analysis.matchedSkills.length ? analysis.matchedSkills.map(skill => <span key={skill} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"><CheckCircle2 className="mr-1 inline h-3 w-3" />{skill}</span>) : <span className="text-sm muted">No target skills found in this file.</span>}</div><h3 className="mt-6 font-bold">Priority gaps</h3><div className="mt-3 flex flex-wrap gap-2">{analysis.missingSkills.length ? analysis.missingSkills.map(skill => <span key={skill} className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">{skill}</span>) : <span className="text-sm text-emerald-700">No priority gaps detected.</span>}</div><h3 className="mt-6 font-bold">Recommended next steps</h3><ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{analysis.recommendations.map(item => <li key={item}>{item}</li>)}</ul></div></div>}</div>;
}
