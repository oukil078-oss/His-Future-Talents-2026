import nodemailer from "nodemailer";
import { StudentApplication } from "@/lib/dataStore";
import { generateApprovalEmailHtml } from "@/lib/emailTemplates";
import {
  generateStudentBadgePngBuffer,
  generateStudentBadgePdfBuffer,
} from "@/lib/badgeGenerator";

// 1. SMTP Transporter Singleton with connection pooling
let transporterInstance: nodemailer.Transporter | null = null;

export function getTransporter(): nodemailer.Transporter {
  if (!transporterInstance) {
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

    transporterInstance = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "nodels3-ca.n0c.com",
      port: port,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER || "hisfuturetalents@his.edu.dz",
        pass: process.env.SMTP_PASS || "3aJMe/}M;N",
      },
      tls: {
        rejectUnauthorized: true,
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100,
    });
  }

  return transporterInstance;
}

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content?: Buffer | string;
    path?: string;
    contentType?: string;
    cid?: string;
  }>;
}

/**
 * Sends a generic transactional email using the configured SMTP server.
 */
export async function sendEmail(options: SendMailOptions) {
  try {
    const transporter = getTransporter();
    const fromAddress =
      process.env.SMTP_FROM || '"HIS Future Talents" <hisfuturetalents@his.edu.dz>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      text: options.text || "",
      html: options.html,
      attachments: options.attachments || [],
    });

    console.log(`[SMTP SUCCESS] Email delivered to ${options.to} (MessageID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[SMTP ERROR] Failed to send email to ${options.to}:`, error);
    return { success: false, error: error?.message || "Unknown SMTP Error" };
  }
}

/**
 * Generates the official student badge PNG image and PDF document, and sends the approval confirmation email.
 */
export async function sendStudentApprovalEmail(
  student: StudentApplication,
  customBadgeBuffer?: Buffer
) {
  if (!student.email) {
    return { success: false, error: "Recipient email is missing." };
  }

  const badgeId = student.badgeId || `HFT-2026-${student.id.slice(-4).toUpperCase()}`;
  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Étudiant";
  const cleanName = fullName.replace(/[^a-zA-Z0-9_-]/g, "_");

  // 1. Generate both High-Res PNG Image and Printable PDF Badge
  let pngBuffer: Buffer = Buffer.from("");
  let pdfBuffer: Buffer = Buffer.from("");

  try {
    pngBuffer = await generateStudentBadgePngBuffer(student);
    pdfBuffer = customBadgeBuffer || (await generateStudentBadgePdfBuffer(student, pngBuffer));
  } catch (err: any) {
    console.error("[BADGE ERROR] Failed to generate badge image/PDF buffer:", err);
  }

  // 2. Generate HTML template
  const html = await generateApprovalEmailHtml({
    studentId: student.id,
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    badgeId: badgeId,
    fieldOfStudyOrWork: student.fieldOfStudyOrWork,
    university: student.university,
  });

  const attachments: Array<{ filename: string; content?: Buffer; contentType?: string; cid?: string }> = [];

  // Add PNG image attachment
  if (pngBuffer && pngBuffer.length > 0) {
    attachments.push({
      filename: `Badge-HFT2026-${cleanName}.png`,
      content: pngBuffer,
      contentType: "image/png",
    });
  }

  // Add PDF document attachment
  if (pdfBuffer && pdfBuffer.length > 0) {
    attachments.push({
      filename: `Pass-Badge-HFT2026-${cleanName}.pdf`,
      content: pdfBuffer,
      contentType: "application/pdf",
    });
  }

  // 3. Dispatch the email
  return sendEmail({
    to: student.email,
    subject: "Confirmation d'accréditation & Badge Officiel - HIS Future Talents 2026",
    html: html,
    text: `Bonjour ${fullName},\n\nVotre candidature pour l'événement HIS Future Talents 2026 a été approuvée !\nVotre ID Badge : ${badgeId}\n\nVeuillez trouver votre badge officiel au format Image PNG et au format PDF en pièces jointes.\n\nL'équipe HIS Future Talents`,
    attachments: attachments,
  });
}

/**
 * Utility to verify SMTP credentials and server connectivity.
 */
export async function verifySmtpConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    return { success: true, message: "SMTP server connection verified successfully." };
  } catch (error: any) {
    console.error("[SMTP VERIFY ERROR]:", error);
    return { success: false, message: error?.message || "Failed to connect to SMTP server." };
  }
}
