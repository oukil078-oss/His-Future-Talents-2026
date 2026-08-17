import sharp from "sharp";
import QRCode from "qrcode";
import { PDFDocument } from "pdf-lib";
import { StudentApplication } from "@/lib/dataStore";

/**
 * Generates the SVG source for the official student badge.
 * Matches 100% the physical badge design on the website:
 * - Rounded Dark Navy background with hole punch (#091320 -> #0D1F38 -> #050D18)
 * - Header with HFT logo & Edition 3 • 2026 | RÉF
 * - Central White Card with Orange-Gold role strip, bold student names, field, and QR code
 * - Lower Slogan & Date/Time/Location Pills
 * - Footer with confirmed status & reception scan text
 */
export async function generateStudentBadgeSvg(student: StudentApplication): Promise<string> {
  const badgeId = student.badgeId || `HFT-2026-${student.id.slice(-4).toUpperCase()}`;
  const firstName = (student.firstName || "").toUpperCase();
  const lastName = (student.lastName || "").toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim() || "TALENT ÉTUDIANT";
  const domain = (student.fieldOfStudyOrWork || student.currentStatus || "INFORMATIQUE & INNOVATION").trim().toUpperCase();
  const email = (student.email || "").trim();
  const phone = (student.phone || "").trim();
  const wilaya = (student.wilaya || "Alger").trim();
  const university = (student.university || "HIS University").trim();
  const isConfirmed = student.status === "Confirmé";

  const qrDataUrl = await QRCode.toDataURL(
    `https://hisfuturetalents.his.edu.dz/verify?id=${student.id}&code=${badgeId}&name=${encodeURIComponent(fullName)}`,
    {
      margin: 1,
      width: 400,
      color: { dark: "#06101D", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    }
  );

  const roleText = isConfirmed ? "ACCÈS CONFIRMÉ • ÉTUDIANT" : "VISITEUR OFFICIEL • ÉTUDIANT";
  const statusText = isConfirmed ? "ACCÈS CONFIRMÉ" : "⏳ EN ATTENTE DE CONFIRMATION";
  const statusBg = isConfirmed ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)";
  const statusBorder = isConfirmed ? "#10B981" : "#F59E0B";
  const statusColor = isConfirmed ? "#34D399" : "#FCD34D";

  return `
<svg width="600" height="960" viewBox="0 0 600 960" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#091320" />
      <stop offset="60%" stop-color="#0D1F38" />
      <stop offset="100%" stop-color="#050D18" />
    </linearGradient>
    <linearGradient id="bannerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F05A22" />
      <stop offset="50%" stop-color="#FFBD0E" />
      <stop offset="100%" stop-color="#F05A22" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Outer Card Background -->
  <rect x="12" y="12" width="576" height="936" rx="44" fill="url(#bgGrad)" stroke="rgba(255,255,255,0.18)" stroke-width="2" filter="url(#cardShadow)" />

  <!-- Top Hole Punch -->
  <circle cx="300" cy="48" r="14" fill="#050D18" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
  <circle cx="300" cy="48" r="6" fill="#091320"/>

  <!-- Header Row -->
  <!-- Logo Left -->
  <g transform="translate(44, 86)">
    <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="18" fill="#ffffff" letter-spacing="-0.5">His</text>
    <text x="0" y="32" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="18" fill="#ffffff" letter-spacing="-0.5">Future</text>
    <text x="0" y="46" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="14" fill="#ffffff" letter-spacing="-0.5">Talents</text>
  </g>

  <!-- Edition / Ref Right -->
  <g transform="translate(556, 100)" text-anchor="end">
    <text x="0" y="12" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="15" fill="#FFBD0E" letter-spacing="1">ÉDITION 3 • 2026</text>
    <text x="0" y="32" font-family="monospace, Courier" font-weight="700" font-size="13" fill="rgba(255,255,255,0.6)" letter-spacing="1.5">RÉF: ${badgeId}</text>
  </g>

  <!-- Divider under header -->
  <line x1="44" y1="152" x2="556" y2="152" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>

  <!-- ── CENTRAL WHITE STUDENT CARD ── -->
  <g transform="translate(44, 176)">
    <!-- White Box Background with Soft Shadow -->
    <rect x="0" y="0" width="512" height="490" rx="36" fill="#ffffff" filter="url(#cardShadow)"/>

    <!-- Top Vibrant Role Banner Strip -->
    <path d="M 0 36 A 36 36 0 0 1 36 0 L 476 0 A 36 36 0 0 1 512 36 L 512 56 L 0 56 Z" fill="url(#bannerGrad)" />
    <text x="256" y="36" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="14" fill="#091320" text-anchor="middle" letter-spacing="2">${roleText}</text>

    <!-- Student Name -->
    <text x="256" y="145" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="34" fill="#091320" text-anchor="middle" letter-spacing="-0.5">${firstName}</text>
    <text x="256" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="34" fill="#003876" text-anchor="middle" letter-spacing="-0.5">${lastName}</text>

    <!-- Domain -->
    <text x="256" y="245" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="16" fill="#F05A22" text-anchor="middle" letter-spacing="2">${domain}</text>

    <!-- Inner Divider -->
    <line x1="28" y1="285" x2="484" y2="285" stroke="#f1f5f9" stroke-width="2"/>

    <!-- Details Left -->
    <g transform="translate(28, 335)">
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="16" fill="#0f172a">${email}</text>
      <text x="0" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="15" fill="#64748b">${phone} • ${wilaya}</text>
      <text x="0" y="74" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="15" fill="#003876">${university}</text>
    </g>

    <!-- QR Code Right -->
    <rect x="340" y="305" width="144" height="144" rx="18" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <image x="348" y="313" width="128" height="128" href="${qrDataUrl}" />
  </g>

  <!-- ── LOWER SLOGAN & EVENT DETAILS ── -->
  <!-- Left Graphic Slogan -->
  <g transform="translate(44, 715)">
    <text x="0" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="16" fill="#ffffff" letter-spacing="0.5">FAÇONNER L'AVENIR DES TALENTS</text>
    <text x="0" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="16" fill="#FFBD0E" letter-spacing="0.5">&amp; INNOVATIONS EN ALGÉRIE</text>
    <text x="0" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="11" fill="rgba(255,255,255,0.5)" letter-spacing="2">HIS FUTURE TALENTS 2026</text>
  </g>

  <!-- Right Stacked Info Pills -->
  <g transform="translate(556, 705)" text-anchor="end">
    <!-- Date Pill -->
    <rect x="-150" y="0" width="150" height="28" rx="8" fill="rgba(240,90,34,0.2)" stroke="rgba(240,90,34,0.5)" stroke-width="1.5"/>
    <text x="-75" y="19" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="12" fill="#FFBD0E" text-anchor="middle" letter-spacing="1">13–14 MAI 2026</text>

    <!-- Time Pill -->
    <rect x="-120" y="36" width="120" height="26" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    <text x="-60" y="53" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="700" font-size="11" fill="#ffffff" text-anchor="middle" letter-spacing="1">09:00 - 17:00</text>

    <!-- Place Pill -->
    <rect x="-190" y="70" width="190" height="26" rx="8" fill="rgba(0,56,118,0.6)" stroke="rgba(88,185,255,0.4)" stroke-width="1"/>
    <text x="-95" y="87" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="11" fill="#58B9FF" text-anchor="middle" letter-spacing="1">HIS UNIVERSITY, ALGER</text>
  </g>

  <!-- Footer Divider -->
  <line x1="44" y1="835" x2="556" y2="835" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>

  <!-- Footer Row -->
  <g transform="translate(44, 855)">
    <!-- Status Pill -->
    <rect x="0" y="0" width="280" height="30" rx="8" fill="${statusBg}" stroke="${statusBorder}" stroke-width="1"/>
    <text x="140" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="900" font-size="11" fill="${statusColor}" text-anchor="middle" letter-spacing="1">${statusText}</text>

    <!-- Scanner text -->
    <text x="512" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-weight="800" font-size="11" fill="rgba(255,255,255,0.4)" text-anchor="end" letter-spacing="2">SCANNER RÉCEPTION</text>
  </g>
</svg>
  `.trim();
}

/**
 * Generates an exact high-resolution PNG buffer of the Pass Badge.
 */
export async function generateStudentBadgePngBuffer(student: StudentApplication): Promise<Buffer> {
  const svg = await generateStudentBadgeSvg(student);
  return sharp(Buffer.from(svg)).png({ quality: 100 }).toBuffer();
}

/**
 * Generates an exact replica of the Pass Badge in PDF format.
 * Embeds the high-resolution badge image onto a clean, printable PDF page.
 */
export async function generateStudentBadgePdfBuffer(
  student: StudentApplication,
  providedPngBuffer?: Buffer
): Promise<Buffer> {
  const pngBuffer = providedPngBuffer || (await generateStudentBadgePngBuffer(student));
  
  const pdfDoc = await PDFDocument.create();
  // Standard portrait badge page dimensions (300 x 480 pt)
  const page = pdfDoc.addPage([300, 480]);
  const pngImage = await pdfDoc.embedPng(pngBuffer);

  page.drawImage(pngImage, {
    x: 0,
    y: 0,
    width: 300,
    height: 480,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
