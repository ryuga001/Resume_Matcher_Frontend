"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export function useGsapHero(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;
    let cleanupParallax: (() => void) | undefined;

    import("gsap").then(({ gsap }) => {
      const el = containerRef.current;
      if (!el) return;

      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // gentle perpetual float — created paused so it never fights the
        // entrance tween, then released once the entrance settles.
        const floatArt = reduced ? null : gsap.to('[data-hero="art"]', {
          y: -14, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true,
        });
        const floatBadge = reduced ? null : gsap.to('[data-hero="badge-art"]', {
          y: -8, duration: 2.6, ease: "sine.inOut", yoyo: true, repeat: -1, paused: true,
        });

        tl.from('[data-hero="badge"]', { opacity: 0, y: 16, duration: 0.6 })
          // word-by-word headline reveal
          .from('.hero-word', { yPercent: 120, duration: 0.7, stagger: 0.06 }, "-=0.2")
          .from('[data-hero="sub"]', { opacity: 0, y: 20, duration: 0.6 }, "-=0.35")
          .from('[data-hero="buttons"] > *', {
            opacity: 0, y: 16, scale: 0.96, duration: 0.5, stagger: 0.1,
          }, "-=0.35")
          .from('[data-hero="stats"] > *', {
            opacity: 0, y: 12, duration: 0.5, stagger: 0.08,
          }, "-=0.3")
          .from('[data-hero="art"]', {
            opacity: 0, y: 44, scale: 0.94, duration: 0.9,
          }, "-=0.9")
          .from('[data-hero="badge-art"]', {
            opacity: 0, scale: 0.6, duration: 0.5, ease: "back.out(1.7)",
          }, "-=0.35")
          .add(() => {
            floatArt?.play();
            floatBadge?.play();
          });
      }, el);

      // mouse parallax on the artwork column
      if (!reduced) {
        const wrap = el.querySelector<HTMLElement>('[data-hero="art-wrap"]');
        if (wrap) {
          const xTo = gsap.quickTo(wrap, "x", { duration: 0.6, ease: "power3.out" });
          const yTo = gsap.quickTo(wrap, "y", { duration: 0.6, ease: "power3.out" });
          const onMove = (e: MouseEvent) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            xTo(nx * 16);
            yTo(ny * 14);
          };
          window.addEventListener("mousemove", onMove);
          cleanupParallax = () => window.removeEventListener("mousemove", onMove);
        }
      }
    });

    return () => {
      cleanupParallax?.();
      ctx?.revert();
    };
  }, [containerRef]);
}
