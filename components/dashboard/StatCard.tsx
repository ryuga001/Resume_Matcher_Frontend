import React from "react";
import { COLORS } from "@/components/dashboard/constants";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  loading: boolean;
  value: React.ReactNode;
  subLabel: string;
  showBar?: boolean;
  barPct?: number;
  barColor?: string;
};

export function StatCard({ icon, label, loading, value, subLabel, showBar, barPct, barColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="flex items-start justify-between mb-4">
        <div className="size-11 rounded-xl flex items-center justify-center" style={{ background: COLORS.accentBg }}>
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.textMuted }}>{label}</span>
      </div>
      {loading ? (
        <div className="h-10 w-20 rounded-lg animate-pulse" style={{ background: COLORS.skeletonBg }} />
      ) : (
        value
      )}
      <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>{subLabel}</p>
      {showBar && (
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: COLORS.skeletonBg }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${barPct}%`, background: barColor }}
          />
        </div>
      )}
    </div>
  );
}
