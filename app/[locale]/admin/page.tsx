"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ExhibitorLead } from "@/lib/dataStore";
import { Partner } from "@/data/partners";
import {
  Shield,
  Building2,
  Users,
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  LogOut,
  Sparkles,
  BarChart3,
  Check,
  RefreshCw,
  Award,
  Lock,
} from "lucide-react";

export default function AdminDashboard() {
  const { language } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "sponsors">("overview");

  // Data states
  const [leads, setLeads] = useState<ExhibitorLead[]>([]);
  const [sponsors, setSponsors] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  // Lead filters & detail modal
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<ExhibitorLead | null>(null);

  // Sponsor manager state
  const [sponsorEditionFilter, setSponsorEditionFilter] = useState<number>(2026);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Partner | null>(null);

  // New/Edit Sponsor Form
  const [sponsorForm, setSponsorForm] = useState<Partial<Partner>>({
    name: "",
    slug: "",
    logo: "",
    edition: 2026,
    sponsorTier: "silver",
    website: "",
    description: { fr: "", ar: "" },
  });

  // Check auth session
  useEffect(() => {
    const auth = sessionStorage.getItem("hft_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "hft2026" || passcode === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("hft_admin_auth", "true");
      fetchData();
    } else {
      setLoginError("Code d'accès incorrect.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("hft_admin_auth");
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsRes, sponsorsRes] = await Promise.all([
        fetch("/api/leads"),
        fetch("/api/sponsors"),
      ]);
      const leadsData = await leadsRes.json();
      const sponsorsData = await sponsorsRes.json();

      if (leadsData.success) setLeads(leadsData.data);
      if (sponsorsData.success) setSponsors(sponsorsData.data);
    } catch (err) {
      console.error("Error loading admin data", err);
    } finally {
      setLoading(false);
    }
  };

  // Lead status updater
  const handleUpdateLeadStatus = async (id: string, status: ExhibitorLead["status"]) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        if (selectedLead?.id === id) {
          setSelectedLead((prev) => (prev ? { ...prev, status } : null));
        }
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette candidature exposant ?")) return;
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "delete" }),
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  // Sponsor CRUD Actions
  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorForm.name || !sponsorForm.logo) {
      alert("Le nom et l'URL du logo sont obligatoires.");
      return;
    }

    const method = editingSponsor ? "PUT" : "POST";
    const payload = editingSponsor
      ? { ...editingSponsor, ...sponsorForm }
      : {
          ...sponsorForm,
          slug: sponsorForm.slug || sponsorForm.name!.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        };

    try {
      const res = await fetch("/api/sponsors", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSponsors(data.data);
        setShowSponsorModal(false);
        setEditingSponsor(null);
        setSponsorForm({ name: "", slug: "", logo: "", edition: 2026, sponsorTier: "silver", website: "", description: { fr: "", ar: "" } });
      }
    } catch (err) {
      alert("Erreur de sauvegarde");
    }
  };

  const handleDeleteSponsor = async (slug: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette entreprise / sponsor ?")) return;
    try {
      const res = await fetch(`/api/sponsors?slug=${slug}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSponsors(data.data);
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  const openEditSponsor = (s: Partner) => {
    setEditingSponsor(s);
    setSponsorForm(s);
    setShowSponsorModal(true);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.companyName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.representativeName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = leadStatusFilter === "all" || l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Sponsors
  const filteredSponsors = sponsors.filter((s) => s.edition === sponsorEditionFilter);

  // Login view if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E1B2C] flex items-center justify-center p-6 text-white">
        <div className="bg-gradient-to-br from-[#002855] via-[#003876] to-[#0E1B2C] border border-white/20 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F05A22] flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Espace Administration HFT 2026</h1>
            <p className="text-white/70 text-xs mt-1">Gestion des candidats exposants et sponsors</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-white/80 mb-2">
                Code d'accès administrateur
              </label>
              <input
                type="password"
                placeholder="Saisissez le code"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F05A22] font-semibold text-center text-lg"
              />
              {loginError && <p className="text-red-400 text-xs mt-1.5 font-bold text-center">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#F05A22] hover:bg-[#FFBD0E] hover:text-[#0E1B2C] text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              Se connecter
            </button>
          </form>

          <p className="text-[11px] text-white/40 font-medium">
            His Future Talents Administration • Protected System
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-slate-900 flex flex-col text-start">
      
      {/* Admin Top Navigation Header */}
      <header className="bg-[#003876] text-white py-4 px-6 sm:px-8 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-[#F05A22] animate-pulse" />
            <h1 className="font-black text-lg sm:text-xl tracking-tight">
              HIS Future Talents — Dashboard Admin
            </h1>
            <span className="bg-white/10 text-[#58B9FF] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/15 hidden sm:inline">
              Édition 2026
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all text-white/80 hover:text-white"
              title="Rafraîchir les données"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-red-500/80 text-white text-xs font-bold transition-all border border-white/15"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="bg-[#0E1B2C] text-white border-b border-white/10 px-6 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "overview"
                ? "bg-[#F05A22] text-white shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Vue d'ensemble
          </button>

          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative ${
              activeTab === "leads"
                ? "bg-[#F05A22] text-white shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Candidatures Exposants
            {leads.filter((l) => l.status === "Nouveau").length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                {leads.filter((l) => l.status === "Nouveau").length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("sponsors")}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === "sponsors"
                ? "bg-[#F05A22] text-white shadow-md"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Award className="w-4 h-4" />
            Gestion des Sponsors & Entreprises
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-8 flex-1 w-full">

        {/* ── 1. OVERVIEW TAB ── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase tracking-wider">Demandes Exposants</span>
                  <Building2 className="w-5 h-5 text-[#003876]" />
                </div>
                <p className="text-3xl font-black text-[#003876]">{leads.length}</p>
                <p className="text-xs text-slate-500 font-medium">
                  {leads.filter((l) => l.status === "Nouveau").length} nouvelles demandes à traiter
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase tracking-wider">Demandes Confirmées</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-emerald-600">
                  {leads.filter((l) => l.status === "Confirmé").length}
                </p>
                <p className="text-xs text-slate-500 font-medium">Partenariats validés</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase tracking-wider">Sponsors 2026 Confirmés</span>
                  <Award className="w-5 h-5 text-[#F05A22]" />
                </div>
                <p className="text-3xl font-black text-[#F05A22]">
                  {sponsors.filter((s) => s.edition === 2026).length}
                </p>
                <p className="text-xs text-slate-500 font-medium">Exposants & Sponsors au catalogue</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-2">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-xs font-black uppercase tracking-wider">Total Entreprises</span>
                  <Users className="w-5 h-5 text-[#58B9FF]" />
                </div>
                <p className="text-3xl font-black text-slate-800">{sponsors.length}</p>
                <p className="text-xs text-slate-500 font-medium">Historique (2024 - 2026)</p>
              </div>
            </div>

            {/* Recent Submissions Section */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-[#003876]">Dernières demandes exposants</h2>
                <button
                  onClick={() => setActiveTab("leads")}
                  className="text-xs font-bold text-[#F05A22] hover:underline"
                >
                  Voir tout
                </button>
              </div>

              {leads.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">Aucune demande d'exposition enregistrée pour le moment.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {leads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-slate-900">{lead.companyName}</span>
                        <p className="text-xs text-slate-500">{lead.representativeName} • {lead.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          lead.status === "Nouveau" ? "bg-amber-100 text-amber-700" :
                          lead.status === "Confirmé" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                        }`}>
                          {lead.status}
                        </span>
                        <button
                          onClick={() => { setSelectedLead(lead); setActiveTab("leads"); }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 2. LEADS TAB ── */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* Filters bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Rechercher entreprise, nom, email..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500">Statut :</span>
                {["all", "Nouveau", "En cours", "Confirmé", "Refusé"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setLeadStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      leadStatusFilter === st
                        ? "bg-[#003876] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st === "all" ? "Tous" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead className="bg-[#003876] text-white font-black uppercase tracking-wider">
                    <tr>
                      <th className="p-4 text-start">Entreprise</th>
                      <th className="p-4 text-start">Représentant & Contact</th>
                      <th className="p-4 text-center">Personnes</th>
                      <th className="p-4 text-center">Pack Souhaité</th>
                      <th className="p-4 text-center">Statut</th>
                      <th className="p-4 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                          Aucune candidature exposant trouvée.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <span className="font-bold text-sm text-slate-900 block">{lead.companyName}</span>
                            <span className="text-[10px] text-slate-400">Réf: {lead.id}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-800 block">{lead.representativeName} ({lead.role})</span>
                            <span className="text-slate-500 block">{lead.email} • {lead.phone}</span>
                          </td>
                          <td className="p-4 text-center font-bold text-slate-700">
                            {lead.representativesCount} personnes
                          </td>
                          <td className="p-4 text-center">
                            <span className="font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 text-[#003876]">
                              {lead.packageDesired}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border cursor-pointer ${
                                lead.status === "Nouveau" ? "bg-amber-100 text-amber-800 border-amber-300" :
                                lead.status === "Confirmé" ? "bg-emerald-100 text-emerald-800 border-emerald-300" :
                                lead.status === "En cours" ? "bg-blue-100 text-blue-800 border-blue-300" :
                                "bg-red-100 text-red-800 border-red-300"
                              }`}
                            >
                              <option value="Nouveau">Nouveau</option>
                              <option value="En cours">En cours</option>
                              <option value="Confirmé">Confirmé</option>
                              <option value="Refusé">Refusé</option>
                            </select>
                          </td>
                          <td className="p-4 text-end">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                                title="Voir les détails complets du formulaire PDF"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── 3. SPONSORS MANAGER TAB ── */}
        {activeTab === "sponsors" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">Filtrer par Édition :</span>
                {[2026, 2025, 2024].map((ed) => (
                  <button
                    key={ed}
                    onClick={() => setSponsorEditionFilter(ed)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                      sponsorEditionFilter === ed
                        ? "bg-[#003876] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Édition {ed}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setEditingSponsor(null);
                  setSponsorForm({ name: "", slug: "", logo: "", edition: sponsorEditionFilter as any, sponsorTier: "silver", website: "", description: { fr: "", ar: "" } });
                  setShowSponsorModal(true);
                }}
                className="px-5 py-2.5 rounded-xl bg-[#F05A22] hover:bg-[#FFBD0E] hover:text-[#0E1B2C] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                Ajouter un sponsor / entreprise
              </button>
            </div>

            {/* Sponsor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSponsors.map((sponsor) => (
                <div
                  key={sponsor.slug}
                  className={`bg-white border rounded-3xl p-5 flex flex-col justify-between shadow-soft hover:shadow-premium transition-all space-y-4 relative ${
                    sponsor.sponsorTier === "silver" ? "border-slate-300 ring-2 ring-slate-300/60" : "border-slate-200"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {sponsor.sponsorTier || "Partenaire"}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">Édition {sponsor.edition}</span>
                    </div>

                    <div className="aspect-[16/9] w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center">
                      <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                    </div>

                    <h3 className="font-extrabold text-base text-[#003876]">{sponsor.name}</h3>
                    {sponsor.description?.fr && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{sponsor.description.fr}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {sponsor.website ? (
                      <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#58B9FF] font-bold hover:underline flex items-center gap-1">
                        <span>Site Web</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : <span />}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditSponsor(sponsor)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Modifier"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSponsor(sponsor.slug)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ── LEAD INSPECTION MODAL ── */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-start">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-[#F05A22]">Formulaire PDF 9-Champs</span>
                <h3 className="text-xl font-black text-[#003876]">{selectedLead.companyName}</h3>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 rounded-full hover:bg-slate-100">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Représentant</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedLead.representativeName}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Fonction</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedLead.role}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Email</span>
                  <span className="text-slate-900 font-bold">{selectedLead.email}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Téléphone</span>
                  <span className="text-slate-900 font-bold">{selectedLead.phone}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Nombre de représentants sur stand</span>
                  <span className="text-slate-900 font-bold text-sm">{selectedLead.representativesCount} personnes</span>
                </div>

                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Opportunités proposées (pour réseaux sociaux)</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedLead.opportunities?.map((o) => (
                      <span key={o} className="px-2.5 py-1 rounded-full bg-[#003876] text-white font-bold text-[10px]">
                        {o}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Profils / Spécialités recherchés</span>
                  <p className="text-slate-800 font-medium mt-1">{selectedLead.targetProfiles || "Non spécifié"}</p>
                </div>

                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Matériel prévu pour stand</span>
                  <p className="text-slate-800 font-medium mt-1">{selectedLead.equipmentNeeded || "Non spécifié"}</p>
                </div>

                <div>
                  <span className="block text-[10px] font-black uppercase text-slate-400">Remarques complémentaires</span>
                  <p className="text-slate-800 font-medium mt-1">{selectedLead.remarks || "Aucune remarque"}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">Reçu le : {new Date(selectedLead.submittedAt).toLocaleString("fr-FR")}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateLeadStatus(selectedLead.id, "Confirmé")}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                  >
                    Valider l'exposant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD/EDIT SPONSOR MODAL ── */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl text-start">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-[#003876]">
                {editingSponsor ? "Modifier le Sponsor / Entreprise" : "Ajouter un Sponsor / Entreprise"}
              </h3>
              <button onClick={() => setShowSponsorModal(false)} className="p-2 rounded-full hover:bg-slate-100">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-700 font-black mb-1">Nom de l'entreprise *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: SATIM"
                  value={sponsorForm.name || ""}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-black mb-1">URL du Logo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: /partners/2026/satim.png"
                  value={sponsorForm.logo || ""}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, logo: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-black mb-1">Édition *</label>
                  <select
                    value={sponsorForm.edition || 2026}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, edition: Number(e.target.value) as any })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                  >
                    <option value={2026}>2026 (Édition Actuelle)</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-black mb-1">Niveau / Tier Sponsor</label>
                  <select
                    value={sponsorForm.sponsorTier || "silver"}
                    onChange={(e) => setSponsorForm({ ...sponsorForm, sponsorTier: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                  >
                    <option value="gold">Gold (Or)</option>
                    <option value="silver">Silver (Argent)</option>
                    <option value="bronze">Bronze</option>
                    <option value="official">Partenaire Officiel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-black mb-1">Site Web (Optionnel)</label>
                <input
                  type="url"
                  placeholder="https://www.entreprise.dz"
                  value={sponsorForm.website || ""}
                  onChange={(e) => setSponsorForm({ ...sponsorForm, website: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-black mb-1">Description (Français)</label>
                <textarea
                  rows={3}
                  placeholder="Brève présentation de l'entreprise..."
                  value={sponsorForm.description?.fr || ""}
                  onChange={(e) =>
                    setSponsorForm({
                      ...sponsorForm,
                      description: { fr: e.target.value, ar: sponsorForm.description?.ar || "" },
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003876]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F05A22] text-white font-black hover:bg-[#FFBD0E] hover:text-[#0E1B2C] shadow-md"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
