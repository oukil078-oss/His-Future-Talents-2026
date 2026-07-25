"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, ChevronRight, X, Menu, ArrowRight } from "lucide-react";

interface NavLink {
  href: string;
  label: { fr: string; ar: string };
}

const NAV_LINKS: NavLink[] = [
  { href: "#value-section", label: { fr: "L'Événement", ar: "الحدث" } },
  { href: "#edition3-section", label: { fr: "Édition 2026", ar: "دورة 2026" } },
  { href: "#sponsors-section", label: { fr: "Nos Sponsors", ar: "الرعاة" } },
  { href: "#why-section", label: { fr: "Pourquoi Exposer", ar: "لماذا المشاركة؟" } },
  { href: "#program-section", label: { fr: "Programme", ar: "البرنامج" } },
  { href: "#speakers-section", label: { fr: "Intervenants", ar: "المتحدثون" } },
  { href: "#media-section", label: { fr: "Médias", ar: "الإعلام" } },
  { href: "#contact-form", label: { fr: "Contact", ar: "تواصل معنا" } },
];

export default function CardNav() {
  const { t, language, setLanguage, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDarkSection, setIsDarkSection] = useState(true); // Default true at top (Hero is dark)
  const headerRef = useRef<HTMLElement>(null);

  // Track scroll position & dark section overlap
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // Detect dark section collision at header center point (~44px from top)
      const headerY = 44;
      const darkSections = document.querySelectorAll('[data-theme="dark"]');
      let isDark = false;

      darkSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= headerY && rect.bottom >= headerY) {
          isDark = true;
        }
      });

      setIsDarkSection(isDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const offsetTop = (target as HTMLElement).getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  }, []);

  const getLabel = (l: { fr: string; ar: string }) => (language === "ar" ? l.ar : l.fr);

  return (
    <header
      ref={headerRef}
      dir={dir}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isDarkSection
          ? scrolled
            ? "bg-[#0E1B2C]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-3"
            : "bg-transparent py-4"
          : scrolled
            ? "bg-white/98 backdrop-blur-md shadow-md border-b border-[#003876]/10 py-3"
            : "bg-[#FBF9F6]/95 backdrop-blur-sm border-b border-[#003876]/08 py-4"
      }`}
    >
      {/* Scroll Progress Indicator Bar */}
      <div
        id="scroll-progress"
        className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-his-blue via-his-orange to-his-yellow z-50 transition-all duration-150"
        style={{ width: "0%" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-12 md:h-14">

        {/* ── LEFT: Official Stacked HFT Logo & App Icon ── */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-2.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-his-blue rounded-lg transition-transform hover:opacity-95"
          aria-label="HIS Future Talents — Page d'accueil"
        >
          <img
            src="/app-logo.png"
            alt="HIS Future Talents App Logo"
            className="h-8 sm:h-9 md:h-10 w-auto rounded-lg object-contain border border-white/20 shadow-xs"
          />
          <img
            src={isDarkSection ? "/logo-hft-white.svg" : "/logo-hft.svg"}
            alt="HIS Future Talents"
            className="h-10 sm:h-11 md:h-13 w-auto object-contain transition-opacity duration-200"
          />
        </a>

        {/* ── CENTER: Desktop Navigation Links (White over dark bg, dark over light bg) ── */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {NAV_LINKS.map((link, idx) => (
            <button
              key={idx}
              onClick={() => handleNavClick(link.href)}
              className={`px-3 py-2 text-xs xl:text-sm font-bold transition-colors rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-his-blue ${
                isDarkSection
                  ? "text-white hover:text-[#F05A22]"
                  : "text-[#0E1B2C] hover:text-[#F05A22]"
              }`}
            >
              {getLabel(link.label)}
            </button>
          ))}
        </nav>

        {/* ── RIGHT: Language Toggle + Single Header CTA ── */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "fr" ? "ar" : "fr")}
            className={`flex items-center gap-1.5 h-10 px-3.5 rounded-xl border text-xs font-extrabold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-his-blue shadow-xs ${
              isDarkSection
                ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                : "bg-white text-[#003876] border-[#003876]/15 hover:bg-his-blue/5"
            }`}
            aria-label="Changer de langue / تغيير اللغة"
          >
            <Globe className={`w-3.5 h-3.5 shrink-0 ${isDarkSection ? "text-white/70" : "text-slate-400"}`} />
            <span>{language === "fr" ? "العربية" : "Français"}</span>
          </button>

          {/* Primary Header CTA */}
          <a
            href="#contact-form"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#contact-form");
            }}
            className="hidden sm:inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#F05A22] text-white text-xs font-black uppercase tracking-wider hover:bg-[#003876] transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-his-orange"
          >
            <span>{t("common.cta_partner")}</span>
            <ChevronRight className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden w-10 h-10 rounded-xl border flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-his-blue shadow-xs ${
              isDarkSection
                ? "bg-white/10 text-white border-white/20 hover:bg-white/20"
                : "bg-white text-[#003876] border-[#003876]/15 hover:bg-his-blue/5"
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU OVERLAY / DRAWER ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${
          isDarkSection ? "bg-[#0E1B2C] border-b border-white/10" : "bg-white border-b border-[#003876]/10"
        } ${
          mobileMenuOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 space-y-3">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(link.href)}
                className={`w-full text-start py-2.5 px-3 rounded-lg text-sm font-bold transition-colors flex items-center justify-between ${
                  isDarkSection
                    ? "text-white hover:bg-white/10 hover:text-[#F05A22]"
                    : "text-[#0E1B2C] hover:bg-his-blue/5 hover:text-[#F05A22]"
                }`}
              >
                <span>{getLabel(link.label)}</span>
                <ChevronRight className={`w-4 h-4 text-slate-400 ${dir === "rtl" ? "rotate-180" : ""}`} />
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-100/10">
            <a
              href="#contact-form"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#contact-form");
              }}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#F05A22] text-white text-xs font-black uppercase tracking-wider hover:bg-[#003876] transition-colors shadow-sm"
            >
              <span>{t("common.cta_partner")}</span>
              <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

