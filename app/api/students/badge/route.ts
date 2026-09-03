import { NextRequest, NextResponse } from "next/server";
import { getStudentApplications } from "@/lib/dataStore";
import { generateStudentBadgePngBuffer, generateStudentBadgePdfBuffer } from "@/lib/badgeGenerator";
import { StudentApplication } from "@/lib/dataStore";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || "";
    const format = (searchParams.get("format") || "png").toLowerCase();

    // Query parameters override if student not in DB or client supplied full details
    const firstName = searchParams.get("firstName") || "";
    const lastName = searchParams.get("lastName") || "";
    const badgeId = searchParams.get("badgeId") || searchParams.get("code") || "";
    const fieldOfStudyOrWork = searchParams.get("domain") || searchParams.get("fieldOfStudyOrWork") || "";
    const university = searchParams.get("university") || "";

    let student: StudentApplication | undefined;

    if (id) {
      const students = await getStudentApplications();
      student = students.find((s) => s.id === id);
    }

    if (!student) {
      if (firstName || lastName || id) {
        student = {
          id: id || `temp-${Date.now()}`,
          badgeId: badgeId || `HFT-2026-${(id || "PASS").slice(-4).toUpperCase()}`,
          firstName: firstName || "STUDENT",
          lastName: lastName || "ATTENDEE",
          email: searchParams.get("email") || "",
          phone: searchParams.get("phone") || "",
          fieldOfStudyOrWork: fieldOfStudyOrWork || "Computer Science & AI",
          university: university || "HIS University",
          status: "Confirmé",
          createdAt: new Date().toISOString(),
        } as StudentApplication;
      } else {
        return NextResponse.json({ success: false, error: "Student ID or details required" }, { status: 400 });
      }
    }

    const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";
    const cleanName = fullName.replace(/[^a-zA-Z0-9_-]/g, "_");

    if (format === "pdf") {
      const pdfBuffer = await generateStudentBadgePdfBuffer(student);
      return new NextResponse(pdfBuffer as any, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Pass-Ticket-HFT2026-${cleanName}.pdf"`,
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    // Default: PNG format
    const pngBuffer = await generateStudentBadgePngBuffer(student);
    return new NextResponse(pngBuffer as any, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="Pass-Ticket-HFT2026-${cleanName}.png"`,
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (error: any) {
    console.error("Error generating badge in /api/students/badge:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error generating badge" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { student, format = "png" } = body;

    if (!student) {
      return NextResponse.json({ success: false, error: "Student data is required" }, { status: 400 });
    }

    const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";
    const cleanName = fullName.replace(/[^a-zA-Z0-9_-]/g, "_");

    if (format === "pdf") {
      const pdfBuffer = await generateStudentBadgePdfBuffer(student);
      return new NextResponse(pdfBuffer as any, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="Pass-Ticket-HFT2026-${cleanName}.pdf"`,
        },
      });
    }

    const pngBuffer = await generateStudentBadgePngBuffer(student);
    return new NextResponse(pngBuffer as any, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="Pass-Ticket-HFT2026-${cleanName}.png"`,
      },
    });
  } catch (error: any) {
    console.error("Error in POST /api/students/badge:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal error generating badge" },
      { status: 500 }
    );
  }
}
