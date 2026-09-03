"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { partnersData, Partner } from "@/data/partners";

function PartnerLogoCard({ partner }: { partner: Partner }) {
  const [hasError, setHasError] = useState(false);

  const isOrganizingEntity =
    partner.slug === "his-university" ||
    partner.slug === "iracademy" ||
    partner.slug === "his-training-center";

  return (
    <div
      title={partner.name}
      className={`group relative bg-white rounded-xl p-1.5 sm:p-2 h-16 sm:h-20 flex items-center justify-center transition-all duration-200 hover:shadow-md hover:scale-105 overflow-hidden ${
        isOrganizingEntity
          ? "border-2 border-[#003876]/40 bg-gradient-to-b from-white to-blue-50/20 hover:border-[#003876]"
          : "border border-slate-200/80 hover:border-[#F05A22]"
      }`}
    >
      {!hasError && partner.logo ? (
        <div className="w-full h-full flex items-center justify-center p-1">
          <img
            src={partner.logo}
            alt={partner.name}
            onError={() => setHasError(true)}
            className="w-full h-full max-h-full max-w-full object-contain select-none opacity-90 group-hover:opacity-100 transition-all duration-200 group-hover:scale-105"
            loading="lazy"
            width={140}
            height={70}
          />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center px-1">
          <span className="text-[10px] sm:text-[11px] font-black text-[#003876] line-clamp-2 leading-tight uppercase tracking-tight group-hover:text-[#F05A22] transition-colors">
            {partner.name}
          </span>
          {partner.edition === 2026 && (
            <span className="text-[8px] font-bold text-[#F05A22] uppercase tracking-wider mt-0.5 opacity-80">
              2026
            </span>
          )}
        </div>
      )}

      {/* Micro Hover Tooltip with Name */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20 shadow-md">
        {partner.name}
      </div>
    </div>
  );
}

export default function PartnerLogoGrid() {
  const { language, dir } = useLanguage();
  const [activeEdition, setActiveEdition] = useState<2026 | 2025 | 2024>(2026);
  const [allPartners, setAllPartners] = useState<Partner[]>(partnersData);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await fetch("/api/sponsors");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setAllPartners(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch sponsors list:", err);
      }
    };
    fetchSponsors();
  }, []);

  // Filter exhibitors for active edition
  const filteredPartners = allPartners.filter((p) => {
    if (p.edition === 2026 && (/vitrin|vi-tri-n/i.test(p.slug || "") || /vitrin|v[i\u0130]tr[i\u0130]n/i.test(p.name || ""))) {
      return false;
    }
    return p.edition === activeEdition;
  });

  return (
    <div className="space-y-6" dir={dir}>
      {/* Header & Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 text-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#003876]/10 text-[#003876] text-[10px] font-black uppercase tracking-wider mb-1.5">
            <span>{language === "ar" ? "شبكة الشركاء والعارضين" : "Partner Network & Exhibitors"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#003876] tracking-tight">
            {language === "ar"
              ? activeEdition === 2026
                ? "المؤسسات المشاركة في دورة 2026"
                : "المؤسسات والشركات المشاركة"
              : activeEdition === 2026
              ? "Exhibitors & Partners for 2026 Edition"
              : "Exhibitors from Previous Editions"}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
            {language === "ar"
              ? "أكثر من 140 مؤسسة وطنية ودولية تشارك في دورات HIS Future Talents"
              : "Over 140 leading companies recruit and partner across HIS Future Talents editions."}
          </p>
        </div>

        {/* Edition Switcher Tabs - 2026, 2025, 2024 */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto flex-wrap gap-1">
          {[
            { id: 2026, label: language === "ar" ? "دورة 2026 (النسخة الحالية)" : "2026 Edition (Current)" },
            { id: 2025, label: language === "ar" ? "دورة 2025" : "2025 Edition" },
            { id: 2024, label: language === "ar" ? "دورة 2024" : "2024 Edition" },
          ].map((tab) => {
            const isActive = activeEdition === tab.id;
            return (
              <button
                key={String(tab.id)}
                onClick={() => setActiveEdition(tab.id as 2026 | 2025 | 2024)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#003876] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dense, High-Visual Logo Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {filteredPartners.map((partner, idx) => (
          <PartnerLogoCard
            key={`${partner.edition}-${partner.slug}-${idx}`}
            partner={partner}
          />
        ))}
      </div>
    </div>
  );
}
