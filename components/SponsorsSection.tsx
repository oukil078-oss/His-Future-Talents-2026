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
      className="relative py-16 md:py-24 bg-[#0E1B2C] text-white overflow-hidden text-start"
    >
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#003876]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-[#F05A22]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-14">
        
        {/* Section Header & CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F05A22]/20 border border-[#F05A22]/40 text-[#F05A22] text-xs font-black uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              {language === "ar" ? "الرعاية الرسمية 2026" : "Sponsoring Officiel 2026"}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {language === "ar" ? "الرعاة الرسميون" : "Nos sponsors"}
            </h2>
            <p className="text-white/80 text-sm md:text-base font-medium leading-relaxed">
              {language === "ar"
                ? "شركاء استراتيجيون يساهمون في نجاح مبادرة HIS Future Talents."
                : "Des partenaires engagés aux côtés de HIS Future Talents."}
            </p>
          </div>

          <a
            href="#contact-form"
            className="inline-flex items-center gap-2.5 px-6 h-13 rounded-2xl bg-[#F05A22] hover:bg-[#FFBD0E] text-white hover:text-[#0E1B2C] font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-[#F05A22]/25 hover:-translate-y-0.5 shrink-0 self-start md:self-auto cursor-pointer"
          >
            <span>{language === "ar" ? "الانضمام كرعاة" : "Devenir partenaire"}</span>
            <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </a>
        </div>

        {/* Sponsorship Tiers Showcase */}
        <div className="space-y-14">
          
          {/* ─────────────────────────────────────────────────────────
              1. GOLD SPONSORS TIER (Cinematic Gold Metallic Visuals)
          ──────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#FFBD0E] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD0E] animate-pulse" />
              {language === "ar" ? "الرعاية الذهبية (Sponsors Gold)" : "Sponsors Gold"}
            </h3>

            {goldSponsors.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {goldSponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#3b2a08] to-slate-900 border-2 border-amber-400/60 p-6 sm:p-8 text-white shadow-[0_15px_45px_rgba(251,191,36,0.25)] group transition-all duration-500 text-start"
                  >
                    {/* Gold Metallic Shine Sweep on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="bg-white rounded-2xl p-5 shadow-2xl border-2 border-amber-300 w-full md:w-56 h-36 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {sponsor.logo ? (
                          <img
                            src={sponsor.logo}
                            alt={`Logo de ${sponsor.name}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xl font-black text-slate-900">{sponsor.name}</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 text-slate-900 border border-amber-300 shadow-md">
                          ★ {language === "ar" ? "الراعي الذهبي الرسمي 2026" : "SPONSOR OR 2026 — GOLD SPONSOR"}
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          {sponsor.name}
                        </h4>
                        {sponsor.description && (
                          <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-medium max-w-3xl">
                            {language === "ar" ? sponsor.description.ar : sponsor.description.fr}
                          </p>
                        )}
                        {sponsor.website && (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#FFBD0E] hover:text-white transition-colors pt-1"
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
              <div className="border border-dashed border-amber-400/30 rounded-3xl p-8 text-center space-y-2 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#FFBD0E]">
                  {language === "ar" ? "الرعاية الذهبية (Sponsors Gold)" : "Sponsors Gold"}
                </h4>
                <p className="text-xs text-white/70 font-medium">
                  {language === "ar"
                    ? "سيتم الإعلان عن رعاة هذه الدورة قريباً."
                    : "Les sponsors de cette édition seront annoncés prochainement."}
                </p>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────
              2. SILVER SPONSORS TIER (Cinematic Silver Metallic Visuals)
          ──────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-[#58B9FF] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#58B9FF] animate-ping" />
              {language === "ar" ? "الرعاية الفضية (Sponsors Silver)" : "Sponsors Silver"}
            </h3>

            {silverSponsors.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {silverSponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#002855] to-slate-900 border-2 border-slate-300/40 p-6 sm:p-8 text-white shadow-[0_15px_45px_rgba(148,163,184,0.25)] group transition-all duration-500 text-start hover:border-[#58B9FF]"
                  >
                    {/* Silver Metallic Shine Sweep on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="bg-white rounded-2xl p-5 shadow-2xl border-2 border-slate-200 w-full md:w-56 h-36 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {sponsor.logo ? (
                          <img
                            src={sponsor.logo}
                            alt={`Logo de ${sponsor.name}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xl font-black text-slate-900">{sponsor.name}</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 text-slate-900 border border-slate-300 shadow-md">
                          ★ {language === "ar" ? "الراعي الفضي الرسمي 2026" : "SPONSOR ARGENT 2026 — SILVER SPONSOR"}
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          {sponsor.name}
                        </h4>
                        {sponsor.description && (
                          <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-medium max-w-3xl">
                            {language === "ar" ? sponsor.description.ar : sponsor.description.fr}
                          </p>
                        )}
                        {sponsor.website && (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#58B9FF] hover:text-white transition-colors pt-1"
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
              <div className="border border-dashed border-slate-300/30 rounded-3xl p-8 text-center space-y-2 bg-gradient-to-br from-slate-500/10 via-transparent to-transparent">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#58B9FF]">
                  {language === "ar" ? "الرعاية الفضية (Sponsors Silver)" : "Sponsors Silver"}
                </h4>
                <p className="text-xs text-white/70 font-medium">
                  {language === "ar"
                    ? "سيتم الإعلان عن رعاة هذه الدورة قريباً."
                    : "Les sponsors de cette édition seront annoncés prochainement."}
                </p>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────
              3. BRONZE SPONSORS TIER (Cinematic Bronze Metallic Visuals)
          ──────────────────────────────────────────────────────────── */}
          <div className="space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-500 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              {language === "ar" ? "الرعاية البرونزية (Sponsors Bronze)" : "Sponsors Bronze"}
            </h3>

            {bronzeSponsors.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {bronzeSponsors.map((sponsor) => (
                  <div
                    key={sponsor.name}
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#2d1b0d] to-slate-900 border-2 border-amber-700/60 p-6 sm:p-8 text-white shadow-[0_15px_45px_rgba(180,83,9,0.25)] group transition-all duration-500 text-start hover:border-amber-500"
                  >
                    {/* Bronze Metallic Shine Sweep on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-600/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="bg-white rounded-2xl p-5 shadow-2xl border-2 border-amber-600 w-full md:w-56 h-36 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {sponsor.logo ? (
                          <img
                            src={sponsor.logo}
                            alt={`Logo de ${sponsor.name}`}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-xl font-black text-slate-900">{sponsor.name}</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-amber-100 border border-amber-600 shadow-md">
                          ★ {language === "ar" ? "الراعي البرونزي الرسمي 2026" : "SPONSOR BRONZE 2026 — BRONZE SPONSOR"}
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          {sponsor.name}
                        </h4>
                        {sponsor.description && (
                          <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-medium max-w-3xl">
                            {language === "ar" ? sponsor.description.ar : sponsor.description.fr}
                          </p>
                        )}
                        {sponsor.website && (
                          <a
                            href={sponsor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-400 hover:text-white transition-colors pt-1"
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
              <div className="border border-dashed border-amber-700/30 rounded-3xl p-8 text-center space-y-2 bg-gradient-to-br from-amber-900/10 via-transparent to-transparent">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-500">
                  {language === "ar" ? "الرعاية البرونزية (Sponsors Bronze)" : "Sponsors Bronze"}
                </h4>
                <p className="text-xs text-white/70 font-medium">
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
