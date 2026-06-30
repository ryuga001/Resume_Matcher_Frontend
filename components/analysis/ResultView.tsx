"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { Wand2 } from "lucide-react";
import { ScoreGauge } from "./ScoreGauge";
import { SkillsCard } from "./SkillsCard";
import { RecommendationsList } from "./RecommendationsList";
import type { Result } from "./types";
import { COLORS } from "./constants";

interface ResultViewProps {
  result:         Result;
  onReset:        () => void;
  resumeId?:      string;
  jobDescription?: string;
}

export function ResultView({ result, onReset, resumeId, jobDescription }: ResultViewProps) {
  const router = useRouter();
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: result.atsScore,
      duration: 1.4,
      ease: "power2.out",
      onUpdate() {
        setDisplayScore(Math.round(obj.val));
      },
    });
  }, [result.atsScore]);

  function handleBuildResume() {
    if (!resumeId) return;
    const recs    = encodeURIComponent(JSON.stringify(result.recommendations ?? []));
    const missing = encodeURIComponent(JSON.stringify(result.missingSkills ?? []));
    const jd      = encodeURIComponent(jobDescription ?? "");
    router.push(`/resumes/${resumeId}/build?recs=${recs}&missing=${missing}&jd=${jd}`);
  }

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

        <div
          className="bg-white rounded-md p-10 mb-6 flex flex-col md:flex-row items-center gap-10 border"
          style={{ borderColor: COLORS.borderMuted, boxShadow: "none" }}
        >
          <ScoreGauge score={displayScore} />
          <div className="flex-1">
            <p className="text-base leading-relaxed mb-6" style={{ color: COLORS.textMuted, maxWidth: "560px" }}>
              {result.summary || "Your profile has been compared against the job description. Review the skill breakdown and recommendations below to improve your match score."}
            </p>
            <div className="flex gap-3 flex-wrap">
              {resumeId && (
                <button
                  onClick={handleBuildResume}
                  className="h-10 px-6 rounded text-white text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-[0.97]"
                  style={{ background: COLORS.primary, boxShadow: `0 2px 12px ${COLORS.primaryShadow}` }}
                >
                  <Wand2 className="size-4" />
                  Build Updated Resume
                </button>
              )}
              <button className="h-10 px-6 rounded text-sm font-bold border hover:bg-stone-50 transition-colors" style={{ borderColor: COLORS.border, color: COLORS.text }}>
                Share Result
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SkillsCard type="matching" skills={result.matchingSkills} />
          <SkillsCard type="missing"  skills={result.missingSkills} />
        </div>

        <RecommendationsList recommendations={result.recommendations} />
      </div>
    </div>
  );
}
