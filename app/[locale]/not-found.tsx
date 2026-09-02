import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E1B2C] text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-2xl">
        <span className="text-xs font-black uppercase text-[#F05A22] tracking-wider">Error 404</span>
        <h1 className="text-3xl font-black text-white">Page Not Found</h1>
        <p className="text-slate-400 text-xs font-medium">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/en"
          className="inline-block w-full py-3 rounded-xl bg-[#003876] hover:bg-[#F05A22] text-white font-black text-xs uppercase tracking-wider transition-all"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
