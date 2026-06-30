import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { COLORS } from "@/components/dashboard/constants";

type DashboardTopBarProps = {
  userName: string;
};

export function DashboardTopBar({ userName }: DashboardTopBarProps) {
  return (
    <div className="px-8 pt-8 pb-5 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold leading-tight" style={{ color: COLORS.textPrimary }}>
          Welcome back, {userName}.
        </h1>
        <p className="text-sm mt-1" style={{ color: COLORS.textSecondary }}>
          Here&apos;s an overview of your career activity and latest insights.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0 mt-1">
        <button
          className="h-10 px-4 flex items-center gap-2 rounded-full border text-sm font-medium transition-colors hover:bg-white/60"
          style={{ borderColor: COLORS.searchBtnBorder, color: COLORS.textSecondary, background: "rgba(255,255,255,0.5)" }}
        >
          <Search className="size-4" />
          Search Intelligence
        </button>
        <Link
          href="/resumes"
          className="h-10 px-5 flex items-center gap-2 rounded-full text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.97]"
          style={{ background: COLORS.accent }}
        >
          <Plus className="size-4" strokeWidth={2.5} />
          New Resume
        </Link>
      </div>
    </div>
  );
}
