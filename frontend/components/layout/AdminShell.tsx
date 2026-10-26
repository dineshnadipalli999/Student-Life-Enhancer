"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Briefcase, BookOpen, Settings, FileText, Menu, X, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  ["Dashboard","/admin",LayoutDashboard],
  ["Students","/admin/students",Users],
  ["Jobs","/admin/jobs",Briefcase],
  ["Internships","/admin/internships",Briefcase],
  ["Part-Time","/admin/part-time",Briefcase],
  ["Scholarships","/admin/scholarships",BookOpen],
  ["Courses","/admin/courses",BookOpen],
  ["Careers","/admin/careers",BookOpen],
  ["Notes","/admin/notes",FileText],
  ["Settings","/admin/settings",Settings]
] as const;

export default function AdminShell({children}:{children:React.ReactNode}) {
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) setIsSuperAdmin((JSON.parse(stored) as { role?: string }).role === "SUPER_ADMIN");
  }, []);
  function logout(){localStorage.removeItem("auth_user");window.location.href="/login";}
  const Sidebar=({mobile=false}:{mobile?:boolean})=><aside className={`${mobile?"fixed inset-y-0 left-0 z-50 w-80":"hidden lg:flex w-72"} flex-col border-r bg-[var(--card)]`}>
    <div className="flex h-16 items-center justify-between border-b px-5"><Link href="/admin" className="font-extrabold">SLE+ <span className="text-indigo-600">Admin</span></Link>{mobile&&<button onClick={()=>setOpen(false)}><X size={20}/></button>}</div>
    <nav className="flex-1 overflow-y-auto p-3">{nav.map(([label,href,Icon])=>{const active=pathname===href;return <Link key={href} href={href} onClick={()=>setOpen(false)} className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${active?"bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300":"hover:bg-slate-100 dark:hover:bg-slate-800"}`}><Icon size={17}/>{label}</Link>})}{isSuperAdmin&&<Link href="/admin/admins" onClick={()=>setOpen(false)} className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${pathname==="/admin/admins"?"bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300":"hover:bg-slate-100 dark:hover:bg-slate-800"}`}><ShieldCheck size={17}/>Administrators</Link>}</nav>
    <div className="border-t p-3"><Link href="/dashboard" className="block rounded-xl border px-3 py-2.5 text-sm font-semibold">← Student App</Link><button onClick={logout} className="mt-2 w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50">Log out</button></div>
  </aside>;
  return <div className="min-h-screen"><div className="flex min-h-screen"><Sidebar/>{open&&<><div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={()=>setOpen(false)}/><Sidebar mobile/></>}<div className="min-w-0 flex-1"><header className="sticky top-0 z-30 flex h-16 items-center border-b bg-[var(--background)]/90 px-4 backdrop-blur"><button className="mr-3 rounded-lg p-2 lg:hidden" onClick={()=>setOpen(true)}><Menu size={21}/></button><div><p className="text-xs muted">Student Life Enhancer+</p><p className="font-bold">Administration Console</p><p className="text-xs text-emerald-600">Admin access</p></div><div className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">AD</div></header><main>{children}</main></div></div></div>;
}
