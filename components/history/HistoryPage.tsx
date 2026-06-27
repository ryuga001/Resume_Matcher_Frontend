"use client";
import { useHistory } from "@/components/history/hooks/useHistory";
import { HistoryList } from "@/components/history/HistoryList";

export function HistoryPage() {
  const { history, loading } = useHistory();

  return (
    <div className="px-8 py-8">
      <header className="mb-6">
        <h1 className="font-heading text-4xl font-bold" style={{ color: "#2a2826" }}>Analysis History</h1>
        <p className="text-sm mt-1" style={{ color: "#6e6862" }}>Every match scored, most recent first.</p>
      </header>
      <HistoryList history={history} loading={loading} />
    </div>
  );
}
