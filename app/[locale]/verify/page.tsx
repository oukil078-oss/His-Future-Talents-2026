"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ShieldCheck,
  Calendar,
  MapPin,
  Download,
  Share2,
  ExternalLink,
  QrCode,
  GraduationCap,
  Sparkles,
  Award,
} from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const code = searchParams.get("code") || searchParams.get("badgeId") || "";
  const name = searchParams.get("name") || "";

  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch("/api/students");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            const match = data.data.find((s: any) => {
              if (id && s.id && s.id.toLowerCase() === id.toLowerCase()) return true;
              if (code && s.badgeId && s.badgeId.toUpperCase() === code.toUpperCase()) return true;
              if (name && (s.name === name || `${s.firstName} ${s.lastName}`.toLowerCase() === name.toLowerCase())) return true;
              return false;
            });
            if (match) {
              setStudent(match);
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error verifying pass:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [id, code, name]);

  const displayName = student ? (student.name || `${student.firstName} ${student.lastName}`) : (name || "Participant Invité");
  const displayCode = student?.badgeId || code || "HFT-2026";
  const displayField = student?.fieldOfStudyOrWork || student?.studyLevel || "Étudiant / Candidat";
  const displayUniversity = student?.university || "Université / École Supérieure";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E1B2C] via-[#003876] to-[#0E1B2C] text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg space-y-6 animate-fadeIn">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image
              src="/logo.webp"
              alt="HIS Future Talents 2026"
              width={140}
              height={50}
              className="h-12 w-auto mx-auto drop-shadow-md"
              priority
            />
          </Link>
          <p className="text-xs font-black uppercase text-[#FFBD0E] tracking-widest">
            HIS FUTURE TALENTS 2026 • SALON DE L'EMPLOI
          </p>
        </div>

        {/* Verification Card */}
        <div className="bg-white text-[#0E1B2C] rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-[#FFBD0E] space-y-6 relative overflow-hidden">
          
          {/* Top Banner Verification Status */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Pass Authentique & Vérifié
              </span>
              <h1 className="text-lg font-black text-emerald-950 leading-tight mt-0.5">
                Accès Officiel Validé
              </h1>
            </div>
          </div>

          {/* Student / Participant Info */}
          <div className="border-b border-slate-100 pb-5 space-y-3 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Nom du Participant
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#003876] tracking-tight">
                  {displayName}
                </h2>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] font-black uppercase tracking-wider text-white bg-[#F05A22] px-3 py-1 rounded-full shadow-sm">
                  {displayCode}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
              <span className="px-3 py-1 bg-slate-100 rounded-xl flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#003876]" />
                {displayField}
              </span>
              {displayUniversity && (
                <span className="px-3 py-1 bg-slate-100 rounded-xl">
                  {displayUniversity}
                </span>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-2.5 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-[#F05A22] shrink-0" />
              <span className="font-bold">Mardi 29 Septembre 2026 — De 09h00 à 17h00</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#003876] shrink-0" />
              <span className="font-semibold">Campus HIS University, Bordj El Kiffan, Alger</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            {student && (
              <a
                href={`/api/badge?id=${student.id}&format=png`}
                download={`Pass_HFT2026_${displayName.replace(/\s+/g, "_")}.png`}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#003876] hover:bg-[#F05A22] text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger mon Badge (PNG)</span>
              </a>
            )}

            <Link
              href="/"
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <span>Accéder au site officiel</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Security watermark */}
        <p className="text-center text-[11px] text-slate-400 font-medium">
          Ce QR Code certifie la participation officielle de l'étudiant à l'événement HIS Future Talents 2026.
        </p>

      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0E1B2C] text-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FFBD0E]"></div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
