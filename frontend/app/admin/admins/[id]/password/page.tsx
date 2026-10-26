"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import PasswordResetForm from "@/components/admin/PasswordResetForm";
import { use } from "react";

export default function ResetAdminPassword({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading } = useCurrentUser();
  const { id } = use(params);
  if (loading) return <main className="p-7">Loading...</main>;
  if (user?.role !== "SUPER_ADMIN") return <main className="p-7 text-sm font-semibold text-rose-600">Only super administrators can access this page.</main>;
  return <PasswordResetForm endpoint={`/api/admin/admins/${id}/password`} targetLabel="administrator" backHref="/admin/admins" />;
}
