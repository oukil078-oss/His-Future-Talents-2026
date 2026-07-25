import crypto from "crypto";
import fs from "fs";
import path from "path";

/**
 * Pure Node.js RS256 JWT Client for Google Sheets API v4
 * Operates seamlessly on Vercel Serverless Functions and local dev servers.
 */
export async function appendToGoogleSheet(
  values: any[],
  spreadsheetId?: string,
  range = "Inscriptions entreprises!A:S"
): Promise<boolean> {
  try {
    let client_email = process.env.GOOGLE_CLIENT_EMAIL;
    let private_key = process.env.GOOGLE_PRIVATE_KEY;
    let targetSheetId =
      spreadsheetId ||
      process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
      "1fTF5m5vH6NzHH3ZUFHIoF5Ooi9luGUEI2Sf9ntlwp4A";

    // Support single GOOGLE_SERVICE_ACCOUNT_JSON string env var in Vercel
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
      try {
        const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
        client_email = parsed.client_email;
        private_key = parsed.private_key;
      } catch (e) {
        console.error("Invalid GOOGLE_SERVICE_ACCOUNT_JSON format:", e);
      }
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH) {
      try {
        if (fs.existsSync(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH)) {
          const parsed = JSON.parse(
            fs.readFileSync(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_PATH, "utf-8")
          );
          client_email = parsed.client_email;
          private_key = parsed.private_key;
        }
      } catch (e) {
        console.error("Failed to read GOOGLE_SERVICE_ACCOUNT_JSON_PATH:", e);
      }
    }

    // Local fallback check
    if (!client_email || !private_key) {
      const candidatePaths = [
        path.join(process.cwd(), "credentials.json"),
        path.join(process.cwd(), "..", "isentropic-sun-485518-s2-8ac97c7eb16e.json"),
        "C:\\Users\\STRIX\\Documents\\isentropic-sun-485518-s2-8ac97c7eb16e.json",
      ];
      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          try {
            const parsed = JSON.parse(fs.readFileSync(p, "utf-8"));
            client_email = parsed.client_email;
            private_key = parsed.private_key;
            break;
          } catch (err) {}
        }
      }
    }

    if (!client_email || !private_key) {
      console.warn(
        "Google Sheets credentials missing. Please set GOOGLE_CLIENT_EMAIL and GOOGLE_PRIVATE_KEY in Vercel settings."
      );
      return false;
    }

    // Sanitize private key formatting
    private_key = private_key.replace(/\\n/g, "\n");

    // Construct RS256 JWT Header & Payload
    const header = { alg: "RS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const base64UrlEncode = (obj: any) =>
      Buffer.from(JSON.stringify(obj)).toString("base64url");

    const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}`;
    const signer = crypto.createSign("RSA-SHA256");
    signer.update(unsignedToken);
    const signature = signer.sign(private_key, "base64url");
    const jwtToken = `${unsignedToken}.${signature}`;

    // Request Google OAuth2 Access Token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtToken,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Google OAuth2 Authentication Error:", tokenData);
      return false;
    }

    // Append Values to Google Sheets API v4
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${targetSheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED`;

    const appendRes = await fetch(appendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [values] }),
    });

    const appendData = await appendRes.json();
    if (!appendRes.ok) {
      console.error("Google Sheets API Append Error:", appendData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("appendToGoogleSheet Exception:", error);
    return false;
  }
}
