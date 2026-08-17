"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { speakersData, Speaker } from "@/data/speakers";
import SpeakerCard from "./SpeakerCard";

type FilterType = "all" | "conf-2025" | "conf-2024" | "workshop-2025";

const GroupHeader = ({ title, count }: { title: string; count: number }) => (
  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-4 text-start">
    <div className="flex items-center gap-2.5">
      <div className="w-1.5 h-4 bg-[#F05A22] rounded-full" />
      <h3 className="text-base sm:text-lg font-black text-[#003876] tracking-tight">
        {title}
      </h3>
    </div>
    <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
      {count} Intervenants
    </span>
  </div>
);

export default function SpeakerFilterGrid() {
  const { language, dir } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const conf2025 = speakersData.filter((s) => s.edition === 2025 && s.category === "conference");
  const conf2024 = speakersData.filter((s) => s.edition === 2024 && s.category === "conference");
  const workshop2025 = speakersData.filter((s) => s.edition === 2025 && s.category === "workshop");

  const filterTabs = [
    { id: "all", fr: "Tous", ar: "الكل" },
    { id: "conf-2025", fr: "Conférences 2025", ar: "محاضرات 2025" },
    { id: "conf-2024", fr: "Conférences 2024", ar: "محاضرات 2024" },
    { id: "workshop-2025", fr: "Ateliers & Workshops", ar: "الورشات التدريبية" }
  ];

  const renderGroup = (title: { fr: string; ar: string }, list: Speaker[]) => {
    if (list.length === 0) return null;
    return (
      <div className="space-y-3" dir={dir}>
        <GroupHeader
          title={language === "ar" ? title.ar : title.fr}
          count={list.length}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {list.map((speaker, idx) => (
            <div key={`${speaker.name}-${idx}`} className="h-full">
              <SpeakerCard speaker={speaker} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs Selector */}
      <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto" role="tablist" aria-label="Filtre des experts">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(tab.id as FilterType)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 focus:outline-none ${
                isActive
                  ? "bg-[#003876] text-white shadow-sm scale-102"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60"
              }`}
            >
              {language === "ar" ? tab.ar : tab.fr}
            </button>
          );
        })}
      </div>

      {/* Grouped Grids */}
      <div className="space-y-8 max-w-7xl mx-auto">
        {(activeFilter === "all" || activeFilter === "conf-2025") &&
          renderGroup(
            { fr: "Conférences — Édition 2025", ar: "محاضرات — دورة 2025" },
            conf2025
          )}

        {(activeFilter === "all" || activeFilter === "conf-2024") &&
          renderGroup(
            { fr: "Conférences — Édition 2024", ar: "محاضرات — دورة 2024" },
            conf2024
          )}

        {(activeFilter === "all" || activeFilter === "workshop-2025") &&
          renderGroup(
            { fr: "Ateliers & Workshops Pratiques — Édition 2025", ar: "الورشات التدريبية — دورة 2025" },
            workshop2025
          )}
      </div>
    </div>
  );
}
