import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import QRCode from "qrcode";
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
 * Sends a transactional email using the configured SMTP server.
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
 * Generates the official student ticket PNG image and PDF pass, and dispatches the confirmation email.
 */
export async function sendStudentApprovalEmail(
  student: StudentApplication,
  customBadgeBuffer?: Buffer
) {
  if (!student.email) {
    return { success: false, error: "Recipient email is missing." };
  }

  const badgeId = student.badgeId || `HFT-2026-${student.id.slice(-4).toUpperCase()}`;
  const fullName = `${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student";
  const cleanName = fullName.replace(/[^a-zA-Z0-9_-]/g, "_");

  // 1. Generate downloadable High-Res PNG Image and Printable PDF Landscape Ticket
  let pngBuffer: Buffer = Buffer.from("");
  let pdfBuffer: Buffer = Buffer.from("");
  let qrBuffer: Buffer = Buffer.from("");
  let logoBuffer: Buffer = Buffer.from("");

  try {
    pngBuffer = await generateStudentBadgePngBuffer(student);
    pdfBuffer = customBadgeBuffer || (await generateStudentBadgePdfBuffer(student, pngBuffer));
  } catch (err: any) {
    console.error("[BADGE ERROR] Failed to generate ticket image/PDF buffer:", err);
  }

  // 2. Generate inline CID QR Code buffer (Guarantees display in Gmail and all email clients)
  try {
    qrBuffer = await QRCode.toBuffer(
      `https://hisfuturetalents.his.edu.dz/verify?id=${student.id}&code=${badgeId}&name=${encodeURIComponent(fullName)}`,
      {
        margin: 1,
        width: 300,
        color: {
          dark: "#001C3D",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "M",
      }
    );
  } catch (qrErr) {
    console.error("[QR ERROR] Failed to generate QR buffer:", qrErr);
  }

  // 3. Generate inline CID white logo buffer from logo-hft-white.svg
  try {
    const logoSvgPath = path.join(process.cwd(), "public", "logo-hft-white.svg");
    if (fs.existsSync(logoSvgPath)) {
      const logoSvg = fs.readFileSync(logoSvgPath);
      logoBuffer = await sharp(logoSvg).png().toBuffer();
    }
  } catch (logoErr) {
    console.error("[LOGO ERROR] Failed to generate logo buffer:", logoErr);
  }

  // 4. Generate HTML template
  const html = await generateApprovalEmailHtml({
    studentId: student.id,
    firstName: student.firstName || "",
    lastName: student.lastName || "",
    badgeId: badgeId,
    fieldOfStudyOrWork: student.fieldOfStudyOrWork,
    university: student.university,
  });

  const attachments: Array<{ filename: string; content?: Buffer; contentType?: string; cid?: string }> = [];

  // Inline CID image: Scannable QR Code
  if (qrBuffer && qrBuffer.length > 0) {
    attachments.push({
      filename: "ticket-qr.png",
      content: qrBuffer,
      contentType: "image/png",
      cid: "ticket_qr_code",
    });
  }

  // Inline CID image: White Header Logo
  if (logoBuffer && logoBuffer.length > 0) {
    attachments.push({
      filename: "hft-logo-white.png",
      content: logoBuffer,
      contentType: "image/png",
      cid: "hft_logo_white",
    });
  }

  // Downloadable PNG image attachment
  if (pngBuffer && pngBuffer.length > 0) {
    attachments.push({
      filename: `Pass-Ticket-HFT2026-${cleanName}.png`,
      content: pngBuffer,
      contentType: "image/png",
    });
  }

  // Downloadable PDF document attachment
  if (pdfBuffer && pdfBuffer.length > 0) {
    attachments.push({
      filename: `Pass-Ticket-HFT2026-${cleanName}.pdf`,
      content: pdfBuffer,
      contentType: "application/pdf",
    });
  }

  // 5. Dispatch the email
  return sendEmail({
    to: student.email,
    subject: "Registration Confirmation & Official Event Pass - HIS Future Talents 2026",
    html: html,
    text: `This email is to confirm your registration for the HIS Future Talents 2026 event on September 29, 2026 at HIS University Algiers.\n\nPlease find attached your official event registration ticket.\n\nTo stay informed on all event updates, we highly recommend following our official social media account @hisfuturetalents.\n\nThank you for your participation and we look forward to welcoming you at the event.\n\nBest,\nHIS Future Talents Team`,
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
