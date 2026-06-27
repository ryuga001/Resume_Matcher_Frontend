import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight } from "lucide-react";
import { STATS } from "@/components/home/constants";

export function HeroSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
      <div className="inline-flex items-center gap-2 bg-primary/8 border border-primary/20 rounded-full px-3 py-1 mb-8">
        <Zap className="size-3 text-primary" />
        <span className="text-xs font-semibold text-primary">ATS intelligence for job seekers</span>
      </div>

      <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
        Know your score before the recruiter does
      </h1>

      <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
        Upload your resume, paste any job description, and get an instant ATS compatibility
        score with actionable skill gaps — no guesswork.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link href="/register" className="flex items-center gap-2">
            Start for free <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-16 max-w-sm mx-auto">
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <div className="font-heading text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
