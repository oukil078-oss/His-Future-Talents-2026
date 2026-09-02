"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import enTranslations from "../messages/en.json";
import arTranslations from "../messages/ar.json";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  dir: Direction;
  fontClass: string;
  setLanguage: (lang: Language) => void;
  t: (keyPath: string) => string;
}

const translations: Record<Language, any> = {
  en: enTranslations,
  ar: arTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  locale,
  bahijClass,
  neulisClass,
}: {
  children: React.ReactNode;
  locale: Language;
  bahijClass: string;
  neulisClass: string;
}) {
  // Guard locale value to only support 'en' or 'ar', default to 'en'
  const initialLang: Language = locale === "ar" || locale === "en" ? locale : "en";
  
  const [language, setLanguageState] = useState<Language>(initialLang);
  const [dir, setDir] = useState<Direction>(initialLang === "ar" ? "rtl" : "ltr");
  const [fontClass, setFontClass] = useState<string>(initialLang === "ar" ? bahijClass : neulisClass);

  useEffect(() => {
    // Keep internal language and direction state synced if locale prop changes
    const currentLang: Language = locale === "ar" || locale === "en" ? locale : "en";
    setLanguageState(currentLang);
    const newDir = currentLang === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    setFontClass(currentLang === "ar" ? bahijClass : neulisClass);
    
    if (typeof window !== "undefined") {
      document.documentElement.dir = newDir;
      document.documentElement.lang = currentLang;
    }
  }, [locale, bahijClass, neulisClass]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const newDir = lang === "ar" ? "rtl" : "ltr";
    setDir(newDir);
    setFontClass(lang === "ar" ? bahijClass : neulisClass);
    if (typeof window !== "undefined") {
      document.documentElement.dir = newDir;
      document.documentElement.lang = lang;
      
      const pathname = window.location.pathname;
      const search = window.location.search;
      const hash = window.location.hash;

      // Preserve current route (e.g. /students, /admin) when switching language
      let newPath = pathname;
      if (pathname.startsWith("/en") || pathname.startsWith("/ar") || pathname.startsWith("/fr")) {
        newPath = pathname.replace(/^\/(en|ar|fr)(\/|$)/, `/${lang}$2`);
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
