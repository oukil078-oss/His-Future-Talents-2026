"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { partnersData, Partner } from "@/data/partners";
import { ChevronLeft, ChevronRight, ArrowRight, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PartnerLogoGrid() {
  const { t, language, dir } = useLanguage();
  const [activeEdition, setActiveEdition] = useState<2025 | 2024>(2025);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [modalHeight, setModalHeight] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const [allPartners, setAllPartners] = useState<Partner[]>(partnersData);

  // Fetch live sponsors/partners list from server data store
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

  // Measure modal height to dynamically expand container and push contents down
  useEffect(() => {
    if (selectedPartner) {
      const handleResize = () => {
        if (modalRef.current) {
          setModalHeight(modalRef.current.offsetHeight);
        }
      };
      
      const timer = setTimeout(handleResize, 100);
      window.addEventListener("resize", handleResize);
      
      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", handleResize);
      };
    } else {
      setModalHeight(0);
    }
  }, [selectedPartner, language]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPartner(null);
      }
    };
    if (selectedPartner) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPartner]);

  // Filter exhibitors by edition dynamically (Excluding 2026 sponsors like SATIM to avoid duplication)
  const filteredPartners = allPartners.filter(
    (p) => p.edition === activeEdition && p.slug !== "satim"
  );

  // Handle window resizing to set capacity
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setItemsPerPage(4); // Mobile: 2 columns x 2 rows
      } else if (w < 1024) {
        setItemsPerPage(8); // Tablet: 4 columns x 2 rows
      } else {
        setItemsPerPage(12); // Desktop: 6 columns x 2 rows
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset page when edition changes or screen size changes itemsPerPage
  useEffect(() => {
    setCurrentPage(0);
  }, [activeEdition, itemsPerPage]);

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  
  const startIndex = currentPage * itemsPerPage;
  const visiblePartners = filteredPartners.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Keyboard navigation for tabs
  const handleKeyDown = (e: React.KeyboardEvent, edition: 2025 | 2024) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveEdition(edition);
    }
  };

  return (
    <div
      className={`relative space-y-8 transition-[min-height] duration-500 ease-in-out ${
        selectedPartner ? "z-20" : "z-10"
      }`}
      style={selectedPartner && modalHeight > 0 ? { minHeight: `${modalHeight + 96}px` } : undefined}
    >
      {/* Exhibitors Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6 text-start">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-black text-[#003876] tracking-tight">
            {language === "ar" ? "العارضون في الدورات السابقة" : "Les exposants des éditions précédentes"}
          </h2>
          <p className="text-slate-600 text-sm md:text-base font-medium">
            {language === "ar"
              ? "المؤسسات والشركات التي شاركت كعارضين في الدورات السابقة لصالون HIS Future Talents."
              : "Entreprises et institutions ayant participé en tant qu'exposants lors des éditions précédentes."}
          </p>
        </div>

        {/* Edition Switcher Tabs (2025 & 2024) */}
        <div className="flex justify-center" role="tablist" aria-label="Les exposants des éditions précédentes">
          <div className="inline-flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              role="tab"
              aria-selected={activeEdition === 2025}
              aria-controls="partners-panel"
              id="tab-2025"
              tabIndex={activeEdition === 2025 ? 0 : -1}
              onClick={() => setActiveEdition(2025)}
              onKeyDown={(e) => handleKeyDown(e, 2025)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 focus:outline-none ${
                activeEdition === 2025
                  ? "bg-[#003876] text-white shadow-md scale-105"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              }`}
            >
              {language === "ar" ? "نسخة 2025" : "Édition 2025"}
            </button>
            <button
              role="tab"
              aria-selected={activeEdition === 2024}
              aria-controls="partners-panel"
              id="tab-2024"
              tabIndex={activeEdition === 2024 ? 0 : -1}
              onClick={() => setActiveEdition(2024)}
              onKeyDown={(e) => handleKeyDown(e, 2024)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 focus:outline-none ${
                activeEdition === 2024
                  ? "bg-[#003876] text-white shadow-md scale-105"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              }`}
            >
              {language === "ar" ? "نسخة 2024" : "Édition 2024"}
            </button>
          </div>
        </div>
      </div>

      {/* Partners Grid Panel */}
      <div
        role="tabpanel"
        id="partners-panel"
        aria-labelledby={`tab-${activeEdition}`}
        className="relative"
      >
        {/* Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {visiblePartners.map((partner) => {
            const hasDetails = !!partner.description;
            const isSilver = partner.sponsorTier === "silver";
            return (
              <div
                key={`${partner.edition}-${partner.slug}`}
                onClick={() => {
                  if (hasDetails) {
                    setSelectedPartner(partner);
                  }
                }}
                className={`bg-white border rounded-2xl p-4 aspect-[4/3] flex flex-col items-center justify-center relative transition-all duration-300 group ${
                  isSilver
                    ? "border-slate-300 shadow-[0_4px_20px_rgba(148,163,184,0.35)] ring-2 ring-slate-300/80 hover:shadow-[0_8px_30px_rgba(148,163,184,0.6)] hover:scale-105"
                    : "border-slate-100 shadow-soft"
                } ${
                  hasDetails
                    ? "cursor-pointer hover:-translate-y-1 hover:border-his-orange/40"
                    : "cursor-default"
                }`}
              >
                {isSilver && (
                  <span className="absolute -top-2.5 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider bg-slate-900 text-slate-100 border border-slate-300 shadow-md">
                    Silver Sponsor
                  </span>
                )}
                <img
                  src={partner.logo}
                  alt={language === "ar" ? `شعار ${partner.name}` : `Logo de ${partner.name}`}
                  className="w-full h-full object-contain select-none opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                  loading="lazy"
                  width={200}
                  height={150}
                />
              </div>
            );
          })}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-8" dir="ltr">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              aria-label="Page précédente"
              className={`p-2.5 rounded-full border transition-all ${
                currentPage === 0
                  ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-600 hover:border-his-orange hover:text-his-orange hover:shadow-soft"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
              Page {currentPage + 1} / {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              aria-label="Page suivante"
              className={`p-2.5 rounded-full border transition-all ${
                currentPage === totalPages - 1
                  ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-white border-slate-200 text-slate-600 hover:border-his-orange hover:text-his-orange hover:shadow-soft"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Become a Partner CTA */}
      <div className="text-center pt-2">
        <a
          href="#contact-form"
          className="inline-flex items-center gap-2 text-his-orange hover:text-his-deep font-black text-xs uppercase tracking-wider transition-colors duration-300 focus:outline-none focus:underline"
        >
          <span>{language === "ar" ? "كن شريكًا في الفعالية" : "Devenir partenaire de l'événement"}</span>
          <ArrowRight className={`w-4 h-4 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
        </a>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedPartner && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPartner(null)}
              className="absolute inset-0 bg-slate-950/30 backdrop-blur-md rounded-3xl"
            />

            {/* Modal Content */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col focus:outline-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPartner(null)}
                className={`absolute top-4 ${dir === "rtl" ? "left-4" : "right-4"} p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-400 hover:text-slate-700 transition-colors duration-200 z-20`}
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Body */}
              <div className="p-6 md:p-8 flex flex-col gap-6">
                {/* Header: Logo and Title */}
                <div className={`flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100 ${dir === "rtl" ? "sm:flex-row-reverse text-right" : "text-left"}`}>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-32 h-24 flex items-center justify-center shrink-0">
                    <img
                      src={selectedPartner.logo}
                      alt={selectedPartner.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className={`text-center sm:text-left ${dir === "rtl" ? "sm:text-right" : ""} space-y-1.5 flex-grow`}>
                    <span className="inline-block bg-his-orange/10 text-his-orange text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                      {language === "ar" ? `شريك نسخة ${selectedPartner.edition}` : `Partenaire ${selectedPartner.edition}`}
                    </span>
                    <h3 id="modal-title" className="text-2xl font-black text-slate-800 tracking-tight">
                      {selectedPartner.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">
                    {language === "ar" ? "حول الشركة" : "À propos"}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedPartner.description?.[language] || selectedPartner.description?.fr}
                  </p>
                </div>

                {/* Key Points */}
                {selectedPartner.keyPoints && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest">
                      {language === "ar" ? "النقاط الرئيسية" : "Points clés"}
                    </h4>
                    <ul className="space-y-2.5">
                      {(selectedPartner.keyPoints[language] || selectedPartner.keyPoints.fr).map((point, index) => (
                        <li key={index} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-his-orange shrink-0 mt-2" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Website Link */}
                {selectedPartner.website && (
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <a
                      href={selectedPartner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-his-orange hover:text-his-deep transition-colors duration-200"
                    >
                      <span>{language === "ar" ? "زيارة الموقع الإلكتروني" : "Visiter le site officiel"}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
