"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe, ArrowRight } from "lucide-react";

export default function StickyTopCTA() {
  const { t, language, setLanguage, dir } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const formElement = document.getElementById("contact-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-white/80 backdrop-blur-sm py-4 border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logos Container */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="#" className="flex items-center gap-2 sm:gap-2.5">
            <img
              src="/logo-hft.svg"
              alt="HIS Future Talents"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain"
            />
            <span className="text-[#003876]/40 text-xs sm:text-sm font-black select-none">✕</span>
            <img
              src="/brand/his-logo-blue.png"
              alt="HIS University"
              className="h-6 sm:h-8 md:h-9 w-auto object-contain"
            />
          </a>
        </div>

        {/* Action Items */}
        <div className="flex items-center gap-4">
          {/* Language Selector Selector */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 r-control border border-slate-200 text-sm font-semibold hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0060C1] hover:border-slate-300"
            aria-label="Switch Language / تغيير اللغة"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span>{language === "en" ? "AR" : "EN"}</span>
          </button>

          {/* Sticky CTA Button */}
          <a
            href="#contact-form"
            onClick={scrollToForm}
            className="relative inline-flex items-center justify-center gap-2 px-5 py-2 md:px-6 md:py-2.5 r-control bg-[#0060C1] text-white text-sm font-bold shadow-sm hover:bg-[#003876] hover:shadow transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0060C1]"
          >
            <span>{t("common.cta_partner")}</span>
            <ArrowRight
              className={`w-4 h-4 transition-transform duration-200 ${
                dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"
              }`}
            />
          </a>
        </div>
      </div>
    </header>
  );
}
