"use client";

import React from "react";
import PartnerLogoGrid from "@/components/PartnerLogoGrid";

export default function ExhibitorsSection() {
  return (
    <section
      id="exhibitors-section"
      className="relative py-12 md:py-20 bg-white text-slate-900 overflow-hidden text-start border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <PartnerLogoGrid />
      </div>
    </section>
  );
}
