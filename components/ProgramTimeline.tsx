"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { programData } from "@/lib/eventData";
import { Award } from "lucide-react";

export default function ProgramTimeline() {
  const { t, language, dir } = useLanguage();

  return (
    <section id="program-section" className="py-12 md:py-16 section-compact bg-white relative z-10" dir={dir}>
      {/* Decorative Full-Color Brand Motif background accent */}
      <div className="pointer-events-none absolute top-8 inset-inline-end-8 w-32 md:w-44 opacity-90 drop-shadow-md select-none hidden lg:block" aria-hidden="true">
        <img src="/brand/motifs/Future Talents Icon Blue-07.png" alt="" className="w-full h-auto" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14 text-start">
          <span className="section-pill mb-4">{t("program.title")}</span>
          <h2 className="text-3xl md:text-5xl font-black text-his-deep leading-tight tracking-tight mt-4">
            {t("program.title")}
          </h2>
          <p className="text-slate-500 text-sm md:text-base mt-3 max-w-xl font-medium">
            {t("program.subtitle")}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-his-blue/40 via-his-blue/15 to-transparent"
            style={{ insetInlineStart: "4.5rem" }}
            aria-hidden="true"
          />

          <div className="space-y-2">
            {programData.map((item, idx) => {
              const isKeynote = idx === 2;
              const isAwards  = idx === 5;
              return (
                <div
                  key={idx}
                  data-gsap
                  className={`relative flex items-start gap-0 group transition-all duration-300 ${
                    isKeynote || isAwards ? "z-10" : ""
                  }`}
                >
                  {/* Time column */}
                  <div className="w-[4.5rem] shrink-0 pt-[19px] text-end pe-4">
                    <span className={`text-[10px] font-black tracking-wider tabular-nums ${
                      isKeynote ? "text-his-orange" : "text-his-blue/60"
                    }`}>
                      {item.time}
                    </span>
                  </div>

                  {/* Dot */}
                  <div className="shrink-0 flex flex-col items-center pt-[18px] z-10 me-4">
                    <div className={`w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center transition-all duration-300 ${
                      isKeynote
                        ? "bg-his-orange ring-4 ring-his-orange/20 scale-110"
                        : isAwards
                        ? "bg-his-gold ring-4 ring-his-gold/20 scale-110"
                        : "bg-slate-200 group-hover:bg-his-blue"
                    }`}>
                      {isAwards && <div className="w-1 h-1 rounded-full bg-white" />}
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 mb-3 r-small-card px-5 py-4 border transition-all duration-300 text-start ${
                    isKeynote
                      ? "bg-his-orange/5 border-his-orange/15 hover:shadow-soft"
                      : isAwards
                      ? "bg-[#D4AF37]/5 border-[#D4AF37]/25 hover:shadow-soft"
                      : "bg-his-cream/50 b-alpha hover:bg-white hover:border-his-blue/15 hover:shadow-soft"
                  }`}>
                    <h3 className={`font-black text-sm md:text-base leading-snug mb-0.5 ${
                      isKeynote ? "text-his-orange" : isAwards ? "text-[#9d7a0a]" : "text-his-deep"
                    }`}>
                      {language === "ar" ? item.title.ar : item.title.fr}
                    </h3>

                    {/* Contextual note for Talent Awards */}
                    {isAwards && (
                      <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 font-bold">
                        <Award className="w-3.5 h-3.5 text-his-gold shrink-0" />
                        {language === "ar"
                          ? "منح جوائز المعهد تمنح للشركاء الراعين تواجداً مميزاً خلال حفل الاختتام الرسمي"
                          : "Les HIS Talent Awards offrent une visibilité exclusive aux sponsors lors de la clôture officielle"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
