"use client";

import { useGetAnalysisDetailQuery } from "@/store/api/analysisApi";
import type { Detail } from "@/components/history/detail/types";

export function useHistoryDetail(id: string): { detail: Detail | null; loading: boolean; error: string } {
  const { data = null, isLoading: loading, isError } = useGetAnalysisDetailQuery(id);
  return {
    detail: data as Detail | null,
    loading,
    error: isError ? "Analysis not found." : "",
  };
}
