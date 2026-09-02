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

  // Handle PNG Download
  const handleDownloadPNG = async () => {
    if (!badgeRef.current) return;
    setDownloadingPng(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await (html2canvas as any)(badgeRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Ticket-HFT2026-${fullName.replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (err) {
      console.error("Error exporting ticket PNG:", err);
      alert(language === "ar" ? "خطأ أثناء توليد الصورة." : "Error generating image.");
    } finally {
      setDownloadingPng(false);
    }
  };

  // Handle PDF Download (Landscape Ticket Format)
  const handleDownloadPDF = async () => {
    if (!badgeRef.current) return;
    setDownloadingPdf(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { PDFDocument } = await import("pdf-lib");

      const canvas = await (html2canvas as any)(badgeRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      const pngDataUrl = canvas.toDataURL("image/png");
      const pngImageBytes = await fetch(pngDataUrl).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.create();
      // Standard landscape ticket format (595 x 345 pt)
      const page = pdfDoc.addPage([595, 345]);

      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      page.drawImage(pngImage, {
        x: 10,
        y: 10,
        width: 575,
        height: 325,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Pass-Ticket-HFT2026-${fullName.replace(/\s+/g, "_")}.pdf`;
      link.click();
    } catch (err) {
      console.error("Error exporting ticket PDF:", err);
      alert(language === "ar" ? "خطأ أثناء توليد ملف PDF." : "Error generating PDF.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  // Handle Print
  const handlePrint = () => {
    if (!badgeRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pass Ticket - ${fullName}</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
            @page { size: landscape; margin: 10mm; }
          </style>
        </head>
        <body>
          <div>${badgeRef.current.outerHTML}</div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

          {/* Center Brand Identity: Official White HFT Logo from Header */}
          <div className="flex flex-col items-center justify-center relative z-10 py-1 space-y-1">
            <img
              src="/logo-hft-white.svg"
              crossOrigin="anonymous"
              alt="HIS Future Talents"
              className="h-12 sm:h-14 w-auto object-contain drop-shadow-md"
            />
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
