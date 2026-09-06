import { NextResponse } from "next/server";
import { getSponsors, addSponsor, updateSponsor, deleteSponsor, getLeads } from "@/lib/dataStore";
import { Partner } from "@/data/partners";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function sortPartnersByCustomRules(list: any[]) {
  const isHis = (n: string) => /his university|higher institute of sciences/i.test(n);
  const isIra = (n: string) => /iracademy/i.test(n);
  const isTraining = (n: string) => /training center/i.test(n);

  const priority2026 = [
    (n: string, s: string) => /satim/i.test(n) || /satim/i.test(s),
    (n: string, s: string) => /techno/i.test(n) || /techno/i.test(s),
    (n: string, s: string) => /prophex|profex/i.test(n) || /prophex|profex/i.test(s),
    (n: string, s: string) => /hydrapharm/i.test(n) || /hydrapharm/i.test(s),
    (n: string, s: string) => /mfg|mediterranean float glass/i.test(n) || /mfg/i.test(s),
  ];

  const priority2024 = [
    (n: string) => /yassir/i.test(n),
    (n: string) => /bnp/i.test(n),
    (n: string) => /natixis/i.test(n),
  ];

  const priority2025 = [
    (n: string) => /satim/i.test(n),
    (n: string) => /djezzy/i.test(n),
    (n: string) => /cybear/i.test(n),
    (n: string) => /yalid/i.test(n),
    (n: string) => /aviation|enna/i.test(n),
  ];

  function getScore(p: any): number {
    const name = p.name || "";
    const slug = p.slug || "";
    if (isHis(name)) return 1;
    if (isIra(name)) return 2;
    if (isTraining(name)) return 3;

    if (p.edition === 2026) {
      for (let i = 0; i < priority2026.length; i++) {
        if (priority2026[i](name, slug)) return 10 + i;
      }
    } else if (p.edition === 2024) {
      for (let i = 0; i < priority2024.length; i++) {
        if (priority2024[i](name)) return 10 + i;
      }
    } else if (p.edition === 2025) {
      for (let i = 0; i < priority2025.length; i++) {
        if (priority2025[i](name)) return 10 + i;
      }
    }

    return 100;
  }

  // Preserve relative order for items with the same score
  return [...list].sort((a, b) => {
    if (a.edition !== b.edition) {
      return (b.edition || 0) - (a.edition || 0);
    }
    const scoreA = getScore(a);
    const scoreB = getScore(b);
    return scoreA - scoreB;
  });
}

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

    let result = localSponsors;
    if (liveSponsors.length > 0) {
      const sponsorMap = new Map<string, any>();
      for (const s of localSponsors) {
        sponsorMap.set(`${s.edition}_${s.slug || s.name}`, s);
      }
      for (const s of liveSponsors) {
        const key = `${s.edition}_${s.slug || s.name}`;
        if (!sponsorMap.has(key)) {
          sponsorMap.set(key, s);
        }
      }
      result = Array.from(sponsorMap.values());
    }

    // Enrich 2026 sponsors with lead opportunities and target profiles
    try {
      const leads = await getLeads();
      const leadMap = new Map<string, any>();
      leads.forEach((l) => {
        const key = (l.companyName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        leadMap.set(key, l);
      });

      result = result.map((partner: any) => {
        if (partner.edition === 2026) {
          const pKey = (partner.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          const slugKey = (partner.slug || "").toLowerCase().replace(/[^a-z0-9]/g, "");
          let match = leadMap.get(pKey) || leadMap.get(slugKey);
          if (!match) {
            for (const [k, l] of Array.from(leadMap.entries())) {
              if (pKey.includes(k) || k.includes(pKey) || slugKey.includes(k) || k.includes(slugKey)) {
                match = l;
                break;
              }
            }
          }
          if (match) {
            return {
              ...partner,
              opportunities: partner.opportunities || match.opportunities || ["emploi", "pfe"],
              targetProfiles: partner.targetProfiles || match.targetProfiles || "",
            };
          }
        }
        return partner;
      });
    } catch (leadErr) {
      console.warn("Could not enrich sponsors with leads:", leadErr);
    }

    // Filter out Vitrin Clinic from 2026 list
    result = result.filter((p: any) => {
      if (p.edition === 2026) {
        const isVitrin = /vitrin|vi-tri-n/i.test(p.slug || "") || /vitrin|v[i\u0130]tr[i\u0130]n/i.test(p.name || "");
        return !isVitrin;
      }
      return true;
    });

    const sorted = sortPartnersByCustomRules(result);
    return NextResponse.json({ success: true, data: sorted });
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
