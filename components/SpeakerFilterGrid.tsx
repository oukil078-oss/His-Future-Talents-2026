"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { speakersData, Speaker } from "@/data/speakers";
import SpeakerCard from "./SpeakerCard";

type FilterType = "all" | "conf-2025" | "conf-2024" | "workshop-2025";

const GroupHeader = ({ title, count, language }: { title: string; count: number; language: string }) => (
  <div className="flex items-center gap-3 border-b border-slate-100 pb-3 mb-6 text-start">
    <div className="w-1.5 h-6 bg-[#F05A22] rounded-full" />
    <h3 className="text-lg md:text-xl font-black text-[#003876] tracking-tight">
      {title}
    </h3>
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
      <div className="space-y-6" dir={dir}>
        <GroupHeader
          title={language === "ar" ? title.ar : title.fr}
          count={list.length}
          language={language}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="space-y-10">
      {/* Filter Tabs Selector */}
      <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto" role="tablist" aria-label="Filtre des experts">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(tab.id as FilterType)}
              className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-his-orange/50 ${
                isActive
                  ? "bg-his-orange text-white shadow-md scale-105"
                  : "bg-his-cream text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {language === "ar" ? tab.ar : tab.fr}
            </button>
          );
        })}
      </div>

      {/* Grouped Grids */}
      <div className="space-y-14 max-w-6xl mx-auto">
        {(activeFilter === "all" || activeFilter === "conf-2025") &&
          renderGroup(
            { fr: "Conference Speakers — Edition 2025", ar: "متحدثو المؤتمر — دورة 2025" },
            conf2025
          )}

        {(activeFilter === "all" || activeFilter === "conf-2024") &&
          renderGroup(
            { fr: "Conference Speakers — Edition 2024", ar: "متحدثو المؤتمر — دورة 2024" },
            conf2024
          )}

        {(activeFilter === "all" || activeFilter === "workshop-2025") &&
          renderGroup(
            { fr: "Workshop Speakers — Edition 2025", ar: "متحدثو ورشات العمل — دورة 2025" },
            workshop2025
          )}
      </div>
    </div>
  );
}
