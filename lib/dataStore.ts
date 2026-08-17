import fs from "fs";
import path from "path";
import os from "os";
import { partnersData, Partner } from "@/data/partners";
import prisma from "@/lib/prisma";

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

let isSeedingDone = false;

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
    // Ignore read-only initialization errors
  }
}

/**
 * Automatically seeds PostgreSQL with existing authentic records if database is empty.
 */
async function autoSeedDatabaseIfEmpty() {
  if (isSeedingDone || !process.env.DATABASE_URL) return;
  try {
    isSeedingDone = true;
    const leadsCount = await prisma.exhibitorLead.count();
    if (leadsCount === 0) {
      const fileLeads = safeReadFile<ExhibitorLead[]>(LEADS_FILE, []);
      if (fileLeads.length > 0) {
        for (const lead of fileLeads) {
          await prisma.exhibitorLead.create({
            data: {
              id: lead.id,
              companyName: lead.companyName,
              representativeName: lead.representativeName,
              role: lead.role || "",
              email: lead.email,
              phone: lead.phone,
              representativesCount: lead.representativesCount || 2,
              opportunities: lead.opportunities || [],
              targetProfiles: lead.targetProfiles || "",
              equipmentNeeded: lead.equipmentNeeded || "",
              remarks: lead.remarks || "",
              packageDesired: lead.packageDesired || "Exposant",
              status: lead.status || "Nouveau",
              submittedAt: lead.submittedAt ? new Date(lead.submittedAt) : new Date(),
            },
          });
        }
      }
    }

    const studentsCount = await prisma.studentApplication.count();
    if (studentsCount === 0) {
      const fileStudents = safeReadFile<StudentApplication[]>(STUDENTS_FILE, []);
      if (fileStudents.length > 0) {
        for (const s of fileStudents) {
          await prisma.studentApplication.create({
            data: {
              id: s.id,
              badgeId: s.badgeId || `HFT-2026-${s.id.slice(-4).toUpperCase()}`,
              firstName: s.firstName || "",
              lastName: s.lastName || "",
              email: s.email,
              phone: s.phone,
              wilaya: s.wilaya || "",
              ageCategory: s.ageCategory || "",
              currentStatus: s.currentStatus || "",
              fieldOfStudyOrWork: s.fieldOfStudyOrWork || "",
              university: s.university || "",
              studyLevel: s.studyLevel || "",
              cvUrl: s.cvUrl || "",
              cvFileName: s.cvFileName || "",
              seekingObjectives: s.seekingObjectives || [],
              interestedFields: s.interestedFields || [],
              interestedCompanies: s.interestedCompanies || [],
              interests: s.interests || [],
              howDidYouHear: s.howDidYouHear || "",
              additionalComments: s.additionalComments || "",
              status: s.status || "Nouveau",
              submittedAt: s.submittedAt ? new Date(s.submittedAt) : new Date(),
            },
          });
        }
      }
    }
  } catch (err) {
    console.warn("[PRISMA SEED WARNING] Could not auto-seed database:", err);
  }
}

// ── LEADS CRUD ──
export async function getLeads(): Promise<ExhibitorLead[]> {
  ensureFiles();
  if (process.env.DATABASE_URL) {
    try {
      await autoSeedDatabaseIfEmpty();
      const dbLeads = await prisma.exhibitorLead.findMany({
        orderBy: { submittedAt: "desc" },
      });
      if (dbLeads && dbLeads.length > 0) {
        return dbLeads.map((l) => ({
          ...l,
          status: l.status as any,
          submittedAt: l.submittedAt.toISOString(),
        }));
      }
    } catch (err) {
      console.warn("[PRISMA READ WARNING] Falling back to file storage for leads:", err);
    }
  }
  return safeReadFile<ExhibitorLead[]>(LEADS_FILE, []);
}

export async function saveLead(
  leadData: Omit<ExhibitorLead, "id" | "status" | "submittedAt">
): Promise<ExhibitorLead> {
  const newId = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const now = new Date();

  const newLead: ExhibitorLead = {
    ...leadData,
    id: newId,
    status: "Nouveau",
    submittedAt: now.toISOString(),
  };

  if (process.env.DATABASE_URL) {
    try {
      const created = await prisma.exhibitorLead.create({
        data: {
          id: newId,
          companyName: leadData.companyName,
          representativeName: leadData.representativeName,
          role: leadData.role || "",
          email: leadData.email,
          phone: leadData.phone,
          representativesCount: leadData.representativesCount || 2,
          opportunities: leadData.opportunities || [],
          targetProfiles: leadData.targetProfiles || "",
          equipmentNeeded: leadData.equipmentNeeded || "",
          remarks: leadData.remarks || "",
          packageDesired: leadData.packageDesired || "Exposant",
          status: "Nouveau",
          submittedAt: now,
        },
      });
      return {
        ...created,
        status: created.status as any,
        submittedAt: created.submittedAt.toISOString(),
      };
    } catch (err) {
      console.warn("[PRISMA WRITE WARNING] Falling back to file storage for saveLead:", err);
    }
  }

  const localLeads = safeReadFile<ExhibitorLead[]>(LEADS_FILE, []);
  localLeads.unshift(newLead);
  safeWriteFile(LEADS_FILE, JSON.stringify(localLeads, null, 2));
  return newLead;
}

export async function updateLeadStatus(
  id: string,
  status: ExhibitorLead["status"]
): Promise<ExhibitorLead | null> {
  if (process.env.DATABASE_URL) {
    try {
      const updated = await prisma.exhibitorLead.update({
        where: { id },
        data: { status },
      });
      return {
        ...updated,
        status: updated.status as any,
        submittedAt: updated.submittedAt.toISOString(),
      };
    } catch (err) {
      console.warn("[PRISMA UPDATE WARNING] Falling back to file storage for updateLeadStatus:", err);
    }
  }

  const leads = safeReadFile<ExhibitorLead[]>(LEADS_FILE, []);
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  leads[index].status = status;
  safeWriteFile(LEADS_FILE, JSON.stringify(leads, null, 2));
  return leads[index];
}

export async function deleteLead(id: string): Promise<boolean> {
  if (process.env.DATABASE_URL) {
    try {
      await prisma.exhibitorLead.delete({ where: { id } });
      return true;
    } catch (err) {
      console.warn("[PRISMA DELETE WARNING] Falling back to file storage for deleteLead:", err);
    }
  }

  const leads = safeReadFile<ExhibitorLead[]>(LEADS_FILE, []);
  const filtered = leads.filter((l) => l.id !== id);
  if (filtered.length === leads.length) return false;
  safeWriteFile(LEADS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// ── STUDENTS CRUD ──
export async function getStudentApplications(): Promise<StudentApplication[]> {
  ensureFiles();
  if (process.env.DATABASE_URL) {
    try {
      await autoSeedDatabaseIfEmpty();
      const dbStudents = await prisma.studentApplication.findMany({
        orderBy: { submittedAt: "desc" },
      });
      if (dbStudents && dbStudents.length > 0) {
        return dbStudents.map((s) => ({
          ...s,
          wilaya: s.wilaya || "",
          university: s.university || "",
          studyLevel: s.studyLevel || "",
          cvUrl: s.cvUrl || "",
          cvFileName: s.cvFileName || "",
          howDidYouHear: s.howDidYouHear || "",
          additionalComments: s.additionalComments || "",
          status: s.status as any,
          submittedAt: s.submittedAt.toISOString(),
        }));
      }
    } catch (err) {
      console.warn("[PRISMA READ WARNING] Falling back to file storage for students:", err);
    }
  }
  return safeReadFile<StudentApplication[]>(STUDENTS_FILE, []);
}

export async function saveStudentApplication(
  appData: Omit<StudentApplication, "id" | "badgeId" | "status" | "submittedAt"> & { badgeId?: string }
): Promise<StudentApplication> {
  const newId = `std_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const badgeId = appData.badgeId || `HFT-2026-${randomSuffix}`;
  const now = new Date();

  const newApp: StudentApplication = {
    ...appData,
    id: newId,
    badgeId: badgeId,
    status: "Nouveau",
    submittedAt: now.toISOString(),
  };

  if (process.env.DATABASE_URL) {
    try {
      const created = await prisma.studentApplication.create({
        data: {
          id: newId,
          badgeId: badgeId,
          firstName: appData.firstName || "",
          lastName: appData.lastName || "",
          email: appData.email,
          phone: appData.phone,
          wilaya: appData.wilaya || "",
          ageCategory: appData.ageCategory || "",
          currentStatus: appData.currentStatus || "",
          fieldOfStudyOrWork: appData.fieldOfStudyOrWork || "",
          university: appData.university || "",
          studyLevel: appData.studyLevel || "",
          cvUrl: appData.cvUrl || "",
          cvFileName: appData.cvFileName || "",
          seekingObjectives: appData.seekingObjectives || [],
          interestedFields: appData.interestedFields || [],
          interestedCompanies: appData.interestedCompanies || [],
          interests: appData.interests || [],
          howDidYouHear: appData.howDidYouHear || "",
          additionalComments: appData.additionalComments || "",
          status: "Nouveau",
          submittedAt: now,
        },
      });
      return {
        ...created,
        wilaya: created.wilaya || "",
        university: created.university || "",
        studyLevel: created.studyLevel || "",
        cvUrl: created.cvUrl || "",
        cvFileName: created.cvFileName || "",
        howDidYouHear: created.howDidYouHear || "",
        additionalComments: created.additionalComments || "",
        status: created.status as any,
        submittedAt: created.submittedAt.toISOString(),
      };
    } catch (err) {
      console.warn("[PRISMA WRITE WARNING] Falling back to file storage for saveStudentApplication:", err);
    }
  }

  const localStudents = safeReadFile<StudentApplication[]>(STUDENTS_FILE, []);
  localStudents.unshift(newApp);
  safeWriteFile(STUDENTS_FILE, JSON.stringify(localStudents, null, 2));
  return newApp;
}

export async function updateStudentApplicationStatus(
  id: string,
  status: StudentApplication["status"]
): Promise<StudentApplication | null> {
  if (process.env.DATABASE_URL) {
    try {
      const updated = await prisma.studentApplication.update({
        where: { id },
        data: { status },
      });
      return {
        ...updated,
        wilaya: updated.wilaya || "",
        university: updated.university || "",
        studyLevel: updated.studyLevel || "",
        cvUrl: updated.cvUrl || "",
        cvFileName: updated.cvFileName || "",
        howDidYouHear: updated.howDidYouHear || "",
        additionalComments: updated.additionalComments || "",
        status: updated.status as any,
        submittedAt: updated.submittedAt.toISOString(),
      };
    } catch (err) {
      console.warn("[PRISMA UPDATE WARNING] Falling back to file storage for updateStudentStatus:", err);
    }
  }

  const apps = safeReadFile<StudentApplication[]>(STUDENTS_FILE, []);
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) return null;
  apps[index].status = status;
  safeWriteFile(STUDENTS_FILE, JSON.stringify(apps, null, 2));
  return apps[index];
}

export async function deleteStudentApplication(id: string): Promise<boolean> {
  if (process.env.DATABASE_URL) {
    try {
      await prisma.studentApplication.delete({ where: { id } });
      return true;
    } catch (err) {
      console.warn("[PRISMA DELETE WARNING] Falling back to file storage for deleteStudent:", err);
    }
  }

  const apps = safeReadFile<StudentApplication[]>(STUDENTS_FILE, []);
  const filtered = apps.filter((a) => a.id !== id);
  if (filtered.length === apps.length) return false;
  safeWriteFile(STUDENTS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// ── SPONSORS CRUD ──
export function getSponsors(): Partner[] {
  ensureFiles();
  return safeReadFile<Partner[]>(SPONSORS_FILE, partnersData);
}

export function saveSponsors(sponsors: Partner[]): void {
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
