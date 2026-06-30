"use client";

import { Zap } from "lucide-react";
import { COLORS } from "./constants";

const LOADING_STYLES = `
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes pulse-glow { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.06)} }
  @keyframes icon-pulse { 0%,100%{opacity:.8} 50%{opacity:1} }
`;

interface LoadingViewProps {
  progress: number;
}

export function LoadingView({ progress }: LoadingViewProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-8 py-20 min-h-[80vh]">
      <style>{LOADING_STYLES}</style>
      <div
        className="w-full max-w-xl rounded-md p-16 flex flex-col items-center text-center"
        style={{ background: "#ffffff", boxShadow: "0 4px 32px rgba(58,48,42,0.07)" }}
      >
        <div className="relative mb-12">
          <div className="absolute inset-0 rounded-full" style={{
            background: COLORS.primaryGlow, filter: "blur(24px)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }} />
          <div
            className="relative w-28 h-28 rounded-full border-2 flex items-center justify-center bg-white"
            style={{ borderColor: "rgba(194,101,42,0.2)", boxShadow: "0 4px 24px rgba(194,101,42,0.08)" }}
          >
            <Zap
              className="size-12"
              style={{ color: COLORS.primary, animation: "icon-pulse 2s ease-in-out infinite" }}
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h2 className="font-heading text-4xl font-bold mb-3" style={{ color: COLORS.text }}>
          Scoring your resume...
        </h2>
        <p className="text-base mb-12" style={{ color: COLORS.textMuted }}>
          The AI is comparing your experience against the job description.
        </p>

        <div className="w-full max-w-sm">
          <div className="flex justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.primary }}>Analysis Progress</span>
            <span className="text-[10px] font-bold" style={{ color: COLORS.textFaint }}>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: COLORS.bgTrack }}>
            <div style={{
              height: "100%", width: `${progress}%`, borderRadius: "9999px",
              background: `linear-gradient(90deg,${COLORS.primary} 0%,#e08850 50%,${COLORS.primary} 100%)`,
              backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite",
              transition: "width 0.5s ease-out",
            }} />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-8 w-full max-w-sm pt-8 border-t" style={{ borderColor: COLORS.borderFaint }}>
          <div className="text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: COLORS.textFaint }}>Processing</p>
            <p className="text-sm font-medium" style={{ color: COLORS.text }}>Semantic Mapping</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: COLORS.textFaint }}>Match Index</p>
            <p className="text-sm font-medium" style={{ color: COLORS.text }}>Calculating Weights</p>
          </div>
        </div>
      </div>
    </div>
  );
}
