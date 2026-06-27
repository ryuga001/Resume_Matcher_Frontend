"use client";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type User = { id: string; email: string; name: string };

type AuthState = {
  user:      User | null;
  token:     string | null;
  isLoading: boolean;
};

const initialState: AuthState = { user: null, token: null, isLoading: true };

function persist(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem("rm_token", token);
  localStorage.setItem("rm_user", JSON.stringify(user));
  document.cookie = `rm_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`;
}

function clear() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("rm_token");
  localStorage.removeItem("rm_user");
  document.cookie = "rm_token=; path=/; max-age=0";
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, { payload }: PayloadAction<{ user: User; token: string }>) {
      state.user      = payload.user;
      state.token     = payload.token;
      state.isLoading = false;
      persist(payload.token, payload.user);
    },
    clearCredentials(state) {
      state.user      = null;
      state.token     = null;
      state.isLoading = false;
      clear();
    },
    hydrateAuth(state, { payload }: PayloadAction<{ user: User; token: string } | null>) {
      if (payload) { state.user = payload.user; state.token = payload.token; }
      state.isLoading = false;
    },
  },
});

export const { setCredentials, clearCredentials, hydrateAuth } = authSlice.actions;
