import crypto from "crypto";
import fs from "fs";
import path from "path";
import { ExhibitorLead } from "@/lib/dataStore";

/**
 * Helper to get Google OAuth2 credentials from environment or candidate paths.
 */
function getGoogleCredentials() {
  let client_email = process.env.GOOGLE_CLIENT_EMAIL;
  let private_key = process.env.GOOGLE_PRIVATE_KEY;
  const targetSheetId =
    process.env.GOOGLE_SHEETS_SPREADSHEET_ID ||
    "1fTF5m5vH6NzHH3ZUFHIoF5Ooi9luGUEI2Sf9ntlwp4A";

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

  // Local candidate paths check
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

  if (private_key) {
    private_key = private_key.replace(/\\n/g, "\n");
  }

  return { client_email, private_key, targetSheetId };
}

/**
 * Obtains an OAuth2 access token for Google Sheets API using RS256 JWT.
 */
async function getAccessToken(client_email: string, private_key: string): Promise<string | null> {
  try {
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

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwtToken,
      }),
    });

    const tokenData = await tokenRes.json();
    return tokenRes.ok && tokenData.access_token ? tokenData.access_token : null;
  } catch (err) {
    console.error("Failed to get Google access token:", err);
    return null;
  }
}

/**
 * Appends a row of values to the Google Sheet.
 */
export async function appendToGoogleSheet(
  values: any[],
  spreadsheetId?: string,
  range = "Inscriptions entreprises!A:S"
): Promise<boolean> {
  try {
    const { client_email, private_key, targetSheetId } = getGoogleCredentials();
    const sheetId = spreadsheetId || targetSheetId;

    if (!client_email || !private_key) {
      console.warn("Google Sheets credentials not found.");
      return false;
    }

    const accessToken = await getAccessToken(client_email, private_key);
    if (!accessToken) return false;

    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      range
    )}:append?valueInputOption=USER_ENTERED`;

    const appendRes = await fetch(appendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [values] }),
    });

    return appendRes.ok;
  } catch (error) {
    console.error("appendToGoogleSheet Exception:", error);
    return false;
  }
}

/**
 * Fetches all exhibitor leads recorded in Google Sheets and maps them to ExhibitorLead objects.
 */
export async function fetchLeadsFromGoogleSheet(
  spreadsheetId?: string,
  range = "Inscriptions entreprises!A:S"
): Promise<ExhibitorLead[]> {
  try {
    const { client_email, private_key, targetSheetId } = getGoogleCredentials();
    const sheetId = spreadsheetId || targetSheetId;

    if (!client_email || !private_key) {
      return [];
    }

    const accessToken = await getAccessToken(client_email, private_key);
    if (!accessToken) return [];

    const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(
      range
    )}`;

    const res = await fetch(getUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    const rows: any[][] = data.values || [];
    if (rows.length === 0) return [];

    const leads: ExhibitorLead[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      // Skip header row if it contains column labels
      if (
        i === 0 &&
        (String(row[0]).toLowerCase().includes("date") ||
          String(row[1]).toLowerCase().includes("entreprise") ||
          String(row[1]).toLowerCase().includes("nom"))
      ) {
        continue;
      }

      const companyName = String(row[1] || "").trim();
      const representativeName = String(row[2] || "").trim();
      const email = String(row[4] || "").trim();

      if (!companyName && !representativeName && !email) continue;

      const opps: string[] = [];
      if (String(row[7]).toLowerCase().includes("oui")) opps.push("emploi");
      if (String(row[8]).toLowerCase().includes("oui")) opps.push("pfe");
      if (String(row[9]).toLowerCase().includes("oui")) opps.push("immersion");
      if (String(row[10]).toLowerCase().includes("oui")) opps.push("decouverte");

      const statusRaw = String(row[15] || "Nouveau").trim();
      let status: ExhibitorLead["status"] = "Nouveau";
      if (statusRaw.toLowerCase().includes("confirm")) status = "Confirmé";
      else if (statusRaw.toLowerCase().includes("cours")) status = "En cours";
      else if (statusRaw.toLowerCase().includes("refus")) status = "Refusé";

      leads.push({
        id: `sheet_lead_${i + 1}`,
        companyName: companyName || "Entreprise",
        representativeName: representativeName || "Représentant",
        role: String(row[3] || "").trim(),
        email: email || "contact@entreprise.dz",
        phone: String(row[5] || "").trim(),
        representativesCount: parseInt(String(row[6]), 10) || 2,
        opportunities: opps,
        targetProfiles: String(row[11] || "").trim(),
        equipmentNeeded: String(row[12] || "").trim(),
        remarks: String(row[13] || "").trim(),
        packageDesired: String(row[14] || "Exposant").trim(),
        status: status,
        submittedAt: String(row[0] || new Date().toISOString()),
      });
    }

    return leads;
  } catch (error) {
    console.error("fetchLeadsFromGoogleSheet error:", error);
    return [];
  }
}
