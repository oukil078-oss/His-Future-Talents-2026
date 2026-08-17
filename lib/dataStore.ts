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

export const AUTHENTIC_RECOVERED_LEADS: ExhibitorLead[] = [
  {
    companyName: "SPA MOUSTACHIR",
    representativeName: "BAHNAS Younes",
    role: "Directeur Marketing",
    email: "bahnasyounes@moustachir.dz",
    phone: "0791260835",
    representativesCount: 3,
    opportunities: ["emploi", "pfe", "decouverte", "immersion"],
    targetProfiles: "Generalement de le departement Commercial ,Finance, marketing",
    equipmentNeeded: "Supports marketing , Flayers , Rollups , Pc .. etc",
    remarks: "tables et des chaises je pense seulement",
    packageDesired: "Exposant",
    id: "lead_1786622173707_3gfw1",
    status: "Confirmé",
    submittedAt: "2026-08-13T11:56:13.707Z"
  },
  {
    companyName: "SARL AYAM",
    representativeName: "HAIFI ABDELOUAHAB",
    role: "RESPONSABLE RH",
    email: "abdelouahab.haifi@ayam-dz.com",
    phone: "0560861819",
    representativesCount: 2,
    opportunities: ["emploi", "pfe", "immersion"],
    targetProfiles: "MARKETING - COMMERCIAL - COMPTABILITE",
    equipmentNeeded: "FLYERS",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1786612817101_h37c9",
    status: "En cours",
    submittedAt: "2026-08-13T09:20:17.101Z"
  },
  {
    companyName: "CANHYGINEN",
    representativeName: "AMINA SADOU",
    role: "MANAGER DEVELOPPEMENT",
    email: "amina.sadou@canhygiene.com",
    phone: "0550953011",
    representativesCount: 2,
    opportunities: ["pfe", "emploi"],
    targetProfiles: "",
    equipmentNeeded: "UNE Baner",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1786536638514_scgrs",
    status: "Confirmé",
    submittedAt: "2026-08-12T12:10:38.514Z"
  },
  {
    companyName: "Gam assurance",
    representativeName: "ouadah sabrina",
    role: "manager développement RH",
    email: "souadah@gam.dz",
    phone: "0782291417",
    representativesCount: 2,
    opportunities: ["pfe", "emploi"],
    targetProfiles: "ingénieur système sécurité /graphiste/manager juridique /juriste contentieux /moyen généraux/ressources humaines",
    equipmentNeeded: "banners shops flayer",
    remarks: "table espace ou mettre se matérielle",
    packageDesired: "Exposant",
    id: "lead_1786374061037_qzlog",
    status: "Confirmé",
    submittedAt: "2026-08-10T15:01:01.037Z"
  },
  {
    companyName: "EURL OUM DARMAN ENTREPOT PUBLIC",
    representativeName: "Med Nadji LAHMARI",
    role: "Directeur de la promotion commerciale",
    email: "n.lahmari@omd-dz.com",
    phone: "0560628418",
    representativesCount: 4,
    opportunities: ["pfe", "decouverte", "immersion"],
    targetProfiles: "",
    equipmentNeeded: "un Snapap\nUn dex ( Petit bureu )\nQlq chaises",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1786363483142_orys7",
    status: "Confirmé",
    submittedAt: "2026-08-10T12:04:43.142Z"
  },
  {
    companyName: "BortoCall",
    representativeName: "Billel AMIOUR",
    role: "Directeur des opérations",
    email: "b.amiour@bortocall.dz",
    phone: "0770022038",
    representativesCount: 2,
    opportunities: ["emploi"],
    targetProfiles: "- Cyber Security Engineer\n- Android Developer - Native\n- iOS Developer - Native",
    equipmentNeeded: "Roll-up",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1786302038327_hi7ng",
    status: "Confirmé",
    submittedAt: "2026-08-09T19:00:38.327Z"
  },
  {
    companyName: "VİTRİN CLİNİC",
    representativeName: "Lazhari BEKKARİ",
    role: "Manager",
    email: "l.bekkari@vitrinclinic.com",
    phone: "0770406022",
    representativesCount: 2,
    opportunities: ["emploi", "pfe", "immersion"],
    targetProfiles: "",
    equipmentNeeded: "Roll up, flyers, ...",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1786277155406_mjj5z",
    status: "En cours",
    submittedAt: "2026-08-09T12:05:55.406Z"
  },
  {
    companyName: "ZAD AI",
    representativeName: "Rayan Ibrahim Benatallah",
    role: "General manager",
    email: "rayan.benatallah@zad-ai.com",
    phone: "+213540091749",
    representativesCount: 2,
    opportunities: ["emploi", "pfe"],
    targetProfiles: "",
    equipmentNeeded: "2 banners, notebooks, pens",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1786272150222_is1m9",
    status: "Confirmé",
    submittedAt: "2026-08-09T10:42:30.222Z"
  },
  {
    companyName: "SARL SOFICLEF",
    representativeName: "CHANANE MOHAMED RAFIK",
    role: "Responsable Emplois et Compétences",
    email: "r.chanane@soficlef.com",
    phone: "0560016014",
    representativesCount: 2,
    opportunities: ["emploi", "pfe", "immersion", "decouverte"],
    targetProfiles: "nous cherchons des profils pour l'engenniring , R & D , marketing (chef de produit)",
    equipmentNeeded: "Banners  muralle\nflayers",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1786271815110_kdi5j",
    status: "Confirmé",
    submittedAt: "2026-08-09T10:36:55.110Z"
  },
  {
    companyName: "SARL AFC INDUSTRY",
    representativeName: "Yasmine Ramdani",
    role: "Chargée d'événementiel",
    email: "yasmine.ramdani@afcindustry-dz.com",
    phone: "+213 563 05 74 14",
    representativesCount: 3,
    opportunities: ["emploi", "immersion", "pfe", "decouverte"],
    targetProfiles: "",
    equipmentNeeded: "Flyers, roll up",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1786260926128_9gymc",
    status: "Confirmé",
    submittedAt: "2026-08-09T07:35:26.128Z"
  },
  {
    companyName: "HYDRAPHARM Groupe",
    representativeName: "Racha Yasmine BENDRIS",
    role: "Talent Acquisition Specialist",
    email: "racha.bendris@groupehydrapharm.com",
    phone: "0770510910",
    representativesCount: 2,
    opportunities: ["emploi", "pfe"],
    targetProfiles: "Développeurs Applications et ERP \nDélégués médicaux  \nConseillers Commerciaux Parapharm et clinique \nEvènementiel",
    equipmentNeeded: "Tablettes et banners",
    remarks: "/",
    packageDesired: "Exposant",
    id: "lead_1786017516645_4d4ra",
    status: "Confirmé",
    submittedAt: "2026-08-06T11:58:36.645Z"
  },
  {
    companyName: "Laboratoires Merinal",
    representativeName: "Selma Goumeziane",
    role: "Chargée de communication interne",
    email: "s.goumeziane@gmail.com",
    phone: "0561638621",
    representativesCount: 4,
    opportunities: ["emploi", "pfe", "decouverte"],
    targetProfiles: "",
    equipmentNeeded: "",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1785857696100_w9xhc",
    status: "Confirmé",
    submittedAt: "2026-08-04T15:34:56.101Z"
  },
  {
    companyName: "KAOUA FOOD",
    representativeName: "ZEBOUCHI MOHAMED",
    role: "DRH",
    email: "mohamed.zebouchi@kaouafood.dz",
    phone: "0560347447",
    representativesCount: 2,
    opportunities: ["emploi", "pfe"],
    targetProfiles: "Marketing management rh",
    equipmentNeeded: "desk",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1785768194136_xyceh",
    status: "Confirmé",
    submittedAt: "2026-08-03T14:43:14.136Z"
  },
  {
    companyName: "MFG",
    representativeName: "Yamina BOUHINI",
    role: "Responsable développement RH",
    email: "yamina.bouhini@mfg.dz",
    phone: "0550981663",
    representativesCount: 2,
    opportunities: ["emploi", "pfe", "decouverte", "immersion"],
    targetProfiles: "",
    equipmentNeeded: "banners , flyers..etc",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1785764709493_vgokz",
    status: "Confirmé",
    submittedAt: "2026-08-03T13:45:09.493Z"
  },
  {
    companyName: "HIBOU CONSULTING RH",
    representativeName: "ABDERRAHIM HAMMADI",
    role: "gérant",
    email: "contact@hibouconsulting.com",
    phone: "0770561007",
    representativesCount: 2,
    opportunities: ["emploi", "immersion"],
    targetProfiles: "gestionnaire des ressources humaines \ncommercial sédentaire (plusieurs postes )",
    equipmentNeeded: "Roll up -2-",
    remarks: "",
    packageDesired: "Exposant",
    id: "lead_1785671872976_5kdpm",
    status: "Confirmé",
    submittedAt: "2026-08-02T11:57:52.976Z"
  }
];

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
      fs.writeFileSync(LEADS_FILE, JSON.stringify(AUTHENTIC_RECOVERED_LEADS, null, 2), "utf-8");
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
 * Automatically cleans fake/mock test leads and syncs all authentic production records into PostgreSQL.
 */
async function autoSeedDatabaseIfEmpty() {
  if (isSeedingDone || !process.env.DATABASE_URL) return;
  try {
    isSeedingDone = true;

    // 1. Purge legacy mock/test leads from PostgreSQL by exact mock IDs
    await prisma.exhibitorLead.deleteMany({
      where: {
        OR: [
          { id: { startsWith: "lead_178492329805" } },
          { id: { startsWith: "lead_178492329806" } },
        ]
      }
    });

    // 2. Ensure all 15 authentic production leads are in PostgreSQL
    for (const lead of AUTHENTIC_RECOVERED_LEADS) {
      await prisma.exhibitorLead.upsert({
        where: { id: lead.id },
        update: {
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
        },
        create: {
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

    const studentsCount = await prisma.studentApplication.count();
    if (studentsCount === 0) {
      const fileStudents = safeReadFile<StudentApplication[]>(STUDENTS_FILE, []);
      if (fileStudents.length > 0) {
        for (const s of fileStudents) {
          await prisma.studentApplication.upsert({
            where: { id: s.id },
            update: {},
            create: {
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
    console.warn("[PRISMA SEED WARNING] Could not sync authentic data:", err);
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
        // Filter out any lingering mock IDs
        const filtered = dbLeads.filter(
          (l) => !l.id.startsWith("lead_178492329805") && !l.id.startsWith("lead_178492329806")
        );
        if (filtered.length > 0) {
          return filtered.map((l) => ({
            ...l,
            status: l.status as any,
            submittedAt: l.submittedAt.toISOString(),
          }));
        }
      }
    } catch (err) {
      console.warn("[PRISMA READ WARNING] Falling back to file storage for leads:", err);
    }
  }
  
  const fileLeads = safeReadFile<ExhibitorLead[]>(LEADS_FILE, AUTHENTIC_RECOVERED_LEADS);
  const cleanLeads = fileLeads.filter(
    (l) => !l.id.startsWith("lead_178492329805") && !l.id.startsWith("lead_178492329806")
  );
  return cleanLeads.length > 0 ? cleanLeads : AUTHENTIC_RECOVERED_LEADS;
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

  const localLeads = safeReadFile<ExhibitorLead[]>(LEADS_FILE, AUTHENTIC_RECOVERED_LEADS);
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

  const leads = safeReadFile<ExhibitorLead[]>(LEADS_FILE, AUTHENTIC_RECOVERED_LEADS);
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

  const leads = safeReadFile<ExhibitorLead[]>(LEADS_FILE, AUTHENTIC_RECOVERED_LEADS);
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
