"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { HistoryItem } from "./types";
import { scoreBadgeStyle } from "./utils";
import { COLORS } from "./constants";

interface RecentComparisonsProps {
  history: HistoryItem[];
}

export function RecentComparisons({ history }: RecentComparisonsProps) {
  if (history.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: COLORS.border }}>
        <h3 className="font-heading text-xl font-semibold" style={{ color: COLORS.text }}>Recent Comparisons</h3>
        <Link href="/history" className="text-[10px] font-bold uppercase tracking-[0.12em] hover:underline flex items-center gap-1" style={{ color: COLORS.textFaint }}>
          View All <ChevronRight className="size-3" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {history.slice(0, 3).map(item => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function HistoryCard({ item }: { item: HistoryItem }) {
  const badgeStyle = scoreBadgeStyle(item.atsScore);

  return (
    <Link
      href={`/history/${item.id}`}
      className="p-5 rounded-md border transition-colors hover:bg-white"
      style={{ background: "rgba(255,255,255,0.6)", borderColor: COLORS.border }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded uppercase" style={badgeStyle}>
          {item.atsScore}% Match
        </span>
        <span className="text-[10px]" style={{ color: COLORS.textFaint }}>
          {new Date(item.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-sm font-bold truncate" style={{ color: COLORS.text }}>{item.resumeName}</p>
      <p className="text-xs mt-1 truncate" style={{ color: COLORS.textFaint }}>
        {item.jobDescription?.substring(0, 60)}…
      </p>
    </Link>
  );
}
