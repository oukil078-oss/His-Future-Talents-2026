"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import frTranslations from "../messages/fr.json";
import arTranslations from "../messages/ar.json";

type Language = "fr" | "ar";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  dir: Direction;
  fontClass: string;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => string;
}

const translations: Record<Language, any> = {
  fr: frTranslations,
  ar: arTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  locale,
  bahijClass,
  montserratClass,
}: {
  children: React.ReactNode;
  locale: Language;
  bahijClass: string;
  montserratClass: string;
}) {
  // Guard locale value to only support 'fr' or 'ar', default to 'fr'
  const initialLang: Language = locale === "ar" || locale === "fr" ? locale : "fr";
  
  const [language, setLanguageState] = useState<Language>(initialLang);
  const [dir, setDir] = useState<Direction>(initialLang === "ar" ? "rtl" : "ltr");
  const [fontClass, setFontClass] = useState<string>(initialLang === "ar" ? bahijClass : montserratClass);

  useEffect(() => {
    // Keep internal language and direction state synced if locale prop changes
    const currentLang: Language = locale === "ar" || locale === "fr" ? locale : "fr";
    setLanguageState(currentLang);
    const newDir = currentLang === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    setFontClass(currentLang === "ar" ? bahijClass : montserratClass);
    
    if (typeof window !== "undefined") {
      document.documentElement.dir = newDir;
      document.documentElement.lang = currentLang;
    }
  }, [locale, bahijClass, montserratClass]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const newDir = lang === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    setFontClass(lang === "ar" ? bahijClass : montserratClass);
    if (typeof window !== "undefined") {
      document.documentElement.dir = newDir;
      document.documentElement.lang = lang;
      
      const pathname = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;

      // Preserve current route (e.g. /students, /admin) when switching language
      let newPath = pathname;
      if (pathname.startsWith("/fr") || pathname.startsWith("/ar")) {
        newPath = pathname.replace(/^\/(fr|ar)(\/|$)/, `/${lang}$2`);
      } else {
        newPath = `/${lang}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
      }

      window.location.href = `${newPath}${search}${hash}`;
    }
  };

  const t = (keyPath: string) => {
    const parts = keyPath.split(".");
    let current = translations[language];
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        return keyPath; // Fallback to raw string path if translation not found
      }
    }
    return typeof current === "string" ? current : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, dir, fontClass, setLanguage, t }}>
      <div className={fontClass} style={{ width: "100%", minHeight: "100vh" }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
