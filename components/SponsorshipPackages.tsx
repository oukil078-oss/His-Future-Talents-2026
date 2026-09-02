"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { packagesData, packageBenefits } from "@/lib/eventData";
import { Check, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const TIER_STYLES = {
  bronze: {
    badge:  "bg-amber-700/10 text-amber-800 border-amber-700/25 font-bold",
    check:  "text-amber-700",
    card:   "border border-amber-700/30 hover:border-amber-600 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(180,83,9,0.22)] hover:-translate-y-1",
    glow:   "shadow-md",
  },
  silver: {
    badge:  "bg-slate-100 text-slate-700 border-slate-300 font-bold",
    check:  "text-slate-600",
    card:   "border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(226,232,240,0.35)] hover:-translate-y-1",
    glow:   "shadow-md",
  },
  gold: {
    badge:  "bg-[#D4AF37]/15 text-[#8a6b05] border-[#D4AF37]/40 font-bold",
    check:  "text-[#8a6b05]",
    card:   "border-2 border-[#D4AF37]/50 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-[0_12px_45px_rgba(212,175,55,0.3)] hover:-translate-y-1",
    glow:   "shadow-xl ring-1 ring-[#D4AF37]/30",
  },
};

export default function SponsorshipPackages() {
  const { t, language, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<"bronze" | "silver" | "gold">("gold");
  const [expanded, setExpanded] = useState(false);

  const formatPrice = (price: number) =>
    price.toLocaleString(language === "ar" ? "ar-DZ" : "en-US") + " " + t("packages.da");

  const visibleBenefits = expanded ? packageBenefits : packageBenefits.slice(0, 9);

  return (
    <section id="packages-section" className="py-16 bg-[#001E3D] text-white relative z-10 border-t border-white/10 overflow-hidden" dir={dir}>
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero/hft-hero-poster.webp"
          className="w-full h-full object-cover opacity-25 scale-105"
        >
          <source src="/video/hft-hero-background.mp4" type="video/mp4" />
        </video>
        {/* Dark Navy Gradient Overlay for high text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001E3D]/95 via-[#002855]/90 to-[#0E1B2C]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2C] via-transparent to-[#001E3D]/80" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-md text-xs font-bold uppercase tracking-widest bg-[#F05A22] text-white mb-3 shadow-sm">
            {language === "ar" ? "باقات الرعاية والظهور" : "Exhibitor & Sponsoring Packages"}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mt-2 text-balance leading-tight">
            {t("packages.title")}
          </h2>
          <p className="text-white/80 text-sm md:text-base mt-4 font-medium">{t("packages.subtitle")}</p>
        </div>

        {/* ─── DESKTOP: Three-column card layout ─────────────────────── */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mb-10">
          {packagesData.map((pkg) => {
            const styles = TIER_STYLES[pkg.id];
            const isGold = pkg.id === "gold";
            return (
              <div
                key={pkg.id}
                className={`relative r-card overflow-hidden bg-white transition-all duration-300 flex flex-col justify-between ${styles.card} ${styles.glow}`}
              >
                {/* Gold tag */}
                {isGold && (
                  <div className={`absolute top-4 ${dir === "rtl" ? "left-4" : "right-4"} z-10`}>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black bg-his-orange text-white uppercase tracking-wider shadow-sm">
                      ★ {t("packages.gold_tag")}
                    </span>
                  </div>
                )}

                <div>
                  {/* Header band: dark, expensive ink background */}
                  <div className="bg-[#0E1B2C] px-6 pt-8 pb-7 text-white text-start">
                    <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${styles.badge} bg-white/5 mb-3`}>
                      {t(`packages.${pkg.nameKey}`)}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-black">{formatPrice(pkg.price)}</span>
                    </div>
                  </div>

                  {/* Benefit list */}
                  <div className="px-6 py-6 space-y-3.5 text-start">
                    {packageBenefits.slice(0, 8).map((benefit, idx) => {
                      const has = benefit[pkg.id];
                      return (
                        <div key={idx} className="flex items-start gap-3 text-sm">
                          {has ? (
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 stroke-[3px] ${styles.check}`} />
                          ) : (
                            <span className="w-4 h-4 shrink-0 mt-1 flex items-center justify-center text-slate-200 font-bold">—</span>
                          )}
                          <span className={has ? "text-slate-700 font-bold" : "text-slate-300 line-through opacity-50 font-medium"}>
                            {language === "ar" ? benefit.label.ar : (benefit.label.en || benefit.label.fr)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <a
                    href="#contact-form"
                    className={`flex items-center justify-center gap-2 w-full py-3.5 r-control font-black text-xs transition-all ${
                      isGold
                        ? "bg-his-blue text-white hover:bg-his-deep shadow-soft"
                        : "bg-his-cream text-his-deep border b-alpha hover:bg-white"
                    }`}
                  >
                    <span>{t("common.cta_partner")}</span>
                    <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── DESKTOP: Detailed comparison table ─────────────────────── */}
        <div className="hidden lg:block r-card border b-alpha overflow-hidden bg-white shadow-soft">
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="border-b b-alpha">
                <th className="p-5 text-start font-black text-his-deep text-xs uppercase tracking-wider w-2/5 bg-his-cream/40">
                  {t("packages.features_title")}
                </th>
                {packagesData.map((pkg) => (
                  <th
                    key={pkg.id}
                    className={`p-5 text-center text-[10px] font-black uppercase tracking-wider w-1/5 ${
                      pkg.id === "gold"
                        ? "bg-his-gold/6 text-[#9d7a0a] border-x b-alpha-gold"
                        : "text-slate-500"
                    }`}
                  >
                    {t(`packages.${pkg.nameKey}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y b-alpha">
              {visibleBenefits.map((benefit, idx) => (
                <tr key={idx} className="hover:bg-his-cream/20 transition-colors">
                  <td className="p-4 text-slate-700 text-xs md:text-sm font-semibold">
                    {language === "ar" ? benefit.label.ar : (benefit.label.en || benefit.label.fr)}
                  </td>
                  {["bronze", "silver", "gold"].map((tier) => (
                    <td key={tier} className={`p-4 text-center ${tier === "gold" ? "bg-his-gold/3 border-x b-alpha-gold/30" : ""}`}>
                      {benefit[tier as keyof typeof benefit] ? (
                        <Check className="w-4 h-4 mx-auto stroke-[3px] text-his-blue" />
                      ) : (
                        <span className="text-slate-200 text-xs">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t b-alpha bg-his-cream/40 py-4 text-center">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 text-xs font-black text-his-blue hover:text-his-deep transition-colors focus:outline-none r-control px-4 py-2 hover:bg-his-blue/5 border b-alpha"
            >
              {expanded ? t("packages.collapse") : t("packages.expand")}
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ─── MOBILE: Tabbed cards ──────────────────────────────────── */}
        <div className="block lg:hidden">
          {/* Pill tabs */}
          <div className="flex bg-white border b-alpha r-control p-1 mb-6 shadow-sm">
            {packagesData.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setActiveTab(pkg.id)}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider r-control transition-all ${
                  activeTab === pkg.id
                    ? pkg.id === "gold"
                      ? "bg-his-gold text-white shadow-sm"
                      : "bg-his-deep text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {t(`packages.${pkg.nameKey}`)}
              </button>
            ))}
          </div>

          {packagesData.map((pkg) => {
            if (pkg.id !== activeTab) return null;
            const styles = TIER_STYLES[pkg.id];
            return (
              <div key={pkg.id} className={`r-card border shadow-premium overflow-hidden bg-white ${styles.card}`}>
                <div className="bg-[#0E1B2C] px-6 pt-7 pb-6 text-white text-start">
                  <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${styles.badge} bg-white/5 mb-3`}>
                    {t(`packages.${pkg.nameKey}`)}
                  </span>
                  <p className="text-2xl font-black mt-1">{formatPrice(pkg.price)}</p>
                </div>
                <div className="px-6 py-6 space-y-3.5 text-start">
                  {packageBenefits.map((benefit, idx) => {
                    const has = benefit[pkg.id];
                    return (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        {has ? (
                          <Check className="w-4 h-4 shrink-0 mt-0.5 stroke-[3px] text-his-blue" />
                        ) : (
                          <span className="w-5 shrink-0 text-slate-200 text-center font-bold">—</span>
                        )}
                        <span className={has ? "text-slate-700 font-bold" : "text-slate-350 line-through opacity-45 font-medium"}>
                          {language === "ar" ? benefit.label.ar : benefit.label.fr}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="px-6 pb-6">
                  <a
                    href="#contact-form"
                    className="block w-full text-center py-4 r-control bg-his-blue text-white text-xs font-black hover:bg-his-deep transition-all"
                  >
                    {t("common.cta_partner")}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
