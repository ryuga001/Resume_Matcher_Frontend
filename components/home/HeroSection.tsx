"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useGsapHero } from "@/components/home/hooks/useGsapHero";
import { STATS } from "@/components/home/constants";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGsapHero(containerRef);

  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "92vh" }}
    >
      {/* Soft radial fade so text stays crisp over the 3D scene */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 50%, rgba(245,237,228,0.60) 0%, rgba(245,237,228,0.08) 100%)",
        }}
      />

      {/* Content */}
      <div
        ref={containerRef}
        className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center"
      >
        {/* Badge */}
        <div
          data-hero="badge"
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border"
          style={{ borderColor: "rgba(194,101,42,0.30)", background: "rgba(194,101,42,0.07)" }}
        >
          <span className="size-1.5 rounded-full" style={{ background: "#c2652a" }} />
          <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "#c2652a" }}>
            Premium Career Intelligence
          </span>
        </div>

        {/* Heading */}
        <h1
          data-hero="title"
          className="font-heading font-bold leading-[1.08] mb-6"
          style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)", color: "#2a2826" }}
        >
          Know your score before
          <br />
          <span style={{ color: "#c2652a" }}>the recruiter does</span>
        </h1>

        {/* Subtitle */}
        <p
          data-hero="sub"
          className="text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#6e6862" }}
        >
          Upload your resume, paste any job description, and get an instant ATS
          compatibility score with actionable skill gaps — in under two minutes.
        </p>

        {/* CTA buttons */}
        <div
          data-hero="buttons"
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Link
            href="/register"
            className="flex items-center gap-2 px-8 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#c2652a", boxShadow: "0 4px 20px rgba(194,101,42,0.30)", height: "52px" }}
          >
            Start for free
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/login"
            className="flex items-center px-8 rounded-xl text-sm font-bold border transition-all hover:bg-white/60"
            style={{ borderColor: "rgba(194,101,42,0.30)", color: "#2a2826", height: "52px", background: "rgba(255,255,255,0.50)" }}
          >
            Sign in
          </Link>
        </div>

        {/* Stats row */}
        <div data-hero="stats" className="flex items-center justify-center gap-10">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-heading text-2xl font-bold" style={{ color: "#2a2826" }}>{value}</div>
              <div className="text-xs mt-0.5" style={{ color: "#9e8e84" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
