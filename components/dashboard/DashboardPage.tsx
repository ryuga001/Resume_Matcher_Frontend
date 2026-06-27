"use client";
import { useDashboard } from "@/components/dashboard/hooks/useDashboard";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { ResumeTable } from "@/components/dashboard/ResumeTable";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { MarketSentiment } from "@/components/dashboard/MarketSentiment";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { COLORS } from "@/components/dashboard/constants";
import { FileText, BarChart2, RefreshCw } from "lucide-react";
import { scoreBarColor, scoreStatusLabel } from "@/components/dashboard/utils";

export function DashboardPage() {
  const { user, resumes, history, loading, avg, recent } = useDashboard();

  return (
    <div className="flex flex-col" style={{ background: COLORS.background }}>
      <DashboardTopBar userName={user?.name.split(" ")[0] ?? ""} />

      <div className="px-8 pb-8 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={<FileText className="size-5" style={{ color: COLORS.accent }} strokeWidth={1.5} />}
            label="Active Docs"
            loading={loading}
            value={
              <p className="font-heading text-4xl font-bold" style={{ color: COLORS.textPrimary }}>
                {resumes.length}
              </p>
            }
            subLabel="Resumes stored and analyzed"
          />
          <StatCard
            icon={<BarChart2 className="size-5" style={{ color: COLORS.accent }} strokeWidth={1.5} />}
            label="Deep Scans"
            loading={loading}
            value={
              <p className="font-heading text-4xl font-bold" style={{ color: COLORS.textPrimary }}>
                {history.length}
              </p>
            }
            subLabel="Analyses run this month"
          />
          <StatCard
            icon={<RefreshCw className="size-5" style={{ color: COLORS.accent }} strokeWidth={1.5} />}
            label="Strength Index"
            loading={loading}
            value={
              <div className="flex items-baseline gap-1">
                <p className="font-heading text-4xl font-bold" style={{ color: COLORS.textPrimary }}>
                  {avg ?? "—"}
                </p>
                {avg !== null && <span className="text-sm font-medium" style={{ color: COLORS.textMuted }}>/100</span>}
              </div>
            }
            subLabel={`Avg ATS Score${avg !== null ? ` (${scoreStatusLabel(avg)})` : ""}`}
            showBar={avg !== null}
            barPct={avg ?? 0}
            barColor={scoreBarColor(avg ?? 0)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <ResumeTable resumes={recent} history={history} loading={loading} />

          <div className="flex flex-col gap-4">
            <InsightCard avg={avg} />
            <MarketSentiment />
          </div>
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
}
