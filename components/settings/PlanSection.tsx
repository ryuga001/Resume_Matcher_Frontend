"use client";

import { Sparkles } from "lucide-react";
import { MAX_USES, SECTION_CARD_STYLE } from "@/components/settings/constants";
import { usageBarColor, usageHint, usedPercent } from "@/components/settings/utils";

interface PlanSectionProps {
  usesLeft: number | null;
}

export function PlanSection({ usesLeft }: PlanSectionProps) {
  const usedPct = usedPercent(usesLeft, MAX_USES);
  const barColor = usageBarColor(usesLeft);
  const hint = usageHint(usesLeft, MAX_USES);

  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <Sparkles className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
        <h3 className="font-heading text-2xl font-bold" style={{ color: "#2a2826" }}>Plan &amp; Billing</h3>
      </div>
      <div className="bg-white rounded-xl p-6 border" style={SECTION_CARD_STYLE}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex-1 max-w-md space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.14em]" style={{ background: "#ece6dc", color: "#605850" }}>Current Plan</span>
              <span className="text-sm font-bold" style={{ color: "#2a2826" }}>Free Plan</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold" style={{ color: "#605850" }}>
                <span>Usage</span>
                <span>{usesLeft !== null ? `${usesLeft} / ${MAX_USES} uses left` : "Loading…"}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "#ece6dc" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${usedPct}%`, background: barColor }} />
              </div>
              <p className="text-[11px] italic" style={{ color: "#9a9088" }}>{hint}</p>
            </div>
          </div>
          <div
            className="shrink-0 text-center p-6 rounded-xl border flex flex-col items-center gap-3 min-w-[200px]"
            style={{ background: "#f6f0e8", borderColor: "rgba(216,208,200,0.4)" }}
          >
            <div className="size-12 rounded-xl flex items-center justify-center" style={{ background: "rgba(194,101,42,0.12)" }}>
              <Sparkles className="size-6" style={{ color: "#c2652a" }} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "#3a302a" }}>Get Sahara Pro</p>
              <p className="text-xs" style={{ color: "#605850" }}>Unlimited intelligence &amp; history</p>
            </div>
            <button
              className="w-full h-10 rounded-lg text-white text-sm font-bold hover:opacity-90 transition-all mt-1"
              style={{ background: "#c2652a", boxShadow: "0 2px 8px rgba(194,101,42,0.20)" }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
