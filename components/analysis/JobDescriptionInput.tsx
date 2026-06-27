"use client";

import { COLORS } from "./constants";

interface JobDescriptionInputProps {
  value:    string;
  onChange: (value: string) => void;
}

export function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  return (
    <div className="flex flex-col bg-white border p-8 rounded-xl" style={{ borderColor: COLORS.border, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="mb-6">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLORS.textFaint }}>Step 2: Paste Job Description</span>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Paste the job requirements or company role description here to begin the intelligence scan..."
        className="flex-1 w-full p-4 text-sm rounded-xl border resize-none outline-none transition-all"
        style={{ minHeight: "260px", borderColor: COLORS.border, background: COLORS.bg, color: COLORS.text }}
        onFocus={e => {
          e.currentTarget.style.borderColor = COLORS.primary;
          e.currentTarget.style.boxShadow   = `0 0 0 3px ${COLORS.primaryGlow}`;
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = COLORS.border;
          e.currentTarget.style.boxShadow   = "none";
        }}
      />
    </div>
  );
}
