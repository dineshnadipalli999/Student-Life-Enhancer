"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AppShell from "./AppShell";

export default function ClientAppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Pages without student navigation
  const publicPages = [
    "/",
    "/login",
    "/signup",
    "/about",
    "/onboarding",
  ];

  useEffect(() => {
    setMounted(true);
    const storedUser = window.localStorage.getItem("auth_user");
    const user = storedUser ? JSON.parse(storedUser) as { role?: string } : null;
    if (!publicPages.includes(pathname) && !user) {
      window.location.replace("/login");
    }
    if (pathname.startsWith("/admin") && user && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      window.location.replace("/dashboard");
    }
  }, [pathname]);

  if (publicPages.includes(pathname)) {
    return <>{children}</>;
  }

  if (!mounted) {
    return <>{children}</>;
  }

  const storedUser = typeof window !== "undefined" ? window.localStorage.getItem("auth_user") : null;
  const user = storedUser ? JSON.parse(storedUser) as { role?: string } : null;
  if (pathname.startsWith("/admin") && user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") {
    return null;
  }

  // The nested admin layout owns the admin shell.
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  // All student pages use AppShell
  return <AppShell>{children}</AppShell>;
}