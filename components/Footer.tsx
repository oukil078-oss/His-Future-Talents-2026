"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function Footer() {
  const { t, language, dir } = useLanguage();

  const year = new Date().getFullYear();

  return (
    <footer data-theme="dark" className="bg-his-ink text-white border-t border-white/6 relative overflow-hidden" dir={dir}>
      {/* Subtle top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-his-electric/20 to-transparent" aria-hidden="true" />

      {/* Subtle brand motif in background corner */}
      <div className="absolute bottom-4 right-6 w-24 h-24 opacity-10 pointer-events-none select-none hidden md:block" aria-hidden="true">
        <img src="/brand/motifs/Future Talents Icon Yellow-04.png" alt="" className="w-full h-auto" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5 text-start">

          {/* Brand column */}
          <div className="md:col-span-6 space-y-5">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <img
                src="/logo-hft-white.svg"
                alt="HIS Future Talents"
                className="h-10 sm:h-12 md:h-13 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
              />
              <span className="text-white/40 text-xs sm:text-sm font-black select-none px-0.5">✕</span>
              <img
                src="/brand/his-logo-white.png"
                alt="HIS University"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity"
              />
            </div>
            <p className="text-white/70 text-xs md:text-sm leading-relaxed max-w-sm font-medium">
              {language === "ar"
                ? "المنصة الرسمية لشراكات ملتقى المواهب المستقبلية — الإصدار 3، منظم من طرف المعهد العالي للعلوم."
                : "The official partnership and talent acquisition platform for HIS Future Talents Edition 3, hosted by Higher Institute of Sciences."}
            </p>

            {/* CTA */}
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 px-4 py-2.5 r-control bg-his-blue text-white text-xs font-black hover:bg-his-electric transition-colors focus:outline-none"
            >
              <span>{t("common.cta_partner")}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </a>
          </div>

          {/* Contact column */}
          <div className="md:col-span-5 md:col-start-8 space-y-4">
            <h4 className="text-[9px] font-black uppercase tracking-widest text-his-electric/60">
              {language === "ar" ? "التواصل الرسمي" : "Official Contact"}
            </h4>
            <ul className="space-y-3 text-xs md:text-sm text-white/40 font-semibold">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-his-electric/40 shrink-0 mt-0.5" />
                <span>Higher Institute of Sciences, Bordj El Kiffan, Algiers</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-his-electric/40 shrink-0" />
                <a href="mailto:i.delhoum@his.edu.dz" className="hover:text-white transition-colors">
                  i.delhoum@his.edu.dz
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-his-electric/40 shrink-0" />
                <span dir="ltr">+213 (0) 770 941 174</span>
              </li>
              <li className="text-white/40 text-xs pt-1">
                {language === "ar" ? "مسؤول المشروع : دلهوم عماد الدين" : "Project Lead : DELHOUM Imad Eddine"}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/40 font-bold">
          <p>© {year} HIS Future Talents. {language === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</p>
          <div className="flex gap-6 items-center">
            <a href={`/${language}/admin`} className="hover:text-[#58B9FF] transition-colors flex items-center gap-1">
              <span>{language === "ar" ? "فضاء الإدارة" : "Admin Portal"}</span>
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              {language === "ar" ? "الشروط القانونية" : "Legal Notice"}
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
