import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ThemeMode = "light" | "dark";

type ThemeState = { mode: ThemeMode };

const initialState: ThemeState = { mode: "light" };

function applyTheme(mode: ThemeMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem("rm_theme", mode);
  document.documentElement.classList.toggle("dark", mode === "dark");
}

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, { payload }: PayloadAction<ThemeMode>) {
      state.mode = payload;
      applyTheme(payload);
    },
    toggleTheme(state) {
      const next: ThemeMode = state.mode === "light" ? "dark" : "light";
      state.mode = next;
      applyTheme(next);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
