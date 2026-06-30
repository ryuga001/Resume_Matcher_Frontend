"use client";

import { COLORS } from "@/components/dashboard/constants";
import type { HistoryItem } from "@/components/dashboard/types";

type Props = {
  scoreTrend: HistoryItem[];
};

function barColor(score: number): string {
  if (score >= 70) return COLORS.scoreGood;
  if (score >= 50) return COLORS.scoreMid;
  return COLORS.scoreBad;
}

export function ScoreTrendWidget({ scoreTrend }: Props) {
  const svgW = 160;
  const svgH = 52;
  const barW = 20;
  const gap = 12;
  const count = scoreTrend.length;

  return (
    <div className="dash-card bg-white rounded-md p-5 border" style={{ borderColor: COLORS.borderColor, boxShadow: "none" }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLORS.textMuted }}>
        Score Trend ({count})
      </p>
      {count === 0 ? (
        <p className="text-xs" style={{ color: COLORS.textMuted }}>No analyses yet.</p>
      ) : (
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          {scoreTrend.map((item, i) => {
            const barH = Math.max(4, Math.round((item.atsScore / 100) * svgH));
            const x = i * (barW + gap);
            const y = svgH - barH;
            return (
              <rect
                key={item.id}
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={3}
                fill={barColor(item.atsScore)}
                opacity={0.85}
              />
            );
          })}
        </svg>
      )}
    </div>
  );
}
