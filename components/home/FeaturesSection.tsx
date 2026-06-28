"use client";

import { useRef } from "react";
import { FEATURES } from "@/components/home/constants";
import { useGsapReveal } from "@/components/home/hooks/useGsapReveal";

export function FeaturesSection() {
  const colRef = useRef<HTMLDivElement>(null);
  useGsapReveal([{ ref: colRef, staggerChildren: ".feature-item" }]);

  return (
    // Transparent — 3D scene shows through. Ball travels the RIGHT half.
    <section className="py-28" style={{ background: "transparent" }}>
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-2 gap-16 items-center" style={{ minHeight: "520px" }}>

          {/* LEFT — content column */}
          <div ref={colRef}>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#c2652a" }}>
              Why Sahara
            </span>
            <h2 className="font-heading text-4xl font-bold mt-2 mb-8" style={{ color: "#2a2826" }}>
              Everything you need<br />to land the role
            </h2>

            <div className="space-y-4">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="feature-item flex items-start gap-4 rounded-xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.82)",
                    border: "1px solid rgba(212,200,192,0.45)",
                    boxShadow: "0 2px 12px rgba(58,48,42,0.06)",
                  }}
                >
                  <div
                    className="shrink-0 size-10 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(194,101,42,0.10)" }}
                  >
                    <Icon className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold mb-1" style={{ color: "#2a2826" }}>{title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#6e6862" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — empty lane: ball travels here */}
          <div />
        </div>
      </div>
    </section>
  );
}
