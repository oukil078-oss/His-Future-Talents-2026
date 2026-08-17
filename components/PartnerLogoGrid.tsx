"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { partnersData, Partner } from "@/data/partners";

export default function PartnerLogoGrid() {
  const { language, dir } = useLanguage();
  const [activeEdition, setActiveEdition] = useState<2025 | 2024>(2025);
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

  // Filter exhibitors (exclude SATIM to avoid duplication with main 2026 partner banner)
  const filteredPartners = allPartners.filter((p) => {
    if (p.slug === "satim") return false;
    return p.edition === activeEdition;
  });

  return (
    <div className="space-y-6" dir={dir}>
      {/* Header & Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 text-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#003876]/10 text-[#003876] text-[10px] font-black uppercase tracking-wider mb-1.5">
            <span>{language === "ar" ? "شبكة الشركاء" : "Réseau Entreprises"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#003876] tracking-tight">
            {language === "ar" ? "المؤسسات والشركات المشاركة" : "Les exposants des éditions précédentes"}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-0.5">
            {language === "ar"
              ? "أكثر من 120 مؤسسة وطنية ودولية شاركت في دورات HIS Future Talents"
              : "Plus de 120 entreprises de premier plan ont recruté lors de nos événements."}
          </p>
        </div>

        {/* Edition Switcher Tabs - Strictly 2025 and 2024 */}
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
          {[
            { id: 2025, label: language === "ar" ? "دورة 2025" : "Édition 2025" },
            { id: 2024, label: language === "ar" ? "دورة 2024" : "Édition 2024" },
          ].map((tab) => {
            const isActive = activeEdition === tab.id;
            return (
              <button
                key={String(tab.id)}
                onClick={() => setActiveEdition(tab.id as 2025 | 2024)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
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

      {/* Dense, High-Visual Logo Grid for Gen-Z */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 sm:gap-3">
        {filteredPartners.map((partner, idx) => (
          <div
            key={`${partner.edition}-${partner.slug}-${idx}`}
            title={partner.name}
            className="group relative bg-white border border-slate-200/80 rounded-xl p-2.5 h-16 sm:h-20 flex items-center justify-center transition-all duration-200 hover:border-[#F05A22] hover:shadow-md hover:scale-105"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="max-h-9 sm:max-h-11 w-auto max-w-[85%] object-contain select-none opacity-85 group-hover:opacity-100 transition-opacity"
              loading="lazy"
              width={120}
              height={60}
            />

            {/* Micro Hover Tooltip with Name */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-20 shadow-md">
              {partner.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
