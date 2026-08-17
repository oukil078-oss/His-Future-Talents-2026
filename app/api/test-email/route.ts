import { NextResponse } from "next/server";
import { sendEmail, verifySmtpConnection } from "@/lib/mailer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetEmail = searchParams.get("to") || process.env.SMTP_USER || "hisfuturetalents@his.edu.dz";

  try {
    // 1. Verify connection
    const verifyResult = await verifySmtpConnection();
    if (!verifyResult.success) {
      return NextResponse.json({
        success: false,
        stage: "SMTP Verification",
        error: verifyResult.message,
      }, { status: 500 });
    }

    // 2. Send test email
    const mailResult = await sendEmail({
      to: targetEmail,
      subject: "Test SMTP - HIS Future Talents 2026",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #0A111E; color: #FFFFFF; border-radius: 10px;">
          <h2 style="color: #FFBD0E;">✓ Connexion SMTP Réussie !</h2>
          <p>Ce courriel confirme que le serveur SMTP (<strong>${process.env.SMTP_HOST}</strong> sur le port <strong>${process.env.SMTP_PORT}</strong>) fonctionne parfaitement.</p>
          <p style="color: #94A3B8; font-size: 12px;">Envoyé depuis le système de gestion des talents HIS Future Talents 2026.</p>
        </div>
      `,
      text: "Test SMTP HIS Future Talents 2026 : Le serveur SMTP fonctionne correctement.",
    });

    return NextResponse.json({
      success: mailResult.success,
      targetEmail,
      mailResult,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Internal server error during SMTP test",
    }, { status: 500 });
  }
}
