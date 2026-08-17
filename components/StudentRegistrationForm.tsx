"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { StudentApplication } from "@/lib/dataStore";
import StudentBadge from "./StudentBadge";
import {
  User,
  BookOpen,
  Compass,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Upload,
  FileCheck,
  Loader2,
  Award,
  ExternalLink,
} from "lucide-react";

interface StudentRegistrationFormProps {
  id?: string;
  variant?: "dark" | "light";
  submittedStudent: StudentApplication | null;
  setSubmittedStudent: (student: StudentApplication | null) => void;
}

export default function StudentRegistrationForm({
  id = "register-form",
  variant = "dark",
  submittedStudent,
  setSubmittedStudent,
}: StudentRegistrationFormProps) {
  const { language, dir } = useLanguage();
  const isDark = variant === "dark";

  const [formStep, setFormStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    wilaya: "",
    ageCategory: "",
    currentStatus: "",
    fieldOfStudyOrWork: "",
    university: "",
    cvUrl: "",
    cvFileName: "",
    seekingObjectives: [] as string[],
    howDidYouHear: "",
    additionalComments: "",
  });

  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const [cvUploadError, setCvUploadError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [accountTab, setAccountTab] = useState<"badge" | "details">("badge");

  // Handle PDF CV File Upload
  const handleCvFileUpload = async (file: File) => {
    setCvUploadError("");
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setCvUploadError(
        language === "ar"
          ? "ملف السيرة الذاتية يجب أن يكون بصيغة PDF."
          : "Le fichier CV doit être au format PDF."
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCvUploadError(
        language === "ar"
          ? "حجم الملف لا يجب أن يتجاوز 10 ميغابايت."
          : "La taille du fichier ne doit pas dépasser 10 Mo."
      );
      return;
    }

    setIsUploadingCv(true);
    try {
      const data = new FormData();
      data.append("file", file);

      const res = await fetch("/api/upload-cv", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.success) {
        setFormData((prev) => ({
          ...prev,
          cvUrl: json.url || json.dataUrl,
          cvFileName: file.name,
        }));
      } else {
        setCvUploadError(json.error || "Erreur de téléversement du CV.");
      }
    } catch (err) {
      setCvUploadError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsUploadingCv(false);
    }
  };

  const handleSeekingToggle = (value: string) => {
    setFormData((prev) => {
      const exists = prev.seekingObjectives.includes(value);
      return {
        ...prev,
        seekingObjectives: exists
          ? prev.seekingObjectives.filter((v) => v !== value)
          : [...prev.seekingObjectives, value],
      };
    });
  };

  const validateCurrentStep = () => {
    setFormError("");
    if (formStep === 1) {
      if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.ageCategory) {
        setFormError(
          language === "ar"
            ? "يرجى ملء جميع الحقول الإلزامية في الخطوة 1 (الاسم، البريد، الهاتف، الفئة العمرية)."
            : "Veuillez remplir tous les champs obligatoires de l'étape 1."
        );
        return false;
      }
    } else if (formStep === 2) {
      if (!formData.currentStatus || !formData.fieldOfStudyOrWork.trim()) {
        setFormError(
          language === "ar"
            ? "يرجى تحديد وضعك الحالي ومجال دراستك أو عملك."
            : "Veuillez renseigner votre statut actuel et votre domaine d'études."
        );
        return false;
      }
      if (!formData.cvUrl) {
        setFormError(
          language === "ar"
            ? "رفع ملف السيرة الذاتية بصيغة PDF إلزامي جداً."
            : "Le téléversement de votre CV PDF est obligatoire."
        );
        return false;
      }
    } else if (formStep === 3) {
      if (formData.seekingObjectives.length === 0) {
        setFormError(
          language === "ar"
            ? "يرجى اختيار هدف واحد على الأقل مما تبحث عنه."
            : "Veuillez sélectionner au moins un objectif de recherche."
        );
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setFormStep((prev) => Math.min(prev + 1, 4) as any);
    }
  };

  const handlePrevStep = () => {
    setFormError("");
    setFormStep((prev) => Math.max(prev - 1, 1) as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setFormSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, autoApprove: true }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSubmittedStudent(data.data);
        try {
          localStorage.setItem("hft_student_registration", JSON.stringify(data.data));
        } catch (e) {}
      } else {
        setFormError(data.error || "Une erreur s'est produite lors de l'enregistrement.");
      }
    } catch (err) {
      setFormError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const inputClass = isDark
    ? "w-full h-8 sm:h-8.5 px-2.5 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/40 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#FFBD0E] focus:border-transparent transition-all"
    : "w-full h-8 sm:h-8.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#003876] transition-all";

  const labelClass = isDark
    ? "block text-[10px] sm:text-[10.5px] font-bold text-white/90 mb-0.5"
    : "block text-[10px] sm:text-[10.5px] font-black text-[#003876] mb-0.5";

  return (
    <div
      id={id}
      dir={dir}
      className={`rounded-2xl p-3 sm:p-4 transition-all duration-300 ${
        isDark
          ? "bg-[#0A1424]/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl"
          : "bg-white border border-slate-200 text-slate-900 shadow-xl"
      }`}
    >
      {/* ── IF STUDENT ALREADY REGISTERED: SHOW BADGE & ACCOUNT ── */}
      {submittedStudent ? (
        <div className="space-y-2.5 text-center">
          <div className="flex items-center justify-center gap-1.5 border-b border-white/10 pb-2">
            <button
              onClick={() => setAccountTab("badge")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                accountTab === "badge"
                  ? "bg-[#F05A22] text-white shadow-xs"
                  : isDark
                  ? "bg-white/10 text-white/70 hover:bg-white/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Award className="w-3 h-3 text-white" />
              <span>{language === "ar" ? "شارة الدخول" : "Mon Pass Badge"}</span>
            </button>

            <button
              onClick={() => setAccountTab("details")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                accountTab === "details"
                  ? "bg-[#003876] text-white shadow-xs"
                  : isDark
                  ? "bg-white/10 text-white/70 hover:bg-white/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <User className="w-3 h-3 text-[#58B9FF]" />
              <span>{language === "ar" ? "بيانات التسجيل" : "Mes Informations"}</span>
            </button>
          </div>

          {accountTab === "badge" && (
            <div className="space-y-2 py-0.5">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-[10px] font-bold">
                <CheckCircle2 className="w-3 h-3" />
                <span>{language === "ar" ? "تم تأكيد الدخول وإرسال الشارة" : "Accréditation confirmée & envoyée par email"}</span>
              </div>

              <StudentBadge student={submittedStudent} showActions={true} />

              <div className="pt-1 border-t border-white/10">
                <button
                  onClick={() => {
                    if (confirm(language === "ar" ? "هل تريد إجراء تسجيل جديد؟" : "Souhaitez-vous effectuer une nouvelle inscription ?")) {
                      setSubmittedStudent(null);
                      setFormStep(1);
                      try { localStorage.removeItem("hft_student_registration"); } catch (e) {}
                    }
                  }}
                  className="text-[10px] font-bold text-white/50 hover:text-[#FFBD0E] underline transition-colors cursor-pointer"
                >
                  {language === "ar" ? "تسجيل طالب آخر" : "Effectuer une autre inscription"}
                </button>
              </div>
            </div>
          )}

          {accountTab === "details" && (
            <div className="text-start space-y-3 text-xs font-semibold">
              <div className={`p-3.5 rounded-2xl space-y-1.5 ${isDark ? "bg-white/5 border border-white/10" : "bg-slate-50 border border-slate-200"}`}>
                <h4 className={`font-black text-xs uppercase ${isDark ? "text-[#FFBD0E]" : "text-[#003876]"}`}>1. Informations Personnelles</h4>
                <p><span className="opacity-60">Nom :</span> <span className="font-bold">{submittedStudent.firstName} {submittedStudent.lastName}</span></p>
                <p><span className="opacity-60">Email :</span> <span className="font-bold">{submittedStudent.email}</span></p>
                <p><span className="opacity-60">Téléphone :</span> <span className="font-bold">{submittedStudent.phone}</span></p>
                <p><span className="opacity-60">Wilaya :</span> <span className="font-bold">{submittedStudent.wilaya || "Non spécifiée"}</span></p>
              </div>

              <div className={`p-3.5 rounded-2xl space-y-1.5 ${isDark ? "bg-white/5 border border-white/10" : "bg-slate-50 border border-slate-200"}`}>
                <h4 className={`font-black text-xs uppercase ${isDark ? "text-[#58B9FF]" : "text-[#003876]"}`}>2. Parcours & CV</h4>
                <p><span className="opacity-60">Statut :</span> <span className="font-bold">{submittedStudent.currentStatus}</span></p>
                <p><span className="opacity-60">Domaine :</span> <span className="font-bold">{submittedStudent.fieldOfStudyOrWork}</span></p>
                {submittedStudent.cvUrl && (
                  <div className="pt-1.5">
                    <a
                      href={submittedStudent.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Ouvrir mon CV PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (

        /* ── 4-STEP STREAMLINED WIZARD ── */
        <form onSubmit={handleSubmit} className="space-y-4 text-start">
          
          {/* Step Progress Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-1 pb-1 border-b border-white/10 overflow-x-auto no-scrollbar">
              {[
                { num: 1, title: language === "ar" ? "1. المعلومات" : "1. Info" },
                { num: 2, title: language === "ar" ? "2. المسار & CV" : "2. Parcours & CV" },
                { num: 3, title: language === "ar" ? "3. أهدافك" : "3. Objectifs" },
                { num: 4, title: language === "ar" ? "4. التأكيد" : "4. Pass" },
              ].map((item) => {
                const isActive = formStep === item.num;
                const isCompleted = formStep > item.num;
                return (
                  <button
                    type="button"
                    key={item.num}
                    onClick={() => {
                      if (isCompleted || item.num < formStep) {
                        setFormError("");
                        setFormStep(item.num as any);
                      }
                    }}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black transition-all shrink-0 ${
                      isActive
                        ? isDark
                          ? "bg-[#F05A22] text-white shadow-xs"
                          : "bg-[#003876] text-white shadow-xs"
                        : isCompleted
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : isDark
                        ? "bg-white/5 text-white/40 cursor-not-allowed"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black ${
                      isActive ? "bg-white text-slate-900" : isCompleted ? "bg-emerald-500 text-white" : "bg-white/20 text-white"
                    }`}>
                      {isCompleted ? "✓" : item.num}
                    </span>
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </div>

            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F05A22] to-[#FFBD0E] transition-all duration-300"
                style={{ width: `${(formStep / 4) * 100}%` }}
              />
            </div>
          </div>

          {formError && (
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-bold text-center">
              {formError}
            </div>
          )}

          {/* ── STEP 1: Informations Personnelles ── */}
          {formStep === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className={labelClass}>{language === "ar" ? "الاسم *" : "Prénom *"}</label>
                  <input
                    type="text"
                    required
                    placeholder={language === "ar" ? "اسمك" : "Votre prénom"}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{language === "ar" ? "اللقب *" : "Nom *"}</label>
                  <input
                    type="text"
                    placeholder={language === "ar" ? "لقبك" : "Votre nom"}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className={labelClass}>{language === "ar" ? "البريد الإلكتروني *" : "Email *"}</label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{language === "ar" ? "رقم الهاتف *" : "Téléphone *"}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+213 XXX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className={labelClass}>{language === "ar" ? "الولاية" : "Wilaya"}</label>
                  <input
                    type="text"
                    placeholder="Alger, Oran, Blida..."
                    value={formData.wilaya}
                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{language === "ar" ? "الفئة العمرية *" : "Tranche d'âge *"}</label>
                  <select
                    required
                    value={formData.ageCategory}
                    onChange={(e) => setFormData({ ...formData, ageCategory: e.target.value })}
                    className={inputClass}
                  >
                    <option value="" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>
                      {language === "ar" ? "اختر الفئة العمرية" : "Sélectionnez votre âge"}
                    </option>
                    <option value="أقل من 18 سنة" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>&lt; 18 ans</option>
                    <option value="18–24 سنة" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>18–24 ans</option>
                    <option value="25–34 سنة" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>25–34 ans</option>
                    <option value="35 سنة فأكثر" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>35 ans et plus</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Parcours Académique & CV PDF ── */}
          {formStep === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <div>
                <label className={labelClass}>{language === "ar" ? "الوضع الحالي *" : "Statut Actuel *"}</label>
                <select
                  required
                  value={formData.currentStatus}
                  onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                  className={inputClass}
                >
                  <option value="" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>
                    {language === "ar" ? "اختر وضعك الحالي" : "Sélectionnez votre statut"}
                  </option>
                  <option value="طالب (Licence / Master / Ingénieur)" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>
                    طالب (Étudiant en Licence / Master / Ingénieur)
                  </option>
                  <option value="خريج حديث" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>
                    خريج حديث (Jeune diplômé)
                  </option>
                  <option value="باحث عن عمل / تربص" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>
                    باحث عن عمل أو تربص (En recherche d'emploi / stage)
                  </option>
                  <option value="موظف" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>
                    موظف (Employé en poste)
                  </option>
                  <option value="رائد أعمال / صاحب مشروع" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>
                    رائد أعمال / صاحب مشروع (Entrepreneur)
                  </option>
                  <option value="أخرى" className={isDark ? "bg-[#0E1B2C] text-white" : ""}>
                    أخرى (Autre)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className={labelClass}>{language === "ar" ? "مجال الدراسة أو العمل *" : "Domaine d'Études / Travail *"}</label>
                  <input
                    type="text"
                    required
                    placeholder="Informatique, Management, Marketing..."
                    value={formData.fieldOfStudyOrWork}
                    onChange={(e) => setFormData({ ...formData, fieldOfStudyOrWork: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>{language === "ar" ? "الجامعة / المعهد" : "Université / Établissement"}</label>
                  <input
                    type="text"
                    placeholder="HIS University, USTHB..."
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Integrated CV PDF Upload Box */}
              <div>
                <label className={labelClass}>{language === "ar" ? "تحميل السيرة الذاتية (CV PDF إلزامي) *" : "Votre CV en format PDF (Obligatoire) *"}</label>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleCvFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border border-dashed rounded-2xl p-3 text-center transition-all ${
                    formData.cvUrl
                      ? "border-emerald-500 bg-emerald-500/10"
                      : isDark
                      ? "border-white/20 hover:border-[#FFBD0E] bg-white/5"
                      : "border-slate-300 hover:border-[#003876] bg-slate-50"
                  }`}
                >
                  {isUploadingCv ? (
                    <div className="flex items-center justify-center gap-2 text-white text-xs font-bold py-1">
                      <Loader2 className="w-4 h-4 animate-spin text-[#F05A22]" />
                      <span>{language === "ar" ? "جاري رفع الـ CV..." : "Téléversement en cours..."}</span>
                    </div>
                  ) : formData.cvUrl ? (
                    <div className="flex items-center justify-between gap-2 text-start">
                      <div className="flex items-center gap-2 truncate">
                        <FileCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="font-bold text-xs truncate text-emerald-300">{formData.cvFileName || "CV.pdf"}</span>
                      </div>
                      <label className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer shrink-0">
                        <span>{language === "ar" ? "تغيير" : "Modifier"}</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              handleCvFileUpload(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex items-center justify-center gap-2 block py-1">
                      <Upload className="w-4 h-4 text-[#F05A22]" />
                      <span className="text-xs font-bold opacity-90">
                        {language === "ar" ? "اختر ملف السيرة الذاتية (PDF فقط)" : "Déposez ou choisissez votre CV PDF"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#F05A22] text-white text-[10px] font-black uppercase">
                        {language === "ar" ? "استعراض" : "Parcourir"}
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            handleCvFileUpload(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                {cvUploadError && <p className="text-xs font-bold text-red-400 mt-1">{cvUploadError}</p>}
              </div>
            </div>
          )}

          {/* ── STEP 3: Que recherchez-vous ? (6 Choix) ── */}
          {formStep === 3 && (
            <div className="space-y-3 animate-fadeIn">
              <label className={labelClass}>{language === "ar" ? "ما الذي تبحث عنه في الصالون ؟ (اختيارات متعددة) *" : "Que recherchez-vous à HIS Future Talents ? *"}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: "فرص تدريب", label: language === "ar" ? "فرص تدريب (Stages / PFE)" : "Stages & PFE" },
                  { id: "فرص عمل", label: language === "ar" ? "فرص عمل (Offres d'emploi)" : "Offres d'emploi & Recrutement" },
                  { id: "بناء شبكة علاقات مهنية", label: language === "ar" ? "بناء شبكة علاقات مهنية" : "Networking & Réseau Pro" },
                  { id: "التعرف على الشركات والمؤسسات", label: language === "ar" ? "التعرف على الشركات والمؤسسات" : "Découvrir les Entreprises" },
                  { id: "حضور المحاضرات والورشات", label: language === "ar" ? "حضور المحاضرات والورشات" : "Conférences & Ateliers" },
                  { id: "أخرى", label: language === "ar" ? "أخرى" : "Autre" },
                ].map((item) => {
                  const checked = formData.seekingObjectives.includes(item.id);
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleSeekingToggle(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                        checked
                          ? "bg-[#F05A22] text-white border-[#F05A22] shadow-xs"
                          : isDark
                          ? "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span className="truncate pr-1">{item.label}</span>
                      <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center shrink-0 ${
                        checked ? "bg-white text-[#F05A22]" : "border-white/30"
                      }`}>
                        {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 4: Finalisation ── */}
          {formStep === 4 && (
            <div className="space-y-3 animate-fadeIn">
              <div>
                <label className={labelClass}>{language === "ar" ? "كيف تعرفت على الحدث ؟" : "Comment avez-vous connu l'événement ?"}</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {["Instagram", "LinkedIn", "Facebook", "TikTok", "Université", "Autre"].map((src) => (
                    <button
                      type="button"
                      key={src}
                      onClick={() => setFormData({ ...formData, howDidYouHear: src })}
                      className={`p-2 rounded-xl border text-[11px] font-bold text-center transition-all ${
                        formData.howDidYouHear === src
                          ? "bg-[#F05A22] text-white border-[#F05A22]"
                          : isDark
                          ? "bg-white/5 text-white/80 border-white/10 hover:bg-white/10"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>{language === "ar" ? "ملاحظات أو أسئلة (اختياري)" : "Remarques (Optionnel)"}</label>
                <textarea
                  rows={2}
                  placeholder={language === "ar" ? "ملاحظاتك..." : "Vos remarques..."}
                  value={formData.additionalComments}
                  onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs">
                ✨ {language === "ar" ? "سيتم إرسال بطاقة دخولك الرسمية PDF فوراً إلى بريدك الإلكتروني." : "Votre badge d'accès VIP PDF sera expédié immédiatement par courriel."}
              </div>
            </div>
          )}

          {/* Form Action Controls */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
            {formStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase transition-all flex items-center gap-1"
              >
                <ChevronRight className={`w-3.5 h-3.5 ${dir === "rtl" ? "" : "rotate-180"}`} />
                <span>{language === "ar" ? "السابق" : "Précédent"}</span>
              </button>
            ) : <span />}

            {formStep < 4 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2 rounded-xl bg-[#F05A22] hover:bg-[#FFBD0E] hover:text-[#0E1B2C] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-1"
              >
                <span>{language === "ar" ? "المتابعة" : "Continuer"}</span>
                <ChevronRight className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F05A22] to-[#FFBD0E] text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
              >
                {formSubmitting ? (
                  <span className="animate-pulse flex items-center gap-1.5">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {language === "ar" ? "جاري الإرسال..." : "Génération du Pass..."}
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === "ar" ? "تأكيد واستلام البطاقة" : "Valider & Obtenir Mon Pass VIP"}</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      )}
    </div>
  );
}
