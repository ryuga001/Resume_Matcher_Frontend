"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

interface RevealTarget {
  ref: RefObject<HTMLElement | null>;
  /** extra stagger for child elements — pass a child selector string */
  staggerChildren?: string;
  delay?: number;
}

export function useGsapReveal(targets: RevealTarget[]) {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          targets.forEach(({ ref, staggerChildren, delay = 0 }) => {
            const el = ref.current;
            if (!el) return;

            if (staggerChildren) {
              gsap.from(el.querySelectorAll(staggerChildren), {
                opacity: 0, y: 50, duration: 0.80, stagger: 0.14, delay,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              });
            } else {
              gsap.from(el, {
                opacity: 0, y: 40, duration: 0.75, delay,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              });
            }
          });
        });
      }
    );

    return () => ctx?.revert();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
