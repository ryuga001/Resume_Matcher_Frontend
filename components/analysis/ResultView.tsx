"use client";

import { Zap } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { SkillsCard } from "./SkillsCard";
import { RecommendationsList } from "./RecommendationsList";
import type { Result } from "./types";
import { COLORS } from "./constants";

interface ResultViewProps {
  result:  Result;
  onReset: () => void;
}

export function ResultView({ result, onReset }: ResultViewProps) {
  return (
    <div className="px-10 py-10">
      <div className="max-w-5xl mx-auto">
        <button onClick={onReset} className="flex items-center gap-1.5 text-sm font-semibold mb-8 hover:underline" style={{ color: COLORS.primary }}>
          ← New Analysis
        </button>

        <div className="mb-8">
          <h2 className="font-heading text-5xl font-bold" style={{ color: COLORS.text }}>Analysis result</h2>
          <div className="h-1 w-16 mt-2 rounded-full" style={{ background: "rgba(194,101,42,0.3)" }} />
        </div>

        {/* Score hero */}
        <div
          className="bg-white rounded-xl p-10 mb-6 flex flex-col md:flex-row items-center gap-10 border"
          style={{ borderColor: COLORS.borderMuted, boxShadow: "0 2px 16px rgba(58,48,42,0.04)" }}
        >
          <ScoreGauge score={result.atsScore} />
          <div className="flex-1">
            <p className="text-base leading-relaxed mb-6" style={{ color: COLORS.textMuted, maxWidth: "560px" }}>
              {result.summary || "Your profile has been compared against the job description. Review the skill breakdown and recommendations below to improve your match score."}
            </p>
            <div className="flex gap-3 flex-wrap">
              <button className="h-10 px-6 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-all active:scale-[0.97]" style={{ background: COLORS.primary }}>
                Full Report
              </button>
              <button className="h-10 px-6 rounded-lg text-sm font-bold border hover:bg-stone-50 transition-colors" style={{ borderColor: COLORS.border, color: COLORS.text }}>
                Share Result
              </button>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SkillsCard type="matching" skills={result.matchingSkills} />
          <SkillsCard type="missing"  skills={result.missingSkills} />
        </div>

        <RecommendationsList recommendations={result.recommendations} />
      </div>
    </div>
  );
}
