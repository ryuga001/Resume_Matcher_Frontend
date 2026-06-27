"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, clearCredentials } from "@/store/slices/authSlice";
import type { User } from "@/store/slices/authSlice";

// Keeps the exact same interface as the original React-context version.
// All existing components that call useAuth() continue to work unchanged.
export function useAuth() {
  const user      = useAppSelector((s) => s.auth.user);
  const token     = useAppSelector((s) => s.auth.token);
  const isLoading = useAppSelector((s) => s.auth.isLoading);
  const dispatch  = useAppDispatch();
  const router    = useRouter();

  const login = useCallback(
    (token: string, user: User) => dispatch(setCredentials({ token, user })),
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(clearCredentials());
    router.push("/login");
  }, [dispatch, router]);

  return { user, token, isLoading, login, logout };
}
