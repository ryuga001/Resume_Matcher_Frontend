"use client";

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type UserRole = "SUPER_ADMIN" | "USER";
export type User = { id: string; email: string; name: string; role: UserRole };

type AuthState = {
  user:      User | null;
  isLoading: boolean;
};

const initialState: AuthState = { user: null, isLoading: true };

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<User>) {
      state.user      = payload;
      state.isLoading = false;
    },
    clearUser(state) {
      state.user      = null;
      state.isLoading = false;
    },
    setAuthLoading(state, { payload }: PayloadAction<boolean>) {
      state.isLoading = payload;
    },
  },
});

export const { setUser, clearUser, setAuthLoading } = authSlice.actions;
