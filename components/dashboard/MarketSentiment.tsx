import { COLORS, MARKET_SENTIMENT } from "@/components/dashboard/constants";

export function MarketSentiment() {
  return (
    <div className="rounded-md p-6" style={{ background: COLORS.darkCardBg, boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}>
      <h3 className="font-heading text-base font-bold mb-5" style={{ color: COLORS.darkCardText }}>
        Market Sentiment
      </h3>
      <div className="flex flex-col gap-5">
        {MARKET_SENTIMENT.map(({ label, value, pct }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: COLORS.textMuted }}>{label}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: COLORS.textMuted }}>{value}</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: COLORS.darkCardBarBg }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS.accent }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
