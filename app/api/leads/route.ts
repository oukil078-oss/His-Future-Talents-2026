import { NextResponse } from "next/server";
import { getLeads, saveLead, updateLeadStatus, deleteLead } from "@/lib/dataStore";

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
      packageDesired: String(packageDesired || "gold").trim(),
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
