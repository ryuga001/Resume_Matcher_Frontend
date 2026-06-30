"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { COLORS } from "./constants";

interface SkillsCardProps {
  type: "matching" | "missing";
  skills: string[];
}

const CONFIG = {
  matching: {
    icon:        <CheckCircle2 className="size-5" style={{ color: COLORS.skillMatch.color }} />,
    title:       "Matching Skills",
    emptyText:   "No matching skills found.",
    badgeStyle:  COLORS.skillMatch,
  },
  missing: {
    icon:        <XCircle className="size-5" style={{ color: COLORS.skillMissing.color }} />,
    title:       "Missing Skills",
    emptyText:   "No missing skills — great match!",
    badgeStyle:  COLORS.skillMissing,
  },
} as const;

export function SkillsCard({ type, skills }: SkillsCardProps) {
  const { icon, title, emptyText, badgeStyle } = CONFIG[type];

  return (
    <div className="bg-white rounded-md p-8 border" style={{ borderColor: COLORS.borderMuted, boxShadow: "none" }}>
      <div className="flex items-center gap-3 mb-6">
        {icon}
        <h4 className="font-heading text-2xl font-bold" style={{ color: COLORS.text }}>{title}</h4>
      </div>
      {skills.length === 0
        ? <p className="text-sm" style={{ color: COLORS.textFaint }}>{emptyText}</p>
        : (
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className="px-4 py-1.5 rounded text-xs font-bold" style={badgeStyle}>{s}</span>
            ))}
          </div>
        )
      }
    </div>
  );
}
