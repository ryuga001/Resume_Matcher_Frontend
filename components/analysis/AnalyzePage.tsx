"use client";

import { useAnalysis } from "./hooks/useAnalysis";
import { LoadingView } from "./LoadingView";
import { ResultView } from "./ResultView";
import { AnalyzeForm } from "./AnalyzeForm";

export function AnalyzePage() {
  const {
    resumes, history, selectedId, setSelectedId,
    jd, setJd, view, progress, result, error,
    loadingData, handleSubmit, resetToForm,
  } = useAnalysis();

  if (view === "loading") return <LoadingView progress={progress} />;
  if (view === "result" && result) return <ResultView result={result} onReset={resetToForm} />;

  return (
    <AnalyzeForm
      resumes={resumes}
      history={history}
      selectedId={selectedId}
      jd={jd}
      error={error}
      loadingData={loadingData}
      onSelectId={setSelectedId}
      onJdChange={setJd}
      onSubmit={handleSubmit}
    />
  );
}
