import fs from "fs";
import path from "path";
import os from "os";
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

export type StudentApplication = {
  id: string;
  badgeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wilaya?: string;
  ageCategory: string;
  currentStatus: string;
  fieldOfStudyOrWork: string;
  university?: string;
  studyLevel?: string;
  cvUrl?: string;
  cvFileName?: string;
  seekingObjectives: string[];
  interestedFields: string[];
  interestedCompanies?: string[];
  interests?: string[];
  howDidYouHear?: string;
  additionalComments?: string;
  status: "Nouveau" | "En cours" | "Confirmé" | "Refusé";
  submittedAt: string;
};

const LEADS_FILE = path.join(process.cwd(), "data", "leads.json");
const SPONSORS_FILE = path.join(process.cwd(), "data", "sponsors.json");
const STUDENTS_FILE = path.join(process.cwd(), "data", "students.json");

let memoryLeads: ExhibitorLead[] | null = null;
let memorySponsors: Partner[] | null = null;
let memoryStudents: StudentApplication[] | null = null;

function getTmpPath(filename: string): string {
  return path.join(os.tmpdir(), filename);
}

function safeWriteFile(filePath: string, data: string) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, data, "utf-8");
  } catch (err) {
    // Read-only filesystem (e.g. Vercel serverless) fallback to /tmp
    try {
      const tmpPath = getTmpPath(path.basename(filePath));
      fs.writeFileSync(tmpPath, data, "utf-8");
    } catch (tmpErr) {
      console.error(`Failed to write file ${filePath} and tmp fallback:`, tmpErr);
    }
  }
}

function safeReadFile<T>(primaryPath: string, fallbackDefault: T): T {
  const tmpPath = getTmpPath(path.basename(primaryPath));
  if (fs.existsSync(tmpPath)) {
    try {
      return JSON.parse(fs.readFileSync(tmpPath, "utf-8"));
    } catch (e) {}
  }
  if (fs.existsSync(primaryPath)) {
    try {
      return JSON.parse(fs.readFileSync(primaryPath, "utf-8"));
    } catch (e) {}
  }
  return fallbackDefault;
}

function ensureFiles() {
  try {
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
    if (!fs.existsSync(STUDENTS_FILE)) {
      fs.writeFileSync(STUDENTS_FILE, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (e) {
    // Ignore read-only errors on initialization
  }
}

// ── LEADS CRUD ──
export function getLeads(): ExhibitorLead[] {
  if (memoryLeads !== null) return memoryLeads;
  ensureFiles();
  memoryLeads = safeReadFile<ExhibitorLead[]>(LEADS_FILE, []);
  return memoryLeads;
}

export function saveLead(leadData: Omit<ExhibitorLead, "id" | "status" | "submittedAt">): ExhibitorLead {
  const leads = getLeads();
  const newLead: ExhibitorLead = {
    ...leadData,
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    status: "Nouveau",
    submittedAt: new Date().toISOString(),
  };
  leads.unshift(newLead);
  memoryLeads = leads;
  safeWriteFile(LEADS_FILE, JSON.stringify(leads, null, 2));
  return newLead;
}

export function updateLeadStatus(id: string, status: ExhibitorLead["status"]): ExhibitorLead | null {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  leads[index].status = status;
  memoryLeads = leads;
  safeWriteFile(LEADS_FILE, JSON.stringify(leads, null, 2));
  return leads[index];
}

export function deleteLead(id: string): boolean {
  const leads = getLeads();
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  memoryLeads = filtered;
  safeWriteFile(LEADS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// ── STUDENTS CRUD ──
export function getStudentApplications(): StudentApplication[] {
  if (memoryStudents !== null) return memoryStudents;
  ensureFiles();
  memoryStudents = safeReadFile<StudentApplication[]>(STUDENTS_FILE, []);
  return memoryStudents;
}

export function saveStudentApplication(
  appData: Omit<StudentApplication, "id" | "badgeId" | "status" | "submittedAt"> & { badgeId?: string }
): StudentApplication {
  const apps = getStudentApplications();
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const newApp: StudentApplication = {
    ...appData,
    id: `std_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    badgeId: appData.badgeId || `HFT-2026-${randomSuffix}`,
    status: "Nouveau",
    submittedAt: new Date().toISOString(),
  };
  apps.unshift(newApp);
  memoryStudents = apps;
  safeWriteFile(STUDENTS_FILE, JSON.stringify(apps, null, 2));
  return newApp;
}

export function updateStudentApplicationStatus(
  id: string,
  status: StudentApplication["status"]
): StudentApplication | null {
  const apps = getStudentApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) return null;
  apps[index].status = status;
  memoryStudents = apps;
  safeWriteFile(STUDENTS_FILE, JSON.stringify(apps, null, 2));
  return apps[index];
}

export function deleteStudentApplication(id: string): boolean {
  const apps = getStudentApplications();
  const filtered = apps.filter((a) => a.id !== id);
  if (filtered.length === apps.length) return false;
  memoryStudents = filtered;
  safeWriteFile(STUDENTS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// ── SPONSORS CRUD ──
export function getSponsors(): Partner[] {
  if (memorySponsors !== null) return memorySponsors;
  ensureFiles();
  memorySponsors = safeReadFile<Partner[]>(SPONSORS_FILE, partnersData);
  return memorySponsors;
}

export function saveSponsors(sponsors: Partner[]): void {
  memorySponsors = sponsors;
  safeWriteFile(SPONSORS_FILE, JSON.stringify(sponsors, null, 2));
}

export function addSponsor(sponsor: Partner): Partner[] {
  const sponsors = getSponsors();
  sponsors.unshift(sponsor);
  saveSponsors(sponsors);
  return sponsors;
}

export function updateSponsor(slug: string, updated: Partial<Partner>, edition?: number): Partner[] {
  const sponsors = getSponsors();
  const idx = sponsors.findIndex((s) => s.slug === slug && (!edition || s.edition === edition));
  if (idx !== -1) {
    sponsors[idx] = { ...sponsors[idx], ...updated };
    saveSponsors(sponsors);
  }
  return sponsors;
}

export function deleteSponsor(slug: string, edition?: number): Partner[] {
  const sponsors = getSponsors();
  const filtered = sponsors.filter((s) => {
    if (edition) {
      return !(s.slug === slug && s.edition === edition);
    }
    return s.slug !== slug;
  });
  saveSponsors(filtered);
  return filtered;
}

