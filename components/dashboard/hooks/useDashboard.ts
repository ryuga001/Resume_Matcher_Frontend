"use client";

import { useAuth } from "@/lib/auth";
import { useGetResumesQuery } from "@/store/api/resumesApi";
import { useGetHistoryQuery } from "@/store/api/analysisApi";
import { RECENT_RESUMES_COUNT } from "@/components/dashboard/constants";

export function useDashboard() {
  const { user } = useAuth();
  const { data: resumes = [], isLoading: resumesLoading } = useGetResumesQuery();
  const { data: history = [], isLoading: historyLoading } = useGetHistoryQuery();

  const loading = resumesLoading || historyLoading;

  const avg = history.length
    ? Math.round(history.reduce((s, h) => s + (h.atsScore ?? 0), 0) / history.length)
    : null;

  const recent = resumes.slice(0, RECENT_RESUMES_COUNT);

  return { user, resumes, history, loading, avg, recent };
}
