"use client";

import React, { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Partner } from "@/data/partners";
import {
  X,
  Briefcase,
  GraduationCap,
  Layers,
  Search,
  Building2,
  ExternalLink,
  Sparkles,
  Users,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";

interface CompanyDetailModalProps {
  partner: Partner | null;
  onClose: () => void;
}

interface OpportunityMeta {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: {
    en: string;
    ar: string;
  };
  desc: {
    en: string;
    ar: string;
  };
  bgClass: string;
  borderClass: string;
  textClass: string;
  iconClass: string;
}

const OPPORTUNITIES_MAP: Record<string, OpportunityMeta> = {
  emploi: {
    id: "emploi",
    icon: Briefcase,
    label: {
      en: "Job Offers & Careers",
      ar: "عروض عمل وتوظيف",
    },
    desc: {
      en: "Full-time positions, CDI/CDD contracts & graduate hiring",
      ar: "عقود عمل دائمة ومؤقتة وفرص توظيف مباشر للكفاءات",
    },
    bgClass: "bg-orange-500/10",
    borderClass: "border-orange-500/30",
    textClass: "text-orange-300",
    iconClass: "text-[#F05A22]",
  },
  pfe: {
    id: "pfe",
    icon: GraduationCap,
    label: {
      en: "End-of-Studies Projects (PFE)",
      ar: "مشاريع تخرج (PFE)",
    },
    desc: {
      en: "Graduation internships, thesis coaching & industrial research",
      ar: "تأطير مشاريع التخرج ومذكرات الماستر والمهندسين",
    },
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
    textClass: "text-blue-300",
    iconClass: "text-blue-400",
  },
  immersion: {
    id: "immersion",
    icon: Layers,
    label: {
      en: "Practical & Hands-on Internships",
      ar: "تربصات تطبيقية وميدانية",
    },
    desc: {
      en: "On-site practical training, technical skill-building & mentoring",
      ar: "تربصات مهنية ميدانية لتطوير المهارات العملية والتطبيقية",
    },
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
    textClass: "text-emerald-300",
    iconClass: "text-emerald-400",
  },
  decouverte: {
    id: "decouverte",
    icon: Search,
    label: {
      en: "Discovery & Exploration Internships",
      ar: "تربصات استكشافية",
    },
    desc: {
      en: "Company culture immersion, career observation & shadow days",
      ar: "استكشاف بيئة العمل وملاحظة المهن والأنشطة المؤسساتية",
    },
    bgClass: "bg-purple-500/10",
    borderClass: "border-purple-500/30",
    textClass: "text-purple-300",
    iconClass: "text-purple-400",
  },
};

export default function CompanyDetailModal({ partner, onClose }: CompanyDetailModalProps) {
  const { language, dir } = useLanguage();

  // Handle ESC key and prevent body scroll
  useEffect(() => {
    if (!partner) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [partner, onClose]);

  if (!partner) return null;

  // Resolve localized description
  const description =
    partner.description && typeof partner.description === "object"
      ? language === "ar"
        ? partner.description.ar || partner.description.en
        : partner.description.en || partner.description.ar
      : typeof partner.description === "string"
      ? partner.description
      : language === "ar"
      ? `${partner.name} هي إحدى المؤسسات المشاركة في صالون HIS Future Talents.`
      : `${partner.name} is a leading partner organization participating in HIS Future Talents.`;

  // Resolve opportunities (defaults to ['emploi', 'pfe'] if empty)
  const oppList =
    Array.isArray(partner.opportunities) && partner.opportunities.length > 0
      ? partner.opportunities
      : ["emploi", "pfe"];

  const is2026 = Number(partner.edition) === 2026;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`company-modal-title-${partner.slug || partner.name}`}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      dir={dir}
    >
      {/* Dark Ambient Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#07111F]/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0E1B2C] via-[#0A1422] to-[#060D17] border border-white/15 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10 space-y-6 text-start max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-40 bg-[#0052CC]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-40 bg-[#F05A22]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer z-20"
          aria-label={language === "ar" ? "إغلاق" : "Close"}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Company Logo & Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-white/10 pb-6 pr-6 relative z-10">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-3.5 flex items-center justify-center shrink-0 border-2 border-white/20 shadow-xl overflow-hidden group">
            {partner.logo ? (
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-full object-contain select-none transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                <Building2 className="w-8 h-8 text-[#003876] mb-1" />
                <span className="text-xs font-black text-[#003876] line-clamp-2 leading-tight">
                  {partner.name}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/10 text-white border border-white/20">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                {is2026
                  ? language === "ar"
                    ? "مؤسسة عارضة • دورة 2026"
                    : "Exhibitor • 2026 Edition"
                  : language === "ar"
                  ? `شريك دورة ${partner.edition}`
                  : `Partner • ${partner.edition} Edition`}
              </span>

              {partner.tier && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F05A22]/20 border border-[#F05A22]/40 text-[#F05A22] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  {partner.tier}
                </span>
              )}
            </div>

            <h3
              id={`company-modal-title-${partner.slug || partner.name}`}
              className="text-2xl sm:text-3xl font-black text-white tracking-tight"
            >
              {partner.name}
            </h3>

            <p className="text-xs font-semibold text-[#58B9FF]">
              {language === "ar"
                ? "شريك توظيف وتدريب معتمد في صالون HIS Future Talents"
                : "Official Talent & Internship Partner at HIS Future Talents"}
            </p>
          </div>
        </div>

        {/* ── Section: Opportunités proposées (Event Opportunities) ── */}
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#F05A22] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>
                {language === "ar"
                  ? "الفرص المعروضة في الصالون (Opportunités proposées)"
                  : "Opportunities Offered at Fair (Opportunités proposées)"}
              </span>
            </h4>
            <span className="text-[11px] text-white/50 font-medium hidden sm:inline">
              {language === "ar" ? "حسب استمارة التسجيل" : "From event registration"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {oppList.map((oppKey) => {
              const meta = OPPORTUNITIES_MAP[oppKey];
              if (!meta) return null;
              const IconComp = meta.icon;

              return (
                <div
                  key={oppKey}
                  className={`rounded-2xl p-3.5 border ${meta.borderClass} ${meta.bgClass} flex items-start gap-3 transition-all hover:scale-[1.02] shadow-sm`}
                >
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 border border-white/10">
                    <IconComp className={`w-5 h-5 ${meta.iconClass}`} />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className={`text-xs font-black ${meta.textClass}`}>
                      {language === "ar" ? meta.label.ar : meta.label.en}
                    </div>
                    <div className="text-[11px] text-white/70 font-medium leading-snug">
                      {language === "ar" ? meta.desc.ar : meta.desc.en}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Section: Profils recherchés (Target Profiles) if specified ── */}
        {partner.targetProfiles && partner.targetProfiles.trim().length > 0 && (
          <div className="space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-4 relative z-10">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#58B9FF] flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {language === "ar" ? "التخصصات والملفات المستهدفة" : "Target Academic & Work Profiles"}
              </span>
            </h4>
            <p className="text-xs text-white/90 leading-relaxed font-medium whitespace-pre-line">
              {partner.targetProfiles}
            </p>
          </div>
        )}

        {/* ── Section: Description de l'entreprise ── */}
        <div className="space-y-2 relative z-10">
          <h4 className="text-xs font-black uppercase tracking-wider text-white/60">
            {language === "ar" ? "نبذة عن المؤسسة" : "About the Organization"}
          </h4>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* ── Key Highlights (if available) ── */}
        {partner.keyPoints && (
          <div className="space-y-2.5 bg-black/25 border border-white/10 rounded-2xl p-4 relative z-10">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#58B9FF]">
              {language === "ar" ? "نقاط القوة والشراكة" : "Key Highlights & Focus"}
            </h4>
            <ul className="space-y-1.5 text-xs text-white/90 font-medium">
              {(language === "ar"
                ? partner.keyPoints.ar || partner.keyPoints.en
                : partner.keyPoints.en || partner.keyPoints.ar
              )?.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Event Stand Notice ── */}
        <div className="rounded-xl bg-gradient-to-r from-[#003876]/40 to-[#0052CC]/20 border border-[#0052CC]/30 p-3.5 flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-[#F05A22]/20 border border-[#F05A22]/40 flex items-center justify-center text-[#F05A22] shrink-0">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="text-xs text-white/90 leading-tight">
            <span className="font-bold text-white">
              {language === "ar" ? "لقاء مباشر بالجناح: " : "Meet at the Booth: "}
            </span>
            {language === "ar"
              ? `فريق ${partner.name} سيكون حاضراً لاستقبال سيرتكم الذاتية وإجراء المقابلات الأولية في صالون HIS Future Talents 2026.`
              : `The ${partner.name} talent team will be on-site to collect resumes and conduct preliminary interviews at HIS Future Talents 2026.`}
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 relative z-10">
          {partner.website && (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 h-12 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer bg-[#003876] hover:bg-[#004899] text-white border border-[#58B9FF]/30 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>{language === "ar" ? "زيارة الموقع الرسمي" : "Visit Official Website"}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 h-12 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            {language === "ar" ? "إغلاق" : "Close"}
          </button>
        </div>

      </div>
    </div>
  );
}
