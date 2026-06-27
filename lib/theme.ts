"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme, toggleTheme } from "@/store/slices/themeSlice";
import type { ThemeMode } from "@/store/slices/themeSlice";

export function useTheme() {
  const mode     = useAppSelector((s) => s.theme.mode);
  const dispatch = useAppDispatch();

  return {
    mode,
    isDark: mode === "dark",
    toggle: () => dispatch(toggleTheme()),
    set:    (m: ThemeMode) => dispatch(setTheme(m)),
  };
}
