"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { verifiedSponsors2026 } from "@/data/sponsorsData";
import { ArrowRight, ExternalLink, Sparkles } from "lucide-react";

export type SponsorItem = {
  name: string;
  slug?: string;
  logo?: string;
  tier?: "Gold" | "Silver" | "Bronze" | "official" | "gold" | "silver" | "bronze";
  sponsorTier?: "gold" | "silver" | "bronze" | "official";
  edition: number | string;
  website?: string;
  description?: {
    fr?: string;
    ar?: string;
  };
  keyPoints?: {
    fr?: string[];
    ar?: string[];
  };
};

export default function SponsorsSection() {
  const { language, dir } = useLanguage();
  const [sponsorsList, setSponsorsList] = useState<SponsorItem[]>(verifiedSponsors2026 as SponsorItem[]);

  // Live Sync with Backend /api/sponsors (Updates when admin makes any change)
  useEffect(() => {
    const fetchLiveSponsors = async () => {
      try {
        const res = await fetch("/api/sponsors");
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setSponsorsList(json.data);
        }
      } catch (err) {
        console.error("Failed to sync live sponsors from backend:", err);
      }
    };
    fetchLiveSponsors();
  }, []);

  // Filter 2026 Sponsors
  const sponsors2026 = sponsorsList.filter((s) => Number(s.edition) === 2026);

  // Group by Tiers
  const goldSponsors = sponsors2026.filter(
    (s) => (s.tier?.toLowerCase() === "gold" || s.sponsorTier?.toLowerCase() === "gold")
  );
  const silverSponsors = sponsors2026.filter(
    (s) => (s.tier?.toLowerCase() === "silver" || s.sponsorTier?.toLowerCase() === "silver")
  );
  const bronzeSponsors = sponsors2026.filter(
    (s) => (s.tier?.toLowerCase() === "bronze" || s.sponsorTier?.toLowerCase() === "bronze")
  );

  return (
    <section
      id="sponsors-section"
      data-theme="dark"
      className="relative py-16 md:py-24 bg-[#001E3D] text-white overflow-hidden text-start border-t border-white/10"
    >
      {/* Brand Motifs in background whitespace */}
      <div className="absolute top-12 right-6 w-32 md:w-40 opacity-15 pointer-events-none select-none hidden lg:block" aria-hidden="true">
        <img src="/brand/motifs/Future Talents Icon Yellow-03.png" alt="" className="w-full h-auto" />
      </div>
      <div className="absolute bottom-12 left-6 w-32 md:w-40 opacity-15 pointer-events-none select-none hidden lg:block" aria-hidden="true">
        <img src="/brand/motifs/Future Talents Icon Orange-02.png" alt="" className="w-full h-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-12">
        
        {/* Section Header & CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F05A22]/10 border border-[#F05A22]/25 text-[#F05A22] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              {language === "ar" ? "SPONSORS | شركاؤنا — 03" : "— NOS SPONSORS"}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              {language === "ar" ? "الرعاة الرسميون" : "Nos Sponsors"}
            </h2>
            <p className="text-white/80 text-sm md:text-base font-normal leading-relaxed">
              {language === "ar"
                ? "لقد رأوا امكانيتكم ... و قرروا أن يفتحوا لكم الباب."
                : "Ils ont vu le potentiel. Ils ont choisi d’ouvrir la porte."}
            </p>
          </div>

          <a
            href="#contact-form"
            className="inline-flex items-center gap-2.5 px-6 h-12 rounded-xl bg-[#F05A22] hover:bg-[#d84a15] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shrink-0 self-start md:self-auto cursor-pointer shadow-sm"
          >
            <span>{language === "ar" ? "الانضمام كرعاة" : "Devenir partenaire"}</span>
            <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </a>
        </div>

        {/* Sponsorship Tiers Showcase */}
        <div className="space-y-10">
          
          {/* 1. GOLD SPONSORS TIER */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {language === "ar" ? "الرعاية الذهبية (Sponsors Gold)" : "Sponsors Gold"}
            </h3>

            {goldSponsors.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {goldSponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="relative rounded-2xl overflow-hidden bg-[#0E1B2C]/80 border border-amber-400/30 p-6 text-white group transition-all duration-500 text-start hover:border-amber-400/90 hover:shadow-[0_12px_45px_rgba(251,191,36,0.3)] hover:-translate-y-1"
                  >
                    {/* Gold Metallic Shine Sweep on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="bg-white rounded-xl p-4 border border-slate-200 w-full md:w-48 h-28 flex items-center justify-center shrink-0">
                        {sponsor.logo ? (
                          <img
                            src={sponsor.logo}
                            alt={`Logo de ${sponsor.name}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-lg font-bold text-slate-900">{sponsor.name}</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                          ★ {language === "ar" ? "الراعي الذهبي الرسمي 2026" : "SPONSOR OR 2026"}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {sponsor.name}
                        </h4>
                        {sponsor.description && (
                          <p className="text-white/75 text-xs sm:text-sm leading-relaxed font-normal max-w-3xl">
                            {language === "ar" ? sponsor.description.ar : sponsor.description.fr}
                          </p>
                        )}
                        {sponsor.website && (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-200 transition-colors pt-1"
                          >
                            <span>{language === "ar" ? "زيارة الموقع الرسمي" : "Site officiel de la société"}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-amber-400/20 rounded-2xl p-6 text-center space-y-1 bg-amber-400/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {language === "ar" ? "الرعاية الذهبية (Sponsors Gold)" : "Sponsors Gold"}
                </h4>
                <p className="text-xs text-white/60 font-normal">
                  {language === "ar"
                    ? "سيتم الإعلان عن رعاة هذه الدورة قريباً."
                    : "Les sponsors de cette édition seront annoncés prochainement."}
                </p>
              </div>
            )}
          </div>

          {/* 2. SILVER SPONSORS TIER */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#58B9FF] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#58B9FF]" />
              {language === "ar" ? "الرعاية الفضية (Sponsors Silver)" : "Sponsors Silver"}
            </h3>

            {silverSponsors.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {silverSponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="relative rounded-2xl overflow-hidden bg-[#0E1B2C]/80 border border-slate-300/30 p-6 text-white group transition-all duration-500 text-start hover:border-slate-200 hover:shadow-[0_12px_45px_rgba(226,232,240,0.35)] hover:-translate-y-1"
                  >
                    {/* Silver Metallic Shine Sweep on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="bg-white rounded-xl p-4 border border-slate-200 w-full md:w-48 h-28 flex items-center justify-center shrink-0">
                        {sponsor.logo ? (
                          <img
                            src={sponsor.logo}
                            alt={`Logo de ${sponsor.name}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-lg font-bold text-slate-900">{sponsor.name}</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-[#58B9FF]/20 text-[#58B9FF] border border-[#58B9FF]/30">
                          ★ {language === "ar" ? "الراعي الفضي الرسمي 2026" : "SPONSOR ARGENT 2026"}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {sponsor.name}
                        </h4>
                        {sponsor.description && (
                          <p className="text-white/75 text-xs sm:text-sm leading-relaxed font-normal max-w-3xl">
                            {language === "ar" ? sponsor.description.ar : sponsor.description.fr}
                          </p>
                        )}
                        {sponsor.website && (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#58B9FF] hover:text-white transition-colors pt-1"
                          >
                            <span>{language === "ar" ? "زيارة الموقع الرسمي" : "Site officiel de la société"}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-[#58B9FF]/20 rounded-2xl p-6 text-center space-y-1 bg-[#58B9FF]/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#58B9FF]">
                  {language === "ar" ? "الرعاية الفضية (Sponsors Silver)" : "Sponsors Silver"}
                </h4>
                <p className="text-xs text-white/60 font-normal">
                  {language === "ar"
                    ? "سيتم الإعلان عن رعاة هذه الدورة قريباً."
                    : "Les sponsors de cette édition seront annoncés prochainement."}
                </p>
              </div>
            )}
          </div>

          {/* 3. BRONZE SPONSORS TIER */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {language === "ar" ? "الرعاية البرونزية (Sponsors Bronze)" : "Sponsors Bronze"}
            </h3>

            {bronzeSponsors.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {bronzeSponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="relative rounded-2xl overflow-hidden bg-[#0E1B2C]/80 border border-amber-700/40 p-6 text-white group transition-all duration-500 text-start hover:border-amber-600 hover:shadow-[0_12px_45px_rgba(180,83,9,0.3)] hover:-translate-y-1"
                  >
                    {/* Bronze Metallic Shine Sweep on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="bg-white rounded-xl p-4 border border-slate-200 w-full md:w-48 h-28 flex items-center justify-center shrink-0">
                        {sponsor.logo ? (
                          <img
                            src={sponsor.logo}
                            alt={`Logo de ${sponsor.name}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-lg font-bold text-slate-900">{sponsor.name}</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-600/20 text-amber-400 border border-amber-600/30">
                          ★ {language === "ar" ? "الراعي البرونزي الرسمي 2026" : "SPONSOR BRONZE 2026"}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {sponsor.name}
                        </h4>
                        {sponsor.description && (
                          <p className="text-white/75 text-xs sm:text-sm leading-relaxed font-normal max-w-3xl">
                            {language === "ar" ? sponsor.description.ar : sponsor.description.fr}
                          </p>
                        )}
                        {sponsor.website && (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-white transition-colors pt-1"
                          >
                            <span>{language === "ar" ? "زيارة الموقع الرسمي" : "Site officiel de la société"}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-amber-600/20 rounded-2xl p-6 text-center space-y-1 bg-amber-600/5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                  {language === "ar" ? "الرعاية البرونزية (Sponsors Bronze)" : "Sponsors Bronze"}
                </h4>
                <p className="text-xs text-white/60 font-normal">
                  {language === "ar"
                    ? "سيتم الإعلان عن رعاة هذه الدورة قريباً."
                    : "Les sponsors de cette édition seront annoncés prochainement."}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
