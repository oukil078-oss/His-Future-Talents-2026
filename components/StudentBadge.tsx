"use client";

import React, { useRef, useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { StudentApplication } from "@/lib/dataStore";
import { Download, Printer, ShieldCheck, Mail, CheckCircle2 } from "lucide-react";
import QRCode from "qrcode";

interface StudentBadgeProps {
  student: StudentApplication;
  showActions?: boolean;
}

// Scannable High-DPI QR Code Generator
function RealScannableQRCode({ value, size = 80 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size * 3,
      margin: 1,
      color: {
        dark: "#001C3D",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => setDataUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className="bg-white rounded-xl flex items-center justify-center border border-slate-200"
      >
        <span className="text-[9px] font-bold text-slate-400">QR</span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      crossOrigin="anonymous"
      alt="Pass Ticket QR Code"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-xl object-contain bg-white p-1 border border-slate-200 shadow-xs"
    />
  );
}

export default function StudentBadge({ student, showActions = true }: StudentBadgeProps) {
  const { language } = useLanguage();
  const badgeRef = useRef<HTMLDivElement>(null);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const firstName = (student.firstName || "").toUpperCase();
  const lastName = (student.lastName || "").toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim() || (language === "ar" ? "طالب مشارك" : "STUDENT ATTENDEE");
  const badgeCode = student.badgeId || `HFT-2026-${student.id.slice(-4).toUpperCase()}`;
  const domain = (student.fieldOfStudyOrWork || student.currentStatus || "Computer Science & AI").trim().toUpperCase();
  const university = (student.university || "HIS University").trim().toUpperCase();

  const qrUrl = `https://hisfuturetalents.his.edu.dz/verify?id=${student.id}&code=${badgeCode}&name=${encodeURIComponent(fullName)}`;

  // Force/Resend Badge Email
  const handleSendEmail = async () => {
    setSendingEmail(true);
    setEmailStatusMessage(null);
    try {
      const res = await fetch("/api/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: student.id, action: "resend_email" }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailStatusMessage({
          type: "success",
          text: language === "ar" ? `✓ تم إرسال البطاقة إلى ${student.email} !` : `✓ Pass sent to ${student.email} !`,
        });
      } else {
        setEmailStatusMessage({
          type: "error",
          text: data.error || (language === "ar" ? "خطأ أثناء الإرسال." : "Error sending email."),
        });
      }
    } catch (err) {
      setEmailStatusMessage({
        type: "error",
        text: language === "ar" ? "خطأ في الشبكة." : "Network error.",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  // Handle PNG Download via Server-Side High-Res Vector Engine
  const handleDownloadPNG = async () => {
    setDownloadingPng(true);
    try {
      const queryParams = new URLSearchParams({
        id: student.id || "",
        format: "png",
        code: badgeCode,
        firstName: firstName,
        lastName: lastName,
        domain: domain,
        university: university,
      });

      const res = await fetch(`/api/students/badge?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Server error generating PNG");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Pass-Ticket-HFT2026-${fullName.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading ticket PNG:", err);
      // Fallback to client-side html2canvas if offline
      try {
        if (badgeRef.current) {
          const html2canvas = (await import("html2canvas")).default;
          const canvas = await (html2canvas as any)(badgeRef.current, {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
          });
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = `Pass-Ticket-HFT2026-${fullName.replace(/\s+/g, "_")}.png`;
          link.click();
        }
      } catch (fallbackErr) {
        alert(language === "ar" ? "خطأ أثناء تحميل الصورة." : "Error generating image.");
      }
    } finally {
      setDownloadingPng(false);
    }
  };

  // Handle PDF Download (Official Printable Landscape Ticket Pass)
  const handleDownloadPDF = async () => {
    setDownloadingPdf(true);
    try {
      const queryParams = new URLSearchParams({
        id: student.id || "",
        format: "pdf",
        code: badgeCode,
        firstName: firstName,
        lastName: lastName,
        domain: domain,
        university: university,
      });

      const res = await fetch(`/api/students/badge?${queryParams.toString()}`);
      if (!res.ok) throw new Error("Server error generating PDF");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Pass-Ticket-HFT2026-${fullName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading ticket PDF:", err);
      alert(language === "ar" ? "خطأ أثناء توليد ملف PDF." : "Error generating PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Handle Print
  const handlePrint = async () => {
    try {
      const queryParams = new URLSearchParams({
        id: student.id || "",
        format: "pdf",
        code: badgeCode,
        firstName: firstName,
        lastName: lastName,
        domain: domain,
        university: university,
      });

      const printUrl = `/api/students/badge?${queryParams.toString()}`;
      const printWindow = window.open(printUrl, "_blank");
      if (printWindow) {
        printWindow.focus();
      }
    } catch (err) {
      console.error("Error opening print window:", err);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 w-full">
      
      {/* ── OFFICIAL EVENT TICKET PASS (LANDSCAPE FORMAT MATCHING EXACT REFERENCE) ── */}
      <div
        ref={badgeRef}
        className="w-full max-w-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 select-none bg-white text-slate-900 transition-all duration-300"
      >
        {/* ════════════════════ TOP HALF: BRAND IDENTITY BANNER (HFT PALETTE) ════════════════════ */}
        <div className="relative bg-gradient-to-r from-[#001B3A] via-[#003876] to-[#0A1424] p-3.5 sm:p-4 text-white overflow-hidden">
          
          {/* Subtle Ambient Wave Glows */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_at_top_right,rgba(88,185,255,0.4),transparent_60%)]" />
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(135deg,rgba(240,90,34,0.2)_0%,transparent_50%)]" />

          {/* Decorative Dot Matrix on Left in HIS Electric Blue */}
          <div className="absolute left-3 top-10 pointer-events-none opacity-40 hidden sm:grid grid-cols-5 gap-1">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-[#58B9FF]" />
            ))}
          </div>

          {/* Top Row: Patronage Left + Venue/Dates Right */}
          <div className="flex items-start justify-between relative z-10 gap-2 mb-2">
            
            {/* Top Left: Institutional Patronage in HFT Gold */}
            <div className="text-start leading-tight space-y-0.5 max-w-[240px]">
              <span className="text-[6.5px] sm:text-[7.5px] font-black text-[#FFBD0E] tracking-wider uppercase block">
                {language === "ar" ? "تحت الرعاية السامية لـ" : "UNDER THE HIGH PATRONAGE OF"}
              </span>
              <span className="text-[6px] sm:text-[6.5px] font-bold text-white tracking-wide uppercase block">
                {language === "ar" ? "وزارة التعليم العالي والبحث العلمي" : "MINISTRY OF HIGHER EDUCATION & S.R"}
              </span>
              <span className="text-[6px] sm:text-[6.5px] font-bold text-slate-300 tracking-wide uppercase block">
                {language === "ar" ? "وزارة اقتصاد المعرفة والمؤسسات الناشئة" : "MINISTRY OF KNOWLEDGE ECONOMY & STARTUPS"}
              </span>
            </div>

            {/* Top Right: Location & Dates in HFT Palette */}
            <div className="text-end leading-tight space-y-0.5">
              <span className="text-[7.5px] sm:text-[8px] font-black text-white tracking-widest uppercase block">
                HIS UNIVERSITY
              </span>
              <span className="text-[6.5px] sm:text-[7px] font-extrabold text-[#58B9FF] tracking-wider uppercase block">
                {language === "ar" ? "الجزائر العاصمة" : "ALGIERS"}
              </span>
              <div className="pt-0.5">
                <span className="text-xs sm:text-sm font-black text-[#FFBD0E] tracking-tight block font-mono">
                  29
                </span>
                <span className="text-[8px] font-black text-white tracking-widest uppercase block -mt-0.5">
                  {language === "ar" ? "سبتمبر 2026" : "SEPTEMBER 2026"}
                </span>
              </div>
            </div>

          </div>

          {/* Center Brand Identity: Inline Crisp Vector HFT Logo with Sunburst & Flame */}
          <div className="flex flex-col items-center justify-center relative z-10 py-1 space-y-1">
            <svg
              viewBox="7 70 383 260"
              className="h-11 sm:h-13 w-auto drop-shadow-md"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Word: Future */}
              <g>
                <path fill="#ffffff" d="m127.12,226.12v13.4h-4.03c-7.64,0-12.65-2.76-14.73-8.08-4.25,6.06-10.47,9.36-18.1,9.36-12.54,0-20.94-8.19-20.94-20.74v-34.79h14.18v30.75c0,6.91,4.58,11.38,11.45,11.38,7.31,0,12.21-4.57,12.21-11.6v-30.53h14.18v36.28c0,2.87,1.75,4.58,4.69,4.58h1.09Z"/>
                <path fill="#ffffff" d="m150.59,197.92v22.13c0,4.25,2.73,6.81,7.31,6.81h5.56v12.66h-7.63c-12.76,0-19.42-5.96-19.42-17.13v-24.47h-8.83v-12.66h5.12c2.95,0,4.48-1.49,4.48-4.36v-10.11h13.41v14.47h12.87v12.66h-12.87Z"/>
                <path fill="#ffffff" d="m226.71,226.12v13.4h-4.03c-7.64,0-12.65-2.76-14.73-8.08-4.25,6.06-10.47,9.36-18.1,9.36-12.54,0-20.94-8.19-20.94-20.74v-34.79h14.18v30.75c0,6.91,4.58,11.38,11.45,11.38,7.31,0,12.21-4.57,12.21-11.6v-30.53h14.18v36.28c0,2.87,1.75,4.58,4.69,4.58h1.09Z"/>
                <path fill="#ffffff" d="m288.03,226.12v13.4h-3.6c-14.73,0-22.47-8.08-22.47-21.49,0-5.1,1.31-10.53,4.14-16.06l-16.57-2.13-7.75,39.69h-13.96l8.73-42.88c-2.95-1.81-4.8-5.21-4.8-8.94,0-5.21,3.82-8.83,9.38-8.83s9.27,3.4,9.82,7.87l35.11,4.04v3.3c-6.1,8.4-9.59,15.96-9.59,22.24s3.38,9.79,9.27,9.79h2.29Z"/>
                <path fill="#ffffff" d="m347.36,217.18h-44.17c1.85,6.91,7.53,11.38,15.16,11.38,5.78,0,10.8-2.44,13.2-5.96h15.37c-4.25,10.85-15.26,18.19-28.79,18.19-17.23,0-30.1-12.23-30.1-28.41s12.87-28.41,29.88-28.41,29.89,12.24,29.89,28.52c0,1.38-.11,3.4-.44,4.68Zm-43.95-10.11h29.12c-1.86-6.59-7.64-10.96-14.62-10.96s-12.65,4.36-14.5,10.96Z"/>
              </g>
              {/* Word: Talents */}
              <g>
                <path fill="#ffffff" d="m63.24,262.05h-20.5v59.58h-15.05v-59.58H7.2v-13.83h56.05v13.83Z"/>
                <path fill="#ffffff" d="m122.26,308.22v13.4h-4.04c-7.85,0-12.87-2.87-14.94-8.51-4.36,6.07-11.01,9.79-19.08,9.79-15.49,0-27.16-12.23-27.16-28.41s11.67-28.41,27.16-28.41c7.52,0,13.74,3.19,18.1,8.4v-7.12h14.18v36.28c0,2.87,1.63,4.58,4.69,4.58h1.09Zm-19.96-13.73c0-8.51-6.54-15-15.38-15s-15.27,6.49-15.27,15,6.55,15,15.27,15,15.38-6.49,15.38-15Z"/>
                <path fill="#ffffff" d="m169.27,308.22v13.4h-4.14c-8.4,0-15.82-2.55-21.92-7.02-4.15,2.87-8.73,5.32-13.75,7.02l-5.45-11.06c3.6-1.49,6.98-3.3,10.03-5.53-5.78-8.3-9.05-19.36-9.05-31.81,0-18.94,8.73-29.47,21.82-29.47s20.72,9.57,20.72,25.96c0,12.77-4.91,25.21-13.42,35.11,3.38,2.23,7.42,3.4,11.78,3.4h3.38Zm-29.66-35.97c0,8.41,1.85,16.07,5.12,22.13,5.24-7.23,8.18-15.75,8.18-24.68,0-8.19-2.4-12.55-6.32-12.55-4.26,0-6.98,4.78-6.98,15.1Z"/>
                <path fill="#ffffff" d="m228.83,299.28h-44.17c1.85,6.91,7.53,11.38,15.16,11.38,5.78,0,10.8-2.44,13.2-5.96h15.37c-4.25,10.85-15.26,18.19-28.79,18.19-17.23,0-30.1-12.23-30.1-28.41s12.87-28.41,29.88-28.41,29.89,12.24,29.89,28.52c0,1.38-.11,3.4-.44,4.68Zm-43.95-10.11h29.12c-1.86-6.59-7.64-10.96-14.62-10.96s-12.65,4.36-14.5,10.96Z"/>
                <path fill="#ffffff" d="m294.28,308.22v13.4h-4.03c-10.58,0-16.04-5.1-16.04-15v-15c0-7.34-4.8-12.13-12.1-12.13-7.85,0-13.09,4.89-13.09,12.34v29.79h-14.18v-54.26h14.18v6.7c4.25-5.21,10.36-7.98,17.67-7.98,13.09,0,21.7,8.3,21.7,21.07v16.49c0,2.87,1.75,4.58,4.69,4.58h1.2Z"/>
                <path fill="#ffffff" d="m316.21,280.03v22.13c0,4.25,2.73,6.81,7.31,6.81h5.56v12.66h-7.63c-12.76,0-19.42-5.96-19.42-17.13v-24.47h-8.83v-12.66h5.12c2.95,0,4.48-1.49,4.48-4.36v-10.11h13.41v14.47h12.87v12.66h-12.87Z"/>
                <path fill="#ffffff" d="m389.63,300.78c0,13.08-8.73,22.13-23.02,22.13-8.72,0-16.36-3.29-21.48-8.61l-3.16,7.34h-14.62l24-54.26h16.25c2.5,14.04,22.03,13.83,22.03,33.41Zm-14.62-.32c0-7.77-10.69-10.21-15.81-18.83l-9.16,21.17c2.83,4.04,8.07,6.7,13.85,6.7,6.65,0,11.12-3.51,11.12-9.04Z"/>
              </g>
              {/* Word: His */}
              <g>
                <path fill="#ffffff" d="m71.25,83.16v73.41h-15.05v-30H22.82v30H7.78v-73.41h15.05v29.58h33.38v-29.58h15.05Z"/>
                <path fill="#ffffff" d="m79.67,85.72c0-4.89,3.92-8.62,8.94-8.62s8.94,3.72,8.94,8.62-3.92,8.61-8.94,8.61-8.94-3.72-8.94-8.61Zm1.85,16.6h14.18v54.26h-14.18v-54.26Z"/>
                <path fill="#ffffff" d="m158.08,135.72c0,13.08-8.73,22.13-23.02,22.13-8.72,0-16.36-3.29-21.48-8.61l-3.16,7.34h-14.62l24-54.26h16.25c2.5,14.04,22.03,13.83,22.03,33.41Zm-14.62-.32c0-7.76-10.69-10.21-15.81-18.83l-9.16,21.17c2.83,4.04,8.07,6.7,13.85,6.7,6.65,0,11.12-3.51,11.12-9.04Z"/>
              </g>
              {/* Sunburst Rays: Gold */}
              <g>
                <rect fill="#ffbd0e" x="302.88" y="143.4" width="32.91" height="14.09" transform="translate(131.13 449.1) rotate(-83.01)"/>
                <rect fill="#ffbd0e" x="333.72" y="144.89" width="42.58" height="14.09" transform="translate(35.4 368.65) rotate(-57.31)"/>
                <rect fill="#ffbd0e" x="357.57" y="174.85" width="33.86" height="14.09" transform="translate(-41.83 184.44) rotate(-26.26)"/>
              </g>
              {/* Spark Flame: Orange */}
              <path fill="#f05a22" d="m42.33,181.19c6.84-1.3,14.1-1.37,21.08-.27v-13.28c-20.4-1.85-53.32,3.63-52.98,29.64.62,4.72,2.46,9.04,5.2,12.8-.82,1.23-1.57,2.53-2.19,3.9-4.04,8.76-4.93,17.66-5.27,26.01l14.37.34c-.27-7.46.89-14.78,3.7-20.88,9.38,5.27,21.15,6.16,30.32-.34,8.14-5.34,9.58-19.71.14-24.44-11.16-5.13-23.75-1.51-32.92,6.16-.75-1.51-1.23-3.08-1.44-4.65.14-9.38,11.09-13.07,19.99-14.99Zm5.61,22.93c4.86-.27,5.68,2.67,1.71,5.95-4.72,3.08-10.95,2.53-16.29-.14,3.76-3.15,8.56-5.27,14.58-5.82Z"/>
            </svg>
            <p className="text-[8px] sm:text-[9px] font-black text-[#FFBD0E] tracking-widest uppercase">
              FROM POTENTIAL TO PROFESSION
            </p>
          </div>

          {/* Bottom Right Event Highlights in Top Banner */}
          <div className="text-end relative z-10 pt-1 border-t border-white/10 mt-1.5">
            <span className="text-[6.5px] sm:text-[7.5px] font-black text-[#FFBD0E] tracking-wider uppercase block">
              {language === "ar" ? "الصالون الأول للمواهب والتوظيف في الجزائر" : "THE #1 TALENT & RECRUITMENT FAIR IN ALGERIA"}
            </span>
            <span className="text-[5.5px] sm:text-[6.5px] font-bold text-slate-200 tracking-wide uppercase block">
              {language === "ar" ? "تربصات، وظائف، تواصل مهني، ورشات ومحاضرات" : "INTERNSHIPS, JOBS, NETWORKING, WORKSHOPS & CONFERENCES"}
            </span>
          </div>

        </div>

        {/* ════════════════════ BOTTOM HALF: VISITOR DETAILS & QR CODE ════════════════════ */}
        <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between gap-3 text-start">
          
          {/* Left Column: Participant Information */}
          <div className="space-y-1.5 flex-1 min-w-0">
            
            <div>
              <span className="text-xs sm:text-sm font-black text-[#003876] uppercase tracking-wide block">
                HIS FUTURE TALENTS 2026
              </span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-700">
                  {language === "ar" ? "رقم التسجيل :" : "Registration N°"}
                </span>
                <span className="text-[11px] sm:text-xs font-black text-[#F05A22] font-mono">
                  {badgeCode}
                </span>
              </div>
            </div>

            {/* Full Name & Profession */}
            <div className="pt-0.5">
              <h2 className="text-sm sm:text-base font-black text-[#00224A] uppercase tracking-tight truncate">
                {fullName}
              </h2>
              <p className="text-[9.5px] sm:text-[10.5px] font-black text-[#F05A22] uppercase tracking-wide truncate">
                {domain} • {university}
              </p>
            </div>

            {/* Venue & Date */}
            <div className="text-[8px] sm:text-[9px] text-slate-600 font-bold space-y-0.5 pt-1 border-t border-slate-100">
              <p className="truncate">
                {language === "ar" ? "المعهد العالي للعلوم، برج الكيفان، الجزائر العاصمة" : "Campus HIS University, Bordj El Kiffan, Algiers"}
              </p>
              <p className="text-[#003876] font-extrabold truncate">
                {language === "ar" ? "الثلاثاء 29 سبتمبر 2026 ابتداءً من 08:30" : "Tuesday, September 29, 2026 from 08:30 AM"}
              </p>
            </div>

          </div>

          {/* Right Column: Scannable QR Code */}
          <div className="shrink-0 flex flex-col items-center">
            <RealScannableQRCode value={qrUrl} size={76} />
          </div>

        </div>

      </div>

      {/* ── EMAIL STATUS FEEDBACK MESSAGE ── */}
      {emailStatusMessage && (
        <div
          className={`w-full max-w-[500px] p-2 rounded-lg text-center text-xs font-black ${
            emailStatusMessage.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
              : "bg-rose-500/20 text-rose-300 border border-rose-400/40"
          }`}
        >
          {emailStatusMessage.text}
        </div>
      )}

      {/* ── ACTION BUTTONS: 4-Grid Action Bar ── */}
      {showActions && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-[500px]">
          {/* Resend Email */}
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="h-8.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all border border-emerald-500/30 cursor-pointer"
            title={language === "ar" ? "إرسال إلى البريد الإلكتروني" : "Send ticket via email"}
          >
            {sendingEmail ? (
              <span className="animate-pulse flex items-center gap-1">
                <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {language === "ar" ? "إرسال..." : "Sending..."}
              </span>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5" />
                <span>{language === "ar" ? "بالبريد" : "By Email"}</span>
              </>
            )}
          </button>

          {/* PNG Download */}
          <button
            onClick={handleDownloadPNG}
            disabled={downloadingPng}
            className="h-8.5 rounded-xl bg-[#F05A22] hover:bg-[#FFBD0E] hover:text-[#0E1B2C] text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            {downloadingPng ? (
              <span className="animate-pulse">PNG...</span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>PNG</span>
              </>
            )}
          </button>

          {/* PDF Download */}
          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPdf}
            className="h-8.5 rounded-xl bg-[#003876] hover:bg-[#002855] text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all border border-blue-400/30 cursor-pointer"
          >
            {downloadingPdf ? (
              <span className="animate-pulse">PDF...</span>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>PDF Pass</span>
              </>
            )}
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="h-8.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all border border-white/20 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{language === "ar" ? "طباعة" : "Print"}</span>
          </button>
        </div>
      )}

    </div>
  );
}
