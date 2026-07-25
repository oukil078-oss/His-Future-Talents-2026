"use client";

import React, { useEffect, useRef } from "react";

export default function LivingBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const svg = svgRef.current;
    if (!svg) return;

    let animFrame: number;
    let t = 0;

    // Animated node positions
    const nodes = Array.from({ length: 22 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003,
    }));

    const linesEl = svg.querySelector<SVGGElement>("#bg-lines");
    const dotsEl  = svg.querySelector<SVGGElement>("#bg-dots");

    const tick = () => {
      t++;
      let linesHTML = "";
      let dotsHTML  = "";

      const W = svg.viewBox.baseVal.width || 1440;
      const H = svg.viewBox.baseVal.height || 900;

      nodes.forEach((n) => {
        n.x = ((n.x + n.vx) + 1.1) % 1.1;
        n.y = ((n.y + n.vy) + 1.1) % 1.1;
        const px = n.x * W;
        const py = n.y * H;
        dotsHTML += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="1.5" fill="rgba(88,185,255,0.22)"/>`;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * W;
          const dy = (nodes[i].y - nodes[j].y) * H;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const alpha = (1 - dist / 200) * 0.06;
            linesHTML += `<line x1="${(nodes[i].x * W).toFixed(1)}" y1="${(nodes[i].y * H).toFixed(1)}" x2="${(nodes[j].x * W).toFixed(1)}" y2="${(nodes[j].y * H).toFixed(1)}" stroke="rgba(88,185,255,${alpha.toFixed(3)})" stroke-width="0.8"/>`;
          }
        }
      }

      if (linesEl) linesEl.innerHTML = linesHTML;
      if (dotsEl)  dotsEl.innerHTML  = dotsHTML;

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* Static subtle grid */}
      <defs>
        <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
          <path d="M 72 0 L 0 0 0 72" fill="none" stroke="rgba(0,56,118,0.04)" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {/* Animated network */}
      <g id="bg-lines" />
      <g id="bg-dots" />
    </svg>
  );
}
