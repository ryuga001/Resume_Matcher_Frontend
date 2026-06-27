"use client";

import { scoreColor, scoreLabel } from "./utils";
import { COLORS } from "./constants";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const r             = 80;
  const circumference = 2 * Math.PI * r;
  const dashOffset    = circumference * (1 - score / 100);
  const color         = scoreColor(score);
  const label         = scoreLabel(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[200px] h-[200px]">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r={r} fill="none" stroke={COLORS.bgTrack} strokeWidth="12" />
          <circle
            cx="100" cy="100" r={r} fill="none"
            stroke={color} strokeWidth="12"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            strokeLinecap="round" transform="rotate(-90 100 100)"
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-5xl font-bold" style={{ color }}>{score}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.textFaint }}>Score</span>
        </div>
      </div>
      <h3 className="font-heading text-3xl font-bold" style={{ color: COLORS.text }}>{label}</h3>
    </div>
  );
}
