export type Sponsor = {
  name: string;
  logo?: string;
  tier?: "Gold" | "Silver" | "Bronze";
  edition: "2026";
  website?: string;
  description?: {
    fr: string;
    ar: string;
  };
};

export const verifiedSponsors2026: Sponsor[] = [
  {
    name: "SATIM",
    logo: "/partners/2026/satim.png",
    tier: "Silver",
    edition: "2026",
    website: "https://www.satim.dz",
    description: {
      fr: "Société d'Automatisations des Transactions Interbancaires et de Monétique — Opérateur officiel du réseau CIB en Algérie.",
      ar: "الشركة التلقائية للمعاملات بين البنوك والدفع الإلكتروني — المسير الرسمي لشبكة البطاقات البنكية CIB."
    }
  },
  {
    name: "PROPHEX",
    logo: "/partners/2025/prophex.png",
    tier: "Bronze",
    edition: "2026",
    website: "https://www.profex.dz",
    description: {
      fr: "Fabrication de produits de soins et de dispositifs médicaux certifiés de haute qualité.",
      ar: "شركة متخصصة في تصنيع منتجات العناية والأجهزة الطبية عالية الجودة."
    }
  }
];
