import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clearUser } from "../slices/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
});

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
      // Try silent token refresh before giving up.
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        // New access cookie is now set — retry the original request.
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(clearUser());
        if (typeof window !== "undefined") window.location.href = "/login";
      }
    }

    return result;
  },
  tagTypes: ["Resume", "Analysis", "Me", "Course"],
  endpoints: () => ({}),
});
