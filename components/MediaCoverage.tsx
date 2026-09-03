"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { verifiedMediaChannels, MediaPartner } from "@/data/mediaData";
import { ExternalLink, X, Tv, CheckCircle2 } from "lucide-react";

export default function MediaCoverage() {
  const { language, dir } = useLanguage();
  const [selectedChannel, setSelectedChannel] = useState<MediaPartner | null>(null);

  return (
    <section
      id="media-coverage-section"
      data-theme="light"
      className="relative py-16 md:py-24 bg-[#FAF8F5] border-y border-[#003876]/10 text-start overflow-hidden"
    >
      {/* Decorative Outer Edge Motif */}
      <div
        className="absolute top-8 right-6 w-28 md:w-36 opacity-75 pointer-events-none select-none hidden lg:block"
        aria-hidden="true"
      >
        <img src="/brand/motifs/Future Talents Icon Blue-04.png" alt="" className="w-full h-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Editorial Heading Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#003876]/70 block">
              {language === "ar" ? "الدورة الثانية" : "2nd Edition"}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#003876] tracking-tight leading-tight">
              {language === "ar"
                ? "وسائل الإعلام التي غطت فعاليات صالون HIS Future Talents"
                : "Broadcasters Who Covered HIS Future Talents"}
            </h2>
            <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed max-w-md">
              {language === "ar"
                ? "تغطية القنوات التلفزيونية الوطنية لفعاليات الدورة الثانية."
                : "National television networks and broadcast media that covered our event."}
            </p>
          </div>

          {/* 5 Verified Channels Composition (7 cols) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {verifiedMediaChannels.map((channel: MediaPartner, idx: number) => (
                <button
                  key={channel.name}
                  type="button"
                  onClick={() => setSelectedChannel(channel)}
                  className={`bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs hover:border-[#003876]/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-center items-center text-center min-h-[120px] cursor-pointer group relative overflow-hidden ${
                    idx === 3 || idx === 4 ? "sm:col-span-1 md:col-span-[1.5]" : ""
                  }`}
                >
                  <div className="h-14 w-full flex items-center justify-center p-1">
                    <img
                      src={channel.logo}
                      alt={`Logo de ${channel.name}`}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-xs font-extrabold text-[#003876] group-hover:text-[#F05A22] transition-colors mt-2">
                    {channel.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Interactive Channel Details Modal ── */}
      {selectedChannel && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 animate-fadeIn" dir={dir}>
          {/* Backdrop */}
          <div
            onClick={() => setSelectedChannel(null)}
            className="fixed inset-0 bg-[#0E1B2C]/80 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <div className="relative w-full max-w-lg bg-gradient-to-br from-[#002855] via-[#003876] to-[#0E1B2C] border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10 space-y-6 text-start max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedChannel(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo Card & Title Header */}
            <div className="flex items-center gap-5 border-b border-white/15 pb-6">
              <div className="w-24 h-24 rounded-2xl bg-white p-3 flex items-center justify-center shrink-0 border-2 border-white/20 shadow-lg">
                <img
                  src={selectedChannel.logo}
                  alt={`Logo ${selectedChannel.name}`}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#58B9FF]/20 text-[#58B9FF] border border-[#58B9FF]/30">
                  <Tv className="w-3 h-3" />
                  {language === "ar" ? "الدورة الثانية • تغطية تلفزيونية" : "2nd Edition • TV Coverage"}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                  {selectedChannel.name}
                </h3>
                {selectedChannel.fullName && (
                  <p className="text-xs text-white/70 font-semibold truncate">{selectedChannel.fullName}</p>
                )}
              </div>
            </div>

            {/* Description (EN & AR) */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#F05A22]">
                {language === "ar" ? "حول القناة وتغطية الصالون" : "About the Broadcaster & Event Coverage"}
              </h4>
              <p className="text-white/85 text-xs sm:text-sm leading-relaxed font-medium">
                {language === "ar" ? selectedChannel.description.ar : selectedChannel.description.en}
              </p>
            </div>

            {/* Key Coverage Points */}
            {selectedChannel.keyPoints && (
              <div className="space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#58B9FF]">
                  {language === "ar" ? "أبرز محطات التغطية" : "Coverage Highlights"}
                </h4>
                <ul className="space-y-2 text-xs text-white/80 font-medium">
                  {((language === "ar" ? selectedChannel.keyPoints.ar : selectedChannel.keyPoints.en) || []).map((pt: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#58B9FF] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Button: External Link */}
            {selectedChannel.website && (
              <div className="pt-2">
                <a
                  href={selectedChannel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-2xl bg-[#F05A22] hover:bg-[#d84a15] text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{language === "ar" ? "زيارة الموقع الرسمي للمؤسسة الإعلامية" : "Visit Official Media Website"}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
