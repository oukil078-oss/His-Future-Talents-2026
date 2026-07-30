import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const edition = (formData.get("edition") as string) || "2026";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier fourni." },
        { status: 400 }
      );
    }

    // Validate image mime type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Le fichier doit être une image (PNG, JPG, SVG, WEBP...)." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Clean up filename
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9\.]+/g, "-")
      .replace(/--+/g, "-");
    const filename = `logo-${Date.now()}-${cleanName}`;

    // Target folder inside public/partners/
    const editionFolder = edition === "2024" || edition === "2025" || edition === "2026" ? edition : "2026";
    const uploadDir = path.join(process.cwd(), "public", "partners", editionFolder);

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      const publicUrl = `/partners/${editionFolder}/${filename}`;
      return NextResponse.json({ success: true, url: publicUrl, filename });
    } catch (fsErr) {
      // Fallback to data URL if filesystem write fails (e.g. read-only serverless host)
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64}`;
      return NextResponse.json({ success: true, url: dataUrl, filename });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du téléversement du fichier logo." },
      { status: 500 }
    );
  }
}
