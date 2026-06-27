"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAuth } from "@/store/slices/authSlice";
import { setTheme } from "@/store/slices/themeSlice";
import type { ThemeMode } from "@/store/slices/themeSlice";
import { ToastProvider } from "@/lib/toast";

function AuthInitializer() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const token   = localStorage.getItem("rm_token");
    const userStr = localStorage.getItem("rm_user");
    if (token && userStr) {
      try {
        dispatch(hydrateAuth({ token, user: JSON.parse(userStr) }));
      } catch {
        dispatch(hydrateAuth(null));
      }
    } else {
      dispatch(hydrateAuth(null));
    }
  }, [dispatch]);
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
