"use client";

import { useCallback, useRef } from "react";
import { useWorkflowScene } from "@/components/home/workflow/hooks/useWorkflowScene";
import {
  WORKFLOW_STAGES,
  WF_TRANSITION as TR,
  WF_COLORS as C,
} from "@/components/home/workflow/constants";

// caption fade envelope — kept in sync with the canvas stage presence
function captionAlpha(p: number, start: number, end: number, first: boolean, last: boolean) {
  const ss = (e0: number, e1: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0 || 1)));
    return t * t * (3 - 2 * t);
  };
  const up = first ? 1 : ss(start, start + TR, p);
  const down = last ? 1 : 1 - ss(end - TR, end, p);
  return Math.min(up, down);
}

export function WorkflowSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fillRef = useRef<HTMLDivElement>(null);

  const onFrame = useCallback((p: number) => {
    WORKFLOW_STAGES.forEach((st, i) => {
      const el = captionRefs.current[i];
      if (el) {
        const a = captionAlpha(p, st.start, st.end, i === 0, i === WORKFLOW_STAGES.length - 1);
        el.style.opacity = String(a);
        el.style.transform = `translateY(${(1 - a) * 16}px)`;
      }
      const dot = dotRefs.current[i];
      if (dot) {
        const reached = p >= st.start - 0.001;
        const active = p >= st.start && p < st.end + 0.001;
        dot.style.background = reached ? C.primary : C.track;
        dot.style.transform = `scale(${active ? 1.4 : 1})`;
        dot.style.boxShadow = active ? "0 0 0 5px rgba(194,101,42,0.16)" : "none";
      }
    });
    if (fillRef.current) fillRef.current.style.height = `${p * 100}%`;
  }, []);

  useWorkflowScene({ canvasRef, onFrame });

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="mx-auto flex h-screen w-full max-w-6xl flex-col items-stretch gap-6 px-6 py-16 md:flex-row md:items-center md:gap-10 md:py-0">

        {/* LEFT — copy + vertical stepper */}
        <div className="flex shrink-0 items-start gap-5 md:w-[34%]">
          <div className="relative hidden w-3 self-stretch sm:block" style={{ minHeight: 240 }}>
            <div
              className="absolute left-1/2 top-1 bottom-1 w-[2px] -translate-x-1/2 rounded-full"
              style={{ background: C.track }}
            />
            <div
              ref={fillRef}
              className="absolute left-1/2 top-1 w-[2px] -translate-x-1/2 rounded-full"
              style={{ background: C.primary, height: "0%" }}
            />
            <div className="absolute inset-0 flex flex-col justify-between py-1">
              {WORKFLOW_STAGES.map((st, i) => (
                <div
                  key={st.key}
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className="size-3 rounded-full"
                  style={{ background: C.track }}
                />
              ))}
            </div>
          </div>

          <div className="flex-1">
            <span
              className="mb-4 block text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: C.primary }}
            >
              See it work
            </span>
            <div className="relative h-[220px] md:h-[240px]">
              {WORKFLOW_STAGES.map((st, i) => (
                <div
                  key={st.key}
                  ref={(el) => { captionRefs.current[i] = el; }}
                  className="absolute inset-x-0 top-0"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <div
                    className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: C.textFaint }}
                  >
                    {st.step} — {st.eyebrow}
                  </div>
                  <h3
                    className="font-heading text-3xl font-bold md:text-4xl"
                    style={{ color: C.text }}
                  >
                    {st.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed" style={{ color: C.textMuted }}>
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — self-playing Three.js stage (enlarged) */}
        <div className="relative w-full flex-1 self-stretch overflow-hidden md:h-[88%] min-h-[340px]">
          <canvas
            ref={canvasRef}
            aria-hidden
            className="absolute inset-0 h-full w-full"
            style={{ display: "block" }}
          />
        </div>
      </div>
    </section>
  );
}
