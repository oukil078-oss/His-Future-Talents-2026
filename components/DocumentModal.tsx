"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  FileText,
  Download,
  Eye,
  X,
  Sparkles,
  ExternalLink,
  BookOpen,
  Maximize2,
  Minimize2,
} from "lucide-react";

export type DocumentItem = {
  id: "guide" | "sponsoring";
  title: {
    en?: string;
    fr?: string;
    ar: string;
  };
  subtitle: {
    en?: string;
    fr?: string;
    ar: string;
  };
  pages: number;
  pdfUrl: string;
  driveUrl: string;
  tag: {
    en?: string;
    fr?: string;
    ar: string;
  };
  badgeColor: string;
};

export const DOCUMENTS_LIST: DocumentItem[] = [
  {
    id: "guide",
    title: {
      en: "Exhibitor Participation Guide — Career Fair & Internships",
      fr: "Guide de Participation — Forum Carrières & Stages",
      ar: "دليل المشاركة — صالون التوظيف والتربصات",
    },
    subtitle: {
      en: "Practical event information, fair schedule, target academic profiles, and booth logistics (9 pages).",
      fr: "Informations pratiques, déroulement du forum, profils ciblés et modalités d'organisation pour les exposants (9 pages).",
      ar: "المعلومات التطبيقية، سير الفعالية، الملفات المستهدفة والتنظيم اللوجستي للعارضين (9 صفحات).",
    },
    pages: 9,
    pdfUrl: "/docs/Guide-de-Participation-HFT-2026.pdf",
    driveUrl: "https://drive.google.com/drive/folders/15RIU4KXb1zHrkVr6VKDH3bmXGFyMXPjD",
    tag: {
      en: "Exhibitor Guide",
      fr: "Guide Exposants",
      ar: "دليل العارضين",
    },
    badgeColor: "bg-[#58B9FF]/20 text-[#58B9FF] border-[#58B9FF]/40",
  },
  {
    id: "sponsoring",
    title: {
      en: "Official Sponsoring Dossier & Packages 2026",
      fr: "Dossier de Sponsoring & Grille des Packs 2026",
      ar: "ملف الرعاية وباقات المشاركة 2026",
    },
    subtitle: {
      en: "Detailed breakdown of Bronze, Silver, and Gold sponsorship tiers, media benefits, and brand visibility (15 pages).",
      fr: "Présentation complète des formules de sponsoring (Bronze, Silver, Gold), avantages média et visibilité scénique (15 pages).",
      ar: "عرض شامل لباقات الرعاية (برونزي، فضي، ذهبي)، المزايا الإعلامية وتغطية العلامة التجارية (15 صفحة).",
    },
    pages: 15,
    pdfUrl: "/docs/Dossier-de-Sponsoring-HFT-2026.pdf",
    driveUrl: "https://drive.google.com/drive/folders/15RIU4KXb1zHrkVr6VKDH3bmXGFyMXPjD",
    tag: {
      en: "Packages & Rates",
      fr: "Packs & Tarifs",
      ar: "الباقات والأسعار",
    },
    badgeColor: "bg-[#F05A22]/20 text-[#F05A22] border-[#F05A22]/40",
  },
];

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDocId?: "guide" | "sponsoring";
}

export default function DocumentModal({ isOpen, onClose, initialDocId = "guide" }: DocumentModalProps) {
  const { language, dir } = useLanguage();
  const [activeDoc, setActiveDoc] = useState<DocumentItem>(
    DOCUMENTS_LIST.find((d) => d.id === initialDocId) || DOCUMENTS_LIST[0]
  );
  const [viewMode, setViewMode] = useState<"hub" | "viewer">("hub");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (initialDocId) {
      const match = DOCUMENTS_LIST.find((d) => d.id === initialDocId);
      if (match) setActiveDoc(match);
    }
  }, [initialDocId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (viewMode === "viewer" && !isFullscreen) {
          setViewMode("hub");
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, viewMode, isFullscreen, onClose]);

  if (!isOpen) return null;

  const handleDownloadFile = (doc: DocumentItem) => {
    const a = document.createElement("a");
    a.href = doc.pdfUrl;
    a.download = `${doc.id === "guide" ? "Exhibitor-Guide" : "Sponsoring-Dossier"}-HFT-2026.pdf`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-6 overflow-hidden animate-fadeIn" dir={dir}>
      {/* Backdrop */}
      <div
        onClick={() => {
          if (viewMode === "viewer") setViewMode("hub");
          else onClose();
        }}
        className="fixed inset-0 bg-[#070D18]/85 backdrop-blur-xl transition-opacity"
      />

      {/* ─────────────────────────────────────────────────────────
          1. SELECTION HUB VIEW (Choose File Choice)
      ──────────────────────────────────────────────────────────── */}
      {viewMode === "hub" && (
        <div className="relative w-full max-w-3xl bg-gradient-to-br from-[#002855] via-[#003876] to-[#0E1B2C] border border-white/20 rounded-3xl p-6 sm:p-10 text-white shadow-2xl z-10 space-y-8 text-start max-h-[92vh] overflow-y-auto transform transition-all duration-300 scale-100">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F05A22]/20 border border-[#F05A22]/40 text-[#F05A22] text-xs font-black uppercase tracking-widest backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              {language === "ar" ? "الوثائق الرسمية لصالون HFT 2026" : "Official Documents • HFT 2026"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {language === "ar" ? "اختر الملف المطلوب للاطلاع أو التحميل" : "Select a document to preview or download"}
            </h2>
            <p className="text-white/75 text-xs sm:text-sm font-medium leading-relaxed">
              {language === "ar"
                ? "تفضلوا باختيار دليل المشاركة للعارضين أو ملف باقات الرعاية الكامل لقراءته مباشرة في المتصفح أو تحميله."
                : "Explore the Exhibitor Participation Guide or full Sponsoring Dossier directly in your browser or download high-res PDF copies."}
            </p>
          </div>

          {/* 2 Document Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {DOCUMENTS_LIST.map((doc) => (
              <div
                key={doc.id}
                className="bg-gradient-to-br from-white/10 to-white/5 border border-white/15 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-[#F05A22]/60 hover:bg-white/15 transition-all duration-300 shadow-xl group relative overflow-hidden"
              >
                {/* Top Badge & Page Count */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${doc.badgeColor}`}>
                    {language === "ar" ? doc.tag.ar : (doc.tag.en || doc.tag.fr)}
                  </span>
                  <span className="text-xs font-bold text-white/60 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#58B9FF]" />
                    {doc.pages} {language === "ar" ? "صفحات" : "pages"}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white group-hover:text-[#F05A22] transition-colors leading-snug">
                    {language === "ar" ? doc.title.ar : (doc.title.en || doc.title.fr)}
                  </h3>
                  <p className="text-white/70 text-xs font-medium leading-relaxed">
                    {language === "ar" ? doc.subtitle.ar : (doc.subtitle.en || doc.subtitle.fr)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDoc(doc);
                      setViewMode("viewer");
                    }}
                    className="flex-1 h-12 rounded-2xl bg-[#F05A22] hover:bg-[#d84a15] text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{language === "ar" ? "قراءة الملف" : "Preview PDF"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(doc)}
                    className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer shrink-0"
                    title={language === "ar" ? "تحميل PDF" : "Download PDF"}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Drive Link */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
            <span className="font-semibold">
              {language === "ar" ? "يتوفر أيضاً مجلد Google Drive كامل لكافة الملفات:" : "All documents are also accessible on Google Drive:"}
            </span>
            <a
              href="https://drive.google.com/drive/folders/15RIU4KXb1zHrkVr6VKDH3bmXGFyMXPjD"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#58B9FF] hover:text-[#58B9FF]/80 transition-colors"
            >
              <span>{language === "ar" ? "فتح مجلد Google Drive" : "Open Google Drive Folder"}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          2. STYLED IN-PAGE PDF VIEWER MODAL
      ──────────────────────────────────────────────────────────── */}
      {viewMode === "viewer" && (
        <div
          className={`relative w-full ${
            isFullscreen ? "max-w-none h-screen rounded-none" : "max-w-6xl h-[90vh] rounded-3xl"
          } bg-[#0E1B2C] border border-white/20 shadow-2xl z-10 flex flex-col overflow-hidden text-start animate-fadeIn`}
        >
          {/* Toolbar Header */}
          <div className="h-16 px-4 sm:px-6 bg-gradient-to-r from-[#002855] via-[#003876] to-[#0E1B2C] border-b border-white/15 flex items-center justify-between gap-4 shrink-0">
            
            {/* Document Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {DOCUMENTS_LIST.map((doc) => (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => setActiveDoc(doc)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeDoc.id === doc.id
                      ? "bg-[#F05A22] text-white shadow-md"
                      : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{language === "ar" ? doc.tag.ar : (doc.tag.en || doc.tag.fr)}</span>
                </button>
              ))}
            </div>

            {/* Title & Page Info (Hidden on small mobile) */}
            <div className="hidden lg:flex items-center gap-3 text-white">
              <span className="text-xs font-extrabold truncate max-w-xs">
                {language === "ar" ? activeDoc.title.ar : (activeDoc.title.en || activeDoc.title.fr)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white/70">
                PDF • {activeDoc.pages} {language === "ar" ? "صفحات" : "pages"}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Download Button */}
              <button
                type="button"
                onClick={() => handleDownloadFile(activeDoc)}
                className="h-9 px-3 sm:px-4 rounded-xl bg-white/10 hover:bg-[#F05A22] text-white font-bold text-xs transition-all flex items-center gap-2 border border-white/15 cursor-pointer"
                title={language === "ar" ? "تحميل PDF" : "Download PDF"}
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === "ar" ? "تحميل" : "Download"}</span>
              </button>

              {/* Google Drive Link */}
              <a
                href={activeDoc.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
                title="Google Drive"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#58B9FF]" />
                <span className="hidden md:inline">Drive</span>
              </a>

              {/* Return to Choice Hub */}
              <button
                type="button"
                onClick={() => setViewMode("hub")}
                className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-white/15 cursor-pointer"
                title={language === "ar" ? "تغيير الملف" : "Choose Document"}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#FFBD0E]" />
                <span className="hidden md:inline">{language === "ar" ? "الوثائق" : "Documents"}</span>
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all border border-white/15 cursor-pointer"
                title={isFullscreen ? (language === "ar" ? "تصغير" : "Minimize") : (language === "ar" ? "ملء الشاشة" : "Fullscreen")}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embedded Native PDF Viewer Frame */}
          <div className="flex-1 w-full h-full bg-[#1e293b] relative overflow-hidden">
            <object
              data={`${activeDoc.pdfUrl}#toolbar=1&navpanes=0`}
              type="application/pdf"
              className="w-full h-full border-none"
            >
              {/* Fallback iframe */}
              <iframe
                src={`${activeDoc.pdfUrl}#toolbar=1`}
                className="w-full h-full border-none"
                title={activeDoc.title.en || activeDoc.title.fr}
              >
                <div className="p-8 text-center text-white space-y-4">
                  <p>{language === "ar" ? "متصفحك لا يدعم العرض المباشر لملفات PDF." : "Your browser does not support direct inline PDF viewing."}</p>
                  <a
                    href={activeDoc.pdfUrl}
                    download
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#F05A22] text-white font-bold"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === "ar" ? "تحميل الملف" : "Download PDF"}</span>
                  </a>
                </div>
              </iframe>
            </object>
          </div>
        </div>
      )}
    </div>
  );
}
