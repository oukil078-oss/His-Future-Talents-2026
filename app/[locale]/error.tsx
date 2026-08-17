"use client";

import React from "react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0E1B2C] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-2xl">
        <span className="text-xs font-black uppercase text-[#F05A22] tracking-wider">Erreur de Navigation</span>
        <h1 className="text-2xl font-black text-white">Un problème est survenu</h1>
        <p className="text-slate-400 text-xs font-medium">
          {error?.message || "Erreur lors du chargement de la page."}
        </p>
        <button
          onClick={() => reset()}
          className="w-full py-3 rounded-xl bg-[#003876] hover:bg-[#F05A22] text-white font-black text-xs uppercase tracking-wider transition-all"
        >
          Recharger la page
        </button>
      </div>
    </div>
  );
}
