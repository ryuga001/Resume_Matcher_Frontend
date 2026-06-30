"use client";

import { useRef } from "react";
import { FEATURES } from "@/components/home/constants";
import { useGsapReveal } from "@/components/home/hooks/useGsapReveal";

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal([{ ref, staggerChildren: ".feature-item" }]);

  return (
    <section className="flex min-h-screen items-center py-24" style={{ background: "transparent" }}>
      <div ref={ref} className="max-w-5xl mx-auto px-8 w-full">
        <div className="text-center mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#c2652a" }}>
            Why Sahara
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mt-2" style={{ color: "#2a2826" }}>
            Everything you need to land the role
          </h2>
          <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: "#6e6862" }}>
            One workspace for your resumes, your matches, and the insight that closes the gap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="feature-item rounded-xl p-7"
              style={{
                background: "rgba(255,255,255,0.86)",
                border: "1px solid rgba(212,200,192,0.45)",
                boxShadow: "0 2px 16px rgba(58,48,42,0.05)",
              }}
            >
              <div
                className="size-11 rounded-xl flex items-center justify-center mb-5"
                style={{ background: "rgba(194,101,42,0.10)" }}
              >
                <Icon className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2" style={{ color: "#2a2826" }}>
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "#6e6862" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
