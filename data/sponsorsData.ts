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
    name: "TECHNO",
    logo: "/partners/2026/techno-stationery.png",
    tier: "Silver",
    edition: "2026",
    website: "https://www.techno-dz.com",
    description: {
      en: "Algeria's foremost distributor and retailer of school supplies, office stationery, fine arts equipment, and professional tools.",
      ar: "الشركة الرائدة في الجزائر في توزيع وتجارة الأدوات المكتبية، المدرسية، الفنون الجميلة، والتجهيزات المكتبية الاحترافية."
    }
  },
  {
    name: "PROPHEX",
    logo: "/partners/2026/prophex.png",
    tier: "Bronze",
    edition: "2026",
    website: "https://www.profex.dz",
    description: {
      en: "Manufacturer of certified high-quality personal care products and medical devices.",
      ar: "شركة متخصصة في تصنيع منتجات العناية والأجهزة الطبية عالية الجودة."
    }
  }
];
