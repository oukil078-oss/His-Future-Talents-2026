import React from "react";
import { Speaker } from "@/data/speakers";
import { useLanguage } from "@/context/LanguageContext";
import { Calendar, Tag } from "lucide-react";

interface SpeakerCardProps {
  speaker: Speaker;
}

export default function SpeakerCard({ speaker }: SpeakerCardProps) {
  const { language } = useLanguage();
  const isConfirmed = speaker.imageStatus === "confirmed" && speaker.image;

  const categoryLabel =
    speaker.category === "conference"
      ? language === "ar"
        ? "محاضرة"
        : "Conference"
      : language === "ar"
      ? "ورشة عمل"
      : "Workshop";

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-xs hover:shadow-md hover:border-[#F05A22]/50 hover:-translate-y-0.5 transition-all duration-300 group text-start h-full">
      {/* Mini Avatar Photo */}
      <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200 shadow-xs">
        {isConfirmed ? (
          <img
            src={speaker.image}
            alt={speaker.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            width={72}
            height={72}
          />
        ) : (
          <div className="w-full h-full bg-[#0E1B2C] flex flex-col items-center justify-center p-1.5 text-center">
            <img
              src="/brand/motifs/Future Talents Icon Orange-01.png"
              alt=""
              className="w-6 h-6 object-contain opacity-80"
              aria-hidden="true"
            />
            <span className="text-[7px] font-bold text-white/60 uppercase mt-0.5 leading-tight">
              HIS
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
            speaker.category === "conference"
              ? "bg-[#003876]/10 text-[#003876]"
              : "bg-[#F05A22]/10 text-[#F05A22]"
          }`}>
            {categoryLabel}
          </span>
          <span className="text-[8px] font-bold text-slate-400">
            {speaker.edition}
          </span>
        </div>

        {/* Name */}
        <h4 className="font-black text-slate-900 text-xs sm:text-sm truncate group-hover:text-[#F05A22] transition-colors">
          {speaker.name}
        </h4>

        {/* Topic / Role (What they do) */}
        <p className="text-[11px] text-slate-600 font-medium line-clamp-2 leading-tight">
          {typeof speaker.role === "object"
            ? (language === "ar" ? speaker.role.ar : speaker.role.fr)
            : speaker.role}
        </p>
      </div>
    </div>
  );
}
