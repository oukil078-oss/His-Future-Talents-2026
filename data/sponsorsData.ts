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
    logo: "/images/sponsors/satim.png",
    tier: "Silver",
    edition: "2026",
    website: "https://www.satim.dz",
    description: {
      fr: "Société d'Automatisations des Transactions Interbancaires et de Monétique — Opérateur officiel du réseau CIB en Algérie.",
      ar: "الشركة التلقائية للمعاملات بين البنوك والدفع الإلكتروني — المسير الرسمي لشبكة البطاقات البنكية CIB."
    }
  }
];
