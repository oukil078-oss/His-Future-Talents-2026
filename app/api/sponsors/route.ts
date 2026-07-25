import { NextResponse } from "next/server";
import { getSponsors, addSponsor, updateSponsor, deleteSponsor } from "@/lib/dataStore";
import { Partner } from "@/data/partners";

export async function GET() {
  try {
    const sponsors = getSponsors();
    return NextResponse.json({ success: true, data: sponsors });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch sponsors" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: Partner = await req.json();
    if (!body.name || !body.logo || !body.edition) {
      return NextResponse.json(
        { success: false, error: "Le nom, le logo et l'édition sont obligatoires." },
        { status: 400 }
      );
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newSponsor: Partner = {
      ...body,
      slug,
      edition: Number(body.edition) as 2026 | 2025 | 2024,
    };

    const updatedList = addSponsor(newSponsor);
    return NextResponse.json({ success: true, data: updatedList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add sponsor" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { slug, ...updatedFields } = body;
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const updatedList = updateSponsor(slug, updatedFields);
    return NextResponse.json({ success: true, data: updatedList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update sponsor" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const updatedList = deleteSponsor(slug);
    return NextResponse.json({ success: true, data: updatedList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete sponsor" }, { status: 500 });
  }
}
