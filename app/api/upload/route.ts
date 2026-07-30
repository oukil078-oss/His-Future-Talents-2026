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
    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Le fichier doit être une image (PNG, JPG, SVG, WEBP...)." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate Data URL for 100% reliable instant rendering
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Clean up filename
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9\.]+/g, "-")
      .replace(/--+/g, "-");
    const filename = `logo-${Date.now()}-${cleanName}`;

    // Target folder inside public/partners/
    const editionFolder = edition === "2024" || edition === "2025" || edition === "2026" ? edition : "2026";
    const uploadDir = path.join(process.cwd(), "public", "partners", editionFolder);

    let publicUrl = dataUrl;

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      publicUrl = `/partners/${editionFolder}/${filename}`;
    } catch (fsErr) {
      console.warn("FS write failed, falling back to data URL:", fsErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      dataUrl: dataUrl,
      filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du téléversement du fichier logo." },
      { status: 500 }
    );
  }
}
