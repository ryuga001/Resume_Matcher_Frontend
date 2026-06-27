"use client";

import { useGetHistoryQuery } from "@/store/api/analysisApi";
import type { HistoryItem } from "@/components/history/types";

export function useHistory(): { history: HistoryItem[]; loading: boolean } {
  const { data: history = [], isLoading: loading } = useGetHistoryQuery();
  return { history, loading };
}
