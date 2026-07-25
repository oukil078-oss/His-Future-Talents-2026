import fs from "fs";
import path from "path";
import { partnersData, Partner } from "@/data/partners";

export type ExhibitorLead = {
  id: string;
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
  packageDesired: string;
  status: "Nouveau" | "En cours" | "Confirmé" | "Refusé";
  submittedAt: string;
};

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");
const SPONSORS_FILE = path.join(process.cwd(), "data", "sponsors.json");

// Helper to ensure data files exist
function ensureFiles() {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(LEADS_FILE)) {
    fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), "utf-8");
  }

  if (!fs.existsSync(SPONSORS_FILE)) {
    fs.writeFileSync(SPONSORS_FILE, JSON.stringify(partnersData, null, 2), "utf-8");
  }
}

// ── LEADS CRUD ──
export function getLeads(): ExhibitorLead[] {
  ensureFiles();
  try {
    const data = fs.readFileSync(LEADS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

export function saveLead(leadData: Omit<ExhibitorLead, "id" | "status" | "submittedAt">): ExhibitorLead {
  ensureFiles();
  const leads = getLeads();
  const newLead: ExhibitorLead = {
    ...leadData,
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    status: "Nouveau",
    submittedAt: new Date().toISOString(),
  };
  leads.unshift(newLead);
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  return newLead;
}

export function updateLeadStatus(id: string, status: ExhibitorLead["status"]): ExhibitorLead | null {
  ensureFiles();
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  leads[index].status = status;
  fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
  return leads[index];
}

export function deleteLead(id: string): boolean {
  ensureFiles();
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}

// ── SPONSORS CRUD ──
export function getSponsors(): Partner[] {
  ensureFiles();
  try {
    const data = fs.readFileSync(SPONSORS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return partnersData;
  }
}

export function saveSponsors(sponsors: Partner[]): void {
  ensureFiles();
  fs.writeFileSync(SPONSORS_FILE, JSON.stringify(sponsors, null, 2), "utf-8");
}

export function addSponsor(sponsor: Partner): Partner[] {
  const sponsors = getSponsors();
  sponsors.unshift(sponsor);
  saveSponsors(sponsors);
  return sponsors;
}

export function updateSponsor(slug: string, updated: Partial<Partner>): Partner[] {
  const sponsors = getSponsors();
  const idx = sponsors.findIndex((s) => s.slug === slug);
  if (idx !== -1) {
    sponsors[idx] = { ...sponsors[idx], ...updated };
    saveSponsors(sponsors);
  }
  return sponsors;
}

export function deleteSponsor(slug: string): Partner[] {
  const sponsors = getSponsors();
  const filtered = sponsors.filter((s) => s.slug !== slug);
  saveSponsors(filtered);
  return filtered;
}
