"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import PasswordResetForm from "@/components/admin/PasswordResetForm";
import { use } from "react";

export default function ResetStudentPassword({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading } = useCurrentUser();
  const { id } = use(params);
  if (loading) return <main className="p-7">Loading...</main>;
  if (user?.role !== "ADMIN" && user?.role !== "SUPER_ADMIN") return <main className="p-7 text-sm font-semibold text-rose-600">Only administrators can access this page.</main>;
  return <PasswordResetForm endpoint={`/api/admin/students/${id}/password`} targetLabel="student" backHref="/admin/students" />;
}
