"use client";

import { COLORS } from "@/components/dashboard/constants";

type Props = {
  topSkills: string[];
};

export function TopSkillsWidget({ topSkills }: Props) {
  return (
    <div className="dash-card bg-white rounded-md p-5 border" style={{ borderColor: COLORS.borderColor, boxShadow: "none" }}>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLORS.textMuted }}>
        Top Skills
      </p>
      {topSkills.length === 0 ? (
        <p className="text-xs" style={{ color: COLORS.textMuted }}>No skills detected.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {topSkills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded text-xs font-bold"
              style={{ background: COLORS.accentBg, color: COLORS.accent }}
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
