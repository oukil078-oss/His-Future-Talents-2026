import { NextResponse } from "next/server";
import { getLeads, saveLead, updateLeadStatus, deleteLead } from "@/lib/dataStore";
import { appendToGoogleSheet } from "@/lib/googleSheets";

export async function GET() {
  try {
    const leads = getLeads();
    return NextResponse.json({ success: true, data: leads });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch leads" }, { status: 500 });
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
      formattedTimestamp,
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
      "Site Web Direct (Vercel)",
      "En attente",
      req.headers.get("x-forwarded-for") || "127.0.0.1",
      req.headers.get("user-agent") || "",
      "fr"
    ];

    // Fire & forget Google Sheets append
    appendToGoogleSheet(rowValues).catch((err) => {
      console.error("Google Sheets async sync error:", err);
    });

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save lead" }, { status: 500 });
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
