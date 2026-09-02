"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
  User,
  Briefcase,
  Mail,
  Phone,
  Users,
  CheckSquare,
  Sparkles,
  Layers,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Send,
  FileText,
} from "lucide-react";

interface ExhibitorFormState {
  companyName: string;
  representativeName: string;
  role: string;
  email: string;
  phone: string;
  representativesCount: number;
  opportunities: string[];
  targetProfiles: string;
  equipmentNeeded: string;
  remarks: string;
  consent: boolean;
}

const OPPORTUNITIES_OPTIONS = [
  { id: "emploi", en: "Full-Time Jobs & Careers", fr: "Offres d'emploi", ar: "عروض عمل" },
  { id: "pfe", en: "End-of-Studies Projects (PFE)", fr: "Stages de fin d'études (PFE)", ar: "مشاريع تخرج (PFE)" },
  { id: "immersion", en: "Hands-on & Practical Internships", fr: "Stages pratiques / d'immersion", ar: "تربصات ميدانية وتطبيقية" },
  { id: "decouverte", en: "Discovery & Exploration Internships", fr: "Stages découverte", ar: "تربصات استكشافية" },
];

export default function SponsorLeadForm() {
  const { t, language, dir } = useLanguage();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const [formData, setFormData] = useState<ExhibitorFormState>({
    companyName: "",
    representativeName: "",
    role: "",
    email: "",
    phone: "",
    representativesCount: 2,
    opportunities: ["emploi", "pfe"],
    targetProfiles: "",
    equipmentNeeded: "",
    remarks: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleOpportunity = (id: string) => {
    setFormData((prev) => {
      const exists = prev.opportunities.includes(id);
      return {
        ...prev,
        opportunities: exists
          ? prev.opportunities.filter((o) => o !== id)
          : [...prev.opportunities, id],
      };
    });
  };

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.companyName.trim()) errs.companyName = language === "ar" ? "اسم المؤسسة إجباري" : "Company name is required";
    if (!formData.representativeName.trim()) errs.representativeName = language === "ar" ? "اسم الممُثل إجباري" : "Representative name is required";
    if (!formData.role.trim()) errs.role = language === "ar" ? "الوظيفة إجبارية" : "Job title is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errs.email = language === "ar" ? "البريد الإلكتروني إجباري" : "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      errs.email = language === "ar" ? "البريد الإلكتروني غير صحيح" : "Invalid email format";
    }
    if (!formData.phone.trim()) errs.phone = language === "ar" ? "رقم الهاتف إجباري" : "Phone number is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateFinal = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.consent) errs.consent = language === "ar" ? "يرجى قبول الشروط للمتابعة" : "Please accept terms to submit";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: document.getElementById("contact-form")?.offsetTop || 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      setCurrentStep(3);
      window.scrollTo({ top: document.getElementById("contact-form")?.offsetTop || 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFinal()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setErrors({ form: data.error || (language === "ar" ? "حدث خطأ أثناء الإرسال." : "An error occurred.") });
      }
    } catch (err) {
      setErrors({ form: language === "ar" ? "خطأ في الاتصال بالخادم." : "Server connection error." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" data-theme="dark" className="relative min-h-screen py-10 lg:py-14 flex flex-col justify-center bg-[#0E1B2C] text-white overflow-hidden hero-adaptive" dir={dir}>
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero/hft-hero-poster.webp"
          className="w-full h-full object-cover opacity-30 scale-105"
        >
          <source src="/video/hft-hero-background.mp4" type="video/mp4" />
        </video>
        {/* Deep Navy Gradient Overlay for optimal contrast & brand motion */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E1B2C]/95 via-[#002855]/90 to-[#0E1B2C]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1B2C] via-transparent to-[#0E1B2C]/80" />
      </div>

      {/* Dynamic Ambient Blur Lights */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#003876]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#F05A22]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Full-Color Brand Motif */}
      <div className="absolute top-8 right-8 w-32 md:w-40 opacity-90 drop-shadow-2xl pointer-events-none hidden lg:block select-none" aria-hidden="true">
        <img src="/brand/motifs/Future Talents Icon Orange-01.png" alt="" className="w-full h-auto" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 w-full">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2">
          <h2 className="text-2xl sm:text-4xl md:text-4xl font-black tracking-tight text-white leading-tight">
            {language === "ar" ? "تأكيد مشاركة مؤسستكم في الصالون" : "Official Exhibitor Booking Form"}
          </h2>
          <p className="text-white/80 text-xs sm:text-sm font-medium leading-relaxed">
            {language === "ar"
              ? "يرجى تعبئة النقاط التالية لترتيب جناحكم ونشر معلومات مؤسستكم."
              : "Complete the following form to confirm your booth configuration and broadcast your opportunities."}
          </p>
        </div>

        {/* Success Screen */}
        {success ? (
          <div className="bg-gradient-to-br from-[#002855]/90 via-[#003876]/90 to-[#0E1B2C]/95 border border-white/20 rounded-3xl p-8 sm:p-12 backdrop-blur-xl shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#F05A22]/20 border border-[#F05A22]/40 flex items-center justify-center mx-auto text-[#F05A22] animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {language === "ar" ? "تم تسجيل طلب مشاركتكم بنجاح !" : "Application Submitted Successfully!"}
            </h3>
            <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
              {language === "ar"
                ? "شكراً لكم. قام فريقنا بتسجيل كافة بيانات جناحكم والعروض المطلوبة، وسيتواصل معكم مسؤول المشروع لتأكيد التجهيزات."
                : "Thank you. Our organizing committee has recorded your booth details and our team will contact you promptly to finalize logistics."}
            </p>
            <div className="pt-4">
              <button
                onClick={() => { setSuccess(false); setCurrentStep(1); }}
                className="h-14 px-8 rounded-2xl bg-[#F05A22] hover:bg-[#d84a15] text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer"
              >
                {language === "ar" ? "إرسال نموذج آخر" : "Submit Another Application"}
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Clean Form Card */
          <div className="bg-[#001E3D]/95 border border-white/15 rounded-2xl p-6 sm:p-10 backdrop-blur-md space-y-8 text-start">
            
            {/* Step Wizard Bar */}
            <div className="grid grid-cols-3 gap-2 border-b border-white/12 pb-6">
              {[
                { step: 1, title: language === "ar" ? "1. معلومات الاتصال" : "1. Identification", desc: language === "ar" ? "المؤسسة والممثل" : "Company & Contact" },
                { step: 2, title: language === "ar" ? "2. الفرص والملفات" : "2. Opportunities", desc: language === "ar" ? "العروض والتخصصات" : "Offers & Profiles" },
                { step: 3, title: language === "ar" ? "3. الجناح والملحوظات" : "3. Logistics", desc: language === "ar" ? "العتاد والملحوظات" : "Booth & Remarks" },
              ].map((s) => (
                <div
                  key={s.step}
                  className={`flex flex-col text-center sm:text-start transition-all duration-300 ${
                    currentStep === s.step
                      ? "opacity-100"
                      : currentStep > s.step
                      ? "opacity-80"
                      : "opacity-40"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                    <span
                      className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center ${
                        currentStep === s.step
                          ? "bg-[#F05A22] text-white shadow-md shadow-[#F05A22]/30"
                          : currentStep > s.step
                          ? "bg-emerald-500 text-white"
                          : "bg-white/20 text-white/70"
                      }`}
                    >
                      {currentStep > s.step ? "✓" : s.step}
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-white hidden sm:inline">{s.title}</span>
                  </div>
                  <span className="text-[10px] text-white/60 font-semibold hidden md:block ms-9">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>

            {errors.form && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── STEP 1: Enterprise, Representative, Role, Email, Phone ── */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#58B9FF] flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {language === "ar" ? "معلومات المؤسسة والممثل" : "Company & Representative Details"}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* 1. Nom de l'entreprise */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-white/90">
                        {language === "ar" ? "1. اسم المؤسسة" : "1. Company Name"} <span className="text-[#F05A22]">*</span>
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          placeholder={language === "ar" ? "مثال: سوناطراك، موبيليس، بروفيكس..." : "e.g., Satim, Sonatrach, Ooredoo..."}
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full h-13 sm:h-14 ps-11 pe-4 rounded-2xl border border-white/20 bg-white/10 font-medium text-white text-sm focus:outline-none focus:border-[#F05A22] focus:bg-white/15 transition-all placeholder:text-white/30"
                        />
                      </div>
                      {errors.companyName && <p className="text-red-400 text-xs font-medium">{errors.companyName}</p>}
                    </div>

                    {/* 2. Nom et prénom du représentant */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-white/90">
                        {language === "ar" ? "2. اسم ولقب الممثل" : "2. Representative Full Name"} <span className="text-[#F05A22]">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          placeholder={language === "ar" ? "الاسم واللقب..." : "Full Name..."}
                          value={formData.representativeName}
                          onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                          className="w-full h-13 sm:h-14 ps-11 pe-4 rounded-2xl border border-white/20 bg-white/10 font-medium text-white text-sm focus:outline-none focus:border-[#F05A22] focus:bg-white/15 transition-all placeholder:text-white/30"
                        />
                      </div>
                      {errors.representativeName && <p className="text-red-400 text-xs font-medium">{errors.representativeName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* 3. Fonction */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-white/90">
                        {language === "ar" ? "3. المنصب / الوظيفة" : "3. Job Title"} <span className="text-[#F05A22]">*</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="text"
                          placeholder={language === "ar" ? "مثال: مدير الموارد البشرية، مسؤول التوظيف..." : "e.g., HR Director, Talent Acquisition..."}
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full h-13 sm:h-14 ps-11 pe-4 rounded-2xl border border-white/20 bg-white/10 font-medium text-white text-sm focus:outline-none focus:border-[#F05A22] focus:bg-white/15 transition-all placeholder:text-white/30"
                        />
                      </div>
                      {errors.role && <p className="text-red-400 text-xs font-medium">{errors.role}</p>}
                    </div>

                    {/* 4. Adresse e-mail */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-white/90">
                        {language === "ar" ? "4. البريد الإلكتروني" : "4. Corporate Email"} <span className="text-[#F05A22]">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="email"
                          placeholder="contact@company.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full h-13 sm:h-14 ps-11 pe-4 rounded-2xl border border-white/20 bg-white/10 font-medium text-white text-sm focus:outline-none focus:border-[#F05A22] focus:bg-white/15 transition-all placeholder:text-white/30"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-xs font-medium">{errors.email}</p>}
                    </div>

                    {/* 5. Numéro de téléphone */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-white/90">
                        {language === "ar" ? "5. رقم الهاتف" : "5. Phone Number"} <span className="text-[#F05A22]">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                          type="tel"
                          placeholder="05 / 06 / 07 XX XX XX XX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full h-13 sm:h-14 ps-11 pe-4 rounded-2xl border border-white/20 bg-white/10 font-medium text-white text-sm focus:outline-none focus:border-[#F05A22] focus:bg-white/15 transition-all placeholder:text-white/30"
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs font-medium">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="h-13 sm:h-14 px-8 sm:px-10 rounded-2xl bg-[#F05A22] hover:bg-[#d84a15] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>{language === "ar" ? "التالي (الفرص والتخصصات)" : "Next Step (Opportunities)"}</span>
                      <ChevronRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Representatives count, Opportunities, Target profiles ── */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#58B9FF] flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {language === "ar" ? "تجهيزات الممثلين والعروض والملفات المطلوبة" : "Booth Staff, Opportunities & Target Profiles"}
                    </h3>
                  </div>

                  {/* 5. Nombre de représentants */}
                  <div className="bg-white/5 border border-white/15 rounded-2xl p-5 space-y-3">
                    <label className="block text-xs font-bold text-white/90">
                      {language === "ar" ? "6. عدد الممثلين الحاضرين في الجناح" : "6. Number of Representatives on Booth"} <span className="text-[#F05A22]">*</span>
                    </label>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <span className="text-xs sm:text-sm text-white/80 font-semibold">
                        {language === "ar" ? "الأشخاص المقرر حضورهم بالجناح:" : "Expected booth delegates:"}
                      </span>
                      <div className="flex items-center border border-white/25 bg-white/10 rounded-2xl overflow-hidden shadow-inner">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, representativesCount: Math.max(1, formData.representativesCount - 1) })}
                          className="w-12 h-12 flex items-center justify-center font-black text-white text-lg hover:bg-white/20 transition-colors"
                        >
                          -
                        </button>
                        <span className="w-14 text-center font-black text-white text-lg">
                          {formData.representativesCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, representativesCount: formData.representativesCount + 1 })}
                          className="w-12 h-12 flex items-center justify-center font-black text-white text-lg hover:bg-white/20 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 6. Opportunités proposées */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-white/90">
                      {language === "ar" ? "7. أنواع الفرص المعروضة" : "7. Opportunities Offered"} <span className="text-white/60 text-[11px] font-normal">({language === "ar" ? "ستُنشر هذه التفاصيل عبر منصاتنا" : "This info will be highlighted on social media"})</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {OPPORTUNITIES_OPTIONS.map((opp) => {
                        const active = formData.opportunities.includes(opp.id);
                        return (
                          <button
                            key={opp.id}
                            type="button"
                            onClick={() => toggleOpportunity(opp.id)}
                            className={`p-4 sm:p-5 rounded-2xl border text-start flex items-center gap-4 transition-all duration-300 cursor-pointer ${
                              active
                                ? "bg-[#F05A22]/20 border-[#F05A22] text-white shadow-lg"
                                : "bg-white/5 border-white/15 text-white/80 hover:bg-white/10 hover:border-white/30"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              active ? "bg-[#F05A22] border-[#F05A22] text-white" : "border-white/30 bg-white/5"
                            }`}>
                              {active && <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <span className="text-xs sm:text-sm font-bold">{language === "ar" ? opp.ar : (opp.en || opp.fr)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 7. Profils recherchés */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-white/90">
                      {language === "ar" ? "8. التخصصات والملفات المطلوبة" : "8. Target Profiles & Academic Specialties"} <span className="text-white/60 text-[11px] font-normal">({language === "ar" ? "ستُنشر هذه التفاصيل عبر منصاتنا" : "Will be featured across student communication channels"})</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder={language === "ar" ? "ما هي المهارات أو التخصصات التي تبحثون عنها؟" : "What skillsets, majors, or engineering domains are you targeting?"}
                      value={formData.targetProfiles}
                      onChange={(e) => setFormData({ ...formData, targetProfiles: e.target.value })}
                      className="w-full p-4 rounded-2xl border border-white/20 bg-white/10 font-medium text-white text-sm focus:outline-none focus:border-[#F05A22] focus:bg-white/15 transition-all placeholder:text-white/30"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="h-13 sm:h-14 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center gap-2 border border-white/20 hover:-translate-y-0.5 cursor-pointer"
                    >
                      <ChevronLeft className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                      <span>{language === "ar" ? "السابق" : "Back"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="h-13 sm:h-14 px-8 sm:px-10 rounded-2xl bg-[#F05A22] hover:bg-[#d84a15] text-white font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center gap-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>{language === "ar" ? "التالي (تجهيزات الجناح)" : "Next Step (Logistics & Notes)"}</span>
                      <ChevronRight className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>
              )}

              {/* ── STEP 3: Equipment, Remarks, Consent & Final Submit ── */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-sm font-black uppercase tracking-wider text-[#58B9FF] flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      {language === "ar" ? "تجهيزات الجناح والملحوظات النهائية" : "Booth Equipment & Final Notes"}
                    </h3>
                  </div>

                  {/* 8. Matériel prévu */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-white/90">
                      {language === "ar" ? "9. العتاد والمواد الترويجية المقررة" : "9. Planned Booth Equipment"} <span className="text-white/60 text-[11px] font-normal">({language === "ar" ? "ما هي التجهيزات التي ستحضرونها معكم؟" : "Roll-ups, banners, screens, flyers, promotional goodies..."})</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder={language === "ar" ? "لافتات، شاشة عرض، مطويات، هدايا ترويجية..." : "e.g., Roll-up banner, TV display, brochures, merchandise..."}
                      value={formData.equipmentNeeded}
                      onChange={(e) => setFormData({ ...formData, equipmentNeeded: e.target.value })}
                      className="w-full p-4 rounded-2xl border border-white/20 bg-white/10 font-medium text-white text-sm focus:outline-none focus:border-[#F05A22] focus:bg-white/15 transition-all placeholder:text-white/30"
                    />
                  </div>

                  {/* 9. Remarques */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-white/90">
                      {language === "ar" ? "10. ملاحظات أو طلبات خاصة" : "10. Additional Remarks or Logistics Requests"}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={language === "ar" ? "احتياجات لوجستية إضافية..." : "Special electrical, seating, or technical requirements..."}
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full p-4 rounded-2xl border border-white/20 bg-white/10 font-medium text-white text-sm focus:outline-none focus:border-[#F05A22] focus:bg-white/15 transition-all placeholder:text-white/30"
                    />
                  </div>

                  {/* Consent & Submit */}
                  <div className="pt-4 border-t border-white/10 space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consent}
                        onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                        className="w-4 h-4 mt-0.5 rounded text-[#F05A22] focus:ring-[#F05A22]"
                      />
                      <span className="text-xs text-white/80 font-semibold leading-relaxed">
                        {language === "ar"
                          ? "أوافق على استخدام هذه البيانات لتأكيد مشاركة وتجهيز جناح مؤسستنا في صالون HIS Future Talents."
                          : "I agree that this information will be used to finalize booth logistics and promote our corporate recruitment opportunities."}
                      </span>
                    </label>
                    {errors.consent && <p className="text-red-400 text-xs font-medium">{errors.consent}</p>}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="h-14 sm:h-15 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 border border-white/20 hover:-translate-y-0.5 cursor-pointer shrink-0"
                      >
                        <ChevronLeft className={`w-4 h-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                        <span>{language === "ar" ? "السابق" : "Back"}</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 h-14 sm:h-16 px-8 rounded-2xl bg-[#F05A22] text-white font-black text-sm sm:text-base uppercase tracking-wider hover:bg-[#d84a15] transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 hover:-translate-y-0.5 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>{language === "ar" ? "جاري الإرسال..." : "Submitting Application..."}</span>
                        ) : (
                          <>
                            <span>{language === "ar" ? "إرسال استمارة المشاركة" : "Submit Booking Application"}</span>
                            <Send className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

      </div>
    </section>
  );
}

