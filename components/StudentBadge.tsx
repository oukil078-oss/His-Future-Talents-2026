"use client";

import React, { useRef, useState, useEffect } from "react";
import { StudentApplication } from "@/lib/dataStore";
import { Download, Printer, Check, QrCode, Sparkles, FileText, ShieldCheck, MapPin, Calendar, Clock, Mail } from "lucide-react";

import QRCode from "qrcode";

interface StudentBadgeProps {
  student: StudentApplication;
  showActions?: boolean;
}

// Real 100% Compliant Scannable QR Code Generator
function RealScannableQRCode({ value, size = 48 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size * 3, // Crisp resolution for mobile camera scanning
      margin: 1,
      color: {
        dark: "#06101D",
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
        className="bg-white rounded-lg flex items-center justify-center border border-slate-200"
      >
        <span className="text-[7px] font-bold text-slate-400">QR</span>
      </div>
    );
  }

  return (
    <img
      src={dataUrl}
      crossOrigin="anonymous"
      alt="Pass QR Code"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="rounded-md object-contain bg-white p-0.5 border border-slate-200 shadow-xs"
    />
  );
}

export default function StudentBadge({ student, showActions = true }: StudentBadgeProps) {
  const badgeRef = useRef<HTMLDivElement>(null);
  const [downloadingPng, setDownloadingPng] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatusMessage, setEmailStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const firstName = (student.firstName || "").toUpperCase();
  const lastName = (student.lastName || "").toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim();
  const badgeCode = student.badgeId || `HFT-2026-${student.id.slice(-4).toUpperCase()}`;

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
          text: `✓ Badge envoyé à ${student.email} !`,
        });
      } else {
        setEmailStatusMessage({
          type: "error",
          text: data.error || "Erreur lors de l'envoi.",
        });
      }
    } catch (err) {
      setEmailStatusMessage({
        type: "error",
        text: "Erreur réseau.",
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
      link.download = `Badge-HFT2026-${fullName.replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (err) {
      console.error("Error exporting badge PNG:", err);
      alert("Erreur lors de la génération de l'image.");
    } finally {
      setDownloadingPng(false);
    }
  };

  // Handle PDF Download
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
      const page = pdfDoc.addPage([240, 380]);

      const pngImage = await pdfDoc.embedPng(pngImageBytes);
      page.drawImage(pngImage, {
        x: 8,
        y: 8,
        width: 224,
        height: 364,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `Pass-Badge-HFT2026-${fullName.replace(/\s+/g, "_")}.pdf`;
      link.click();
    } catch (err) {
      console.error("Error exporting badge PDF:", err);
      alert("Erreur lors de la génération du PDF.");
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
          <title>Pass Badge - ${fullName}</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #fff; }
            @page { size: portrait; margin: 10mm; }
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

  const qrUrl = `https://hisfuturetalents.his.edu.dz/verify?id=${student.id}&code=${badgeCode}&name=${encodeURIComponent(fullName)}`;

  return (
    <div className="flex flex-col items-center space-y-2.5 w-full">
      
      {/* ── REALISTIC LANYARD MOCKUP CONTAINER ── */}
      <div className="relative group perspective-1000">
        
        {/* Fabric Lanyard Ribbon & Buckle (Compact Screen Height Sized) */}
        <div className="flex flex-col items-center select-none pointer-events-none z-20 relative">
          
          {/* Woven Fabric Strap */}
          <div className="w-6 h-4 sm:h-5 bg-[#002855] rounded-t-sm shadow-sm border-x border-white/20 relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.15)_50%,transparent_75%)] bg-[length:4px_4px]" />
            <span className="text-[4.5px] font-black text-white/80 uppercase tracking-widest rotate-90 whitespace-nowrap">
              HFT 2026
            </span>
          </div>

          {/* HFT Orange Plastic Breakaway Buckle */}
          <div className="w-7 h-2 bg-[#F05A22] rounded-xs border border-orange-400 shadow-xs flex items-center justify-center gap-0.5 z-20 -mt-0.5">
            <div className="w-1 h-1 bg-slate-900/40 rounded-xs" />
            <div className="w-1 h-1 bg-slate-900/40 rounded-xs" />
          </div>

          {/* Stainless Steel Swivel Hook Clip */}
          <div className="flex flex-col items-center -mt-0.5 z-20">
            <div className="w-3 h-3 rounded-full border border-slate-300 bg-transparent flex items-center justify-center shadow-xs">
              <div className="w-1 h-1 rounded-full border border-slate-400 bg-slate-200" />
            </div>
            <div className="w-2 h-2 bg-gradient-to-b from-slate-300 via-slate-100 to-slate-400 rounded-xs border border-slate-400 -mt-0.5 shadow-xs flex items-center justify-center">
              <div className="w-0.5 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* ── MAIN BADGE CARD (EXACT SCALED PASS DESIGN TO FIT SCREEN HEIGHT) ── */}
        <div
          ref={badgeRef}
          className="w-[255px] sm:w-[270px] h-[345px] sm:h-[360px] rounded-[18px] p-2.5 sm:p-3 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/15 select-none -mt-2"
          style={{
            background: "linear-gradient(170deg, #091320 0%, #0D1F38 60%, #050D18 100%)",
          }}
        >
          {/* Subtle Diagonal Texture Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%)] bg-[length:12px_12px] pointer-events-none" />

          {/* Top Hole Punch */}
          <div className="w-2.5 h-2.5 mx-auto bg-[#050D18] border border-slate-400/60 rounded-full shadow-inner mb-0.5 shrink-0 z-20 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-slate-900" />
          </div>

          {/* ── HEADER ROW ── */}
          <div className="flex items-center justify-between z-10 shrink-0 border-b border-white/10 pb-1.5">
            <div className="flex items-center gap-1">
              <img
                src="/logo-hft-white.svg"
                crossOrigin="anonymous"
                alt="HIS Future Talents"
                width={100}
                height={26}
                className="h-5.5 sm:h-6 w-auto object-contain drop-shadow-md"
              />
            </div>

            <div className="flex items-center gap-1 text-end">
              <span className="text-white/40 font-light text-xs">|</span>
              <div>
                <span className="text-[9px] font-black text-[#FFBD0E] tracking-wider block font-mono leading-none">
                  ÉDITION 3 • 2026
                </span>
                <span className="text-[7px] font-bold text-white/50 uppercase tracking-widest block leading-tight">
                  RÉF: {badgeCode}
                </span>
              </div>
            </div>
          </div>

          {/* ── SIGNATURE CENTRAL WHITE NAME CONTAINER ── */}
          <div className="my-auto z-10 bg-white rounded-[14px] p-2.5 shadow-xl text-slate-900 relative overflow-hidden border border-white/30 space-y-1.5">
            
            {/* Top Role Banner Strip */}
            <div className="-mx-2.5 -mt-2.5 px-2.5 py-1 bg-gradient-to-r from-[#F05A22] via-[#FFBD0E] to-[#F05A22] text-slate-950 text-center shadow-xs">
              <span className="text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider block font-sans">
                {student.status === "Confirmé" ? "ACCÈS CONFIRMÉ • PASS ÉTUDIANT" : "VISITEUR OFFICIEL • ÉTUDIANT"}
              </span>
            </div>

            {/* Student Full Name Display */}
            <div className="text-center pt-0.5 space-y-0.5">
              <h2 className="text-sm sm:text-base font-black text-slate-950 uppercase tracking-tight leading-tight drop-shadow-xs break-words">
                {firstName} <span className="text-[#003876]">{lastName}</span>
              </h2>
              
              <p className="text-[9.5px] sm:text-[10px] font-black text-[#F05A22] uppercase tracking-wider truncate">
                {student.fieldOfStudyOrWork || student.currentStatus || "TALENT ÉTUDIANT"}
              </p>
            </div>

            {/* Bottom Row inside White Container: Details Left + QR Code Right */}
            <div className="flex items-end justify-between border-t border-slate-100 pt-1.5 text-start gap-1">
              <div className="text-[8px] text-slate-600 font-bold space-y-0.5 max-w-[130px] truncate">
                <p className="text-slate-900 font-extrabold truncate">{student.email}</p>
                <p className="text-slate-500 truncate">{student.phone} {student.wilaya ? `• ${student.wilaya}` : ""}</p>
                {student.university && (
                  <p className="text-[#003876] font-bold truncate">{student.university}</p>
                )}
              </div>

              {/* Scannable QR Code */}
              <div className="p-0.5 bg-white rounded-md border border-slate-200 shadow-xs shrink-0">
                <RealScannableQRCode value={qrUrl} size={44} />
              </div>
            </div>

          </div>

          {/* ── LOWER SLOGAN & EVENT DETAILS ROW ── */}
          <div className="grid grid-cols-12 gap-1 items-center z-10 shrink-0 pt-0.5 text-start">
            {/* Left: Graphic Slogan */}
            <div className="col-span-7 space-y-0.5 pr-1">
              <p className="text-[8px] sm:text-[8.5px] font-black text-white leading-tight uppercase tracking-wide">
                Façonner l'Avenir des Talents <br />
                <span className="text-[#FFBD0E]">& Innovations en Algérie</span>
              </p>
              <span className="text-[6.5px] font-bold text-white/50 uppercase tracking-widest block">
                HIS FUTURE TALENTS 2026
              </span>
            </div>

            {/* Right: Stacked Info Pills */}
            <div className="col-span-5 space-y-0.5 text-end">
              <div className="bg-[#F05A22]/20 border border-[#F05A22]/40 rounded-xs px-1.5 py-0.5 text-[#FFBD0E] text-[7.5px] font-black uppercase tracking-wider inline-block">
                13–14 MAI 2026
              </div>
              <div className="bg-[#003876]/60 border border-[#58B9FF]/30 rounded-xs px-1.5 py-0.5 text-[#58B9FF] text-[6.5px] font-extrabold uppercase tracking-wider block truncate">
                HIS University, Alger
              </div>
            </div>
          </div>

          {/* ── FOOTER STATUS BAR ── */}
          <div className="flex items-center justify-between z-10 shrink-0 pt-1 border-t border-white/10 text-start">
            {student.status === "Confirmé" ? (
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-[7px] font-black uppercase tracking-wider">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>ACCÈS CONFIRMÉ</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[7px] font-black uppercase tracking-wider animate-pulse">
                <span>⏳ EN ATTENTE</span>
              </div>
            )}

            <span className="text-[6.5px] text-white/40 font-bold uppercase tracking-widest">
              SCANNER RÉCEPTION
            </span>
          </div>

        </div>
      </div>

      {/* ── ACTION BUTTONS: Compact 2x2 Grid (Fits Screen Height) ── */}
      {showActions && (
        <div className="flex flex-col gap-1.5 max-w-[280px] w-full">
          <div className="grid grid-cols-2 gap-1.5 w-full">
            {/* Resend Email */}
            <button
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all border border-emerald-500/30 cursor-pointer"
              title="Recevoir le Pass Badge par email"
            >
              {sendingEmail ? (
                <span className="animate-pulse flex items-center gap-1">
                  <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Envoi...
                </span>
              ) : (
                <>
                  <Mail className="w-3 h-3" />
                  <span>Par Email</span>
                </>
              )}
            </button>

            {/* PNG Download */}
            <button
              onClick={handleDownloadPNG}
              disabled={downloadingPng}
              className="h-8 rounded-lg bg-[#F05A22] hover:bg-[#FFBD0E] hover:text-[#0E1B2C] text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
            >
              {downloadingPng ? (
                <span className="animate-pulse">PNG...</span>
              ) : (
                <>
                  <Download className="w-3 h-3" />
                  <span>Pass PNG</span>
                </>
              )}
            </button>

            {/* PDF Download */}
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPdf}
              className="h-8 rounded-lg bg-[#003876] hover:bg-[#58B9FF] text-white font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all border border-white/20 cursor-pointer"
            >
              {downloadingPdf ? (
                <span className="animate-pulse">PDF...</span>
              ) : (
                <>
                  <FileText className="w-3 h-3" />
                  <span>Pass PDF</span>
                </>
              )}
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all border border-white/20 cursor-pointer"
              title="Imprimer le Pass Badge"
            >
              <Printer className="w-3 h-3" />
              <span>Imprimer</span>
            </button>
          </div>

          {emailStatusMessage && (
            <div className={`p-1.5 rounded-lg text-[10px] font-bold text-center ${emailStatusMessage.type === "success" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
              {emailStatusMessage.text}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
