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

  const scoreTrend = [...history].slice(0, 5).reverse();

  const skillFreq: Record<string, number> = {};
  for (const r of resumes) {
    for (const s of r.skills ?? []) {
      skillFreq[s] = (skillFreq[s] ?? 0) + 1;
    }
  }
  const topSkills = Object.entries(skillFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([s]) => s);

  return { user, resumes, history, loading, avg, recent, scoreTrend, topSkills };
}
