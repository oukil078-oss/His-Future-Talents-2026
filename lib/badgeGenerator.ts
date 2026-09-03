import sharp from "sharp";
import QRCode from "qrcode";
import { PDFDocument } from "pdf-lib";
import { StudentApplication } from "@/lib/dataStore";

/**
 * Generates the SVG source for the official student ticket/badge.
 * Matches 100% the landscape event ticket design from Image 2:
 * - Top Brand Banner: Deep Blue gradient with digital wave mesh, dot-matrix pattern,
 *   institutional patronage on top-left, location & dates on top-right, center HFT brand logo,
 *   and event category pill on bottom-right.
 * - Bottom White Section: Event Title, Inscription N° [BadgeId], Full Name in bold uppercase,
 *   Profession / Field of Study & University, Venue & Date on left,
 *   and large crisp scannable QR code on right.
 */
function escapeXml(unsafe: string): string {
  return (unsafe || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function generateStudentBadgeSvg(student: StudentApplication): Promise<string> {
  const badgeId = escapeXml(student.badgeId || `HFT-2026-${(student.id || "PASS").slice(-4).toUpperCase()}`);
  const fullName = escapeXml(`${student.firstName || ""} ${student.lastName || ""}`.trim().toUpperCase() || "STUDENT ATTENDEE");
  const domain = escapeXml((student.fieldOfStudyOrWork || student.currentStatus || "COMPUTER SCIENCE & AI").trim().toUpperCase());
  const university = escapeXml((student.university || "HIS University").trim().toUpperCase());
  const professionText = `${domain} • ${university}`;

  const qrDataUrl = await QRCode.toDataURL(
    `https://hisfuturetalents.his.edu.dz/verify?id=${student.id}&code=${badgeId}&name=${encodeURIComponent(fullName)}`,
    {
      margin: 1,
      width: 400,
      color: { dark: "#00224A", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    }
  );

  return `
<svg width="1000" height="580" viewBox="0 0 1000 580" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- HIS Official Deep Blue / Navy Gradient -->
    <linearGradient id="topBannerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#001B3A" />
      <stop offset="35%" stop-color="#003876" />
      <stop offset="75%" stop-color="#00224A" />
      <stop offset="100%" stop-color="#0A1424" />
    </linearGradient>

    <!-- HIS Electric Blue & Orange Wave Accents -->
    <linearGradient id="hftWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F05A22" stop-opacity="0.18" />
      <stop offset="50%" stop-color="#58B9FF" stop-opacity="0.30" />
      <stop offset="100%" stop-color="#FFBD0E" stop-opacity="0.22" />
    </linearGradient>

    <!-- Clip Path for Rounded Ticket -->
    <clipPath id="ticketClip">
      <rect x="0" y="0" width="1000" height="580" rx="28" ry="28" />
    </clipPath>
  </defs>

  <!-- Main Card Container -->
  <g clip-path="url(#ticketClip)">
    
    <!-- ════════════════════ TOP SECTION (HIS FUTURE TALENTS BRANDING) ════════════════════ -->
    <rect x="0" y="0" width="1000" height="315" fill="url(#topBannerGrad)" />

    <!-- Ambient Waves in Top Banner -->
    <path d="M -100 230 Q 200 70 500 190 T 1100 110 L 1100 0 L -100 0 Z" fill="url(#hftWaveGrad)" />
    <path d="M -50 270 Q 250 130 550 250 T 1150 170 L 1150 0 L -50 0 Z" fill="none" stroke="#58B9FF" stroke-width="1.5" stroke-opacity="0.35" />
    <path d="M -50 250 Q 280 100 580 220 T 1150 140 L 1150 0 L -50 0 Z" fill="none" stroke="#F05A22" stroke-width="1.2" stroke-opacity="0.25" />

    <!-- Left Dot Matrix Pattern in HIS Electric Blue (5x5 grid) -->
    <g transform="translate(36, 105)" opacity="0.45">
      <circle cx="0" cy="0" r="2.5" fill="#58B9FF"/>
      <circle cx="16" cy="0" r="2.5" fill="#58B9FF"/>
      <circle cx="32" cy="0" r="2.5" fill="#58B9FF"/>
      <circle cx="48" cy="0" r="2.5" fill="#58B9FF"/>
      <circle cx="64" cy="0" r="2.5" fill="#58B9FF"/>

      <circle cx="0" cy="16" r="2.5" fill="#58B9FF"/>
      <circle cx="16" cy="16" r="2.5" fill="#58B9FF"/>
      <circle cx="32" cy="16" r="2.5" fill="#58B9FF"/>
      <circle cx="48" cy="16" r="2.5" fill="#58B9FF"/>
      <circle cx="64" cy="16" r="2.5" fill="#58B9FF"/>

      <circle cx="0" cy="32" r="2.5" fill="#58B9FF"/>
      <circle cx="16" cy="32" r="2.5" fill="#58B9FF"/>
      <circle cx="32" cy="32" r="2.5" fill="#58B9FF"/>
      <circle cx="48" cy="32" r="2.5" fill="#58B9FF"/>
      <circle cx="64" cy="32" r="2.5" fill="#58B9FF"/>

      <circle cx="0" cy="48" r="2.5" fill="#58B9FF"/>
      <circle cx="16" cy="48" r="2.5" fill="#58B9FF"/>
      <circle cx="32" cy="48" r="2.5" fill="#58B9FF"/>
      <circle cx="48" cy="48" r="2.5" fill="#58B9FF"/>
      <circle cx="64" cy="48" r="2.5" fill="#58B9FF"/>

      <circle cx="0" cy="64" r="2.5" fill="#58B9FF"/>
      <circle cx="16" cy="64" r="2.5" fill="#58B9FF"/>
      <circle cx="32" cy="64" r="2.5" fill="#58B9FF"/>
      <circle cx="48" cy="64" r="2.5" fill="#58B9FF"/>
      <circle cx="64" cy="64" r="2.5" fill="#58B9FF"/>
    </g>

    <!-- Top Left Institutional Header Text in HFT Gold -->
    <g transform="translate(36, 36)">
      <text x="0" y="0" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11" fill="#FFBD0E" letter-spacing="1.2">UNDER THE HIGH PATRONAGE OF</text>
      <text x="0" y="15" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="9.5" fill="#FFFFFF" letter-spacing="0.8">MINISTRY OF HIGHER EDUCATION &amp; S.R</text>
      <text x="0" y="28" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="9.5" fill="#CBD5E1" letter-spacing="0.8">MINISTRY OF KNOWLEDGE ECONOMY &amp; STARTUPS</text>
    </g>

    <!-- Top Right Location & Dates Text in HFT Palette -->
    <g transform="translate(964, 36)" text-anchor="end">
      <text x="0" y="0" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11.5" fill="#FFFFFF" letter-spacing="1.5">HIS UNIVERSITY</text>
      <text x="0" y="15" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="10.5" fill="#58B9FF" letter-spacing="1.5">ALGIERS</text>
      <text x="0" y="38" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="22" fill="#FFBD0E" letter-spacing="0.5">29</text>
      <text x="0" y="55" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" letter-spacing="2">SEPTEMBER 2026</text>
    </g>

    <!-- ── CENTER OFFICIAL HIS FUTURE TALENTS LOGO + SLOGAN ── -->
    <g transform="translate(500, 138)">
      <!-- Official Vector Brand Logo from logo-hft-white.svg -->
      <g transform="translate(-105, -84) scale(0.55)">
        <g>
          <path fill="#ffffff" d="m127.12,226.12v13.4h-4.03c-7.64,0-12.65-2.76-14.73-8.08-4.25,6.06-10.47,9.36-18.1,9.36-12.54,0-20.94-8.19-20.94-20.74v-34.79h14.18v30.75c0,6.91,4.58,11.38,11.45,11.38,7.31,0,12.21-4.57,12.21-11.6v-30.53h14.18v36.28c0,2.87,1.75,4.58,4.69,4.58h1.09Z"/>
          <path fill="#ffffff" d="m150.59,197.92v22.13c0,4.25,2.73,6.81,7.31,6.81h5.56v12.66h-7.63c-12.76,0-19.42-5.96-19.42-17.13v-24.47h-8.83v-12.66h5.12c2.95,0,4.48-1.49,4.48-4.36v-10.11h13.41v14.47h12.87v12.66h-12.87Z"/>
          <path fill="#ffffff" d="m226.71,226.12v13.4h-4.03c-7.64,0-12.65-2.76-14.73-8.08-4.25,6.06-10.47,9.36-18.1,9.36-12.54,0-20.94-8.19-20.94-20.74v-34.79h14.18v30.75c0,6.91,4.58,11.38,11.45,11.38,7.31,0,12.21-4.57,12.21-11.6v-30.53h14.18v36.28c0,2.87,1.75,4.58,4.69,4.58h1.09Z"/>
          <path fill="#ffffff" d="m288.03,226.12v13.4h-3.6c-14.73,0-22.47-8.08-22.47-21.49,0-5.1,1.31-10.53,4.14-16.06l-16.57-2.13-7.75,39.69h-13.96l8.73-42.88c-2.95-1.81-4.8-5.21-4.8-8.94,0-5.21,3.82-8.83,9.38-8.83s9.27,3.4,9.82,7.87l35.11,4.04v3.3c-6.1,8.4-9.59,15.96-9.59,22.24s3.38,9.79,9.27,9.79h2.29Z"/>
          <path fill="#ffffff" d="m347.36,217.18h-44.17c1.85,6.91,7.53,11.38,15.16,11.38,5.78,0,10.8-2.44,13.2-5.96h15.37c-4.25,10.85-15.26,18.19-28.79,18.19-17.23,0-30.1-12.23-30.1-28.41s12.87-28.41,29.88-28.41,29.89,12.24,29.89,28.52c0,1.38-.11,3.4-.44,4.68Zm-43.95-10.11h29.12c-1.86-6.59-7.64-10.96-14.62-10.96s-12.65,4.36-14.5,10.96Z"/>
        </g>
        <g>
          <path fill="#ffffff" d="m63.24,262.05h-20.5v59.58h-15.05v-59.58H7.2v-13.83h56.05v13.83Z"/>
          <path fill="#ffffff" d="m122.26,308.22v13.4h-4.04c-7.85,0-12.87-2.87-14.94-8.51-4.36,6.07-11.01,9.79-19.08,9.79-15.49,0-27.16-12.23-27.16-28.41s11.67-28.41,27.16-28.41c7.52,0,13.74,3.19,18.1,8.4v-7.12h14.18v36.28c0,2.87,1.63,4.58,4.69,4.58h1.09Zm-19.96-13.73c0-8.51-6.54-15-15.38-15s-15.27,6.49-15.27,15,6.55,15,15.27,15,15.38-6.49,15.38-15Z"/>
          <path fill="#ffffff" d="m169.27,308.22v13.4h-4.14c-8.4,0-15.82-2.55-21.92-7.02-4.15,2.87-8.73,5.32-13.75,7.02l-5.45-11.06c3.6-1.49,6.98-3.3,10.03-5.53-5.78-8.3-9.05-19.36-9.05-31.81,0-18.94,8.73-29.47,21.82-29.47s20.72,9.57,20.72,25.96c0,12.77-4.91,25.21-13.42,35.11,3.38,2.23,7.42,3.4,11.78,3.4h3.38Zm-29.66-35.97c0,8.41,1.85,16.07,5.12,22.13,5.24-7.23,8.18-15.75,8.18-24.68,0-8.19-2.4-12.55-6.32-12.55-4.26,0-6.98,4.78-6.98,15.1Z"/>
          <path fill="#ffffff" d="m228.83,299.28h-44.17c1.85,6.91,7.53,11.38,15.16,11.38,5.78,0,10.8-2.44,13.2-5.96h15.37c-4.25,10.85-15.26,18.19-28.79,18.19-17.23,0-30.1-12.23-30.1-28.41s12.87-28.41,29.88-28.41,29.89,12.24,29.89,28.52c0,1.38-.11,3.4-.44,4.68Zm-43.95-10.11h29.12c-1.86-6.59-7.64-10.96-14.62-10.96s-12.65,4.36-14.5,10.96Z"/>
          <path fill="#ffffff" d="m294.28,308.22v13.4h-4.03c-10.58,0-16.04-5.1-16.04-15v-15c0-7.34-4.8-12.13-12.1-12.13-7.85,0-13.09,4.89-13.09,12.34v29.79h-14.18v-54.26h14.18v6.7c4.25-5.21,10.36-7.98,17.67-7.98,13.09,0,21.7,8.3,21.7,21.07v16.49c0,2.87,1.75,4.58,4.69,4.58h1.2Z"/>
          <path fill="#ffffff" d="m316.21,280.03v22.13c0,4.25,2.73,6.81,7.31,6.81h5.56v12.66h-7.63c-12.76,0-19.42-5.96-19.42-17.13v-24.47h-8.83v-12.66h5.12c2.95,0,4.48-1.49,4.48-4.36v-10.11h13.41v14.47h12.87v12.66h-12.87Z"/>
          <path fill="#ffffff" d="m389.63,300.78c0,13.08-8.73,22.13-23.02,22.13-8.72,0-16.36-3.29-21.48-8.61l-3.16,7.34h-14.62l24-54.26h16.25c2.5,14.04,22.03,13.83,22.03,33.41Zm-14.62-.32c0-7.77-10.69-10.21-15.81-18.83l-9.16,21.17c2.83,4.04,8.07,6.7,13.85,6.7,6.65,0,11.12-3.51,11.12-9.04Z"/>
        </g>
        <g>
          <path fill="#ffffff" d="m71.25,83.16v73.41h-15.05v-30H22.82v30H7.78v-73.41h15.05v29.58h33.38v-29.58h15.05Z"/>
          <path fill="#ffffff" d="m79.67,85.72c0-4.89,3.92-8.62,8.94-8.62s8.94,3.72,8.94,8.62-3.92,8.61-8.94,8.61-8.94-3.72-8.94-8.61Zm1.85,16.6h14.18v54.26h-14.18v-54.26Z"/>
          <path fill="#ffffff" d="m158.08,135.72c0,13.08-8.73,22.13-23.02,22.13-8.72,0-16.36-3.29-21.48-8.61l-3.16,7.34h-14.62l24-54.26h16.25c2.5,14.04,22.03,13.83,22.03,33.41Zm-14.62-.32c0-7.76-10.69-10.21-15.81-18.83l-9.16,21.17c2.83,4.04,8.07,6.7,13.85,6.7,6.65,0,11.12-3.51,11.12-9.04Z"/>
        </g>
        <g>
          <rect fill="#ffbd0e" x="302.88" y="143.4" width="32.91" height="14.09" transform="translate(131.13 449.1) rotate(-83.01)"/>
          <rect fill="#ffbd0e" x="333.72" y="144.89" width="42.58" height="14.09" transform="translate(35.4 368.65) rotate(-57.31)"/>
          <rect fill="#ffbd0e" x="357.57" y="174.85" width="33.86" height="14.09" transform="translate(-41.83 184.44) rotate(-26.26)"/>
        </g>
        <path fill="#f05a22" d="m42.33,181.19c6.84-1.3,14.1-1.37,21.08-.27v-13.28c-20.4-1.85-53.32,3.63-52.98,29.64.62,4.72,2.46,9.04,5.2,12.8-.82,1.23-1.57,2.53-2.19,3.9-4.04,8.76-4.93,17.66-5.27,26.01l14.37.34c-.27-7.46.89-14.78,3.7-20.88,9.38,5.27,21.15,6.16,30.32-.34,8.14-5.34,9.58-19.71.14-24.44-11.16-5.13-23.75-1.51-32.92,6.16-.75-1.51-1.23-3.08-1.44-4.65.14-9.38,11.09-13.07,19.99-14.99Zm5.61,22.93c4.86-.27,5.68,2.67,1.71,5.95-4.72,3.08-10.95,2.53-16.29-.14,3.76-3.15,8.56-5.27,14.58-5.82Z"/>
      </g>

      <!-- Slogan under official logo in bold HFT Gold -->
      <text x="0" y="102" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="11.5" fill="#FFBD0E" letter-spacing="2.8" text-anchor="middle">FROM POTENTIAL TO PROFESSION</text>
    </g>

    <!-- Bottom Separator Line & Event Highlights Text in Top Banner -->
    <line x1="36" y1="264" x2="964" y2="264" stroke="#FFFFFF" stroke-opacity="0.15" stroke-width="1" />
    <g transform="translate(964, 284)" text-anchor="end">
      <text x="0" y="0" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="10.5" fill="#FFBD0E" letter-spacing="1.2">THE #1 TALENT &amp; RECRUITMENT FAIR IN ALGERIA</text>
      <text x="0" y="16" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="9" fill="#E2E8F0" letter-spacing="0.8">INTERNSHIPS, JOBS, NETWORKING, WORKSHOPS &amp; CONFERENCES</text>
    </g>

    <!-- ════════════════════ BOTTOM SECTION (USER DETAILS + QR CODE) ════════════════════ -->
    <rect x="0" y="315" width="1000" height="265" fill="#FFFFFF" />

    <!-- Bottom Left: Participant Details -->
    <g transform="translate(48, 356)">
      <!-- Event Name & Category Title in HIS Deep Navy -->
      <text x="0" y="0" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="23" fill="#003876" letter-spacing="0.5">HIS FUTURE TALENTS 2026</text>

      <!-- Inscription Reference Number -->
      <g transform="translate(0, 16)">
        <text x="0" y="18" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="14.5" fill="#334155">
          Registration N° <tspan font-family="monospace, Courier" font-weight="900" font-size="16" fill="#F05A22">${badgeId}</tspan>
        </text>
      </g>

      <!-- Full Name & Profession -->
      <g transform="translate(0, 66)">
        <text x="0" y="0" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="24" fill="#00224A" letter-spacing="0.5">
          ${fullName}
        </text>
        <text x="0" y="24" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="14.5" fill="#F05A22" letter-spacing="0.5">
          ${professionText}
        </text>
      </g>

      <!-- Divider line -->
      <line x1="0" y1="112" x2="640" y2="112" stroke="#E2E8F0" stroke-width="1.5" />

      <!-- Venue & Date -->
      <g transform="translate(0, 134)">
        <text x="0" y="0" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="13" fill="#475569">
          Campus HIS University, Bordj El Kiffan, Algiers
        </text>
        <text x="0" y="20" font-family="'DejaVu Sans', 'Noto Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="13.5" fill="#003876">
          Tuesday, September 29, 2026 from 08:30 AM
        </text>
      </g>
    </g>

    <!-- Bottom Right: Crisp Scannable QR Code -->
    <g transform="translate(730, 335)">
      <rect x="0" y="0" width="220" height="220" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
      <image x="12" y="12" width="196" height="196" href="${qrDataUrl}" />
    </g>

  </g>

  <!-- Outer Border Stroke with HIS Deep Blue tone -->
  <rect x="1" y="1" width="998" height="578" rx="28" ry="28" fill="none" stroke="#003876" stroke-opacity="0.25" stroke-width="2" />
</svg>
  `.trim();
}

/**
 * Generates an exact high-resolution PNG buffer of the official Ticket Pass.
 */
export async function generateStudentBadgePngBuffer(student: StudentApplication): Promise<Buffer> {
  const svg = await generateStudentBadgeSvg(student);
  return sharp(Buffer.from(svg)).png({ quality: 100 }).toBuffer();
}

/**
 * Generates an exact replica of the official Ticket Pass in PDF format.
 * Embeds the high-resolution landscape ticket onto a clean printable PDF page.
 */
export async function generateStudentBadgePdfBuffer(
  student: StudentApplication,
  providedPngBuffer?: Buffer
): Promise<Buffer> {
  const pngBuffer = providedPngBuffer || (await generateStudentBadgePngBuffer(student));
  
  const pdfDoc = await PDFDocument.create();
  // Standard landscape ticket page dimensions matching exact 1000:580 ratio (595 x 355 pt)
  const page = pdfDoc.addPage([595, 355]);
  const pngImage = await pdfDoc.embedPng(pngBuffer);

  page.drawImage(pngImage, {
    x: 10,
    y: 10.75,
    width: 575,
    height: 333.5,
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
