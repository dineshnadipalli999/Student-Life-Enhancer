"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Compass,
  Target,
  Brain,
  Map,
  BookOpen,
  FolderKanban,
  Briefcase,
  GraduationCap,
  Clock3,
  Trophy,
  FlaskConical,
  MessageCircle,
  Settings,
  Bell,
  Menu,
  X,
} from "lucide-react";

const nav = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["My Profile", "/profile", User],
  ["Resume Intelligence", "/resume", FileText],
  ["Career Explorer", "/careers", Compass],
  ["Career Recommendations", "/careers/recommendations", Target],
  ["Skill Gap", "/skills", Brain],
  ["Learning Roadmap", "/roadmap", Map],
  ["Courses", "/courses", BookOpen],
  ["Projects", "/projects", FolderKanban],
  ["Jobs", "/jobs", Briefcase],
  ["Internships", "/internships", GraduationCap],
  ["Part-Time", "/part-time", Clock3],
  ["Scholarships", "/scholarships", Trophy],
  ["Career Simulator", "/simulator", FlaskConical],
  ["AI Career Assistant", "/assistant", MessageCircle],
] as const;

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.removeItem("theme");
  }, []);

    function logout() {
      localStorage.removeItem("auth_user");
      window.location.href = "/login";
    }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside
      className={`${
        mobile
          ? "fixed inset-y-0 left-0 z-50 w-80"
          : "hidden lg:flex w-72"
      } flex-col border-r bg-[var(--card)]`}
    >
      <div className="flex h-16 items-center justify-between border-b px-5">
        <Link
          href="/dashboard"
          className="text-lg font-extrabold tracking-tight"
        >
          Student Life{" "}
          <span className="text-indigo-600">Enhancer+</span>
        </Link>

        {mobile && (
          <button onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {nav.map(([label, href, Icon]) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" && pathname.startsWith(href));

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                active
                  ? "bg-indigo-50 text-indigo-700 font-semibold"
                  : "text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <Link
          href="/notifications"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-900 hover:bg-slate-100"
        >
          <Bell size={17} />
            Important Updates
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-900 hover:bg-slate-100"
        >
          <Settings size={17} />
          Settings
        </Link>

          <button onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50">
            Log out
          </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar />

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <Sidebar mobile />
          </>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-[var(--background)]/90 px-4 backdrop-blur md:px-6">
            <button
              className="rounded-lg p-2 hover:bg-slate-200 lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div className="hidden max-w-xl flex-1 items-center rounded-xl border bg-[var(--card)] px-4 md:flex">
              <input
                className="w-full bg-transparent py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-500"
                placeholder="Search careers, jobs, skills..."
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Link
                href="/notifications"
                className="rounded-xl border p-2 text-slate-900 hover:bg-slate-100"
              >
                <Bell size={18} />
              </Link>

            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}