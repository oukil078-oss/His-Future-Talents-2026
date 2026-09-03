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
  Zap
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
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  glowEffect: string;
  sectorEn: string;
  sectorAr: string;
  taglineEn: string;
  taglineAr: string;
}

const SPONSOR_THEMES: Record<string, SponsorTheme> = {
  satim: {
    primaryColor: "#00C2FF",
    accentBorder: "border-cyan-400/40 hover:border-cyan-400",
    badgeBg: "bg-cyan-500/15 border-cyan-400/30",
    badgeText: "text-cyan-300",
    glowEffect: "from-cyan-500/20 via-blue-600/10 to-transparent group-hover:shadow-[0_16px_50px_rgba(6,182,212,0.25)]",
    sectorEn: "Fintech & Electronic Banking",
    sectorAr: "الدفع الإلكتروني والمنظومة البنكية",
    taglineEn: "National CIB & Edahabia payment switch operator",
    taglineAr: "المشغل الوطني للبنية التحتية للدفع الإلكتروني",
  },
  techno: {
    primaryColor: "#F05A22",
    accentBorder: "border-[#F05A22]/40 hover:border-[#F05A22]",
    badgeBg: "bg-[#F05A22]/15 border-[#F05A22]/30",
    badgeText: "text-[#F05A22]",
    glowEffect: "from-[#F05A22]/20 via-amber-500/10 to-transparent group-hover:shadow-[0_16px_50px_rgba(240,90,34,0.25)]",
    sectorEn: "Office Supplies, Stationery & Creative Arts",
    sectorAr: "الأدوات المدرسية والمكتبية والفنون الجميلة",
    taglineEn: "Algeria's foremost distributor of stationery & creative tools",
    taglineAr: "الرائد الوطني في توفير الأدوات المدرسية والمكتبية",
  },
  prophex: {
    primaryColor: "#10B981",
    accentBorder: "border-emerald-400/40 hover:border-emerald-400",
    badgeBg: "bg-emerald-500/15 border-emerald-400/30",
    badgeText: "text-emerald-300",
    glowEffect: "from-emerald-500/20 via-teal-600/10 to-transparent group-hover:shadow-[0_16px_50px_rgba(16,185,129,0.25)]",
    sectorEn: "Medical Devices & Health Technologies",
    sectorAr: "الأجهزة الطبية والتصنيع الصحي المعتمد",
    taglineEn: "Certified manufacturer of high-standard medical devices",
    taglineAr: "تصنيع معتمد للأجهزة الطبية ومنتجات العناية الصحية",
  },
};

const DEFAULT_THEME: SponsorTheme = {
  primaryColor: "#F05A22",
  accentBorder: "border-white/20 hover:border-[#F05A22]",
  badgeBg: "bg-white/10 border-white/20",
  badgeText: "text-white",
  glowEffect: "from-white/10 to-transparent group-hover:shadow-[0_16px_50px_rgba(255,255,255,0.15)]",
  sectorEn: "Official Event Sponsor",
  sectorAr: "راعي رسمي للحدث",
  taglineEn: "Supporting future talents & innovation in Algeria",
  taglineAr: "دعم المواهب الصاعدة والابتكار في الجزائر",
};

export default function SponsorsSection() {
  const { language, dir } = useLanguage();
  const [sponsorsList, setSponsorsList] = useState<SponsorItem[]>(verifiedSponsors2026 as SponsorItem[]);
  const [selectedSponsor, setSelectedSponsor] = useState<string | null>(null);

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
            "المشغل الوطني المرجعي لشبكة الدفع CIB والذهبية",
            "شريك رائد لابتكارات الفنتك والتحول المالي الرقمي",
            "فرص استقطاب كفاءات تكنولوجيا المعلومات والمالية",
          ]
        : [
            "National CIB & Edahabia interbank payment operator",
            "Strategic pioneer for Algerian fintech & digital economy",
            "Direct recruitment of IT & financial engineering talents",
          ];
    }
    if (/techno/i.test(key)) {
      return language === "ar"
        ? [
            "الرائد الوطني في توزيع الأدوات المدرسية والمكتبية والفنون",
            "دعم مباشر للمواهب الطلابية والتعليم والإبداع الأكاديمي",
            "شبكة فروع واسعة وموثوقة تغطي مختلف ولايات الوطن",
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
            "تصنيع معتمد للأجهزة الطبية ومنتجات الرعاية الصحية",
            "امتثال تام للمعايير والمواصفات الدولية للجودة والسلامة ISO",
            "استقطاب مباشر لمهندسي الطب الحيوي وتقنيي الإنتاج",
          ]
        : [
            "Certified high-standard medical devices manufacturer",
            "Full compliance with international ISO & healthcare standards",
            "Active recruiter of biomedical engineers & production experts",
          ];
    }
    return [];
  };

  return (
    <section
      id="sponsors-section"
      data-theme="dark"
      dir={dir}
      className="relative py-16 md:py-24 bg-[#001730] text-white overflow-hidden text-start border-t border-white/10"
    >
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#F05A22]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Motifs in background */}
      <div className="absolute top-10 right-8 w-28 md:w-36 opacity-15 pointer-events-none select-none hidden lg:block" aria-hidden="true">
        <img src="/brand/motifs/Future Talents Icon Yellow-03.png" alt="" className="w-full h-auto" />
      </div>
      <div className="absolute bottom-10 left-8 w-28 md:w-36 opacity-15 pointer-events-none select-none hidden lg:block" aria-hidden="true">
        <img src="/brand/motifs/Future Talents Icon Orange-02.png" alt="" className="w-full h-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 space-y-12">
        
        {/* Section Header & Prestige Narrative */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F05A22]/15 border border-[#F05A22]/30 text-[#F05A22] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              {language === "ar" ? "الرعاة الرسميون — دورة 2026" : "OFFICIAL EVENT SPONSORS — 2026"}
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              {language === "ar" ? "الرعاة الرسميون لصالون 2026" : "Our Official Sponsors"}
            </h2>
            <p className="text-white/80 text-sm md:text-base font-normal leading-relaxed">
              {language === "ar"
                ? "مؤسسات وطنية رائدة آمنت بطاقات وإمكانيات الكفاءات الجزائرية الشابة، وقررت أن تفتح لهم الأبواب لفرص استثنائية."
                : "Visionary industry champions who recognized Algerian potential and actively invest in unlocking premier opportunities for future leaders."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2.5 px-6 h-12 rounded-xl bg-[#F05A22] hover:bg-[#d84a15] text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-[#F05A22]/20 hover:scale-105 active:scale-95"
            >
              <span>{language === "ar" ? "الانضمام كرعاة" : "Become a Sponsor"}</span>
              <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </a>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {language === "ar" ? "3 مؤسسات رائدة" : "3 National Champions"}
              </div>
              <div className="text-[11px] text-white/60">
                {language === "ar" ? "المالية • الأدوات والإبداع • الصحة" : "Fintech • Education & Arts • Healthcare"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            <div className="w-10 h-10 rounded-lg bg-[#F05A22]/15 border border-[#F05A22]/30 flex items-center justify-center text-[#F05A22] shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {language === "ar" ? "فرص توظيف وتدريب مباشرة" : "Direct Recruitment & Internships"}
              </div>
              <div className="text-[11px] text-white/60">
                {language === "ar" ? "لقاءات حصرية مع مسؤولي الموارد البشرية" : "Direct access to executive talent acquisition"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {language === "ar" ? "رعاية استراتيجية للحدث" : "Official Strategic Partners"}
              </div>
              <div className="text-[11px] text-white/60">
                {language === "ar" ? "تمكين مستمر لطلبة وخريجي 2026" : "Empowering students & top graduates"}
              </div>
            </div>
          </div>
        </div>

        {/* Sponsor Filter / Spotlight Selector Pills */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="inline-flex items-center gap-2 bg-white/[0.04] p-1.5 rounded-xl border border-white/10 flex-wrap">
            <button
              onClick={() => setSelectedSponsor(null)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedSponsor === null
                  ? "bg-white text-slate-900 shadow-md scale-100"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              {language === "ar" ? "جميع الرعاة الرسميين" : "All Official Sponsors"}
            </button>
            {officialSponsors.map((s) => {
              const isSelected = selectedSponsor === s.name;
              return (
                <button
                  key={s.name}
                  onClick={() => setSelectedSponsor(isSelected ? null : s.name)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#F05A22] text-white shadow-md scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-white/60 hidden sm:block">
            {language === "ar"
              ? "انقر على أي راعٍ للاطلاع على مجاله ومميزاته"
              : "Explore each sponsor's domain and opportunities"}
          </div>
        </div>

        {/* Creative Unified Sponsor Spotlight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {officialSponsors.map((sponsor) => {
            const theme = getTheme(sponsor);
            const highlights = getHighlights(sponsor);
            const isHighlighted = selectedSponsor === sponsor.name;
            const isDimmed = selectedSponsor !== null && !isHighlighted;

            return (
              <div
                key={sponsor.name}
                id={`sponsor-card-${sponsor.slug || sponsor.name.toLowerCase()}`}
                className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0E1E38]/90 to-[#0A1628]/95 border p-7 text-white group transition-all duration-500 flex flex-col justify-between ${
                  theme.accentBorder
                } ${
                  isHighlighted
                    ? "ring-2 ring-white/60 scale-[1.02] shadow-[0_20px_60px_rgba(240,90,34,0.35)]"
                    : isDimmed
                    ? "opacity-40 grayscale-[40%] hover:opacity-100 hover:grayscale-0"
                    : "hover:-translate-y-2"
                } ${theme.glowEffect}`}
              >
                {/* Diagonal Metallic Shine Sweep on Hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Ambient Top Glow */}
                <div
                  className="absolute top-0 right-0 left-0 h-32 opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${theme.primaryColor}, transparent 70%)`
                  }}
                />

                <div className="relative z-10 space-y-6">
                  
                  {/* Top Bar: Official Badge + Domain Pill */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {language === "ar" ? "راعي رسمي 2026" : "OFFICIAL SPONSOR 2026"}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${theme.badgeBg} ${theme.badgeText}`}>
                      {language === "ar" ? theme.sectorAr : theme.sectorEn}
                    </span>
                  </div>

                  {/* High-Contrast White Logo Capsule Box */}
                  <div className="bg-white rounded-2xl p-5 border border-white/30 h-32 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-[1.02]">
                    {sponsor.logo ? (
                      <img
                        src={sponsor.logo}
                        alt={`Logo ${sponsor.name}`}
                        className="w-full h-full object-contain select-none max-h-24"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-2xl font-black text-slate-900 tracking-tight">
                        {sponsor.name}
                      </span>
                    )}
                  </div>

                  {/* Header & Sector Tagline */}
                  <div className="space-y-1.5 text-start">
                    <h3 className="text-2xl font-extrabold text-white tracking-tight flex items-center justify-between">
                      <span>{sponsor.name}</span>
                      <Sparkles className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: theme.primaryColor }} />
                    </h3>
                    <p className="text-xs font-semibold" style={{ color: theme.primaryColor }}>
                      {language === "ar" ? theme.taglineAr : theme.taglineEn}
                    </p>
                  </div>

                  {/* Narrative Description */}
                  {sponsor.description && (
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-normal text-start">
                      {language === "ar"
                        ? sponsor.description.ar
                        : (sponsor.description.en || sponsor.description.ar)}
                    </p>
                  )}

                  {/* Key Highlights / Impact Points */}
                  {highlights.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-white/10 text-start">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                        {language === "ar" ? "أبرز المحاور والشراكة" : "Key Partnership Highlights"}
                      </div>
                      <div className="space-y-1.5">
                        {highlights.map((point, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 text-xs text-white/75 font-medium leading-snug"
                          >
                            <CheckCircle2
                              className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              style={{ color: theme.primaryColor }}
                            />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Card Footer: Official Website Button */}
                <div className="relative z-10 pt-6 mt-6 border-t border-white/10">
                  {sponsor.website ? (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.06] hover:bg-white/15 border border-white/15 text-white font-bold text-xs transition-all duration-200 group/btn"
                    >
                      <span>{language === "ar" ? "زيارة الموقع الرسمي" : "Visit Official Website"}</span>
                      <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  ) : (
                    <div className="text-center text-xs text-white/50 py-2">
                      {language === "ar" ? "الشريك الرسمي لصالون 2026" : "Official Partner 2026"}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom VIP Note & Invitation */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900/30 via-[#0E1E38]/60 to-purple-900/30 border border-white/15 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-start">
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
            <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
              {language === "ar"
                ? "احجزوا جناحكم المتميز، وتواصلوا مع أكثر من 3000 طالب وخريج موهوب، واحظوا بظهور إعلامي وطني واسع."
                : "Secure premier visibility, executive branding, and priority access to recruit top university talents across Algeria."}
            </p>
          </div>

          <a
            href="#contact-form"
            className="px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 shrink-0 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            {language === "ar" ? "طلب كتيب الرعاية 2026" : "Request Sponsorship Kit"}
          </a>
        </div>

      </div>
    </section>
  );
}
