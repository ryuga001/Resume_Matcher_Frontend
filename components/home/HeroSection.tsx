"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, FileText, Bot } from "lucide-react";
import { useRef } from "react";
import { useGsapHero } from "@/components/home/hooks/useGsapHero";
import { HeroCanvas } from "@/components/home/HeroCanvas";

const HERO_STATS: { icon: typeof TrendingUp; value: string; label: string }[] = [
  { icon: TrendingUp, value: "87%", label: "avg. score lift" },
  { icon: FileText, value: "12k+", label: "resumes analyzed" },
  { icon: Bot, value: "24/7", label: "AI tutor" },
];

const LINE_1 = ["Know", "your", "score", "before"];
const LINE_2 = ["the", "recruiter", "does"];

/** Each word sits in an overflow-clipped wrapper so GSAP can slide it up. */
function Word({ children, accent }: { children: string; accent?: boolean }) {
  return (
    <span className="inline-block overflow-hidden align-bottom">
      <span
        className="hero-word inline-block"
        style={{ color: accent ? "#c2652a" : undefined, willChange: "transform" }}
      >
        {children}&nbsp;
      </span>
    </span>
  );
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  useGsapHero(containerRef);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Layered warm background for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(180deg, #f8f1e8 0%, #f5ede4 55%, #f1e7db 100%)" }}
      />
      {/* Big soft brand glow behind the illustration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(46% 55% at 76% 42%, rgba(194,101,42,0.20) 0%, rgba(194,101,42,0.0) 70%)",
        }}
      />

      {/* Spatial particle field — Three.js depth behind the hero */}
      <div className="absolute inset-0 pointer-events-none">
        <HeroCanvas />
      </div>

      {/* Soft radial fade so text stays crisp over the 3D scene */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 32% 50%, rgba(245,237,228,0.80) 0%, rgba(245,237,228,0.06) 100%)",
        }}
      />

      <div
        ref={containerRef}
        className="relative z-10 grid w-full max-w-6xl mx-auto grid-cols-1 items-center gap-12 px-6 py-24 lg:grid-cols-2"
      >
        {/* LEFT — copy */}
        <div>
          <div
            data-hero="badge"
            className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full border"
            style={{ borderColor: "rgba(194,101,42,0.30)", background: "rgba(194,101,42,0.07)" }}
          >
            <span className="size-1.5 rounded-full" style={{ background: "#c2652a" }} />
            <span className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color: "#c2652a" }}>
              Premium Career Intelligence
            </span>
          </div>

          <h1
            className="font-heading font-bold leading-[1.08] mb-6"
            style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.6rem)", color: "#2a2826" }}
          >
            {LINE_1.map((w, i) => <Word key={i}>{w}</Word>)}
            <br />
            {LINE_2.map((w, i) => <Word key={i} accent>{w}</Word>)}
          </h1>

          <p
            data-hero="sub"
            className="text-lg max-w-lg mb-9 leading-relaxed"
            style={{ color: "#6e6862" }}
          >
            More than a resume checker. Score your resume against any job, close the
            gaps with expert courses and an AI tutor, then tailor it and apply — your
            entire career journey in one place.
          </p>

          <div data-hero="buttons" className="flex flex-col sm:flex-row items-start gap-3 mb-12">
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

          <div data-hero="stats" className="flex items-center gap-8">
            {HERO_STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="size-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(194,101,42,0.10)" }}
                >
                  <Icon className="size-4" style={{ color: "#c2652a" }} strokeWidth={2} />
                </div>
                <div>
                  <div className="font-heading text-lg font-bold leading-none" style={{ color: "#2a2826" }}>{value}</div>
                  <div className="text-[11px] mt-1" style={{ color: "#9e8e84" }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — floating illustration */}
        <div data-hero="art-wrap" className="relative hidden lg:block">
          <div
            data-hero="art"
            className="relative rounded-xl overflow-hidden border"
            style={{ borderColor: "rgba(212,200,192,0.6)", boxShadow: "0 24px 70px rgba(58,48,42,0.22)", willChange: "transform" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/landing/hero.png"
              alt="Sahara career intelligence — abstract architectural render"
              className="block w-full aspect-[4/5] object-cover"
            />
          </div>

          <div
            data-hero="badge-art"
            className="absolute -bottom-5 -right-4 rounded-xl px-5 py-3 text-white"
            style={{ background: "#c2652a", boxShadow: "0 10px 30px rgba(194,101,42,0.40)", willChange: "transform" }}
          >
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-90">ATS Compatibility</div>
            <div className="font-heading text-3xl font-bold leading-none mt-0.5">94%</div>
          </div>
        </div>
      </div>
    </section>
  );
}
