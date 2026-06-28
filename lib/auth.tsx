"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, clearUser } from "@/store/slices/authSlice";
import type { User } from "@/store/slices/authSlice";
import { useLogoutMutation } from "@/store/api/authApi";

export function useAuth() {
  const user      = useAppSelector((s) => s.auth.user);
  const isLoading = useAppSelector((s) => s.auth.isLoading);
  const dispatch  = useAppDispatch();
  const router    = useRouter();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(
    (user: User) => dispatch(setUser(user)),
    [dispatch],
  );

  const logout = useCallback(async () => {
    try { await logoutMutation().unwrap(); } catch { /* cookie cleanup still happens */ }
    dispatch(clearUser());
    router.push("/login");
  }, [dispatch, router, logoutMutation]);

  return { user, isLoading, login, logout };
}
