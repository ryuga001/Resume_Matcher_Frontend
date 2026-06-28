"use client";

import { useRef } from "react";
import { HOW_IT_WORKS } from "@/components/home/constants";
import { useGsapReveal } from "@/components/home/hooks/useGsapReveal";

export function HowItWorksSection() {
  const colRef = useRef<HTMLDivElement>(null);
  useGsapReveal([{ ref: colRef, staggerChildren: ".hiw-step" }]);

  return (
    // Transparent — 3D scene shows through. Ball travels the LEFT half.
    <section className="py-28" style={{ background: "transparent" }}>
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-2 gap-16 items-center" style={{ minHeight: "520px" }}>

          {/* LEFT — empty lane: ball travels here */}
          <div />

          {/* RIGHT — content column */}
          <div ref={colRef}>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#c2652a" }}>
              How it works
            </span>
            <h2 className="font-heading text-4xl font-bold mt-2 mb-8" style={{ color: "#2a2826" }}>
              From upload to insight<br />in 2 minutes
            </h2>

            <div className="space-y-6">
              {HOW_IT_WORKS.map(({ step, title, desc }) => (
                <div
                  key={step}
                  className="hiw-step flex items-start gap-5 rounded-xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(212,200,192,0.45)",
                    boxShadow: "0 2px 12px rgba(58,48,42,0.06)",
                  }}
                >
                  <div
                    className="shrink-0 size-12 rounded-full flex items-center justify-center font-heading text-lg font-bold"
                    style={{ background: "#c2652a", color: "#ffffff", boxShadow: "0 4px 16px rgba(194,101,42,0.30)" }}
                  >
                    {step}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-heading text-xl font-semibold mb-1" style={{ color: "#2a2826" }}>{title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "#6e6862" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
