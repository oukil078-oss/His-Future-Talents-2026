import QRCode from "qrcode";

export interface ApprovalEmailData {
  studentId?: string;
  firstName: string;
  lastName: string;
  badgeId: string;
  fieldOfStudyOrWork?: string;
  university?: string;
  eventDate?: string;
  eventLocation?: string;
}

export async function generateApprovalEmailHtml(data: ApprovalEmailData): Promise<string> {
  const firstName = (data.firstName || "").toUpperCase();
  const lastName = (data.lastName || "").toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim() || "TALENT ÉTUDIANT";
  const badgeId = data.badgeId || "HFT-2026-3034";
  const domain = (data.fieldOfStudyOrWork || "Informatique & Innovation").trim();
  const university = (data.university || "HIS University").trim();
  const location = data.eventLocation || "HIS University, Alger";

  // Generate crisp QR code data url for the email preview
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(
      `https://hisfuturetalents.his.edu.dz/verify?id=${data.studentId || ""}&code=${badgeId}&name=${encodeURIComponent(fullName)}`,
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
  } catch (e) {
    console.error("Error generating QR for email template:", e);
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmation & Official Pass - HIS Future Talents 2026</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #F1F5F9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0F172A;
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #F1F5F9;
      padding: 36px 12px;
    }
    .main-card {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FFFFFF;
      border-radius: 20px;
      border: 1px solid #E2E8F0;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
    }
    .content-body {
      padding: 40px 32px;
    }
    .main-paragraph {
      font-size: 16px;
      color: #1E293B;
      margin-bottom: 24px;
      font-weight: 500;
    }
    .ticket-alert {
      font-size: 17px;
      font-style: italic;
      font-weight: 800;
      color: #002855;
      margin: 28px 0;
    }
    .ticket-alert mark {
      background-color: #FEF08A;
      color: #002855;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .highlight-word {
      background-color: #FEF08A;
      padding: 1px 4px;
      border-radius: 3px;
    }
    
    /* ── LANDSCAPE TICKET PREVIEW IN EMAIL ── */
    .ticket-container {
      margin: 28px 0;
      border-radius: 16px;
      border: 1px solid #CBD5E1;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0, 34, 74, 0.12);
      background-color: #FFFFFF;
    }
    .ticket-top {
      background: linear-gradient(135deg, #001B3A 0%, #003876 50%, #0A1424 100%);
      padding: 18px 20px;
      color: #FFFFFF;
    }
    .ticket-title {
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #FFFFFF;
      margin: 6px 0 2px 0;
      text-transform: uppercase;
    }
    .ticket-subtitle {
      font-size: 9px;
      font-weight: 800;
      color: #58B9FF;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .ticket-bottom {
      padding: 18px 20px;
      background-color: #FFFFFF;
    }
    .ticket-ref {
      font-size: 11px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 6px;
    }
    .ticket-ref span {
      color: #F05A22;
      font-family: monospace;
      font-weight: 900;
    }
    .ticket-name {
      font-size: 15px;
      font-weight: 900;
      color: #00224A;
      margin-bottom: 2px;
      text-transform: uppercase;
    }
    .ticket-role {
      font-size: 11px;
      font-weight: 800;
      color: #F05A22;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .ticket-meta {
      font-size: 10.5px;
      color: #64748B;
      font-weight: 600;
      line-height: 1.4;
    }
    .qr-box {
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 4px;
      display: inline-block;
    }

    /* Social Media & Signature Section */
    .social-row {
      margin: 32px 0 24px 0;
      padding-top: 20px;
      border-top: 1px solid #E2E8F0;
    }
    .social-link {
      display: inline-block;
      margin-right: 12px;
      background: #00224A;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
    }
    .signature {
      font-size: 15px;
      color: #334155;
      margin-top: 20px;
    }
    .signature-name {
      font-weight: 800;
      color: #00224A;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="content-body">
        
        <!-- Opening Confirmation Sentence -->
        <p class="main-paragraph">
          This email is to confirm your registration for the <strong>HIS Future Talents 2026</strong> <span class="highlight-word">event</span> on <strong>September 29, 2026</strong> at <strong>HIS University, Algiers</strong>.
        </p>

        <!-- Attached Ticket Callout -->
        <p class="ticket-alert">
          Please find attached your official <span class="highlight-word">event</span> registration ticket.
        </p>

        <!-- ── EMBEDDED LANDSCAPE TICKET PREVIEW ── -->
        <div class="ticket-container">
          <!-- Top Section -->
          <div class="ticket-top">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" style="vertical-align: top;">
                  <div style="font-size: 8px; font-weight: 800; color: #FFBD0E; letter-spacing: 1px;">UNDER INSTITUTIONAL HIGH PATRONAGE</div>
                  <img src="cid:hft_logo_white" alt="HIS Future Talents" height="36" style="display: block; height: 36px; width: auto; margin: 6px 0 4px 0;" />
                  <div class="ticket-subtitle">SHAPING THE FUTURE OF TALENT & INNOVATION</div>
                </td>
                <td align="right" style="vertical-align: top;">
                  <div style="font-size: 9px; font-weight: 800; color: #FFFFFF; letter-spacing: 1px;">HIS UNIVERSITY</div>
                  <div style="font-size: 8px; font-weight: 700; color: #58B9FF;">ALGIERS, ALGERIA</div>
                  <div style="font-size: 14px; font-weight: 900; color: #FFBD0E; margin-top: 2px;">29 SEPTEMBER 2026</div>
                </td>
              </tr>
            </table>
          </div>

          <!-- Bottom Section -->
          <div class="ticket-bottom">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" style="vertical-align: top; padding-right: 16px;">
                  <div class="ticket-ref">Registration N° <span>${badgeId}</span></div>
                  <div class="ticket-name">${fullName}</div>
                  <div class="ticket-role">${domain} • ${university}</div>
                  <div class="ticket-meta">
                    Campus HIS University, Algiers, Algeria<br>
                    <strong>Tuesday, September 29, 2026 from 08:00 AM</strong>
                  </div>
                </td>
                <td align="right" style="vertical-align: middle; width: 100px;">
                  <div class="qr-box">
                    <img src="cid:ticket_qr_code" alt="QR Ticket" width="90" height="90" style="display: block; width: 90px; height: 90px; border-radius: 6px;" />
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Social Media Note -->
        <p class="main-paragraph">
          To stay informed on all <span class="highlight-word">event</span> updates, we highly recommend following our official social media account <strong>@hisfuturetalents</strong>.
        </p>

        <!-- Thank you sentence -->
        <p class="main-paragraph">
          Thank you for your participation and we look forward to welcoming you at the <span class="highlight-word">event</span>.
        </p>

        <!-- Social Media Links -->
        <div class="social-row">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <a href="https://linkedin.com" class="social-link" style="margin-right: 8px;">LinkedIn</a>
              </td>
              <td>
                <a href="https://instagram.com/hisfuturetalents" class="social-link" style="margin-right: 8px;">Instagram</a>
              </td>
              <td>
                <a href="https://facebook.com" class="social-link" style="margin-right: 8px;">Facebook</a>
              </td>
              <td>
                <a href="https://his.edu.dz" class="social-link" style="background: #F05A22;">HIS Website</a>
              </td>
            </tr>
          </table>
        </div>

        <!-- Signature -->
        <div class="signature">
          Best,<br>
          <span class="signature-name">HIS Future Talents Team</span>
        </div>

      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
