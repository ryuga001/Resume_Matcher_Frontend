"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { useDashboard } from "@/components/dashboard/hooks/useDashboard";
import { DashboardTopBar } from "@/components/dashboard/DashboardTopBar";
import { StatCard } from "@/components/dashboard/StatCard";
import { ResumeTable } from "@/components/dashboard/ResumeTable";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { ScoreTrendWidget } from "@/components/dashboard/ScoreTrendWidget";
import { TopSkillsWidget } from "@/components/dashboard/TopSkillsWidget";
import { DashboardFooter } from "@/components/dashboard/DashboardFooter";
import { DashboardGlobe } from "@/components/dashboard/DashboardGlobe";
import { COLORS } from "@/components/dashboard/constants";
import { FileText, BarChart2, RefreshCw } from "lucide-react";
import { scoreBarColor, scoreStatusLabel } from "@/components/dashboard/utils";

export function DashboardPage() {
  const { user, resumes, history, loading, avg, recent, scoreTrend, topSkills } = useDashboard();

  useEffect(() => {
    if (loading) return;
    gsap.from(".dash-card", { opacity: 0, y: 20, stagger: 0.08, duration: 0.5, ease: "power2.out" });
  }, [loading]);

  return (
    <div className="flex flex-col relative" style={{ background: COLORS.background }}>
      <DashboardGlobe />
      <DashboardTopBar userName={user?.name.split(" ")[0] ?? ""} />

      <div className="px-8 pb-8 flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="dash-card">
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
          </div>
          <div className="dash-card">
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
          </div>
          <div className="dash-card">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="dash-card">
            <ResumeTable resumes={recent} history={history} loading={loading} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="dash-card">
              <InsightCard avg={avg} />
            </div>
            <ScoreTrendWidget scoreTrend={scoreTrend} />
            <TopSkillsWidget topSkills={topSkills} />
          </div>
        </div>
      </div>

      <DashboardFooter />
    </div>
  );
}
