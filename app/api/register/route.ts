import { NextResponse } from "next/server";
import { appendToGoogleSheet } from "@/lib/googleSheets";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot spam check
    if (body.website) {
      return NextResponse.json({ success: true, message: "Inscription enregistrée" });
    }

    const companyName = body.companyName?.trim() || "";
    const representativeName = body.representativeName?.trim() || "";
    const role = body.role?.trim() || "";
    const email = body.email?.trim() || "";
    const phone = body.phone?.trim() || "";
    const representativesCount = body.representativesCount || 2;
    const opportunities = Array.isArray(body.opportunities) ? body.opportunities : [];
    const targetProfiles = body.targetProfiles?.trim() || "";
    const equipmentNeeded = body.equipmentNeeded?.trim() || "";
    const remarks = body.remarks?.trim() || "";

    const hasEmploi = opportunities.includes("emploi") ? "Oui" : "Non";
    const hasPFE = opportunities.includes("pfe") ? "Oui" : "Non";
    const hasImmersion = opportunities.includes("immersion") ? "Oui" : "Non";
    const hasDecouverte = opportunities.includes("decouverte") ? "Oui" : "Non";

    // Format Europe/Algiers timestamp
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

    const clientIp = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";

    // Array row matching Columns A to S (19 columns)
    const rowValues = [
      formattedTimestamp,
      companyName,
      representativeName,
      role,
      email,
      phone,
      representativesCount,
      hasEmploi,
      hasPFE,
      hasImmersion,
      hasDecouverte,
      targetProfiles,
      equipmentNeeded,
      remarks,
      "Site Web Direct (Vercel)",
      "En attente",
      clientIp,
      userAgent,
      "fr"
    ];

    // 1. Append directly to Google Sheets API v4
    const sheetsSuccess = await appendToGoogleSheet(rowValues);

    // 2. Also log locally if dev environment
    try {
      const dir = path.join(process.cwd(), "data");
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const filePath = path.join(dir, "registrations.json");
      let registrations = [];
      if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, "utf-8");
        registrations = JSON.parse(fileData || "[]");
      }
      registrations.push({ ...body, timestamp: new Date().toISOString(), googleSheetSynced: sheetsSuccess });
      fs.writeFileSync(filePath, JSON.stringify(registrations, null, 2));
    } catch (fsErr) {
      // Ignore filesystem errors on read-only production environments like Vercel
    }

    return NextResponse.json({
      success: true,
      message: "Votre inscription a bien été enregistrée et transmise à l'équipe HIS Future Talents.",
      googleSheetsSynced: sheetsSuccess
    });
  } catch (error) {
    console.error("Registration route error:", error);
    return NextResponse.json({ success: false, error: "Échec de l'enregistrement" }, { status: 500 });
  }
}
