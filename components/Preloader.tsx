"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const centerSealRef = useRef<HTMLDivElement>(null);
  const ringCircleRef = useRef<SVGCircleElement>(null);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const lightFlareRef = useRef<HTMLDivElement>(null);
  const welcomeTextRef = useRef<HTMLDivElement>(null);

  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onComplete();
      return;
    }

    const container = containerRef.current;
    const stage = stageRef.current;
    const leftDoor = leftDoorRef.current;
    const rightDoor = rightDoorRef.current;
    const centerSeal = centerSealRef.current;
    const ringCircle = ringCircleRef.current;
    const percentText = percentTextRef.current;
    const lightFlare = lightFlareRef.current;
    const welcomeText = welcomeTextRef.current;

    if (!container || !leftDoor || !rightDoor || !centerSeal) {
      onComplete();
      return;
    }

    // Set initial 3D transform origins and states
    gsap.set(stage, { perspective: 1400 });
    gsap.set(leftDoor, { transformOrigin: "left center", rotateY: 0 });
    gsap.set(rightDoor, { transformOrigin: "right center", rotateY: 0 });
    gsap.set(centerSeal, { opacity: 0, scale: 0.85, y: 15 });
    gsap.set(welcomeText, { opacity: 0, y: 10 });
    gsap.set(lightFlare, { opacity: 0, scale: 0.5 });

    const totalDash = 283; // 2 * pi * 45
    if (ringCircle) {
      gsap.set(ringCircle, { strokeDasharray: totalDash, strokeDashoffset: totalDash });
    }

    // GSAP Timeline for the 3D Grand Door Opening Experience
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(container, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            if (container) container.style.display = "none";
            onComplete();
          },
        });
      },
    });

    // 1. Entrance of the 3D Center Seal & Welcome Text
    tl.to(centerSeal, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      .to(
        welcomeText,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );

    // 2. Animate Circular Progress Ring and Counter from 0% to 100%
    const progressObj = { value: 0 };
    tl.to(
      progressObj,
      {
        value: 100,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          const val = Math.round(progressObj.value);
          setCounter(val);
          if (ringCircle) {
            const offset = totalDash - (val / 100) * totalDash;
            ringCircle.style.strokeDashoffset = `${offset}`;
          }
        },
      },
      "-=0.2"
    );

    // 3. Center Lock Pulse & Flash Burst
    tl.to(centerSeal, {
      scale: 1.12,
      duration: 0.35,
      ease: "back.out(2)",
    })
      .to(lightFlare, {
        opacity: 0.9,
        scale: 2.5,
        duration: 0.45,
        ease: "power3.out",
      }, "-=0.2")
      .to(centerSeal, {
        opacity: 0,
        scale: 1.4,
        filter: "blur(12px)",
        duration: 0.4,
        ease: "power3.in",
      }, "-=0.15");

    // 4. THE GRAND 3D DOOR OPENING (Swinging Outwards into 3D Depth)
    tl.to(
      leftDoor,
      {
        rotateY: -115,
        duration: 1.5,
        ease: "power4.inOut",
      },
      "-=0.25"
    )
      .to(
        rightDoor,
        {
          rotateY: 115,
          duration: 1.5,
          ease: "power4.inOut",
        },
        "-=1.5"
      )
      // Radiant Light Burst Expansion as Doors Open
      .to(
        lightFlare,
        {
          opacity: 1,
          scale: 5,
          duration: 0.8,
          ease: "power2.in",
        },
        "-=1.3"
      )
      .to(
        lightFlare,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
      );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      id="preloader"
      className="fixed inset-0 z-[10000] bg-[#070D18] text-white select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 3D Perspective Stage */}
      <div
        ref={stageRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        style={{ perspective: "1400px", transformStyle: "preserve-3d" }}
      >
        {/* Background Light Beam Spotlight behind the Doors */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#003876]/60 via-[#0E1B2C]/90 to-[#070D18] pointer-events-none" />

        {/* ── LEFT 3D DOOR PANEL ── */}
        <div
          ref={leftDoorRef}
          className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-r from-[#070D18] via-[#0E1B2C] to-[#002855] border-r-2 border-[#F05A22]/50 shadow-[20px_0_60px_rgba(0,0,0,0.8)] flex items-center justify-end pr-8 sm:pr-16 z-20 overflow-hidden"
          style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
        >
          {/* Decorative Door Texture & Architectural Line Accents */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(240,90,34,0.05)_50%,transparent_100%)] pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#F05A22] to-transparent shadow-[0_0_15px_#F05A22]" />
          
          {/* Embossed Brand Motif Watermark */}
          <div className="w-48 sm:w-72 opacity-15 pointer-events-none transform -rotate-12 translate-x-12 select-none">
            <img src="/brand/motifs/Future Talents Icon Orange-01.png" alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* ── RIGHT 3D DOOR PANEL ── */}
        <div
          ref={rightDoorRef}
          className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#070D18] via-[#0E1B2C] to-[#002855] border-l-2 border-[#F05A22]/50 shadow-[-20px_0_60px_rgba(0,0,0,0.8)] flex items-center justify-start pl-8 sm:pl-16 z-20 overflow-hidden"
          style={{ backfaceVisibility: "hidden", transformStyle: "preserve-3d" }}
        >
          {/* Decorative Door Texture & Architectural Line Accents */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(88,185,255,0.05)_50%,transparent_100%)] pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#58B9FF] to-transparent shadow-[0_0_15px_#58B9FF]" />
          
          {/* Embossed Brand Motif Watermark */}
          <div className="w-48 sm:w-72 opacity-15 pointer-events-none transform rotate-12 -translate-x-12 select-none">
            <img src="/brand/motifs/Future Talents Icon Blue-01.png" alt="" className="w-full h-auto" />
          </div>
        </div>

        {/* ── RADIANT LIGHT FLARE BURST ── */}
        <div
          ref={lightFlareRef}
          className="absolute inset-0 m-auto w-96 h-96 rounded-full bg-gradient-to-tr from-[#F05A22] via-[#FFBD0E] to-white blur-3xl pointer-events-none z-10 opacity-0"
        />

        {/* ── 3D CENTER EMBLEM / WELCOME LOCK ── */}
        <div
          ref={centerSealRef}
          className="absolute z-30 flex flex-col items-center justify-center p-6 text-center space-y-6"
        >
          {/* Circular Progress & Logo Container */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center rounded-full bg-[#0E1B2C]/90 border border-white/20 shadow-[0_0_50px_rgba(240,90,34,0.35)] backdrop-blur-xl">
            {/* SVG Circular Progress Bar */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-white/10 fill-none"
                strokeWidth="3"
              />
              <circle
                ref={ringCircleRef}
                cx="50"
                cy="50"
                r="45"
                className="stroke-[#F05A22] fill-none transition-all duration-75"
                strokeWidth="3.5"
                strokeLinecap="round"
                style={{ strokeDasharray: "283", strokeDashoffset: "283" }}
              />
            </svg>

            {/* Inner Brand Logo */}
            <div className="relative z-10 flex flex-col items-center p-3">
              <img
                src="/app-logo.png"
                alt="HIS Future Talents"
                className="h-10 sm:h-12 w-auto object-contain rounded-lg shadow-sm"
              />
              {/* Monospace Counter */}
              <span
                ref={percentTextRef}
                className="text-xs sm:text-sm font-black text-[#58B9FF] tracking-widest mt-1"
              >
                {counter}%
              </span>
            </div>
          </div>

          {/* Welcome Titles in French & Arabic */}
          <div ref={welcomeTextRef} className="space-y-1.5 max-w-sm text-center">
            <h2 className="text-lg sm:text-xl font-black tracking-wider uppercase text-white drop-shadow-md">
              Bienvenue au Salon
            </h2>
            <p className="text-xs sm:text-sm font-extrabold text-[#F05A22] tracking-wide">
              HIS Future Talents — Édition 3
            </p>
            <p className="text-[11px] text-white/60 font-semibold pt-1">
              أهلاً بكم في المنصة الرسمية لملتقى المستقبل
            </p>
          </div>
        </div>

        {/* Subtle Skip Introduction Option at bottom */}
        <button
          type="button"
          onClick={() => {
            if (containerRef.current) {
              gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                  if (containerRef.current) containerRef.current.style.display = "none";
                  onComplete();
                },
              });
            }
          }}
          className="absolute bottom-6 right-6 z-40 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 hover:text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md transition-all cursor-pointer"
        >
          Passer / تخطي
        </button>

      </div>
    </div>
  );
}
