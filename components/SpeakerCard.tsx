import React from "react";
import { Speaker } from "@/data/speakers";
import { useLanguage } from "@/context/LanguageContext";

interface SpeakerCardProps {
  speaker: Speaker;
}

export default function SpeakerCard({ speaker }: SpeakerCardProps) {
  const { language } = useLanguage();
  const isConfirmed = speaker.imageStatus === "confirmed" && speaker.image;

  // Format category badge
  const categoryLabel =
    speaker.category === "conference"
      ? language === "ar"
        ? "محاضرة"
        : "Conférence"
      : language === "ar"
      ? "ورشة عمل"
      : "Workshop";

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col justify-between shadow-soft hover:shadow-premium hover:-translate-y-1.5 transition-all duration-300 group cursor-default text-start relative overflow-hidden h-full">
      {/* Top Background accent glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-his-blue/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="space-y-4">
        {/* Photo area with aspect-[4/5] */}
        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-slate-50 shrink-0">
          {isConfirmed ? (
            <img
              src={speaker.image}
              alt={language === "ar" ? `صورة الشخصية لـ ${speaker.name}` : `Portrait of ${speaker.name}`}
              className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
              loading="lazy"
              width={350}
              height={438}
            />
          ) : (
            /* Official Branded navy placeholder with brand motif icon */
            <div className="w-full h-full bg-[#0E1B2C] relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
              {/* Graphic brand motif overlays */}
              <div className="absolute -top-10 -left-10 w-28 h-28 opacity-20 pointer-events-none">
                <img src="/brand/motifs/Future Talents Icon Yellow-03.png" alt="" className="w-full h-auto" />
              </div>
              <div className="absolute -bottom-10 -right-10 w-28 h-28 opacity-20 pointer-events-none">
                <img src="/brand/motifs/Future Talents Icon Orange-05.png" alt="" className="w-full h-auto" />
              </div>
              
              {/* Fine line pattern */}
              <div 
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: "repeating-linear-gradient(45deg,#fff,#fff 1px,transparent 1px,transparent 12px)" }}
              />

              {/* Central Official Brand Motif Icon */}
              <div className="relative z-10 w-16 h-16 rounded-2xl border border-white/15 flex items-center justify-center mb-4 bg-white/5 backdrop-blur-xs p-3">
                <img
                  src="/brand/motifs/Future Talents Icon Orange-01.png"
                  alt=""
                  className="w-full h-full object-contain"
                  aria-hidden="true"
                />
              </div>

              {/* Placeholder text */}
              <p className="relative z-10 text-[10px] text-white/70 font-black uppercase tracking-wider leading-snug max-w-[150px]">
                {language === "ar"
                  ? "صورة المتحدث ستتوفر قريبًا"
                  : "Photo bientôt disponible"}
              </p>
            </div>
          )}

          {/* Category Tag Overlay */}
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm shadow-sm border border-slate-100 text-slate-700 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg">
            {categoryLabel}
          </span>
        </div>

        {/* Info below photo */}
        <div className="space-y-1">
          {/* Edition Label */}
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${
              speaker.edition === 2025 ? "bg-his-orange" : "bg-his-blue"
            }`} />
            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
              {language === "ar" ? `نسخة ${speaker.edition}` : `Édition ${speaker.edition}`}
            </span>
          </div>

          {/* Name */}
          <h4 className="font-black text-his-deep text-lg leading-tight group-hover:text-his-orange transition-colors duration-300">
            {speaker.name}
          </h4>

          {/* Role */}
          <p className="text-slate-600 text-xs font-semibold leading-relaxed">
            {language === "ar" ? speaker.role.ar : speaker.role.fr}
          </p>

          {/* Company (if present) */}
          {speaker.company && (
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              {speaker.company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
