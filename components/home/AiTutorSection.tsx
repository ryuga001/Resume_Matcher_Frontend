"use client";

import Link from "next/link";
import { useRef } from "react";
import { Sparkles, ArrowRight, Bot } from "lucide-react";
import { TUTOR_PROMPTS } from "@/components/home/constants";
import { useGsapReveal } from "@/components/home/hooks/useGsapReveal";

export function AiTutorSection() {
  const ref = useRef<HTMLDivElement>(null);
  useGsapReveal([{ ref, staggerChildren: ".tutor-reveal" }]);

  return (
    <section className="flex min-h-screen items-center py-24" style={{ background: "transparent" }}>
      <div ref={ref} className="max-w-5xl mx-auto px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT — copy */}
          <div className="tutor-reveal">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="size-5" style={{ color: "#c2652a" }} strokeWidth={1.8} />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: "#c2652a" }}>
                AI Tutor
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4" style={{ color: "#2a2826" }}>
              Stuck on a concept?<br />Just ask.
            </h2>
            <p className="text-sm leading-relaxed mb-6 max-w-md" style={{ color: "#6e6862" }}>
              Every course comes with a built-in AI tutor. Ask follow-up questions, request examples, or
              get a concept re-explained — it knows the lesson you&apos;re on and answers in context.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 px-6 rounded-lg text-white text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#c2652a", boxShadow: "0 4px 20px rgba(194,101,42,0.25)", height: "46px" }}
            >
              Try the AI tutor
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {/* RIGHT — faux chat */}
          <div
            className="tutor-reveal rounded-xl p-6"
            style={{
              background: "rgba(255,255,255,0.90)",
              border: "1px solid rgba(212,200,192,0.45)",
              boxShadow: "0 8px 40px rgba(58,48,42,0.08)",
            }}
          >
            <div className="flex items-center gap-3 pb-4 mb-4 border-b" style={{ borderColor: "rgba(212,200,192,0.5)" }}>
              <div className="size-9 rounded-full flex items-center justify-center" style={{ background: "#c2652a" }}>
                <Bot className="size-5 text-white" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#2a2826" }}>Sahara Tutor</p>
                <p className="text-[10px]" style={{ color: "#9e8e84" }}>Online · answers in context</p>
              </div>
            </div>

            <div className="space-y-3">
              {TUTOR_PROMPTS.map((q, i) => (
                <div key={q} className="flex flex-col gap-3">
                  {/* user prompt */}
                  <div
                    className="self-end max-w-[80%] px-4 py-2.5 text-sm rounded-2xl rounded-br-sm"
                    style={{ background: "rgba(194,101,42,0.10)", color: "#2a2826" }}
                  >
                    {q}
                  </div>
                  {/* tutor reply (only show one, styled) */}
                  {i === 0 && (
                    <div
                      className="self-start max-w-[85%] px-4 py-2.5 text-sm rounded-2xl rounded-bl-sm leading-relaxed"
                      style={{ background: "#f2ece4", color: "#6e6862" }}
                    >
                      Sure — STAR stands for Situation, Task, Action, Result. For example: &ldquo;Our
                      checkout was slow (S/T), so I rebuilt the API (A), cutting load time 60% (R).&rdquo;
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
