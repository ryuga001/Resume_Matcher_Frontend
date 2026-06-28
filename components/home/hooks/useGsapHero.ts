"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export function useGsapHero(containerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    import("gsap").then(({ gsap }) => {
      const el = containerRef.current;
      if (!el) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from('[data-hero="badge"]',    { opacity: 0, y: 16, duration: 0.6 })
          .from('[data-hero="title"]',    { opacity: 0, y: 32, duration: 0.75 }, "-=0.3")
          .from('[data-hero="sub"]',      { opacity: 0, y: 20, duration: 0.65 }, "-=0.45")
          .from('[data-hero="buttons"] > *', {
            opacity: 0, y: 16, scale: 0.94, duration: 0.55, stagger: 0.12,
          }, "-=0.4")
          .from('[data-hero="stats"] > *', {
            opacity: 0, y: 12, duration: 0.5, stagger: 0.1,
          }, "-=0.3");
      }, el);
    });

    return () => ctx?.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
