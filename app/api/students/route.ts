import { NextResponse } from "next/server";
import {
  getStudentApplications,
  saveStudentApplication,
  updateStudentApplicationStatus,
  deleteStudentApplication,
} from "@/lib/dataStore";
import { sendStudentApprovalEmail } from "@/lib/mailer";

export async function GET() {
  try {
    const students = await getStudentApplications();
    return NextResponse.json({ success: true, data: students });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch student applications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      wilaya,
      ageCategory,
      currentStatus,
      fieldOfStudyOrWork,
      university,
      studyLevel,
      cvUrl,
      cvFileName,
      seekingObjectives,
      interestedFields,
      interestedCompanies,
      interests,
      howDidYouHear,
      additionalComments,
      autoApprove,
    } = body;

    // Required fields: Full Name (firstName + lastName or firstName), Email, Phone, Age Category, Current Status, Field of Study/Work, Interested Fields, CV
    if (!firstName || !email || !phone || !ageCategory || !currentStatus || !fieldOfStudyOrWork) {
      return NextResponse.json(
        { success: false, error: "Veuillez remplir tous les champs obligatoires (*)." },
        { status: 400 }
      );
    }

    const application = await saveStudentApplication({
      firstName: String(firstName).trim(),
      lastName: String(lastName || "").trim(),
      email: String(email).trim().toLowerCase(),
      phone: String(phone).trim(),
      wilaya: wilaya ? String(wilaya).trim() : "",
      ageCategory: String(ageCategory).trim(),
      currentStatus: String(currentStatus).trim(),
      fieldOfStudyOrWork: String(fieldOfStudyOrWork).trim(),
      university: university ? String(university).trim() : String(fieldOfStudyOrWork).trim(),
      studyLevel: studyLevel ? String(studyLevel).trim() : String(currentStatus).trim(),
      cvUrl: cvUrl ? String(cvUrl).trim() : "",
      cvFileName: cvFileName ? String(cvFileName).trim() : "",
      seekingObjectives: Array.isArray(seekingObjectives) ? seekingObjectives : [],
      interestedFields: Array.isArray(interestedFields) ? interestedFields : [],
      interestedCompanies: Array.isArray(interestedCompanies) ? interestedCompanies : [],
      interests: Array.isArray(interests) ? interests : [],
      howDidYouHear: howDidYouHear ? String(howDidYouHear).trim() : "",
      additionalComments: additionalComments ? String(additionalComments).trim() : "",
    });

    // Automatically confirm registration and send the official pass badge PDF via email
    await updateStudentApplicationStatus(application.id, "Confirmé");
    application.status = "Confirmé";
    sendStudentApprovalEmail(application).catch((err) =>
      console.error("Student registration email dispatch error:", err)
    );

    return NextResponse.json({ success: true, data: application, emailDispatched: true });
  } catch (error: any) {
    console.error("Error in POST /api/students:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save student application" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status, action, resendEmail } = body;

    if (action === "delete") {
      const deleted = await deleteStudentApplication(id);
      return NextResponse.json({ success: deleted });
    }

    // Action to resend approval email manually
    if (action === "resend_email" || resendEmail) {
      const students = await getStudentApplications();
      const student = students.find((s) => s.id === id);
      if (!student) {
        return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
      }

      const emailResult = await sendStudentApprovalEmail(student);
      return NextResponse.json({
        success: true,
        emailSent: emailResult.success,
        emailResult,
      });
    }

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "ID and status are required" }, { status: 400 });
    }

    const updated = await updateStudentApplicationStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Student application not found" }, { status: 404 });
    }

    let emailResult = null;

    // Automatically send official badge email when status is set to 'Confirmé'
    if (status === "Confirmé") {
      try {
        emailResult = await sendStudentApprovalEmail(updated);
        console.log(`Approval email triggered for student ${updated.id}:`, emailResult);
      } catch (err: any) {
        console.error("Non-blocking error dispatching student approval email:", err);
        emailResult = { success: false, error: err?.message };
      }
    }

    return NextResponse.json({
      success: true,
      data: updated,
      emailSent: emailResult?.success ?? false,
      emailResult,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/students:", error);
    return NextResponse.json({ success: false, error: "Failed to update student application" }, { status: 500 });
  }
}

