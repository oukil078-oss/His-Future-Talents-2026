"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { verifiedSponsors2026 } from "@/data/sponsorsData";
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Award,
  Building2,
  CheckCircle2,
  Zap,
  X,
  Info,
} from "lucide-react";

export type SponsorItem = {
  name: string;
  slug?: string;
  logo?: string;
  tier?: "Gold" | "Silver" | "Bronze" | "official" | "gold" | "silver" | "bronze";
  sponsorTier?: "gold" | "silver" | "bronze" | "official";
  edition: number | string;
  featured?: boolean;
  website?: string;
  description?: {
    en?: string;
    ar?: string;
  };
  keyPoints?: {
    en?: string[];
    ar?: string[];
  };
};

interface SponsorTheme {
  primaryColor: string;
  cardBackground: string;
  borderColor: string;
  hoverBorderColor: string;
  glowShadow: string;
  radialGlow: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  taglineColor: string;
  buttonBg: string;
  buttonBorder: string;
  buttonText: string;
  sectorEn: string;
  sectorAr: string;
  taglineEn: string;
  taglineAr: string;
  shortDescEn: string;
  shortDescAr: string;
}

const SPONSOR_THEMES: Record<string, SponsorTheme> = {
  satim: {
    // SATIM: Iconic Crimson Red & Pure White
    primaryColor: "#EE2737",
    cardBackground: "linear-gradient(180deg, #2D050D 0%, #1A0307 60%, #0E0104 100%)",
    borderColor: "rgba(238, 39, 55, 0.45)",
    hoverBorderColor: "#EE2737",
    glowShadow: "0 16px 45px rgba(238, 39, 55, 0.28)",
    radialGlow: "rgba(238, 39, 55, 0.35)",
    badgeBg: "rgba(238, 39, 55, 0.16)",
    badgeBorder: "rgba(238, 39, 55, 0.35)",
    badgeText: "#FF6B7A",
    taglineColor: "#FF4D5E",
    buttonBg: "rgba(238, 39, 55, 0.18)",
    buttonBorder: "rgba(238, 39, 55, 0.4)",
    buttonText: "#FFFFFF",
    sectorEn: "Fintech & Electronic Banking",
    sectorAr: "الدفع الإلكتروني والمنظومة البنكية",
    taglineEn: "National CIB & Edahabia payment switch operator",
    taglineAr: "المشغل الوطني للبنية التحتية للدفع الإلكتروني",
    shortDescEn: "National interbank and electronic payment switch operator managing CIB and Edahabia transactions across Algeria.",
    shortDescAr: "المشغل الوطني المرجعي للشبكة البنكية ولمنظومة الدفع الإلكتروني وبطاقات CIB والذهبية في الجزائر.",
  },
  techno: {
    // TECHNO: Signature Golden Yellow, Bold Red & Charcoal
    primaryColor: "#FFD500",
    cardBackground: "linear-gradient(180deg, #2A1A02 0%, #1A1001 60%, #0D0801 100%)",
    borderColor: "rgba(255, 213, 0, 0.45)",
    hoverBorderColor: "#FFD500",
    glowShadow: "0 16px 45px rgba(255, 213, 0, 0.24)",
    radialGlow: "rgba(255, 213, 0, 0.32)",
    badgeBg: "rgba(255, 213, 0, 0.16)",
    badgeBorder: "rgba(255, 213, 0, 0.35)",
    badgeText: "#FFD500",
    taglineColor: "#FFD500",
    buttonBg: "rgba(255, 213, 0, 0.16)",
    buttonBorder: "rgba(255, 213, 0, 0.4)",
    buttonText: "#FFD500",
    sectorEn: "Office Supplies & Creative Arts",
    sectorAr: "الأدوات المدرسية والمكتبية والفنون",
    taglineEn: "Algeria's foremost distributor of stationery & creative tools",
    taglineAr: "الرائد الوطني في توفير الأدوات المدرسية والمكتبية",
    shortDescEn: "Algeria's foremost distributor and retailer of school supplies, office stationery, and fine arts equipment nationwide.",
    shortDescAr: "الرائد الوطني في الجزائر في توزيع وتجارة الأدوات المكتبية، المدرسية، الفنون الجميلة والتجهيزات الاحترافية.",
  },
  prophex: {
    // PROPHEX: Deep Royal Blue & Bright Crimson
    primaryColor: "#0052CC",
    cardBackground: "linear-gradient(180deg, #071D44 0%, #04122D 60%, #020817 100%)",
    borderColor: "rgba(0, 82, 204, 0.55)",
    hoverBorderColor: "#3385FF",
    glowShadow: "0 16px 45px rgba(0, 82, 204, 0.32)",
    radialGlow: "rgba(0, 82, 204, 0.4)",
    badgeBg: "rgba(0, 82, 204, 0.22)",
    badgeBorder: "rgba(0, 82, 204, 0.45)",
    badgeText: "#58B9FF",
    taglineColor: "#58B9FF",
    buttonBg: "rgba(0, 82, 204, 0.25)",
    buttonBorder: "rgba(0, 82, 204, 0.45)",
    buttonText: "#FFFFFF",
    sectorEn: "Plumbing, Heating & Irrigation Solutions",
    sectorAr: "السباكة والتدفئة وحلول الري والصرف",
    taglineEn: "Leading distributor of plumbing, heating & irrigation systems",
    taglineAr: "الرائد في توزيع تجهيزات السباكة والتدفئة وأنظمة الري",
    shortDescEn: "Algerian leader in the distribution and supply of high-grade plumbing, heating, sanitary ware, and modern irrigation solutions.",
    shortDescAr: "مؤسسة جزائرية رائدة في التوزيع المعتمد لتجهيزات السباكة والترصيص، التدفئة المركزية، الأدوات الصحية وشبكات الري.",
  },
};

const DEFAULT_THEME: SponsorTheme = {
  primaryColor: "#003876",
  cardBackground: "linear-gradient(180deg, #0F1E36 0%, #0A1424 100%)",
  borderColor: "rgba(255, 255, 255, 0.15)",
  hoverBorderColor: "#58B9FF",
  glowShadow: "0 16px 45px rgba(0, 56, 118, 0.25)",
  radialGlow: "rgba(88, 185, 255, 0.25)",
  badgeBg: "rgba(255, 255, 255, 0.1)",
  badgeBorder: "rgba(255, 255, 255, 0.2)",
  badgeText: "#FFFFFF",
  taglineColor: "#58B9FF",
  buttonBg: "rgba(255, 255, 255, 0.1)",
  buttonBorder: "rgba(255, 255, 255, 0.2)",
  buttonText: "#FFFFFF",
  sectorEn: "Official Event Sponsor",
  sectorAr: "راعي رسمي للحدث",
  taglineEn: "Supporting future talents & innovation in Algeria",
  taglineAr: "دعم المواهب الصاعدة والابتكار في الجزائر",
  shortDescEn: "Official strategic partner empowering young university talents and future leaders at HIS Future Talents 2026.",
  shortDescAr: "شريك استراتيجي رسمي يدعم الكفاءات الطلابية الصاعدة وقادة المستقبل في صالون HIS Future Talents 2026.",
};

export default function SponsorsSection() {
  const { language, dir } = useLanguage();
  const [sponsorsList, setSponsorsList] = useState<SponsorItem[]>(verifiedSponsors2026 as SponsorItem[]);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedModalSponsor, setSelectedModalSponsor] = useState<SponsorItem | null>(null);

  // Live Sync with Backend /api/sponsors
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

  // Filter and prioritize Official 2026 Sponsors without Silver/Bronze tier separation
  const officialSponsors = useMemo(() => {
    const s2026 = sponsorsList.filter((s) => Number(s.edition) === 2026);
    
    // Identified official sponsors (either with sponsorTier, tier in Gold/Silver/Bronze, or featured)
    const filtered = s2026.filter((s) => {
      const isSponsor =
        s.sponsorTier === "gold" ||
        s.sponsorTier === "silver" ||
        s.sponsorTier === "bronze" ||
        s.tier === "Gold" ||
        s.tier === "Silver" ||
        s.tier === "Bronze" ||
        s.featured === true;
      return isSponsor;
    });

    // Custom order: SATIM, TECHNO, PROPHEX, followed by others
    const getRank = (name: string, slug: string = "") => {
      const key = `${name} ${slug}`.toLowerCase();
      if (/satim/i.test(key)) return 1;
      if (/techno/i.test(key)) return 2;
      if (/prophex|profex/i.test(key)) return 3;
      return 10;
    };

    // If no filtered items, fallback to verifiedSponsors2026
    const listToUse = filtered.length > 0 ? filtered : (verifiedSponsors2026 as SponsorItem[]);
    return [...listToUse].sort((a, b) => getRank(a.name, a.slug) - getRank(b.name, b.slug));
  }, [sponsorsList]);

  const getTheme = (sponsor: SponsorItem): SponsorTheme => {
    const key = (sponsor.slug || sponsor.name).toLowerCase();
    if (/satim/i.test(key)) return SPONSOR_THEMES.satim;
    if (/techno/i.test(key)) return SPONSOR_THEMES.techno;
    if (/prophex|profex/i.test(key)) return SPONSOR_THEMES.prophex;
    return DEFAULT_THEME;
  };

  const getHighlights = (sponsor: SponsorItem): string[] => {
    const key = (sponsor.slug || sponsor.name).toLowerCase();
    if (sponsor.keyPoints) {
      const pts = language === "ar" ? sponsor.keyPoints.ar : (sponsor.keyPoints.en || sponsor.keyPoints.ar);
      if (pts && pts.length > 0) return pts.slice(0, 3);
    }
    if (/satim/i.test(key)) {
      return language === "ar"
        ? [
            "المشغل الوطني المرجعي لشبكة الدفع CIB والذهبية في الجزائر",
            "شريك رائد لابتكارات الفنتك والتحول المالي الرقمي والشمول المالي",
            "فرص استقطاب كفاءات تكنولوجيا المعلومات، الهندسة البرمجية والمالية",
          ]
        : [
            "National CIB & Edahabia interbank payment operator",
            "Strategic pioneer for Algerian fintech & digital financial inclusion",
            "Direct recruitment of IT, software engineering & financial talents",
          ];
    }
    if (/techno/i.test(key)) {
      return language === "ar"
        ? [
            "الرائد الوطني في توزيع الأدوات المدرسية والمكتبية والفنون الجميلة",
            "دعم مباشر للمواهب الطلابية والإبداع الأكاديمي والمهني",
            "شبكة فروع ومتاجر واسعة وموثوقة تغطي مختلف ولايات الوطن",
          ]
        : [
            "National market leader in stationery & creative tools",
            "Directly empowering university students & academic creativity",
            "Nationwide trusted retail and institutional distribution network",
          ];
    }
    if (/prophex|profex/i.test(key)) {
      return language === "ar"
        ? [
            "الرائد الجزائري في توزيع تجهيزات السباكة والترصيص الصحي والتدفئة المركزية",
            "حلول متطورة لشبكات تصريف المياه، العزل، وتجهيزات الري الحديثة",
            "الراعي الرسمي لصالون HIS Future Talents 2026 وفرص استقطاب للكفاءات",
          ]
        : [
            "Premier Algerian distributor of plumbing, central heating, and sanitary systems",
            "Advanced solutions for water drainage, evacuation, and modern agricultural irrigation",
            "Official Sponsor of HIS Future Talents 2026 offering engineering & commercial opportunities",
          ];
    }
    return [];
  };

  const getShortDesc = (sponsor: SponsorItem, theme: SponsorTheme): string => {
    return language === "ar" ? theme.shortDescAr : theme.shortDescEn;
  };

  const getFullDesc = (sponsor: SponsorItem, theme: SponsorTheme): string => {
    if (sponsor.description) {
      const desc = language === "ar" ? sponsor.description.ar : (sponsor.description.en || sponsor.description.ar);
      if (desc) return desc;
    }
    return getShortDesc(sponsor, theme);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedModalSponsor(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section
      id="sponsors-section"
      data-theme="light"
      dir={dir}
      className="relative py-16 md:py-24 bg-white text-slate-900 overflow-hidden text-start border-y border-slate-200/80"
    >
      {/* Soft Ambient Background Elements */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#F05A22]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Outer Edge Motifs */}
      <div className="absolute top-8 right-6 w-24 md:w-32 opacity-20 pointer-events-none select-none hidden lg:block" aria-hidden="true">
        <img src="/brand/motifs/Future Talents Icon Blue-04.png" alt="" className="w-full h-auto" />
      </div>
      <div className="absolute bottom-8 left-6 w-24 md:w-32 opacity-20 pointer-events-none select-none hidden lg:block" aria-hidden="true">
        <img src="/brand/motifs/Future Talents Icon Orange-02.png" alt="" className="w-full h-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-10">
        
        {/* Section Header & Narrative */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
          <div className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F05A22]/10 border border-[#F05A22]/25 text-[#F05A22] text-xs font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              {language === "ar" ? "الرعاة الرسميون — دورة 2026" : "OFFICIAL EVENT SPONSORS — 2026"}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#003876] tracking-tight">
              {language === "ar" ? "الرعاة الرسميون لصالون 2026" : "Our Official Sponsors"}
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-normal leading-relaxed">
              {language === "ar"
                ? "مؤسسات وطنية رائدة آمنت بطاقات وإمكانيات الكفاءات الجزائرية الشابة، وفتحت لهم آفاقاً استثنائية."
                : "Visionary industry champions investing directly in unlocking premier opportunities for emerging Algerian talents."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-[#F05A22] hover:bg-[#d84a15] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md shadow-[#F05A22]/20 hover:scale-105 active:scale-95"
            >
              <span>{language === "ar" ? "الانضمام كرعاة" : "Become a Sponsor"}</span>
              <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </a>
          </div>
        </div>

        {/* Concise Metrics Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === "ar" ? "3 مؤسسات وطنية كبرى" : "3 National Champions"}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {language === "ar" ? "المالية • الأدوات والإبداع • السباكة والري" : "Fintech • Education & Arts • Plumbing & Irrigation"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-[#F05A22]/10 border border-[#F05A22]/20 flex items-center justify-center text-[#F05A22] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === "ar" ? "فرص توظيف وتدريب مباشرة" : "Direct Recruitment & Internships"}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {language === "ar" ? "لقاءات حصرية مع مسؤولي الموارد البشرية" : "Direct access to executive talent acquisition"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {language === "ar" ? "رعاية استراتيجية رسمية" : "Official Strategic Partners"}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {language === "ar" ? "تمكين مستمر لطلبة وخريجي 2026" : "Empowering students & top graduates"}
              </div>
            </div>
          </div>
        </div>

        {/* Sponsor Filter Selector Pills */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 flex-wrap">
            <button
              onClick={() => setSelectedFilter(null)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedFilter === null
                  ? "bg-[#003876] text-white shadow-xs scale-100"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {language === "ar" ? "جميع الرعاة الرسميين" : "All Official Sponsors"}
            </button>
            {officialSponsors.map((s) => {
              const isSelected = selectedFilter === s.name;
              return (
                <button
                  key={s.name}
                  onClick={() => setSelectedFilter(isSelected ? null : s.name)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#F05A22] text-white shadow-xs scale-105"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            {language === "ar"
              ? "انقر على أي راعٍ أو زر «التفاصيل» لمشاهدة كافة المعلومات"
              : "Click 'Details' on any card to view full company profile"}
          </div>
        </div>

        {/* Responsive, Auto-Fitting Unified Sponsor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {officialSponsors.map((sponsor) => {
            const theme = getTheme(sponsor);
            const isHighlighted = selectedFilter === sponsor.name;
            const isDimmed = selectedFilter !== null && !isHighlighted;
            const shortDescription = getShortDesc(sponsor, theme);

            return (
              <div
                key={sponsor.name}
                id={`sponsor-card-${sponsor.slug || sponsor.name.toLowerCase()}`}
                className={`relative rounded-3xl overflow-hidden border p-6 text-white group transition-all duration-300 flex flex-col justify-between h-full shadow-lg ${
                  isHighlighted
                    ? "ring-2 ring-white scale-[1.02] shadow-2xl"
                    : isDimmed
                    ? "opacity-40 grayscale-[30%] hover:opacity-100 hover:grayscale-0"
                    : "hover:-translate-y-1.5"
                }`}
                style={{
                  background: theme.cardBackground,
                  borderColor: theme.borderColor,
                  boxShadow: theme.glowShadow,
                }}
              >
                {/* Diagonal Metallic Shine Sweep on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Ambient Top Glow */}
                <div
                  className="absolute top-0 right-0 left-0 h-32 opacity-25 pointer-events-none transition-opacity group-hover:opacity-50"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${theme.radialGlow}, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 space-y-4 flex-1 flex flex-col">
                  
                  {/* Top Bar: Official Badge + Domain Pill */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {language === "ar" ? "راعي رسمي 2026" : "OFFICIAL SPONSOR 2026"}
                    </span>

                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border"
                      style={{
                        backgroundColor: theme.badgeBg,
                        borderColor: theme.badgeBorder,
                        color: theme.badgeText,
                      }}
                    >
                      {language === "ar" ? theme.sectorAr : theme.sectorEn}
                    </span>
                  </div>

                  {/* High-Contrast Crisp White Logo Container */}
                  <div
                    onClick={() => setSelectedModalSponsor(sponsor)}
                    className="bg-white rounded-2xl p-4 border border-white/20 h-28 flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-[1.02] cursor-pointer"
                    title={language === "ar" ? "عرض التفاصيل الكاملة" : "View full details"}
                  >
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={`Logo ${sponsor.name}`}
                        className="w-full h-full object-contain select-none max-h-20"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {sponsor.name}
                      </span>
                    )}
                  </div>

                  {/* Header & Sector Tagline */}
                  <div className="space-y-1 text-start">
                    <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center justify-between">
                      <span>{sponsor.name}</span>
                      <Sparkles className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: theme.taglineColor }} />
                    </h3>
                    <p className="text-xs font-bold" style={{ color: theme.taglineColor }}>
                      {language === "ar" ? theme.taglineAr : theme.taglineEn}
                    </p>
                  </div>

                  {/* Concise Direct Description (High-contrast text on brand background) */}
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal text-start line-clamp-3 flex-1">
                    {shortDescription}
                  </p>

                </div>

                {/* Card Footer: Show More Modal Button + Direct Website Link */}
                <div className="relative z-10 pt-4 mt-4 border-t border-white/10 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedModalSponsor(sponsor)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer group/btn"
                    style={{
                      backgroundColor: theme.buttonBg,
                      border: `1px solid ${theme.buttonBorder}`,
                      color: theme.buttonText,
                    }}
                  >
                    <Info className="w-3.5 h-3.5 opacity-90 group-hover/btn:opacity-100" />
                    <span>{language === "ar" ? "المزيد من التفاصيل" : "View Details"}</span>
                  </button>

                  {sponsor.website && (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl transition-colors cursor-pointer shrink-0"
                      style={{
                        backgroundColor: theme.buttonBg,
                        border: `1px solid ${theme.buttonBorder}`,
                        color: theme.buttonText,
                      }}
                      title={language === "ar" ? "زيارة الموقع الرسمي" : "Visit official website"}
                      aria-label={language === "ar" ? "زيارة الموقع الرسمي" : "Visit official website"}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom VIP Note & Invitation */}
        <div className="rounded-2xl bg-gradient-to-r from-[#002855] via-[#003876] to-[#0E1B2C] border border-[#003876]/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-start text-white shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>{language === "ar" ? "فرص رعاية استثنائية لمؤسستكم" : "Premium Sponsorship Opportunities"}</span>
            </div>
            <h4 className="text-lg md:text-xl font-bold text-white">
              {language === "ar"
                ? "هل ترغب مؤسستكم في الانضمام إلى قائمة الرعاة الرسميين لصالون 2026؟"
                : "Would your organization like to join our prestigious 2026 Sponsor roster?"}
            </h4>
            <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
              {language === "ar"
                ? "احجزوا جناحكم المتميز، وتواصلوا مع أكثر من 3000 طالب وخريج موهوب، واحظوا بظهور إعلامي وطني واسع."
                : "Secure premier visibility, executive branding, and priority access to recruit top university talents across Algeria."}
            </p>
          </div>

          <a
            href="#contact-form"
            className="px-6 py-3.5 rounded-xl bg-[#F05A22] hover:bg-[#d84a15] text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            {language === "ar" ? "طلب كتيب الرعاية 2026" : "Request Sponsorship Kit"}
          </a>
        </div>

      </div>

      {/* ── Interactive Sponsor Details Modal (TV-Media Pattern) ── */}
      {selectedModalSponsor && (() => {
        const theme = getTheme(selectedModalSponsor);
        const highlights = getHighlights(selectedModalSponsor);
        const fullDesc = getFullDesc(selectedModalSponsor, theme);

        return (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 animate-fadeIn" dir={dir}>
            {/* Backdrop Blur */}
            <div
              onClick={() => setSelectedModalSponsor(null)}
              className="fixed inset-0 bg-[#0E1B2C]/80 backdrop-blur-md transition-opacity"
            />

            {/* Modal Card */}
            <div
              className="relative w-full max-w-xl border rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10 space-y-6 text-start max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
              style={{
                background: theme.cardBackground,
                borderColor: theme.borderColor,
                boxShadow: theme.glowShadow,
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedModalSponsor(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo Capsule & Header */}
              <div className="flex items-center gap-5 border-b border-white/15 pb-6 pr-8">
                <div className="w-24 h-24 rounded-2xl bg-white p-3 flex items-center justify-center shrink-0 border-2 border-white/20 shadow-lg">
                  {selectedModalSponsor.logo ? (
                    <img
                      src={selectedModalSponsor.logo}
                      alt={`Logo ${selectedModalSponsor.name}`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-xl font-black text-slate-900">{selectedModalSponsor.name}</span>
                  )}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border"
                    style={{
                      backgroundColor: theme.badgeBg,
                      borderColor: theme.badgeBorder,
                      color: theme.badgeText,
                    }}
                  >
                    <Award className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
                    {language === "ar" ? "راعي رسمي • دورة 2026" : "Official Sponsor • 2026"}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight truncate">
                    {selectedModalSponsor.name}
                  </h3>
                  <p className="text-xs font-bold" style={{ color: theme.taglineColor }}>
                    {language === "ar" ? theme.sectorAr : theme.sectorEn}
                  </p>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: theme.taglineColor }}>
                  {language === "ar" ? "نبذة عن المؤسسة والشراكة" : "About the Organization & Partnership"}
                </h4>
                <p className="text-slate-100 text-xs sm:text-sm leading-relaxed font-medium">
                  {fullDesc}
                </p>
              </div>

              {/* Key Highlights / Impact Points */}
              {highlights.length > 0 && (
                <div className="space-y-2.5 bg-black/25 border border-white/10 rounded-2xl p-4">
                  <h4 className="text-xs font-black uppercase tracking-wider" style={{ color: theme.taglineColor }}>
                    {language === "ar" ? "أبرز محاور الشراكة والتوظيف" : "Partnership & Talent Opportunities"}
                  </h4>
                  <ul className="space-y-2 text-xs text-white/90 font-medium">
                    {highlights.map((point, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: theme.primaryColor }}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Button: Official Website */}
              {selectedModalSponsor.website && (
                <div className="pt-2">
                  <a
                    href={selectedModalSponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-12 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: theme.primaryColor === "#FFD500" ? "#0D0801" : "#FFFFFF",
                    }}
                  >
                    <span>{language === "ar" ? "زيارة الموقع الرسمي للشركة" : "Visit Official Website"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </section>
  );
}
