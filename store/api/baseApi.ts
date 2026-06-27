import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearCredentials } from "../slices/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth: { token: string | null } };
    const token = state.auth.token
      ?? (typeof window !== "undefined" ? localStorage.getItem("rm_token") : null);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
      api.dispatch(clearCredentials());
      if (typeof window !== "undefined") window.location.href = "/login";
    }
    return result;
  },
  tagTypes: ["Resume", "Analysis", "Me"],
  endpoints: () => ({}),
});
