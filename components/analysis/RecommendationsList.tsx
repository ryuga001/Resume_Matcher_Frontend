"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { COLORS } from "./constants";

interface RecommendationsListProps {
  recommendations: string[];
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  return (
    <div className="bg-white rounded-xl p-10 border" style={{ borderColor: COLORS.borderMuted, boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}>
      <h4 className="font-heading text-3xl font-bold mb-8" style={{ color: COLORS.text }}>Recommendations</h4>
      <div className="space-y-6">
        {recommendations.map((rec, i) => (
          <div key={i} className="flex gap-5">
            <span
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "#fbe8d8", color: COLORS.primary }}
            >
              {i + 1}
            </span>
            <div
              className={cn("flex-1 pb-6", i < recommendations.length - 1 && "border-b")}
              style={{ borderColor: COLORS.borderFaint }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "#4a3728" }}>{rec}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-5 rounded-xl flex items-center justify-between gap-4" style={{ background: COLORS.bgSurface }}>
        <div className="flex items-center gap-4">
          <div className="size-11 rounded-xl flex items-center justify-center bg-white border shrink-0" style={{ borderColor: COLORS.border }}>
            <Zap className="size-5" style={{ color: COLORS.primary }} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: COLORS.text }}>Ready to optimize?</p>
            <p className="text-xs" style={{ color: COLORS.textMuted }}>Our AI can automatically rewrite these sections for you.</p>
          </div>
        </div>
        <button
          className="shrink-0 h-10 px-5 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-all"
          style={{ background: COLORS.text }}
        >
          Auto-Optimize Resume
        </button>
      </div>
    </div>
  );
}
