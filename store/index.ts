import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";
import { themeSlice } from "./slices/themeSlice";
import { baseApi } from "./api/baseApi";

// Import endpoint registrations so their reducers/middleware are active
import "./api/authApi";
import "./api/resumesApi";
import "./api/analysisApi";

export const store = configureStore({
  reducer: {
    auth:               authSlice.reducer,
    theme:              themeSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState  = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
