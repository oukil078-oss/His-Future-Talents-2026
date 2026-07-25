// Central GSAP setup – registers ScrollTrigger and exports animation presets
// Import this in any client component BEFORE using gsap or ScrollTrigger

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins once (safe to call multiple times)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };

/** Fade-up reveal preset for a single element */
export function fadeInUp(
  el: Element | null,
  opts: { delay?: number; duration?: number; y?: number } = {}
) {
  if (!el) return;
  return gsap.from(el, {
    y: opts.y ?? 40,
    opacity: 0,
    duration: opts.duration ?? 0.8,
    delay: opts.delay ?? 0,
    ease: "power3.out",
  });
}

/** Stagger reveal for a list of elements */
export function staggerReveal(
  els: Element[] | NodeListOf<Element>,
  opts: { stagger?: number; y?: number; duration?: number; delay?: number } = {}
) {
  return gsap.from(els, {
    y: opts.y ?? 50,
    opacity: 0,
    duration: opts.duration ?? 0.7,
    delay: opts.delay ?? 0,
    stagger: opts.stagger ?? 0.1,
    ease: "power3.out",
  });
}

/** ScrollTrigger-powered reveal for a single element */
export function scrollReveal(
  el: Element | null,
  trigger: Element | null,
  opts: { y?: number; duration?: number; delay?: number } = {}
) {
  if (!el || !trigger) return;
  return gsap.from(el, {
    y: opts.y ?? 50,
    opacity: 0,
    duration: opts.duration ?? 0.9,
    delay: opts.delay ?? 0,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start: "top 80%",
      once: true,
    },
  });
}

/** ScrollTrigger-powered stagger for multiple elements */
export function scrollStagger(
  els: Element[] | NodeListOf<Element>,
  trigger: Element | null,
  opts: { stagger?: number; y?: number; duration?: number } = {}
) {
  if (!trigger) return;
  return gsap.from(els, {
    y: opts.y ?? 60,
    opacity: 0,
    duration: opts.duration ?? 0.75,
    stagger: opts.stagger ?? 0.12,
    ease: "power3.out",
    scrollTrigger: {
      trigger,
      start: "top 75%",
      once: true,
    },
  });
}
