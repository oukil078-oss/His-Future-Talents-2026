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
  const badgeId = data.badgeId || "HFT-2026-PASS";
  const domain = (data.fieldOfStudyOrWork || "Participant").trim();
  const university = (data.university || "HIS University").trim();
  const location = data.eventLocation || "HIS University, Alger";

  // Generate crisp QR code data url for the email badge
  let qrDataUrl = "";
  try {
    qrDataUrl = await QRCode.toDataURL(
      `https://hisfuturetalents.his.edu.dz/verify?id=${data.studentId || ""}&code=${badgeId}&name=${encodeURIComponent(fullName)}`,
      {
        margin: 1,
        width: 240,
        color: {
          dark: "#06101D",
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
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre Pass Badge Officiel - HIS Future Talents 2026</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #06101D;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #E2E8F0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #06101D;
      padding: 30px 10px;
    }
    .main-table {
      max-width: 580px;
      margin: 0 auto;
      background-color: #0A1424;
      border-radius: 24px;
      border: 1px solid #1E293B;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
    }
    .header-bar {
      background: linear-gradient(135deg, #00224A 0%, #06101D 100%);
      padding: 32px 24px;
      text-align: center;
      border-bottom: 2px solid #F05A22;
    }
    .badge-pill {
      display: inline-block;
      background: rgba(240, 90, 34, 0.15);
      border: 1px solid #F05A22;
      color: #FFBD0E;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 6px 16px;
      border-radius: 20px;
      margin-bottom: 12px;
    }
    .content-body {
      padding: 28px 24px;
    }
    
    /* ── EXACT VISUAL PASS BADGE IN EMAIL ── */
    .badge-container {
      margin: 20px auto 30px auto;
      max-width: 320px;
      text-align: center;
    }
    .lanyard-strap {
      width: 48px;
      height: 24px;
      background: linear-gradient(to bottom, #F05A22, #FFBD0E);
      margin: 0 auto;
      border-radius: 4px 4px 0 0;
    }
    .lanyard-clip {
      width: 34px;
      height: 14px;
      background: linear-gradient(to bottom, #E2E8F0, #94A3B8);
      margin: 0 auto;
      border-radius: 2px;
      border: 1px solid #64748B;
    }
    .physical-badge {
      background: linear-gradient(180deg, #06101D 0%, #00224A 50%, #06101D 100%);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 22px;
      padding: 18px 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
      text-align: center;
    }
    .badge-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .badge-header-table {
      width: 100%;
    }
    .badge-code-tag {
      display: inline-block;
      font-family: monospace;
      font-size: 10px;
      font-weight: 700;
      color: #FFBD0E;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 3px 10px;
      border-radius: 6px;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
    }
    .qr-frame {
      background: #FFFFFF;
      padding: 8px;
      border-radius: 14px;
      display: inline-block;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      margin-bottom: 12px;
    }
    .badge-name {
      font-size: 15px;
      font-weight: 900;
      color: #FFFFFF;
      text-transform: uppercase;
      margin: 4px 0 2px 0;
      letter-spacing: 0.5px;
    }
    .badge-domain {
      font-size: 12px;
      font-weight: 700;
      color: #58B9FF;
      margin: 0 0 2px 0;
    }
    .badge-univ {
      font-size: 10px;
      color: #94A3B8;
      margin: 0 0 14px 0;
    }
    .badge-details-box {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 10px;
      margin-bottom: 12px;
      text-align: left;
    }
    .badge-footer-bar {
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      padding-top: 10px;
      font-size: 9px;
      font-weight: 800;
    }
    .btn-action {
      display: inline-block;
      background: linear-gradient(135deg, #F05A22 0%, #FFBD0E 100%);
      color: #06101D !important;
      text-decoration: none;
      font-weight: 900;
      font-size: 13px;
      padding: 12px 24px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 11px;
      color: #64748B;
      border-top: 1px solid #1E293B;
      background-color: #06101D;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table class="main-table" width="100%" cellpadding="0" cellspacing="0" border="0">
      <!-- Header -->
      <tr>
        <td class="header-bar">
          <div class="badge-pill">HIS FUTURE TALENTS 2026</div>
          <h1 style="margin: 0; color: #FFFFFF; font-size: 22px; font-weight: 900;">
            Félicitations, Pass VIP Confirmé ! 🎉
          </h1>
          <p style="margin: 6px 0 0; color: #94A3B8; font-size: 13px;">
            Votre badge d'accès officiel a été généré avec succès.
          </p>
        </td>
      </tr>

      <!-- Body -->
      <tr>
        <td class="content-body">
          <p style="font-size: 14px; line-height: 1.6; margin-top: 0; color: #E2E8F0;">
            Bonjour <strong style="color: #FFFFFF;">${data.firstName} ${data.lastName}</strong>,
          </p>
          <p style="font-size: 13px; line-height: 1.6; color: #CBD5E1;">
            Votre inscription à l'événement <strong>HIS Future Talents 2026</strong> est validée. Vous trouverez ci-dessous votre Pass d'accès officiel, ainsi qu'en pièce jointe au format PDF haute définition.
          </p>

          <!-- ── REPLICA OF THE WEBSITE VISUAL PASS BADGE ── -->
          <div class="badge-container">
            <!-- Lanyard -->
            <div class="lanyard-strap"></div>
            <div class="lanyard-clip"></div>

            <!-- Card -->
            <div class="physical-badge">
              <!-- Top Row -->
              <div class="badge-header">
                <table class="badge-header-table" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left" style="color: #FFFFFF; font-size: 11px; font-weight: 900; letter-spacing: 0.5px;">
                      HIS FUTURE TALENTS
                    </td>
                    <td align="right">
                      <span style="background: linear-gradient(to right, #F05A22, #FFBD0E); color: #06101D; font-size: 8px; font-weight: 900; padding: 2px 7px; border-radius: 12px; text-transform: uppercase;">
                        PASS VIP 2026
                      </span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Code -->
              <div>
                <span class="badge-code-tag">${badgeId}</span>
              </div>

              <!-- QR Code -->
              ${
                qrDataUrl
                  ? `<div class="qr-frame"><img src="${qrDataUrl}" width="90" height="90" alt="QR Code Pass" style="display: block; border-radius: 6px;" /></div>`
                  : ""
              }

              <!-- Student Identity -->
              <div class="badge-name">${fullName}</div>
              <div class="badge-domain">${domain}</div>
              ${university ? `<div class="badge-univ">${university}</div>` : ""}

              <!-- Event Details -->
              <div class="badge-details-box">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td width="60%" style="font-size: 9px; font-weight: 900; color: #FFFFFF; line-height: 1.3;">
                      FAÇONNER L'AVENIR<br />
                      <span style="color: #FFBD0E;">DES TALENTS EN ALGÉRIE</span>
                    </td>
                    <td width="40%" align="right" style="font-size: 8px; font-weight: 800; color: #FFBD0E;">
                      <div style="background: rgba(240,90,34,0.2); border: 1px solid rgba(240,90,34,0.4); padding: 2px 5px; border-radius: 4px; display: inline-block; margin-bottom: 2px;">
                        13–14 MAI 2026
                      </div><br />
                      <span style="color: #58B9FF; font-size: 7.5px;">HIS University, Alger</span>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Footer Bar -->
              <div class="badge-footer-bar">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td align="left">
                      <span style="color: #10B981; background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); padding: 2px 6px; border-radius: 4px;">
                        ✓ ACCÈS CONFIRMÉ
                      </span>
                    </td>
                    <td align="right" style="color: #64748B; font-size: 8px;">
                      SCANNER RÉCEPTION
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <!-- Instructions -->
          <div style="background: #0E1B2C; border: 1px solid #1E293B; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <div style="color: #FFFFFF; font-size: 13px; font-weight: 800; margin-bottom: 8px;">
              📋 Instructions pour le jour J :
            </div>
            <ul style="color: #94A3B8; font-size: 12px; line-height: 1.7; padding-left: 18px; margin: 0;">
              <li>Présentez ce QR Code ou le PDF ci-joint à l'accueil pour accéder au salon.</li>
              <li>Préparez plusieurs exemplaires de votre CV pour les recruteurs.</li>
              <li>Consultez le programme des conférences et ateliers sur le site officiel.</li>
            </ul>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 24px 0 10px 0;">
            <a href="https://hisfuturetalents.his.edu.dz/fr/students" class="btn-action">
              Accéder à l'Espace Étudiant
            </a>
          </div>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td class="footer">
          <p style="margin: 0 0 6px 0; color: #94A3B8; font-weight: 700;">
            HIS Future Talents 2026 — 13 & 14 Mai 2026 • HIS University, Alger
          </p>
          <p style="margin: 0; color: #475569;">
            Cet email a été envoyé automatiquement. Veuillez ne pas y répondre directement.
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
  `;
}
