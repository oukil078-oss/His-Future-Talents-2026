"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { eventDetails, placeholderMedias, mediaPartners, mediaPartnersDetails, MediaPartner } from "@/lib/eventData";
import PartnerLogoGrid from "@/components/PartnerLogoGrid";
import SpeakerFilterGrid from "@/components/SpeakerFilterGrid";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import CardNav from "@/components/CardNav";
import LivingBackground from "@/components/LivingBackground";
import ProgramTimeline from "@/components/ProgramTimeline";
import SponsorLeadForm from "@/components/SponsorLeadForm";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import DocumentModal from "@/components/DocumentModal";
import MediaCoverage from "@/components/MediaCoverage";
import SponsorsSection from "@/components/SponsorsSection";
import ExhibitorsSection from "@/components/ExhibitorsSection";
import {
  Calendar,
  MapPin,
  Users,
  Briefcase,
  Download,
  Play,
  ArrowRight,
  Tv,
  Award,
  Globe2,
  TrendingUp,
  X,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Target,
  HeartHandshake,
  Building2,
  ExternalLink,
  Film,
  Volume2,
  VolumeX,
} from "lucide-react";

/* ─── Hero Background Layer with Fallback & Reduced Motion ─────────────── */
const HeroBg = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      {!reducedMotion && !videoError ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero/hft-hero-poster.webp"
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setVideoError(true)}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-45 transition-opacity duration-700 pointer-events-none"
        >
          <source src="/video/hft-hero-background.mp4" type="video/mp4" />
        </video>
      ) : (
        <img
          src="/images/hero/hft-hero-poster.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 pointer-events-none"
          loading="eager"
        />
      )}
      {/* Art-directed deep navy gradient overlay for maximum readability & vibrant brand motion */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#003876]/95 via-[#003876]/82 to-[#0E1B2C]/92 pointer-events-none" />
      {/* Subtle vignette gradient at base */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0E1B2C] to-transparent pointer-events-none" />
    </div>
  );
};

/* ─── Refined Countdown Unit (No dark box clutter, large readable orange digits) ─── */
const CountdownUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center justify-center px-3 sm:px-4 py-2 border-r last:border-r-0 border-white/10">
    <span
      className="text-3xl sm:text-4xl md:text-5xl font-black text-[#F05A22] leading-none"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {value.toString().padStart(2, "0")}
    </span>
    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-white/70 mt-1">
      {label}
    </span>
  </div>
);

/* ─── MAIN HOME PAGE COMPONENT ─────────────────────────────────────────────── */
export default function Home() {
  const { t, language, dir } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [counters, setCounters] = useState({ visitors: 0, companies: 0, workshops: 0 });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaPartner | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<"guide" | "sponsoring">("guide");
  const [selectedRecapVideo, setSelectedRecapVideo] = useState<{ src: string; title: string; year: string } | null>(null);

  // Section refs for GSAP entrance animations
  const heroRef     = useRef<HTMLElement>(null);
  const valueRef    = useRef<HTMLElement>(null);
  const whyRef      = useRef<HTMLElement>(null);
  const breakRef    = useRef<HTMLElement>(null);
  const partnersRef = useRef<HTMLElement>(null);
  const mediaRef    = useRef<HTMLElement>(null);
  const speakersRef = useRef<HTMLElement>(null);
  const galleryRef  = useRef<HTMLElement>(null);

  // Authentic HFT Gallery photos from official Future Talents Images archive (WebP format)
  const galleryPhotos = [
    { src: "/brand/gallery/gallery-1.webp", alt: "Salon HFT - Espace Entreprises & Stands" },
    { src: "/brand/gallery/gallery-2.webp", alt: "Entretiens et Sourcing Candidats" },
    { src: "/brand/gallery/gallery-3.webp", alt: "Conférence Officielle & Keynote d'Ouverture HFT" },
    { src: "/brand/gallery/gallery-4.webp", alt: "Workshop Interactif & Session de Formation RH" },
    { src: "/brand/gallery/gallery-5.webp", alt: "Session Pratique & Masterclass Formateurs RH" },
    { src: "/brand/gallery/gallery-6.webp", alt: "Échanges et Rencontres sur les Stands Partenaires" },
    { src: "/brand/gallery/gallery-7.webp", alt: "Présentation des Innovations Écoles" },
    { src: "/brand/gallery/gallery-8.webp", alt: "Cérémonie et Remise des Trophées HFT" },
    { src: "/brand/gallery/gallery-9.webp", alt: "Signature de Partenariats Stratégiques" },
    { src: "/brand/gallery/gallery-10.webp", alt: "Workshops RH et Coaching Carrière" },
    { src: "/brand/gallery/gallery-11.webp", alt: "Atelier de Coaching & Orientation Professionnelle" },
    { src: "/brand/gallery/gallery-12.webp", alt: "Rencontres Recruteurs & Espace Sourcing VIP" },
  ];

  // ── Keyboard Navigation for Lightbox ──
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? galleryPhotos.length - 1 : prev - 1) : null));
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null ? (prev === galleryPhotos.length - 1 ? 0 : prev + 1) : null));
      } else if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, galleryPhotos.length]);

  // ── Keyboard Navigation for Video Modal ──
  useEffect(() => {
    if (!isVideoModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVideoModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVideoModalOpen]);

  // ── Countdown Timer Tick ──
  useEffect(() => {
    const target = new Date(eventDetails.targetDate).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setCountdown({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // ── GSAP Scroll Trigger Animations ──
  useEffect(() => {
    if (!loaded) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll("[data-gsap]").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
      });
      setCounters({ visitors: eventDetails.stats.visitors, companies: eventDetails.stats.companies, workshops: eventDetails.stats.workshops });
      return;
    }

    const sections = [valueRef, whyRef, breakRef, mediaRef, speakersRef, galleryRef];
    sections.forEach((ref) => {
      if (!ref.current) return;
      gsap.from(ref.current.querySelectorAll("[data-gsap]"), {
        y: 20,
        opacity: 0.9,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    });

    // Animated Counter Trigger
    if (valueRef.current) {
      ScrollTrigger.create({
        trigger: valueRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to({}, {
            duration: 2.0,
            ease: "power2.out",
            onUpdate() {
              const p = this.progress();
              setCounters({
                visitors:  Math.floor(p * eventDetails.stats.visitors),
                companies: Math.floor(p * eventDetails.stats.companies),
                workshops: Math.floor(p * eventDetails.stats.workshops),
              });
            },
            onComplete() {
              setCounters({
                visitors:  eventDetails.stats.visitors,
                companies: eventDetails.stats.companies,
                workshops: eventDetails.stats.workshops,
              });
            },
          });
        },
      });
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [loaded]);

  const handleDownload = useCallback((e: React.MouseEvent, docId: "guide" | "sponsoring" = "guide") => {
    e.preventDefault();
    setSelectedDocId(docId);
    setIsDocModalOpen(true);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <>
      {/* Preloader */}
      {!loaded && <Preloader onComplete={handlePreloaderComplete} />}

      <div className="relative min-h-screen bg-[#FBF9F6] text-[#0E1B2C]" dir={dir}>
        {/* Constellation Canvas background */}
        <LivingBackground />

        {/* Rebuilt Header */}
        <CardNav />

        {/* ─────────────────────────────────────────────────────────
            1. HERO SECTION — Complete Visual Composition Rebuild
        ──────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          data-theme="dark"
          className="relative flex items-center pt-24 pb-12 md:pt-28 md:pb-16 lg:pt-24 lg:pb-12 hero-adaptive bg-[#0E1B2C] text-white"
          aria-label="Présentation HIS Future Talents"
        >
          <HeroBg />

          {/* Controlled Brand Motifs in background edges */}
          <div className="absolute top-24 left-6 w-24 md:w-32 opacity-15 pointer-events-none hidden md:block">
            <img src="/brand/motifs/Future Talents Icon Orange-01.png" alt="" className="w-full h-auto" />
          </div>
          <div className="absolute bottom-16 right-6 w-24 md:w-32 opacity-15 pointer-events-none hidden md:block">
            <img src="/brand/motifs/Future Talents Icon Yellow-03.png" alt="" className="w-full h-auto" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              
              {/* Left Column (6 cols): Featured Video Player Container (Web Summit Inspiration) */}
              <div className="lg:col-span-6 w-full min-h-0" data-gsap>
                <div
                  onClick={() => setIsVideoModalOpen(true)}
                  className="relative rounded-3xl overflow-hidden border border-white/20 bg-[#001E3D] shadow-2xl group transition-all duration-500 hover:border-white/30 flex flex-col justify-between h-full min-h-[420px] lg:min-h-[560px] cursor-pointer"
                >
                  {/* Video Background / Featured Video Player */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster="/images/hero/hft-hero-poster.webp"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                    >
                      <source src="/video/hft-hero-background.mp4" type="video/mp4" />
                    </video>
                    {/* Video Dark Overlay for cinematic depth & typography contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2C]/95 via-[#0E1B2C]/30 to-black/40" />
                  </div>

                  {/* Top Bar inside Video Card */}
                  <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F05A22] text-white text-xs font-black uppercase tracking-wider shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      {language === "ar" ? "الدورة السابقة" : "Édition précédente"}
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                      Vidéo HD • 02:15
                    </span>
                  </div>

                  {/* Play Button Center Trigger */}
                  <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsVideoModalOpen(true);
                      }}
                      aria-label="Regarder la vidéo officielle"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 border-2 border-white/40 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-[#F05A22] group-hover:border-[#F05A22] transition-all duration-300 shadow-2xl group/btn cursor-pointer"
                    >
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-white text-white ms-1 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <span className="mt-3 text-xs font-black uppercase tracking-widest text-white/90 drop-shadow-md">
                      {language === "ar" ? "شاهد الفيديو الرسمي" : "Voir le film officiel"}
                    </span>
                  </div>

                  {/* Bottom Caption inside Video Card */}
                  <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-[#0E1B2C] via-[#0E1B2C]/90 to-transparent border-t border-white/10 text-start">
                    <p className="text-xs font-black uppercase tracking-widest text-[#58B9FF]">
                      {language === "ar" ? "المعهد العالي للعلوم — HIS University" : "Higher Institute of Sciences"}
                    </p>
                    <p className="text-sm sm:text-base font-extrabold text-white mt-1 leading-snug">
                      {language === "ar"
                        ? "أبرز لحظات ومحطات الصالون الوطني للتوظيف والشراكات"
                        : "Retour en images sur les temps forts du salon et la rencontre des décideurs RH"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column (6 cols): Structured Information Card (Web Summit Inspiration) */}
              <div className="lg:col-span-6 w-full min-h-0" data-gsap>
                <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#002855]/95 via-[#003876]/90 to-[#0E1B2C]/95 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-5 text-start">
                  
                  {/* Visual Header Strip inside Right Card (like Web Summit top banner photo) */}
                  <div className="relative h-20 sm:h-24 w-full rounded-2xl overflow-hidden border border-white/12 shadow-inner group/banner">
                    <img
                      src="/brand/event2/event_photo_1.webp"
                      alt="HIS Future Talents"
                      className="w-full h-full object-cover group-hover/banner:scale-105 transition-transform duration-500 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#002855]/85 via-transparent to-[#0E1B2C]/90" />
                    <div className="absolute inset-0 flex items-center px-4 justify-between">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                        {language === "ar" ? "الصالون المرجعي للتوظيف" : "Salon de recrutement & B2B"}
                      </span>
                      <span className="text-[11px] font-extrabold text-[#58B9FF] bg-[#003876]/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#58B9FF]/30">
                        2026
                      </span>
                    </div>
                  </div>

                  {/* Welcome Line requested by User */}
                  <p className="text-xs sm:text-sm font-black text-[#58B9FF] tracking-wide uppercase">
                    {language === "ar"
                      ? "مرحباً بكم في HIS Future Talents الدورة 3"
                      : "Bienvenue à HIS Future Talents 3ème édition"}
                  </p>

                  {/* Main H1 Headline */}
                  <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-black leading-snug tracking-tight text-white">
                    {language === "ar"
                      ? "اربطوا مؤسستكم بنخبة الكفاءات التي تصنع المستقبل"
                      : "Connectez votre entreprise aux talents qui façonneront demain"}
                  </h1>

                  {/* Subtitle / Paragraph */}
                  <p className="text-white/85 text-xs sm:text-sm leading-relaxed font-medium">
                    {language === "ar"
                      ? "المنصة الوطنية المرجعية للتوظيف، الشراكات المهنية، الورشات التطبيقية والتبادل المباشر بين قادة المؤسسات وخريجي المعهد العالي للعلوم."
                      : "Le rendez-vous annuel incontournable reliant les recruteurs et décideurs RH aux diplômés et jeunes talents à haute valeur ajoutée."}
                  </p>

                  {/* Information Rail */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 border-y border-white/12 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#58B9FF] shrink-0" />
                      <div>
                        <span className="block text-[9px] font-black uppercase text-white/50">Date</span>
                        <span className="text-xs font-bold text-white">29 Sept. 2026</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#58B9FF] shrink-0" />
                      <div>
                        <span className="block text-[9px] font-black uppercase text-white/50">Lieu</span>
                        <span className="text-xs font-bold text-white">HIS Univ, Alger</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#58B9FF] shrink-0" />
                      <div>
                        <span className="block text-[9px] font-black uppercase text-white/50">Audience</span>
                        <span className="text-xs font-bold text-white">1 000 Candidats</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#58B9FF] shrink-0" />
                      <div>
                        <span className="block text-[9px] font-black uppercase text-white/50">Entreprises</span>
                        <span className="text-xs font-bold text-white">45 Partenaires</span>
                      </div>
                    </div>
                  </div>

                  {/* Countdown Box */}
                  <div
                    className="space-y-1.5 pt-1"
                    role="timer"
                    aria-label={`Compte à rebours: ${countdown.days} jours, ${countdown.hours} heures, ${countdown.minutes} minutes`}
                  >
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/60">
                      {language === "ar" ? "يبدأ الصالون خلال" : "Le salon commence dans"}
                    </p>
                    <div className="inline-flex bg-white/10 border border-white/15 rounded-2xl p-1.5 backdrop-blur-md shadow-inner">
                      <CountdownUnit value={countdown.days} label={t("hero.days")} />
                      <CountdownUnit value={countdown.hours} label={t("hero.hours")} />
                      <CountdownUnit value={countdown.minutes} label={t("hero.minutes")} />
                      <CountdownUnit value={countdown.seconds} label={t("hero.seconds")} />
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 pt-2 w-full max-w-full">
                    <a
                      href="#contact-form"
                      className="inline-flex items-center justify-center gap-3 min-h-[52px] px-6 py-3 rounded-2xl bg-[#F05A22] text-white font-black text-sm tracking-wide hover:bg-[#FFBD0E] hover:text-[#0E1B2C] transition-all duration-300 shadow-xl shadow-[#F05A22]/30 hover:-translate-y-0.5 focus:outline-none shrink-0"
                    >
                      <span className="whitespace-nowrap">{t("common.cta_partner")}</span>
                      <ArrowRight className={`w-4 h-4 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
                    </a>
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-4 py-3 rounded-2xl bg-white/15 border-2 border-white/30 text-white font-black text-xs sm:text-sm tracking-wide hover:bg-white/25 hover:border-white/50 transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 focus:outline-none w-full xl:w-auto xl:flex-1 min-w-0 text-center cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-white shrink-0" />
                      <span className="leading-tight text-center block break-words">{t("common.download_dossier")}</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            2. EVENT INTRODUCTION — Asymmetric Editorial Layout
        ──────────────────────────────────────────────────────────── */}
        <section
          id="value-section"
          ref={valueRef}
          className="relative py-16 md:py-24 section-compact bg-white border-t border-[#003876]/08"
        >
          {/* Full-Color Brand Motif in whitespace */}
          <div className="absolute top-10 right-6 w-28 md:w-36 opacity-90 drop-shadow-md pointer-events-none select-none hidden lg:block" aria-hidden="true">
            <img src="/brand/motifs/Future Talents Icon Blue-01.png" alt="" className="w-full h-auto" />
          </div>
          <div className="absolute bottom-10 left-6 w-28 md:w-36 opacity-90 drop-shadow-md pointer-events-none select-none hidden lg:block" aria-hidden="true">
            <img src="/brand/motifs/Future Talents Icon Orange-05.png" alt="" className="w-full h-auto" />
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Photo Collage Column (5 cols) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4 relative" data-gsap>
                <div className="col-span-2 rounded-2xl overflow-hidden border border-slate-100 shadow-md aspect-[16/10] bg-slate-100">
                  <img
                    src="/brand/event2/event_photo_1.jpg"
                    alt="HIS Future Talents - Espace Recrutement"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-md aspect-square bg-slate-100 group/img relative">
                  <img
                    src="/brand/event2/value_photo_2.jpg"
                    alt="Visiteurs et Candidats HIS Future Talents"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Flux Candidats & Sourcing</span>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-md aspect-square bg-slate-100 group/img relative">
                  <img
                    src="/brand/event2/value_photo_3.jpg"
                    alt="Stand SATIM - Sponsor Officiel HIS Future Talents"
                    className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-end p-2.5">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Stand SATIM Sponsor</span>
                  </div>
                </div>
              </div>

              {/* Text Column (7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-start relative">
                <div data-gsap>
                  <p className="text-xs font-black uppercase tracking-widest text-[#003876] mb-2">
                    {t("value.eyebrow")}
                  </p>
                  <h2 className="text-3xl md:text-5xl font-black text-[#003876] leading-tight tracking-tight">
                    {t("value.title")}
                  </h2>
                </div>

                <div data-gsap className="space-y-4">
                  <p className="text-slate-700 text-base md:text-lg leading-relaxed font-semibold">
                    {t("value.subtitle")}
                  </p>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                    {language === "ar"
                      ? "يجمع صالون HIS Future Talents بين نخبة الخريجين، الطلبة المتفوقين في المعهد العالي للعلوم وأبرز مسيري الموارد البشرية والشركات الرائدة لبناء شراكات توظيف واستقطاب كفاءات مستدامة."
                      : "Le salon HIS Future Talents est le pont stratégique reliant les talents émergents issus de formations d'excellence aux entreprises partenaires désireuses de renforcer leur capital humain."}
                  </p>
                </div>

                {/* Verified Edition 2 Metrics Anchor with Directional Orange Motif */}
                <div data-gsap className="border-t border-slate-100 pt-6 grid grid-cols-3 gap-4 relative">
                  <div className="absolute -top-3 -right-6 w-14 h-14 opacity-20 pointer-events-none select-none hidden md:block" aria-hidden="true">
                    <img src="/brand/motifs/Future Talents Icon Orange-07.png" alt="" className="w-full h-auto" />
                  </div>
                  <div className="bg-[#FBF9F6] p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="block text-3xl md:text-4xl font-black text-[#003876]">
                      +{counters.visitors}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-1 block">
                      {t("value.stat_visitors")}
                    </span>
                  </div>
                  <div className="bg-[#FBF9F6] p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="block text-3xl md:text-4xl font-black text-[#003876]">
                      +{counters.companies}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-1 block">
                      {t("value.stat_companies")}
                    </span>
                  </div>
                  <div className="bg-[#FBF9F6] p-4 rounded-2xl border border-slate-200 text-center">
                    <span className="block text-3xl md:text-4xl font-black text-[#F05A22]">
                      {counters.workshops}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mt-1 block">
                      {t("value.stat_workshops")}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            3. MEDIA COVERAGE — "Ils ont couvert HIS Future Talents"
        ──────────────────────────────────────────────────────────── */}
        <MediaCoverage />

        {/* ─────────────────────────────────────────────────────────
            4. SPONSORS SECTION — "Nos sponsors"
        ──────────────────────────────────────────────────────────── */}
        <SponsorsSection />

        {/* ─────────────────────────────────────────────────────────
            5. EXHIBITORS SECTION — "Les exposants des éditions précédentes"
        ──────────────────────────────────────────────────────────── */}
        <ExhibitorsSection />

        {/* ─────────────────────────────────────────────────────────
            4. EDITION 3 — Flagship Storytelling (High Contrast Moment)
        ──────────────────────────────────────────────────────────── */}
        <section
          id="edition3-section"
          data-theme="dark"
          className="relative py-16 md:py-24 section-compact bg-[#003876] text-white overflow-hidden"
        >
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
            <div className="absolute inset-0 bg-gradient-to-r from-[#003876]/95 via-[#002855]/90 to-[#0E1B2C]/95" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2C] via-transparent to-[#003876]/80" />
          </div>

          {/* Subtle background motif overlays */}
          <div className="absolute top-10 left-6 w-32 h-32 opacity-10 pointer-events-none" aria-hidden="true">
            <img src="/brand/motifs/Future Talents Icon Orange-01.png" alt="" className="w-full h-auto" />
          </div>
          <div className="absolute bottom-10 right-6 w-32 h-32 opacity-10 pointer-events-none" aria-hidden="true">
            <img src="/brand/motifs/Future Talents Icon Yellow-03.png" alt="" className="w-full h-auto" />
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-[#F05A22] text-white">
                {language === "ar" ? "رؤية دورة 2026" : "Vision Édition 2026"}
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                {language === "ar"
                  ? "الدورة 3: قفزة نوعية في ربط الكفاءات بالمؤسسات"
                  : "Édition 3 : L'Évolution Stratégique de HFT"}
              </h2>
              <p className="text-white/80 text-base md:text-lg leading-relaxed font-medium">
                {language === "ar"
                  ? "تضع الدورة الثالثة معايير جديدة للتعاون بين الجامعة والمؤسسات، مع برامج توظيف مخصصة ورعاية عالية المستوى."
                  : "L'Édition 3 élève les standards d'accompagnement et multiplie les opportunités de synergie entre l'écosystème éducatif et économique."}
              </p>
            </div>

            {/* Dual Perspective Split: Talents vs Companies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Perspective 1: Young Talents */}
              <div className="bg-white/10 border border-white/15 rounded-3xl p-8 space-y-6 flex flex-col justify-between text-start">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#58B9FF]/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#58B9FF]" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {language === "ar" ? "للطلبة والشباب المتطلعين" : "Pour les Étudiants & Jeunes Talents"}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed font-normal">
                    {language === "ar"
                      ? "تواصل مباشر مع مسؤولي التوظيف، ورشات عمل لتطوير المهارات، وعروض تربص وتوظيف سريعة."
                      : "Accédez directement aux recruteurs clés, bénéficiez de coaching de carrière et décrochez des opportunités de stages et de premier emploi."}
                  </p>
                  <ul className="space-y-3 text-sm text-white/90 font-semibold pt-2">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-[#58B9FF] shrink-0" />
                      <span>{language === "ar" ? "مقابلات توظيف مباشرة مع قادة HR" : "Entretiens de recrutement directs"}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-[#58B9FF] shrink-0" />
                      <span>{language === "ar" ? "ورشات تدريبية متخصصة ومرافقة" : "Ateliers pratiques et aide au CV"}</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-[#58B9FF] shrink-0" />
                      <span>{language === "ar" ? "فرص حصرية للتربص والتوظيف" : "Offres exclusives de stages & emploi"}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Perspective 2: Companies / Employers */}
              <div className="bg-white/10 border border-white/15 rounded-3xl p-8 space-y-6 flex flex-col justify-between text-start">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#F05A22]/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-[#F05A22]" />
                  </div>
                  <h3 className="text-2xl font-black text-white">
                    {language === "ar" ? "للمؤسسات والشركاء الرعاة" : "Pour les Entreprises & Recruteurs"}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base leading-relaxed font-medium">
                    {language === "ar"
                      ? "استقطاب مباشر لأفضل خريجي المعهد العالي للعلوم وتأكيد حضور علامتكم التجارية كرب عمل مرجعي."
                      : "Sourcez vos futurs collaborateurs parmi l'élite académique et renforcez votre visibilité de marque employeur auprès des jeunes talents."}
                  </p>
                  <ul className="space-y-3.5 text-sm text-white/95 font-semibold pt-2">
                    <li className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-[#F05A22] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-white block">
                          {language === "ar" ? "استقطاب كفاءات الغد" : "Attirez les talents de demain"}
                        </span>
                        <span className="text-xs text-white/70 font-normal">
                          {language === "ar" ? "مقابلات توظيف مباشرة وسورسينغ مخصص للكفاءات" : "Recrutement direct & sourcing auprès des futurs diplômés"}
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Globe2 className="w-5 h-5 text-[#58B9FF] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-white block">
                          {language === "ar" ? "الظهور والانتشار للعلامة التجارية" : "Visibilité de Marque"}
                        </span>
                        <span className="text-xs text-white/70 font-normal">
                          {language === "ar" ? "تغطية إعلامية وظهور استثنائي عبر كافة الوسائط" : "Rayonnement national sur nos supports et médias"}
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <HeartHandshake className="w-5 h-5 text-[#F05A22] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-white block">
                          {language === "ar" ? "المسؤولية المجتمعية للمؤسسة (RSE)" : "Responsabilité RSE"}
                        </span>
                        <span className="text-xs text-white/70 font-normal">
                          {language === "ar" ? "دعم إدماج الشباب وتجسيد الالتزام المجتمعي" : "Engagement sociétal actif pour l'employabilité des jeunes"}
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-[#58B9FF] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-white block">
                          {language === "ar" ? "تعزيز العلامة التجارية كجهة عمل" : "Marque Employeur"}
                        </span>
                        <span className="text-xs text-white/70 font-normal">
                          {language === "ar" ? "ترسيخ مكانة مؤسستكم كوجهة مفضلة للمواهب" : "Positionnement d'employeur de choix auprès des talents"}
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#F05A22] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-white block">
                          {language === "ar" ? "شبكة علاقات B2B حصرية" : "Réseau B2B Exclusif"}
                        </span>
                        <span className="text-xs text-white/70 font-normal">
                          {language === "ar" ? "تواصل حصيري مع 45+ من صناع القرار والمدراء" : "Rencontres VIP et synergies avec 45+ dirigeants d'entreprises"}
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            5. WHY PARTNER / SPONSORSHIP SECTION — Structured B2B Categories
        ──────────────────────────────────────────────────────────── */}
        <section
          id="why-section"
          ref={whyRef}
          className="relative py-16 md:py-24 section-compact bg-white"
        >
          {/* Full-Color Brand Motifs */}
          <div className="absolute top-10 right-6 w-28 md:w-36 opacity-90 drop-shadow-md pointer-events-none select-none hidden lg:block" aria-hidden="true">
            <img src="/brand/motifs/Future Talents Icon Blue-04.png" alt="" className="w-full h-auto" />
          </div>
          <div className="absolute bottom-10 left-6 w-28 md:w-36 opacity-90 drop-shadow-md pointer-events-none select-none hidden lg:block" aria-hidden="true">
            <img src="/brand/motifs/Future Talents Icon Orange-02.png" alt="" className="w-full h-auto" />
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div data-gsap className="text-center max-w-3xl mx-auto mb-16">
              <p className="text-xs font-black uppercase tracking-widest text-[#003876] mb-2">
                {t("why.eyebrow")}
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-[#003876] tracking-tight">
                {t("why.title")}
              </h2>
            </div>

            {/* 5 Structured B2B Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  title: language === "ar" ? "استقطاب كفاءات الغد" : "Attirez les talents de demain",
                  badge: language === "ar" ? "توظيف مباشر" : "Sourcing & Recrutement",
                  desc: language === "ar"
                    ? "استقطبوا ووظفوا كفاءات المستقبل من بين جيل جديد من طلبة وخريجي المعهد العالي للعلوم والتخصصات الواعدة."
                    : "Identifiez et recrutez en direct l'élite des diplômés et jeunes talents hautement qualifiés pour vos équipes.",
                  icon: <Target className="w-6 h-6 text-[#F05A22]" />,
                  accentBorder: "hover:border-[#F05A22]/40",
                  badgeBg: "bg-[#F05A22]/10 text-[#F05A22] border-[#F05A22]/20",
                },
                {
                  title: language === "ar" ? "الظهور والانتشار للعلامة التجارية" : "Visibilité de Marque",
                  badge: language === "ar" ? "حضور وطني" : "Rayonnement Média",
                  desc: language === "ar"
                    ? "احصلوا على حضور استثنائي وانتشار واسع لعلامتكم التجارية عبر الوسائط الإعلامية والدعاية الرقمية للفعالية."
                    : "Bénéficiez d'un rayonnement exceptionnel sur nos supports d'exposition, médias nationaux et canaux digitaux.",
                  icon: <Globe2 className="w-6 h-6 text-[#003876]" />,
                  accentBorder: "hover:border-[#003876]/40",
                  badgeBg: "bg-[#003876]/10 text-[#003876] border-[#003876]/20",
                },
                {
                  title: language === "ar" ? "المسؤولية المجتمعية للمؤسسة (RSE)" : "Responsabilité RSE",
                  badge: language === "ar" ? "التزام مجتمعي" : "Impact Sociétal",
                  desc: language === "ar"
                    ? "جسدوا التزام مؤسستكم بالمسؤولية المجتمعية من خلال الدعم الفعلي لتوظيف وإدماج الكفاءات الشابة."
                    : "Concrétisez vos engagements sociétaux en soutenant l'insertion professionnelle et l'employabilité de la jeunesse.",
                  icon: <HeartHandshake className="w-6 h-6 text-[#F05A22]" />,
                  accentBorder: "hover:border-[#F05A22]/40",
                  badgeBg: "bg-[#F05A22]/10 text-[#F05A22] border-[#F05A22]/20",
                },
                {
                  title: language === "ar" ? "تعزيز العلامة التجارية كجهة عمل" : "Marque Employeur",
                  badge: language === "ar" ? "بيئة عمل مفضلة" : "Employeur de Choix",
                  desc: language === "ar"
                    ? "ابرزوا ثقافة مؤسستكم وفرص النمو المهني لترسيخ مكانتكم كبيئة العمل الأولى المفضلة لدى الكفاءات."
                    : "Valorisez votre culture d'entreprise et affirmez votre statut d'employeur préféré des jeunes diplômés.",
                  icon: <Award className="w-6 h-6 text-[#003876]" />,
                  accentBorder: "hover:border-[#003876]/40",
                  badgeBg: "bg-[#003876]/10 text-[#003876] border-[#003876]/20",
                },
                {
                  title: language === "ar" ? "شبكة علاقات B2B حصرية" : "Réseau B2B Exclusif",
                  badge: language === "ar" ? "لقاءات VIP" : "Synergies & Partenariats",
                  desc: language === "ar"
                    ? "تواصلوا مباشرة مع صناع القرار ومسؤولي التوظيف في أزيد من 45 مؤسسة عارضة لبناء شراكات استراتيجية."
                    : "Échangez avec les décideurs RH, dirigeants et leaders d'entreprises partenaires pour créer des synergies d'affaires.",
                  icon: <Building2 className="w-6 h-6 text-[#F05A22]" />,
                  accentBorder: "hover:border-[#F05A22]/40",
                  badgeBg: "bg-[#F05A22]/10 text-[#F05A22] border-[#F05A22]/20",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  data-gsap
                  className={`bg-[#FBF9F6] border border-slate-200/90 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl ${item.accentBorder} transition-all duration-300 group text-start ${
                    idx === 4 ? "md:col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${item.badgeBg}`}>
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#003876] tracking-tight group-hover:text-[#F05A22] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            5b. INTERMEDIATE B2B CTA BANNER (Between Why & Program)
        ──────────────────────────────────────────────────────────── */}
        <section className="relative py-12 md:py-16 bg-[#FBF9F6] border-b border-[#003876]/08">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-[#001E3D] border border-white/20 p-8 sm:p-12 lg:p-14 text-white shadow-2xl text-start group">
              
              {/* Background Video */}
              <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/images/hero/hft-hero-poster.webp"
                  className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000 group-hover:scale-110"
                >
                  <source src="/video/hft-hero-background.mp4" type="video/mp4" />
                </video>
                {/* Dark Navy Gradient Overlay for high text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#001E3D]/95 via-[#002855]/85 to-[#0E1B2C]/90" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2C]/90 via-transparent to-[#001E3D]/70" />
              </div>

              {/* Background ambient lighting and brand motif */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#F05A22]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#58B9FF]/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 right-8 -translate-y-1/2 w-48 h-48 opacity-10 pointer-events-none hidden lg:block" aria-hidden="true">
                <img src="/brand/motifs/Future Talents Icon Orange-01.png" alt="" className="w-full h-auto" />
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Text Block (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F05A22] text-white text-xs font-black uppercase tracking-wider shadow-md">
                    <TrendingUp className="w-4 h-4 text-white" />
                    {language === "ar" ? "فرصة الشراكة والاستقطاب" : "Opportunité Partenaires & Recruteurs"}
                  </span>
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight text-white max-w-2xl">
                    {language === "ar"
                      ? "هل أنت مستعد لتعزيز هويتك كجهة عمل واستقطاب نخبة الكفاءات؟"
                      : "Prêt à propulser votre marque employeur et recruter l'élite ?"}
                  </h2>
                  
                  <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium max-w-2xl">
                    {language === "ar"
                      ? "احجز جناحك الآن في صالون HIS Future Talents الدورة 3 واحصل على وصول حصري لأكثر من 1 000 خريج وطالب متميز."
                      : "Réservez dès aujourd'hui votre emplacement au salon HIS Future Talents Édition 3 et bénéficiez d'un accès privilégié aux 1 000+ diplômés et jeunes talents à haute valeur ajoutée."}
                  </p>
                </div>

                {/* Right Action Buttons (4 cols) */}
                <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-end w-full max-w-full">
                  <a
                    href="#contact-form"
                    className="inline-flex items-center justify-center gap-3 min-h-[52px] px-6 py-3 rounded-2xl bg-[#F05A22] text-white font-black text-sm sm:text-base tracking-wide hover:bg-[#FFBD0E] hover:text-[#0E1B2C] transition-all duration-300 shadow-xl shadow-[#F05A22]/30 hover:-translate-y-0.5 focus:outline-none w-full sm:flex-1 lg:w-full text-center cursor-pointer"
                  >
                    <span className="whitespace-nowrap">{t("common.cta_partner")}</span>
                    <ArrowRight className={`w-5 h-5 shrink-0 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  </a>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center gap-2.5 min-h-[52px] px-5 py-3 rounded-2xl bg-white/15 border-2 border-white/30 text-white font-black text-xs sm:text-sm tracking-wide hover:bg-white/25 hover:border-white/50 transition-all duration-300 backdrop-blur-md hover:-translate-y-0.5 focus:outline-none w-full sm:flex-1 lg:w-full text-center cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-white shrink-0" />
                    <span className="leading-tight text-center block break-words">{t("common.download_dossier")}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            6. PROGRAM TIMELINE
        ──────────────────────────────────────────────────────────── */}
        <ProgramTimeline />



        {/* ─────────────────────────────────────────────────────────
            8. SPEAKERS & WORKSHOPS
        ──────────────────────────────────────────────────────────── */}
        <section
          id="speakers-section"
          ref={speakersRef}
          className="relative py-16 md:py-24 section-compact bg-white"
        >
          {/* Full-Color Brand Motif */}
          <div className="absolute top-10 left-8 w-28 md:w-36 opacity-90 drop-shadow-md pointer-events-none select-none hidden lg:block" aria-hidden="true">
            <img src="/brand/motifs/Future Talents Icon Blue-06.png" alt="" className="w-full h-auto" />
          </div>
          <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
            <div data-gsap className="max-w-3xl mx-auto mb-12">
              <p className="text-xs font-black uppercase tracking-widest text-[#003876] mb-2">
                {t("marquee.speakers")}
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-[#003876] tracking-tight">
                {t("marquee.speakers")}
              </h2>
            </div>

            <SpeakerFilterGrid />
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────
            9. GALLERY — Authentic HFT Event Photography with Lightbox
        ──────────────────────────────────────────────────────────── */}
        <section
          id="editions-section"
          ref={galleryRef}
          className="relative py-16 md:py-24 section-compact bg-[#FBF9F6] border-t border-[#003876]/08"
        >
          {/* Full-Color Orange Accent Motif */}
          <div className="absolute top-10 right-8 w-28 md:w-36 opacity-90 drop-shadow-md pointer-events-none select-none hidden lg:block" aria-hidden="true">
            <img src="/brand/motifs/Future Talents Icon Orange-03.png" alt="" className="w-full h-auto" />
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div data-gsap className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-xs font-black uppercase tracking-widest text-[#003876] mb-2">
                {t("editions.title")}
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-[#003876] tracking-tight">
                {t("editions.title")}
              </h2>
            </div>

            {/* ── 2 LIVE RECAP VIDEO SHOWCASE CARDS (2025 & 2024) ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Live Video Card 1: Edition 2025 */}
              <div
                data-gsap
                className="relative rounded-3xl overflow-hidden bg-[#0E1B2C] border-2 border-white/20 shadow-2xl group min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 text-white transition-all duration-500 hover:border-[#F05A22]/80 hover:shadow-[0_20px_50px_rgba(240,90,34,0.25)]"
              >
                {/* Background Live Loop Video */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-55 scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                  >
                    <source src="/video/hft-recap-2025.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2C] via-[#0E1B2C]/70 to-[#002855]/60" />
                </div>

                {/* Top Header Badge */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F05A22] text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-[#F05A22]/40">
                    <Film className="w-3.5 h-3.5" />
                    Édition 2025
                  </span>
                  <span className="text-[11px] font-black text-white/80 uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    Live Motion HD
                  </span>
                </div>

                {/* Center Play Sound Trigger Button */}
                <div className="relative z-10 my-auto py-8 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedRecapVideo({
                      src: "/video/hft-recap-2025.mp4",
                      title: language === "ar" ? "الفيديو التلخيصي الرسمي — HIS Future Talents 2025" : "Rétrospective Officielle — HIS Future Talents 2025",
                      year: "2025"
                    })}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#F05A22] hover:bg-[#FFBD0E] text-white hover:text-[#0E1B2C] shadow-[0_0_40px_rgba(240,90,34,0.6)] transition-all duration-300 transform group-hover:scale-110 cursor-pointer relative"
                  >
                    <span className="absolute inset-0 rounded-full bg-[#F05A22] animate-ping opacity-40 pointer-events-none" />
                    <Play className="w-9 h-9 fill-current ms-1" />
                  </button>
                </div>

                {/* Bottom Title & Action */}
                <div className="relative z-10 space-y-3 border-t border-white/15 pt-5">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    {language === "ar" ? "الملخص الفيديوي للدورة الثانية 2025" : "Rétrospective Vidéo — Édition 2025"}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed">
                    {language === "ar"
                      ? "استعيدوا أجواء اللقاءات والفرص التي شهدتها الدورة الثانية بمركب المعهد العالي للعلوم."
                      : "Revivez l'atmosphère vibrante, les recrutements et les échanges forts de la 2e édition sur le campus HIS."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedRecapVideo({
                      src: "/video/hft-recap-2025.mp4",
                      title: language === "ar" ? "الفيديو التلخيصي الرسمي — HIS Future Talents 2025" : "Rétrospective Officielle — HIS Future Talents 2025",
                      year: "2025"
                    })}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#58B9FF] hover:text-[#FFBD0E] transition-colors cursor-pointer pt-1"
                  >
                    <span>{language === "ar" ? "مشاهدة التقرير بالصوت الكامل" : "Regarder avec son en plein écran"}</span>
                    <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Live Video Card 2: Edition 2024 */}
              <div
                data-gsap
                className="relative rounded-3xl overflow-hidden bg-[#0E1B2C] border-2 border-white/20 shadow-2xl group min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-6 sm:p-8 text-white transition-all duration-500 hover:border-[#58B9FF]/80 hover:shadow-[0_20px_50px_rgba(88,185,255,0.25)]"
              >
                {/* Background Live Loop Video */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-55 scale-105 group-hover:scale-110 transition-transform duration-1000 ease-out"
                  >
                    <source src="/video/hft-recap-2024.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2C] via-[#0E1B2C]/70 to-[#003876]/60" />
                </div>

                {/* Top Header Badge */}
                <div className="relative z-10 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#003876] text-white text-xs font-black uppercase tracking-widest border border-white/20 shadow-lg">
                    <Film className="w-3.5 h-3.5" />
                    Édition 2024
                  </span>
                  <span className="text-[11px] font-black text-white/80 uppercase tracking-widest bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    Live Motion HD
                  </span>
                </div>

                {/* Center Play Sound Trigger Button */}
                <div className="relative z-10 my-auto py-8 text-center">
                  <button
                    type="button"
                    onClick={() => setSelectedRecapVideo({
                      src: "/video/hft-recap-2024.mp4",
                      title: language === "ar" ? "الفيديو التلخيصي الرسمي — HIS Future Talents 2024" : "Rétrospective Officielle — HIS Future Talents 2024",
                      year: "2024"
                    })}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#003876] hover:bg-[#F05A22] text-white shadow-[0_0_40px_rgba(0,56,118,0.6)] transition-all duration-300 transform group-hover:scale-110 cursor-pointer relative border border-white/30"
                  >
                    <span className="absolute inset-0 rounded-full bg-[#58B9FF] animate-ping opacity-40 pointer-events-none" />
                    <Play className="w-9 h-9 fill-current ms-1" />
                  </button>
                </div>

                {/* Bottom Title & Action */}
                <div className="relative z-10 space-y-3 border-t border-white/15 pt-5">
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    {language === "ar" ? "الملخص الفيديوي للدورة الأولى 2024" : "Rétrospective Vidéo — Édition 2024"}
                  </h3>
                  <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed">
                    {language === "ar"
                      ? "اكتشفوا انطلاقة المعرض والأجواء الحماسية لمشاريع وورشات التوظيف الأولى."
                      : "Découvrez le lancement fondateur du salon et les premiers grands ateliers d'insertion."}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedRecapVideo({
                      src: "/video/hft-recap-2024.mp4",
                      title: language === "ar" ? "الفيديو التلخيصي الرسمي — HIS Future Talents 2024" : "Rétrospective Officielle — HIS Future Talents 2024",
                      year: "2024"
                    })}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#58B9FF] hover:text-[#FFBD0E] transition-colors cursor-pointer pt-1"
                  >
                    <span>{language === "ar" ? "مشاهدة التقرير بالصوت الكامل" : "Regarder avec son en plein écran"}</span>
                    <ArrowRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lightbox Modal with Left & Right Arrows + Keyboard Nav (Clean - No text on pictures) */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-8 select-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all focus:outline-none z-30"
              aria-label="Fermer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Photo Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-white/80 text-xs font-black uppercase tracking-widest bg-white/10 px-5 py-2 rounded-full backdrop-blur-md border border-white/15 z-20">
              {lightboxIndex + 1} / {galleryPhotos.length}
            </div>

            {/* Left Navigation Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev === 0 ? galleryPhotos.length - 1 : prev - 1) : null));
              }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#F05A22] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 shadow-xl focus:outline-none z-30 hover:scale-105"
              aria-label="Photo précédente"
            >
              <ChevronLeft className="w-7 h-7 md:w-8 md:h-8" />
            </button>

            {/* Main Lightbox Image (Clean - No text overlay) */}
            <div className="relative max-w-full max-h-[85vh] md:max-h-[88vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={galleryPhotos[lightboxIndex].src}
                alt=""
                className="max-w-full max-h-[85vh] md:max-h-[88vh] object-contain rounded-2xl shadow-2xl transition-all duration-300"
              />
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev !== null ? (prev === galleryPhotos.length - 1 ? 0 : prev + 1) : null));
              }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#F05A22] text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-300 shadow-xl focus:outline-none z-30 hover:scale-105"
              aria-label="Photo suivante"
            >
              <ChevronRight className="w-7 h-7 md:w-8 md:h-8" />
            </button>
          </div>
        )}

        {/* Video Lightbox Modal with Full Volume & Smooth Opening/Closing Animations */}
        <AnimatePresence>
          {isVideoModalOpen && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4 md:p-8 select-none"
              onClick={() => setIsVideoModalOpen(false)}
            >
              {/* Close Button with Fade & Scale Entrance */}
              <motion.button
                initial={{ opacity: 0, scale: 0.7, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: -10 }}
                transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-6 right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors focus:outline-none z-30 hover:scale-105"
                aria-label="Fermer la vidéo"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Video Player Container with Cinematic Zoom & Spring Elastic Entrance */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 24 }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  autoPlay
                  controls
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain"
                  ref={(el) => {
                    if (el) {
                      el.muted = false;
                      el.volume = 1;
                      el.play().catch(() => {});
                    }
                  }}
                >
                  <source src="/video/hft-hero-background.mp4" type="video/mp4" />
                  {language === "ar" ? "متصفحك لا يدعم تشغيل الفيديو." : "Votre navigateur ne prend pas en charge la lecture de vidéos."}
                </video>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Edition Recap Video Cinema Lightbox Modal ── */}
        <AnimatePresence>
          {selectedRecapVideo && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-[10000] bg-black/94 flex items-center justify-center p-4 md:p-8 select-none"
              onClick={() => setSelectedRecapVideo(null)}
              dir={dir}
            >
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.7, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: -10 }}
                transition={{ duration: 0.25, delay: 0.1, ease: "easeOut" }}
                onClick={() => setSelectedRecapVideo(null)}
                className="absolute top-6 right-6 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors focus:outline-none z-30 hover:scale-105 cursor-pointer"
                aria-label="Fermer la vidéo"
              >
                <X className="w-6 h-6" />
              </motion.button>

              {/* Video Title Header Badge */}
              <div className="absolute top-6 left-6 text-white text-xs font-black uppercase tracking-wider bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/15 z-20 flex items-center gap-2 hidden sm:flex">
                <Film className="w-4 h-4 text-[#F05A22]" />
                <span>{selectedRecapVideo.title}</span>
              </div>

              {/* Cinema Player Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 20 }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <video
                  autoPlay
                  controls
                  playsInline
                  preload="auto"
                  className="w-full h-full object-contain"
                  ref={(el) => {
                    if (el) {
                      el.muted = false;
                      el.volume = 1;
                      el.play().catch(() => {});
                    }
                  }}
                >
                  <source src={selectedRecapVideo.src} type="video/mp4" />
                  {language === "ar" ? "متصفحك لا يدعم تشغيل الفيديو." : "Votre navigateur ne prend pas en charge la lecture de vidéos."}
                </video>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Media Partner Detail Modal ── */}
        <AnimatePresence>
          {selectedMedia && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir={dir}>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedMedia(null)}
                className="fixed inset-0 bg-[#0E1B2C]/80 backdrop-blur-md"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="relative w-full max-w-lg bg-gradient-to-br from-[#002855] via-[#003876] to-[#0E1B2C] border border-white/20 rounded-3xl p-6 sm:p-8 text-white shadow-2xl z-10 space-y-6 text-start"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Modal Header */}
                <div className="flex flex-col items-center text-center space-y-3 pt-2">
                  <div className="w-24 h-24 rounded-2xl bg-white p-3 flex items-center justify-center shadow-lg border border-white/20">
                    <img
                      src={selectedMedia.logo}
                      alt={selectedMedia.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {selectedMedia.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-white/85 text-xs sm:text-sm font-medium leading-relaxed bg-white/5 border border-white/10 p-4 rounded-2xl">
                  {language === "ar" ? selectedMedia.description.ar : selectedMedia.description.fr}
                </p>

                {/* Key Points */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#58B9FF]">
                    {language === "ar" ? "تفاصيل التغطية الإعلامية" : "Points Forts de la Couverture"}
                  </h4>
                  <ul className="space-y-2">
                    {(language === "ar" ? selectedMedia.keyPoints.ar : selectedMedia.keyPoints.fr).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-white/90 font-medium">
                        <CheckCircle className="w-4 h-4 text-[#F05A22] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* External Link Button */}
                <div className="pt-2">
                  <a
                    href={selectedMedia.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-13 rounded-2xl bg-[#F05A22] hover:bg-[#FFBD0E] text-white hover:text-[#0E1B2C] font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{language === "ar" ? "زيارة الموقع الرسمي للمؤسسة الإعلامية" : "Visiter le site officiel du média"}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── Document Hub & Styled PDF Viewer Modal ── */}
        <DocumentModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          initialDocId={selectedDocId}
        />

        {/* ─────────────────────────────────────────────────────────
            10. SPONSORSHIP LEAD FORM
        ──────────────────────────────────────────────────────────── */}
        <SponsorLeadForm />

        {/* Rebuilt Footer */}
        <Footer />
      </div>
    </>
  );
}
