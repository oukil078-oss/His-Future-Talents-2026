import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Aucun fichier CV fourni." },
        { status: 400 }
      );
    }

    // Validate mime type or extension (must be PDF)
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { success: false, error: "Le fichier CV doit être au format PDF." },
        { status: 400 }
      );
    }

    // Max 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "La taille du fichier CV ne doit pas dépasser 10 Mo." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate base64 Data URL as reliable fallback
    const base64 = buffer.toString("base64");
    const dataUrl = `data:application/pdf;base64,${base64}`;

    // Clean up filename
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9\.]+/g, "-")
      .replace(/--+/g, "-");
    const filename = `cv-${Date.now()}-${cleanName}`;

    // Target upload folder
    const uploadDir = path.join(process.cwd(), "public", "uploads", "cv");
    let publicUrl = dataUrl;

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);
      publicUrl = `/uploads/cv/${filename}`;
    } catch (fsErr) {
      console.warn("CV FS write failed, using data URL fallback:", fsErr);
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      dataUrl: dataUrl,
      filename: file.name,
    });
  } catch (error: any) {
    console.error("CV Upload error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Erreur lors du téléversement du CV." },
      { status: 500 }
    );
  }
}
