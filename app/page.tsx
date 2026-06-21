"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Zap, FileText, Sparkles, History, ArrowRight, CheckCircle2 } from "lucide-react";

const FEATURES = [
  {
    icon: FileText,
    title: "Upload once, analyze forever",
    desc: "Keep your PDF library in one place. Reuse any resume across multiple job applications.",
  },
  {
    icon: Sparkles,
    title: "Instant ATS score",
    desc: "Get a 0–100 match score in seconds. Know exactly where you stand before hitting send.",
  },
  {
    icon: History,
    title: "Full analysis history",
    desc: "Every scored match is saved. Review past analyses and track improvement over time.",
  },
];

const STATS = [
  { value: "2 min", label: "to your first score" },
  { value: "60+", label: "skills detected" },
  { value: "100%", label: "private & tenant-isolated" },
];

export default function RootPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [user, isLoading, router]);

  if (isLoading || user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-primary" />
            <span className="font-heading text-sm font-semibold tracking-tight">MatchKit</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Button asChild size="sm">
              <Link href="/register">Get started free</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
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

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-sm mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <div className="font-heading text-2xl font-bold">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="border-t border-border" />
        </div>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-10 text-center">
            Everything you need
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-lg p-6">
                <div className="size-9 rounded-md bg-primary/8 flex items-center justify-center mb-4">
                  <Icon className="size-4 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-sm mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="bg-card border border-border rounded-xl p-8 sm:p-10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-8 text-center">
              How it works
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Upload your resume", desc: "Drag and drop any PDF. MatchKit indexes your skills in the background." },
                { step: "02", title: "Paste the job description", desc: "Copy the full JD — responsibilities, requirements, preferred qualifications." },
                { step: "03", title: "Get your score", desc: "See your ATS match score, skill gaps, and concrete recommendations instantly." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex flex-col gap-3">
                  <span className="font-mono text-xs font-bold text-primary/60">{step}</span>
                  <h4 className="font-heading font-semibold text-sm">{title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <div className="bg-primary rounded-xl p-8 sm:p-12 text-center text-primary-foreground">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Ready to stop guessing?
            </h2>
            <p className="text-sm opacity-70 mb-8 max-w-sm mx-auto">
              Free to start — 10 analyses included. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register" className="flex items-center gap-2">
                  Create free account <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 opacity-60 text-xs">
              {["No credit card", "10 free analyses", "Cancel anytime"].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5" /> {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="size-3.5 text-primary" />
            <span className="font-heading text-xs font-semibold text-muted-foreground">MatchKit</span>
          </div>
          <p className="text-xs text-muted-foreground">ATS intelligence for serious job seekers.</p>
        </div>
      </footer>
    </div>
  );
}
