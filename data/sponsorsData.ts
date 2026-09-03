export type Sponsor = {
  name: string;
  logo?: string;
  tier?: "Gold" | "Silver" | "Bronze";
  edition: "2026";
  website?: string;
  description?: {
    en: string;
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
      en: "Automated Interbank Transactions and Electronic Payment Company — Official operator of the CIB interbank payment network in Algeria.",
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
      en: "Manufacturer of certified high-quality personal care products and medical devices.",
      ar: "شركة متخصصة في تصنيع منتجات العناية والأجهزة الطبية عالية الجودة."
    }
  }
];
