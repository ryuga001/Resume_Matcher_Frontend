"use client";

import Link from "next/link";
import { useRef } from "react";
import { GraduationCap, ArrowRight, BookOpen } from "lucide-react";
import { POPULAR_COURSES } from "@/components/home/constants";
import { useGsapReveal } from "@/components/home/hooks/useGsapReveal";

export function PopularCoursesSection() {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal([{ ref, staggerChildren: ".course-card" }]);

  return (
    <section className="flex min-h-screen items-center py-24" style={{ background: "transparent" }}>
      <div ref={ref} className="max-w-5xl mx-auto px-8 w-full">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
            <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#c2652a" }}>
              The Academy
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold" style={{ color: "#2a2826" }}>
            Popular courses
          </h2>
          <p className="text-sm mt-3 max-w-md" style={{ color: "#6e6862" }}>
            Beyond the match — curated modules on strategy, interviewing, and leadership to keep your edge sharp.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_COURSES.map((c) => (
            <Link
              key={c.title}
              href="/learn"
              className="course-card group rounded-xl p-5 flex flex-col transition-all hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.88)",
                border: "1px solid rgba(212,200,192,0.45)",
                boxShadow: "0 2px 16px rgba(58,48,42,0.05)",
              }}
            >
              <div
                className="size-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(194,101,42,0.10)" }}
              >
                <BookOpen className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: "#9e8e84" }}>
                {c.category}
              </span>
              <h3 className="font-heading text-lg font-semibold leading-snug mb-3" style={{ color: "#2a2826" }}>
                {c.title}
              </h3>
              <div className="mt-auto flex items-center justify-between text-xs" style={{ color: "#6e6862" }}>
                <span>{c.lessons} lessons</span>
                <span
                  className="px-2 py-0.5 rounded-full font-bold"
                  style={{ background: "rgba(194,101,42,0.10)", color: "#c2652a" }}
                >
                  {c.level}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70"
            style={{ color: "#c2652a" }}
          >
            Browse the full Academy
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
