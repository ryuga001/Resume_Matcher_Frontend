"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { setUser, clearUser } from "@/store/slices/authSlice";
import { setTheme } from "@/store/slices/themeSlice";
import type { ThemeMode } from "@/store/slices/themeSlice";
import { useGetMeQuery } from "@/store/api/authApi";
import { ToastProvider } from "@/lib/toast";

const AUTH_PATHS = ["/", "/login", "/register"];

function AuthInitializer() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));

  const { data, isLoading } = useGetMeQuery(undefined, { skip: isAuthPage });

  useEffect(() => {
    if (isAuthPage) {
      dispatch(clearUser());
      return;
    }
    if (!isLoading) {
      if (data) {
        dispatch(setUser({ id: data.id, email: data.email, name: data.name, role: data.role }));
      } else {
        dispatch(clearUser());
      }
    }
  }, [data, isLoading, isAuthPage, dispatch]);

  return null;
}

function ThemeInitializer() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const saved       = localStorage.getItem("rm_theme") as ThemeMode | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    dispatch(setTheme(saved ?? (prefersDark ? "dark" : "light")));
  }, [dispatch]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <ThemeInitializer />
      <ToastProvider>{children}</ToastProvider>
    </Provider>
  );
}
