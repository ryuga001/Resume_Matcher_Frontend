import Link from "next/link";
import { COLORS, TABLE_COLUMNS } from "@/components/dashboard/constants";
import { ResumeTableRow } from "@/components/dashboard/ResumeTableRow";
import type { Resume, HistoryItem } from "@/components/dashboard/types";

type ResumeTableProps = {
  resumes: Resume[];
  history: HistoryItem[];
  loading: boolean;
};

export function ResumeTable({ resumes, history, loading }: ResumeTableProps) {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-heading text-lg font-bold" style={{ color: COLORS.textPrimary }}>Recent Resumes</h2>
        <Link href="/resumes" className="text-sm font-semibold hover:underline" style={{ color: COLORS.accent }}>
          View All Library
        </Link>
      </div>

      <div className="grid grid-cols-[1fr_160px_80px_120px] gap-2 px-1 mb-3">
        {TABLE_COLUMNS.map(col => (
          <span key={col} className="text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: COLORS.textMuted }}>
            {col}
          </span>
        ))}
      </div>

      <div className="flex flex-col divide-y divide-[#f5ede4]">
        {loading ? (
          [1, 2, 3].map(i => <ResumeTableRow key={i} loading />)
        ) : resumes.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium" style={{ color: COLORS.textSecondary }}>No resumes yet</p>
            <Link href="/resumes" className="text-sm font-semibold mt-1 inline-block hover:underline" style={{ color: COLORS.accent }}>
              Upload your first resume
            </Link>
          </div>
        ) : (
          resumes.map(r => {
            const matchedHistory = history.find(h => h.resumeName === r.fileName);
            return (
              <ResumeTableRow
                key={r.resumeId}
                resume={r}
                matchedScore={matchedHistory?.atsScore ?? null}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
