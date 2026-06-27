"use client";

import { useState, useEffect } from "react";
import { useGetResumesQuery } from "@/store/api/resumesApi";
import { useGetHistoryQuery, useRunAnalysisMutation } from "@/store/api/analysisApi";
import type { AnalysisResult } from "@/store/api/analysisApi";
import type { View } from "../types";

type RtkError = { data?: { error?: string } };

export function useAnalysis() {
  const { data: resumes = [], isLoading: resumesLoading } = useGetResumesQuery();
  const { data: history = [], isLoading: historyLoading } = useGetHistoryQuery();
  const [runAnalysis] = useRunAnalysisMutation();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [jd,         setJd]         = useState("");
  const [view,       setView]       = useState<View>("form");
  const [progress,   setProgress]   = useState(0);
  const [result,     setResult]     = useState<AnalysisResult | null>(null);
  const [error,      setError]      = useState("");

  const loadingData = resumesLoading || historyLoading;

  // Auto-select first resume once the list loads
  useEffect(() => {
    if (!resumesLoading && resumes.length > 0 && !selectedId) {
      setSelectedId(resumes[0].resumeId);
    }
  }, [resumesLoading, resumes, selectedId]);

  async function handleSubmit() {
    if (!selectedId || !jd.trim()) return;
    setError("");
    setView("loading");
    setProgress(18);
    const ticker = setInterval(() => {
      setProgress((p) => (p < 88 ? p + Math.floor(Math.random() * 8) + 3 : p));
    }, 650);
    try {
      const data = await runAnalysis({ resumeId: selectedId, jobDescription: jd }).unwrap();
      clearInterval(ticker);
      setProgress(100);
      setTimeout(() => { setResult(data); setView("result"); }, 400);
    } catch (err) {
      clearInterval(ticker);
      const msg =
        (err as RtkError)?.data?.error ??
        (err instanceof Error ? err.message : "Analysis failed.");
      setError(msg);
      setView("form");
    }
  }

  function resetToForm() {
    setView("form");
    setResult(null);
    setJd("");
  }

  return {
    resumes,
    history,
    selectedId,
    setSelectedId,
    jd,
    setJd,
    view,
    progress,
    result,
    error,
    loadingData,
    handleSubmit,
    resetToForm,
  };
}
