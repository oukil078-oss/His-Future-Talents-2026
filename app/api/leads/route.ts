import { NextResponse } from "next/server";
import { getLeads, saveLead, updateLeadStatus, deleteLead } from "@/lib/dataStore";
import { appendToGoogleSheet, fetchLeadsFromGoogleSheet } from "@/lib/googleSheets";

export async function GET() {
  try {
    const localLeads = getLeads();
    const sheetLeads = await fetchLeadsFromGoogleSheet();

    const leadMap = new Map<string, any>();

    for (const lead of localLeads) {
      const key = `${lead.companyName.toLowerCase().trim()}_${lead.email.toLowerCase().trim()}`;
      leadMap.set(key, lead);
    }

    for (const sheetLead of sheetLeads) {
      const key = `${sheetLead.companyName.toLowerCase().trim()}_${sheetLead.email.toLowerCase().trim()}`;
      if (!leadMap.has(key)) {
        leadMap.set(key, sheetLead);
      }
    }

    const allLeads = Array.from(leadMap.values());
    return NextResponse.json({ success: true, data: allLeads });
  } catch (error) {
    const fallbackLeads = getLeads();
    return NextResponse.json({ success: true, data: fallbackLeads });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      companyName,
      representativeName,
      role,
      email,
      phone,
      representativesCount,
      opportunities,
      targetProfiles,
      equipmentNeeded,
      remarks,
      packageDesired,
    } = body;

    if (!companyName || !representativeName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: "Tous les champs obligatoires doivent être renseignés." },
        { status: 400 }
      );
    }

    const lead = saveLead({
      companyName: String(companyName).trim(),
      representativeName: String(representativeName).trim(),
      role: String(role || "").trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      representativesCount: Number(representativesCount) || 1,
      opportunities: Array.isArray(opportunities) ? opportunities : [],
      targetProfiles: String(targetProfiles || "").trim(),
      equipmentNeeded: String(equipmentNeeded || "").trim(),
      remarks: String(remarks || "").trim(),
      packageDesired: String(packageDesired || "Exposant").trim(),
    });

    // Format row for Google Sheets sync
    const oppsList = Array.isArray(opportunities) ? opportunities : [];
    const now = new Date();
    const formattedTimestamp = now.toLocaleString("fr-FR", {
      timeZone: "Africa/Algiers",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const rowValues = [
      lead.id,
      formattedTimestamp,
      "Nouveau",
      String(companyName).trim(),
      String(representativeName).trim(),
      String(role || "").trim(),
      String(email).trim().toLowerCase(),
      String(phone).trim(),
      Number(representativesCount) || 1,
      oppsList.includes("emploi") ? "Oui" : "Non",
      oppsList.includes("pfe") ? "Oui" : "Non",
      oppsList.includes("immersion") ? "Oui" : "Non",
      oppsList.includes("decouverte") ? "Oui" : "Non",
      String(targetProfiles || "").trim(),
      String(equipmentNeeded || "").trim(),
      String(remarks || "").trim(),
      String(packageDesired || "Exposant").trim(),
      "Site Web Direct (Vercel)",
      req.headers.get("x-forwarded-for") || "127.0.0.1",
      req.headers.get("user-agent") || "",
      "fr"
    ];

    // Await Google Sheets sync so Vercel serverless environment doesn't freeze the process
    try {
      const sheetSynced = await appendToGoogleSheet(rowValues);
      if (!sheetSynced) {
        console.warn("Google Sheets append failed or credentials were missing on Vercel.");
      }
    } catch (sheetErr) {
      console.error("Google Sheets sync exception:", sheetErr);
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error: any) {
    console.error("Error in POST /api/leads:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save lead" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, action } = body;

    if (action === "delete") {
      const deleted = deleteLead(id);
      return NextResponse.json({ success: deleted });
    }

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID and status are required" }, { status: 400 });
    }

    const updated = updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 500 });
  }
}
