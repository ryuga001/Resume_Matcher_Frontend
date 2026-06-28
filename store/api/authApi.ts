import { baseApi } from "./baseApi";
import type { User } from "../slices/authSlice";

type AuthResponse = { user: User };
type MeResponse   = User & { usesLeft: number };

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: build.mutation<AuthResponse, { name: string; email: string; password: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    logout: build.mutation<{ ok: boolean }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    getMe: build.query<MeResponse, void>({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
    updateProfile: build.mutation<AuthResponse, { name?: string; currentPassword?: string; newPassword?: string }>({
      query: (body) => ({ url: "/auth/profile", method: "PATCH", body }),
      invalidatesTags: ["Me"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApi;
