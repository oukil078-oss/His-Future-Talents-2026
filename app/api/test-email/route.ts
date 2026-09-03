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
          <h2 style="color: #FFBD0E;">✓ SMTP Connection Successful!</h2>
          <p>This email confirms that the SMTP server (<strong>${process.env.SMTP_HOST}</strong> on port <strong>${process.env.SMTP_PORT}</strong>) is functioning properly.</p>
          <p style="color: #94A3B8; font-size: 12px;">Sent from the HIS Future Talents 2026 talent management system.</p>
        </div>
      `,
      text: "SMTP Test HIS Future Talents 2026: The SMTP server is functioning properly.",
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
