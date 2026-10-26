"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/services/api";
import type { CurrentUser, CurrentUserResponse, UserProfile } from "@/types/profile";

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = localStorage.getItem("auth_user");
    if (!stored) {
      setLoading(false);
      return;
    }
    const authUser = JSON.parse(stored) as CurrentUser;
    setUser(authUser);
    try {
      const result = await apiFetch<CurrentUserResponse>(`/api/profile/${authUser.id}`);
      setUser(result.user);
      setProfile(result.profile);
      localStorage.setItem("auth_user", JSON.stringify(result.user));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => setLoading(false));
  }, [refresh]);

  return { user, profile, loading, refresh, setProfile };
}
