import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { COLORS } from "@/components/dashboard/constants";

type InsightCardProps = {
  avg: number | null;
};

export function InsightCard({ avg }: InsightCardProps) {
  return (
    <div className="bg-white rounded-md p-6 border" style={{ borderColor: COLORS.borderColor, boxShadow: "none" }}>
      <div className="size-12 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ background: COLORS.accentBg }}>
        <Lightbulb className="size-5" style={{ color: COLORS.accent }} strokeWidth={1.5} />
      </div>
      <h3 className="font-heading text-base font-bold text-center mb-3" style={{ color: COLORS.textPrimary }}>
        Intelligence Insight
      </h3>
      <p className="text-sm text-center leading-relaxed italic" style={{ color: COLORS.textSecondary }}>
        {avg !== null && avg < 60
          ? `"Your resume score of ${avg}/100 indicates skill gaps. Run a deep scan to see exact missing keywords."`
          : avg !== null
          ? `"Your average score of ${avg}/100 is strong. Targeting specific roles can push it higher."`
          : `"Upload a resume and run your first analysis to unlock personalized career insights."`
        }
      </p>
      <div className="text-center mt-4">
        <Link href="/analyze" className="text-sm font-bold hover:underline" style={{ color: COLORS.accent }}>
          Fix Now
        </Link>
      </div>
    </div>
  );
}
