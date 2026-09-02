import { NextResponse } from "next/server";
import { getSponsors, addSponsor, updateSponsor, deleteSponsor } from "@/lib/dataStore";
import { Partner } from "@/data/partners";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const localSponsors = getSponsors();

    let liveSponsors: any[] = [];
    try {
      const liveRes = await fetch("https://hisfuturetalent.his.edu.dz/api/sponsors", {
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(3000),
      });
      if (liveRes.ok) {
        const liveJson = await liveRes.json();
        if (liveJson.success && Array.isArray(liveJson.data)) {
          liveSponsors = liveJson.data;
        }
      }
    } catch (liveErr) {
      // offline fallback
    }

    if (liveSponsors.length > 0) {
      const sponsorMap = new Map<string, any>();
      for (const s of liveSponsors) {
        sponsorMap.set(`${s.edition}_${s.slug || s.name}`, s);
      }
      for (const s of localSponsors) {
        const key = `${s.edition}_${s.slug || s.name}`;
        if (!sponsorMap.has(key)) {
          sponsorMap.set(key, s);
        }
      }
      return NextResponse.json({ success: true, data: Array.from(sponsorMap.values()) });
    }

    return NextResponse.json({ success: true, data: localSponsors });
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
    const { slug, edition, ...updatedFields } = body;
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const updatedList = updateSponsor(slug, updatedFields, edition ? Number(edition) : undefined);
    return NextResponse.json({ success: true, data: updatedList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update sponsor" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const edition = searchParams.get("edition");
    if (!slug) {
      return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
    }

    const updatedList = deleteSponsor(slug, edition ? Number(edition) : undefined);
    return NextResponse.json({ success: true, data: updatedList });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete sponsor" }, { status: 500 });
  }
}
