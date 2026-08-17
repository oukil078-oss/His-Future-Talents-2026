"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import SponsorsSection from "@/components/SponsorsSection";
import PartnerLogoGrid from "@/components/PartnerLogoGrid";
import ProgramTimeline from "@/components/ProgramTimeline";
import SpeakerFilterGrid from "@/components/SpeakerFilterGrid";
import StudentRegistrationForm from "@/components/StudentRegistrationForm";
import { StudentApplication } from "@/lib/dataStore";
import {
  Sparkles,
  ChevronRight,
  Globe,
  Menu,
  X,
  Play,
  Pause,
  Video,
  Zap,
  Bot,
  Rocket,
  MessageSquare,
  User,
} from "lucide-react";

export default function StudentsPage() {
  const { t, language, setLanguage, dir } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlayingVideo) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlayingVideo(!isPlayingVideo);
    }
  };

  // Recap Video Modal State
  const [selectedRecapVideo, setSelectedRecapVideo] = useState<{ src: string; title: string; year: string } | null>(null);

  // Student Registration State (Shared between top and bottom forms)
  const [submittedStudent, setSubmittedStudent] = useState<StudentApplication | null>(null);

  // Restore stored student registration from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("hft_student_registration");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          setSubmittedStudent(parsed);
        }
      }
    } catch (e) {}

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePreloaderComplete = React.useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}

      <div className={`min-h-screen bg-[#FBF9F6] text-slate-900 ${dir === "rtl" ? "font-bahij" : "font-neulis"}`}>
        
        {/* ── 1. HEADER / NAVIGATION BAR ── */}
        <header
          dir={dir}
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
            scrolled
              ? "bg-[#0E1B2C]/95 backdrop-blur-md border-b border-white/10 shadow-lg py-2.5"
              : "bg-[#0E1B2C]/80 backdrop-blur-sm py-3.5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 h-12 md:h-14">
            
            {/* Logo */}
            <a href={`/${language}`} className="flex items-center shrink-0 h-10 sm:h-12">
              <img src="/logo-hft-white.svg" alt="HIS Future Talents" className="h-10 sm:h-12 w-auto object-contain" />
            </a>

            {/* Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-3 text-white text-xs xl:text-sm font-bold">
              <a href={`/${language}`} className="px-3 py-2 hover:text-[#F05A22] transition-colors">
                {language === "ar" ? "الرئيسية" : "Accueil"}
              </a>
              <a href="#register-hero" className="px-3 py-2 text-[#F05A22] font-black hover:underline">
                {language === "ar" ? "احجز تذكرتك" : "Mon Pass VIP"}
              </a>
              <a href="#nouveautes-section" className="px-3 py-2 hover:text-[#F05A22] transition-colors">
                {language === "ar" ? "المستجدات" : "Nouveautés 2026"}
              </a>
              <a href="#sponsors-section" className="px-3 py-2 hover:text-[#F05A22] transition-colors">
                {language === "ar" ? "الرعاة" : "Nos Sponsors"}
              </a>
              <a href="#exhibitors-section" className="px-3 py-2 hover:text-[#F05A22] transition-colors">
                {language === "ar" ? "الشركات المشاركة" : "Exposants"}
              </a>
              <a href="#speakers-section" className="px-3 py-2 hover:text-[#F05A22] transition-colors">
                {language === "ar" ? "المحاضرات والورشات" : "Conférences & Ateliers"}
              </a>
              <a href="#program-section" className="px-3 py-2 hover:text-[#F05A22] transition-colors">
                {language === "ar" ? "البرنامج" : "Programme"}
              </a>
            </nav>

            {/* Language Switcher & CTA */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setLanguage(language === "fr" ? "ar" : "fr")}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-white/20 bg-white/10 text-white text-xs font-extrabold hover:bg-white/20 transition-all"
              >
                <Globe className="w-3.5 h-3.5 text-white/70" />
                <span>{language === "fr" ? "العربية" : "Français"}</span>
              </button>

              {submittedStudent ? (
                <a
                  href="#register-hero"
                  className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{language === "ar" ? "شارة الدخول" : "Mon Pass Badge"}</span>
                </a>
              ) : (
                <a
                  href="#register-hero"
                  className="hidden sm:inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-[#F05A22] text-white text-xs font-black uppercase tracking-wider hover:bg-[#FFBD0E] hover:text-[#0E1B2C] transition-all shadow-sm"
                >
                  <span>{language === "ar" ? "Pass مجاني" : "Pass 100% Gratuit"}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
                </a>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded-xl border border-white/20 bg-white/10 text-white flex items-center justify-center"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-[#0E1B2C] border-b border-white/10 px-6 py-4 space-y-2 text-white text-sm font-bold">
              <a href={`/${language}`} className="block py-2">
                {language === "ar" ? "الرئيسية" : "Accueil"}
              </a>
              <a href="#register-hero" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-[#F05A22]">
                {language === "ar" ? "احجز تذكرتك مجاناً" : "Inscription & Pass"}
              </a>
              <a href="#nouveautes-section" onClick={() => setMobileMenuOpen(false)} className="block py-2">
                {language === "ar" ? "المستجدات" : "Nouveautés 2026"}
              </a>
              <a href="#sponsors-section" onClick={() => setMobileMenuOpen(false)} className="block py-2">
                {language === "ar" ? "الرعاة" : "Nos Sponsors"}
              </a>
              <a href="#exhibitors-section" onClick={() => setMobileMenuOpen(false)} className="block py-2">
                {language === "ar" ? "الشركات المشاركة" : "Exposants"}
              </a>
              <a href="#speakers-section" onClick={() => setMobileMenuOpen(false)} className="block py-2">
                {language === "ar" ? "المحاضرات والورشات" : "Conférences & Ateliers"}
              </a>
              <a href="#program-section" onClick={() => setMobileMenuOpen(false)} className="block py-2">
                {language === "ar" ? "البرنامج" : "Programme"}
              </a>
            </div>
          )}
        </header>

        {/* ── 2. HERO + REGISTRATION FULL-VIEWPORT COMPACT SCREEN (50% / 50% SPLIT) ── */}
        <section
          id="register-hero"
          className="relative min-h-screen lg:h-[100dvh] lg:min-h-[620px] lg:max-h-[960px] flex items-center justify-center pt-24 pb-8 sm:pt-28 sm:pb-8 px-4 sm:px-6 lg:px-8 bg-[#0A1424] text-white overflow-hidden lg:overflow-visible"
        >
          {/* Background Video Layer */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster="/images/hero/hft-hero-poster.webp"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            >
              <source src="/video/hft-hero-background.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-[#00224A]/95 via-[#0A1424]/90 to-[#00142A]/95" />
          </div>

          {/* Background Motif Accent */}
          <div className="pointer-events-none absolute -top-10 -left-10 w-48 h-48 opacity-15 select-none hidden lg:block">
            <img src="/brand/motifs/Future Talents Icon Yellow-03.png" alt="" className="w-full h-auto" />
          </div>

          {/* Video Control */}
          <div className="absolute top-20 right-4 sm:right-8 z-20 hidden sm:block">
            <button
              onClick={toggleVideoPlayback}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#F05A22] border border-white/20 text-white flex items-center justify-center transition-all shadow-md backdrop-blur-sm cursor-pointer"
              title={isPlayingVideo ? "Pause" : "Play"}
            >
              {isPlayingVideo ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>

          {/* 2-Column Responsive Layout: Exactly 50% Left Text & 50% Right Badge/Form */}
          <div className="relative max-w-7xl mx-auto w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Column (50% Width): Motivational Copy & Key Numbers */}
            <div className="space-y-3 sm:space-y-4 text-center lg:text-start" dir={dir}>
              
              {/* Gen-Z Motivational Pill */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F05A22]/20 border border-[#F05A22]/40 text-[#FFBD0E] text-xs font-black uppercase tracking-wider backdrop-blur-sm shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#F05A22]" />
                <span>{language === "ar" ? "الدورة الثالثة • انطلاقة مستقبلك المهني" : "Édition 2026 • 13–14 Mai • HIS Alger"}</span>
              </div>

              {/* High-Impact Headline */}
              <h1 className="text-2xl sm:text-3.5xl lg:text-4xl xl:text-4.5xl font-black tracking-tight text-white leading-tight">
                {language === "ar" ? (
                  <>165+ فرصة عمل وتربص <span className="text-[#F05A22]">ولقاءات مباشرة</span> مع كبرى الشركات</>
                ) : (
                  <>165+ Opportunités de Stages & Emplois <span className="text-[#F05A22]">En Direct avec les Recruteurs</span></>
                )}
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-white/80 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                {language === "ar"
                  ? "لا تفوت الصالون الأكبر للتوظيف والتدريب في الجزائر. التقي بمسؤولي التوظيف وجهاً لوجه واحصل على بطاقتك الرسمية مجاناً في دقيقة واحدة !"
                  : "Échange en direct avec les recruteurs de plus de 120 entreprises leaders et obtiens ton Pass Badge officiel 100% gratuit par email en 60 secondes."}
              </p>

              {/* Compact 4-Card Stats Bar */}
              <div className="pt-1">
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 grid grid-cols-4 gap-2 text-center divide-x divide-white/10 max-w-xl mx-auto lg:mx-0">
                  <div className="space-y-0.5">
                    <p className="text-lg sm:text-2xl font-black text-[#F05A22]">2 500+</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-white/70 uppercase">{language === "ar" ? "طلبة" : "Talents"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-lg sm:text-2xl font-black text-[#58B9FF]">120+</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-white/70 uppercase">{language === "ar" ? "شركة" : "Entreprises"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-lg sm:text-2xl font-black text-[#FFBD0E]">165+</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-white/70 uppercase">{language === "ar" ? "فرصة" : "Offres"}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-lg sm:text-2xl font-black text-emerald-400">100%</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-white/70 uppercase">{language === "ar" ? "مجاني" : "Gratuit"}</p>
                  </div>
                </div>
              </div>

              {/* Event Coordinates */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-white/70 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#F05A22] animate-ping" />
                  <span>13–14 Mai 2026 (09:00 - 17:00)</span>
                </span>
                <span>•</span>
                <span>HIS University, Alger</span>
              </div>
            </div>

            {/* Right Column (50% Width): Ultra-Compact Registration Form & Badge View */}
            <div className="w-full max-w-lg mx-auto flex items-center justify-center">
              <StudentRegistrationForm
                id="top-form"
                variant="dark"
                submittedStudent={submittedStudent}
                setSubmittedStudent={setSubmittedStudent}
              />
            </div>

          </div>
        </section>

        {/* ── 3. NOUVEAUTÉS DE LA 3E ÉDITION (RIGHT UNDER HERO WITH WHITE BG) ── */}
        <section id="nouveautes-section" className="py-12 md:py-16 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" dir={dir}>
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-[#F05A22] bg-[#F05A22]/10 px-3.5 py-1 rounded-full">
                {language === "ar" ? "مستجدات دورة 2026" : "Nouveautés 2026"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#003876]">
                {language === "ar" ? "لماذا تشارك في هذه الدورة ؟" : "Pourquoi participer à cette édition ?"}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                {language === "ar"
                  ? "برنامج متكامل صمم خصيصاً لمساعدتك على إطلاق مسيرتك المهنية بنجاح."
                  : "Des espaces interactifs et des ateliers conçus pour booster votre employabilité."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: MessageSquare, title: language === "ar" ? "محاضرات ونقاشات" : "Conférences & Débats", desc: language === "ar" ? "مداخلات ملهمة يقدمها كبار قادة الصناعة ورواد الأعمال." : "Des interventions inspirantes par les leaders d'industrie." },
                { icon: Zap, title: language === "ar" ? "لقاءات سريعة مع مسؤولي التوظيف" : "Speed Networking", desc: language === "ar" ? "مقابلات مباشرة وفورية مع مدراء الموارد البشرية ومسؤولي التوظيف." : "Rencontres directes et rapides avec les recruteurs et DRH." },
                { icon: Video, title: language === "ar" ? "استوديو تصوير الـ Pitch" : "Studio Vidéo Pitch", desc: language === "ar" ? "أبرز مهاراتك وسجل فيديو تقديمي احترافي لتقديمه للشركات." : "Valorisez vos compétences et réalisez votre pitch professionnel." },
                { icon: Bot, title: language === "ar" ? "منطقة الذكاء الاصطناعي المهني" : "Zone Carrière IA", desc: language === "ar" ? "حسّن سيرتك الذاتية وتدرّب على مقابلات العمل باستخدام الذكاء الاصطناعي." : "Optimisez votre CV et préparez vos entretiens avec l'IA." },
                { icon: Rocket, title: language === "ar" ? "ركن الشركات الناشئة" : "Coin Startups", desc: language === "ar" ? "اكتشف المشاريع المبتكرة وفرص الانضمام لفرق عمل واعدة." : "Découvrez les projets innovants et les créateurs de demain." },
                { icon: Sparkles, title: language === "ar" ? "بطاقة دخول VIP مع QR Code" : "Pass VIP & Badge QR", desc: language === "ar" ? "دخول سريع ومجاني للصالون بشارتك الرسمية الرقمية." : "Accès fluide et coupe-file avec votre badge officiel scannable." },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#FBF9F6] border border-slate-200/80 rounded-2xl p-4 space-y-2 hover:border-[#F05A22] hover:shadow-md hover:bg-white transition-all group text-start"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#003876]/10 text-[#003876] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <item.icon className="w-5 h-5 text-[#F05A22]" />
                  </div>
                  <h3 className="font-black text-base text-[#003876]">{item.title}</h3>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. NOS SPONSORS 2026 SECTION (RIGHT UNDER NOUVEAUTÉS) ── */}
        <div id="sponsors-section">
          <SponsorsSection />
        </div>

        {/* ── 5. EXPOSANTS DES ÉDITIONS PRÉCÉDENTES (COMPACT LOGO WALL SEPARATED 2025/2024) ── */}
        <section id="exhibitors-section" className="py-12 md:py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PartnerLogoGrid />
          </div>
        </section>

        {/* ── 6. CONFERENCES & WORKSHOPS / SPEAKERS SECTION ── */}
        <section id="speakers-section" className="py-12 sm:py-16 bg-[#FBF9F6] border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2 max-w-3xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-[#F05A22] bg-[#F05A22]/10 px-3.5 py-1 rounded-full">
                {language === "ar" ? "المتحدثون والخبراء" : "Intervenants & Experts"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#003876]">
                {language === "ar" ? "محاضرات وورشات الدورات السابقة" : "Conférences & Ateliers Pratiques"}
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm font-medium">
                Des dirigeants, experts RH et leaders d'industrie qui partagent leurs clés de réussite.
              </p>
            </div>

            {/* Compact High-Density Speaker Grid */}
            <SpeakerFilterGrid />
          </div>
        </section>

        {/* ── 7. PRE-PROGRAM TIMELINE SECTION ── */}
        <div id="program-section">
          <ProgramTimeline />
        </div>

        {/* ── 8. PREVIOUS EDITIONS RECAP VIDEOS ── */}
        <section className="py-12 sm:py-16 bg-white border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
            <div className="space-y-2 max-w-2xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-[#F05A22] bg-[#F05A22]/10 px-3.5 py-1 rounded-full">
                Rétrospective Vidéo
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#003876]">
                {t("editions.title")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
              {/* Recap Video 2025 */}
              <div className="bg-[#0E1B2C] border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg group">
                <div
                  onClick={() => setSelectedRecapVideo({ src: "/video/hft-recap-2025.mp4", title: "Retour sur l'édition 2025", year: "Édition 2025" })}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-slate-900"
                >
                  <video muted loop playsInline className="w-full h-full object-cover opacity-75">
                    <source src="/video/hft-recap-2025.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#F05A22] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-2.5 left-2.5 bg-[#F05A22] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    Édition 2025
                  </span>
                </div>
                <h3 className="text-sm font-black text-white">{t("editions.video1_title")}</h3>
              </div>

              {/* Recap Video 2024 */}
              <div className="bg-[#0E1B2C] border border-white/10 rounded-2xl p-4 space-y-3 shadow-lg group">
                <div
                  onClick={() => setSelectedRecapVideo({ src: "/video/hft-recap-2024.mp4", title: "Retour sur l'édition 2024", year: "Édition 2024" })}
                  className="relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-slate-900"
                >
                  <video muted loop playsInline className="w-full h-full object-cover opacity-75">
                    <source src="/video/hft-recap-2024.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#003876] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-2.5 left-2.5 bg-[#003876] text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    Édition 2024
                  </span>
                </div>
                <h3 className="text-sm font-black text-white">{t("editions.video2_title")}</h3>
              </div>
            </div>
          </div>
        </section>

        {/* ── 9. SECOND REGISTRATION FORM AT THE END OF THE PAGE ── */}
        <section id="register-bottom" className="py-16 sm:py-20 bg-gradient-to-b from-[#0A1424] via-[#0E1B2C] to-[#06101D] text-white relative">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F05A22]/20 border border-[#F05A22]/40 text-[#FFBD0E] text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#F05A22]" />
                <span>{language === "ar" ? "تأكيد الدخول الفوري" : "Pass VIP 100% Gratuit"}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {language === "ar" ? "جاهز لإطلاق مسيرتك المهنية ؟ احجز بطاقتك الآن" : "Prêt à propulser votre carrière ? Réservez votre Pass"}
              </h2>
              <p className="text-white/70 text-xs sm:text-sm font-medium max-w-xl mx-auto">
                {language === "ar"
                  ? "سجل في أقل من دقيقة واحصل على شارة دخولك الرسمية بصيغة PDF مع إرسالها إلى بريدك الإلكتروني."
                  : "Remplissez le formulaire ci-dessous pour recevoir instantanément votre badge d'accès officiel avec QR Code."}
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              <StudentRegistrationForm
                id="bottom-form"
                variant="dark"
                submittedStudent={submittedStudent}
                setSubmittedStudent={setSubmittedStudent}
              />
            </div>

          </div>
        </section>

        {/* ── RECAP VIDEO MODAL ── */}
        {selectedRecapVideo && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              <div className="flex items-center justify-between p-3.5 bg-slate-900 border-b border-white/10 text-white">
                <span className="text-xs font-bold text-[#F05A22] uppercase">{selectedRecapVideo.year}</span>
                <h4 className="text-xs sm:text-sm font-black truncate">{selectedRecapVideo.title}</h4>
                <button onClick={() => setSelectedRecapVideo(null)} className="p-1 rounded-full hover:bg-white/10">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <video autoPlay controls className="w-full h-full">
                  <source src={selectedRecapVideo.src} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        )}

        {/* ── 10. FOOTER ── */}
        <Footer />
      </div>
    </>
  );
}
