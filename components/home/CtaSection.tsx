"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRef } from "react";
import { CTA_PERKS } from "@/components/home/constants";
import { useGsapReveal } from "@/components/home/hooks/useGsapReveal";

export function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  useGsapReveal([{ ref }]);

  return (
    <section ref={ref} className="py-28" style={{ background: "transparent" }}>
      <div className="max-w-3xl mx-auto px-8">
        <div
          className="rounded-xl px-8 py-14 text-center"
          style={{
            background: "rgba(42,40,38,0.94)",
            boxShadow: "0 8px 48px rgba(42,40,38,0.22)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "rgba(194,101,42,0.80)" }}>
            Get started today
          </span>
          <h2 className="font-heading text-4xl font-bold mt-3 mb-4" style={{ color: "#f5ede4" }}>
            Ready to stop guessing?
          </h2>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: "rgba(245,237,228,0.62)" }}>
            Free to start — 10 analyses included. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#c2652a", boxShadow: "0 4px 20px rgba(194,101,42,0.40)", height: "52px" }}
          >
            Create free account
            <ArrowRight className="size-4" />
          </Link>
          <div className="flex items-center justify-center gap-8 mt-8">
            {CTA_PERKS.map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(245,237,228,0.50)" }}>
                <CheckCircle2 className="size-3.5" style={{ color: "rgba(194,101,42,0.70)" }} /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
