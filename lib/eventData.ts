export interface ProgramItem {
  time: string;
  title: {
    en: string;
    ar: string;
  };
}

export interface Speaker {
  name: string;
  role: {
    en: string;
    ar: string;
  };
  specialty: {
    en: string;
    ar: string;
  };
  avatarPlaceholder: string;
  edition: "2025" | "2024" | "workshop";
}

export interface SponsorPackage {
  id: "bronze" | "silver" | "gold";
  nameKey: string;
  price: number;
  featured: boolean;
  color: string;
  borderColor: string;
  gradient: string;
}

export interface PackageBenefit {
  label: {
    en: string;
    ar: string;
  };
  bronze: boolean;
  silver: boolean;
  gold: boolean;
}

export const eventDetails = {
  date: {
    en: "Tuesday, September 29, 2026",
    ar: "الثلاثاء 29 سبتمبر 2026",
  },
  location: {
    en: "HIS University, Algiers",
    ar: "المعهد العالي للعلوم، برج الكيفان الجزائر العاصمة",
  },
  targetDate: "2026-09-29T08:00:00+01:00", // Algerian Timezone (GMT+1)
  stats: {
    visitors: 600,
    companies: 36,
    workshops: 5,
    satisfaction: 96,
  },
  targetStats: {
    visitors: "1 000+",
    visitorsAr: "أكثر من 1,000",
    companies: 45,
  }
};

export const programData: ProgramItem[] = [
  {
    time: "08:00",
    title: {
      en: "Booth setup & exhibitor welcome",
      ar: "تهيئة الأجنحة والاستعداد",
    },
  },
  {
    time: "09:00",
    title: {
      en: "Doors open & participant check-in",
      ar: "فتح الأبواب واستقبال المشاركين",
    },
  },
  {
    time: "10:00",
    title: {
      en: "Opening ceremony & keynote addresses",
      ar: "Keynote — الجلسة الافتتاحية",
    },
  },
  {
    time: "12:00",
    title: {
      en: "Executive & VIP networking lunch",
      ar: "Networking Lunch — غداء وتواصل مهني",
    },
  },
  {
    time: "13:00",
    title: {
      en: "Parallel thematic sessions & interactive workshops",
      ar: "جلسات وورشات تطبيقية — 3 ورشات بالتوازي",
    },
  },
  {
    time: "15:30",
    title: {
      en: "HIS Talent Awards ceremony & official closing",
      ar: "HIS Talent Awards والاختتام",
    },
  },
];

export const speakersData: Speaker[] = [
  // --- EDITION 2025 ---
  {
    name: "Abdelmalek Cheta",
    role: {
      en: "Founder of Etihad Group",
      ar: "مؤسس مجموعة الإتحاد",
    },
    specialty: {
      en: "Keynote Speaker • 2025 Conference",
      ar: "متحدث رئيسي • مؤتمر 2025",
    },
    avatarPlaceholder: "bg-[#f05a22]/10 text-[#f05a22]",
    edition: "2025",
  },
  {
    name: "Yacine Mahdid",
    role: {
      en: "Human Resources Expert",
      ar: "خبير في الموارد البشرية",
    },
    specialty: {
      en: "Keynote Speaker • 2025 Conference",
      ar: "متحدث رئيسي • مؤتمر 2025",
    },
    avatarPlaceholder: "bg-[#003876]/10 text-[#003876]",
    edition: "2025",
  },
  // --- EDITION 2024 ---
  {
    name: "Bouzid Moumen",
    role: {
      en: "HR Director at El Kendi",
      ar: "مدير الموارد البشرية بشركة الكندي",
    },
    specialty: {
      en: "Keynote Speaker • 2024 Conference",
      ar: "متحدث رئيسي • مؤتمر 2024",
    },
    avatarPlaceholder: "bg-[#0076a3]/10 text-[#0076a3]",
    edition: "2024",
  },
  {
    name: "Nabil Djenadi",
    role: {
      en: "HR Director at El Hayat",
      ar: "مدير الموارد البشرية بشركة الحياة",
    },
    specialty: {
      en: "Keynote Speaker • 2024 Conference",
      ar: "متحدث رئيسي • مؤتمر 2024",
    },
    avatarPlaceholder: "bg-[#7a2b16]/10 text-[#7a2b16]",
    edition: "2024",
  },
  {
    name: "Samir Gherbi",
    role: {
      en: "Director at Lafarge",
      ar: "مدير بشركة لافارج",
    },
    specialty: {
      en: "Keynote Speaker • 2024 Conference",
      ar: "متحدث رئيسي • مؤتمر 2024",
    },
    avatarPlaceholder: "bg-[#fdb913]/10 text-[#fdb913]",
    edition: "2024",
  },
  // --- WORKSHOPS ---
  {
    name: "Anis Hadadi",
    role: {
      en: "Head of Marketing at Oussama Promotion Immobilière",
      ar: "مدير التسويق، أسامة للترقية العقارية",
    },
    specialty: {
      en: "Workshop Speaker • Masterclasses",
      ar: "متحدث • ورشات العمل",
    },
    avatarPlaceholder: "bg-[#2f2f2f]/10 text-[#2f2f2f]",
    edition: "workshop",
  },
  {
    name: "Sami Hamari",
    role: {
      en: "Founder of Data Intuition",
      ar: "مؤسس داتا إنتويشن",
    },
    specialty: {
      en: "Workshop Speaker • Masterclasses",
      ar: "متحدث • ورشات العمل",
    },
    avatarPlaceholder: "bg-[#003876]/10 text-[#003876]",
    edition: "workshop",
  },
  {
    name: "Bouthaina Mobarki",
    role: {
      en: "Project Manager at Sylabs",
      ar: "مديرة مشاريع في سايلايبس",
    },
    specialty: {
      en: "Workshop Speaker • Masterclasses",
      ar: "متحدث • ورشات العمل",
    },
    avatarPlaceholder: "bg-[#f05a22]/10 text-[#f05a22]",
    edition: "workshop",
  },
];

export const packagesData: SponsorPackage[] = [
  {
    id: "bronze",
    nameKey: "bronze",
    price: 200000,
    featured: false,
    color: "#B87333",
    borderColor: "border-[#B87333]/20",
    gradient: "from-[#B87333]/5 to-[#B87333]/0",
  },
  {
    id: "silver",
    nameKey: "silver",
    price: 300000,
    featured: false,
    color: "#C0C0C0",
    borderColor: "border-slate-300",
    gradient: "from-slate-100 to-transparent",
  },
  {
    id: "gold",
    nameKey: "gold",
    price: 500000,
    featured: true,
    color: "#D4AF37",
    borderColor: "border-[#D4AF37]",
    gradient: "from-[#D4AF37]/10 to-[#D4AF37]/5",
  },
];

export const packageBenefits: PackageBenefit[] = [
  {
    label: {
      en: "Premium exhibitor booth space in the main exhibition hall",
      ar: "مساحة عرض مميزة (جناح خاص)",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Logo and hyperlink featured on the official event website",
      ar: "الشعار مع رابط للموقع الإلكتروني الرسمي",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Partner logo slideshow rotation across on-site event screens",
      ar: "عرض شعار المؤسسة على شاشات الفعالية",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Official press Photo Wall displaying your corporate logo",
      ar: "جدار الصور الرسمي حامل لشعار المؤسسة",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Official partner speaking slot (4-5 min presentation & award handover)",
      ar: "كلمة للمؤسسة مدتها 4-5 د (تقديم وتسليم شهادة)",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Special mention across official press releases and national media coverage",
      ar: "ذكر المؤسسة في البيانات الصحفية الرسمية",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Dedicated social media spotlight posts across our digital channels",
      ar: "منشورات مخصصة على حسابات التواصل الاجتماعي",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Comprehensive post-event report with detailed recruitment analytics",
      ar: "تقرير ما بعد الحدث متضمن إحصائيات مفصلة",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Official recognition certificate for distinguished partners",
      ar: "شهادة تقدير رسمية للشركاء والمساهمين",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Corporate logo printed on official participant badges",
      ar: "وضع الشعار على البطاقات التعريفية الرسمية",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Event flags and prominent entrance signage",
      ar: "أعلام ورايات إعلانية مميزة عند المدخل الرئيسي",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Official event organizer t-shirts co-branded with your logo",
      ar: "شعار المؤسسة مطبوع على قمصان المنظمين",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Promotional event brochures and flyers featuring your brand",
      ar: "توزيع مطويات ترويجية تحمل شعار المؤسسة",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Livestream video outro sequence with prominent partner credit",
      ar: "خاتمة البث المباشر متضمنة شعار المؤسسة",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Lower-third digital banner overlay during live broadcast",
      ar: "شريط إعلاني أسفل شاشة البث المباشر",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Exclusive social media feature: 1 Story + 3 dedicated Reels",
      ar: "قصة واحدة (Story) و 3 مقاطع (Reels) على شبكاتنا",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Keynote / panel discussion seat in thematic industry workshops",
      ar: "المشاركة في الحلقات النقاشية وورشات العمل الموضوعاتية",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Exclusive full access to the complete candidate CV database (CVthèque)",
      ar: "ولوج مميز لقاعدة السير الذاتية الكاملة للطلاب",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Permanent on-screen logo watermark during the full live broadcast",
      ar: "علامة مائية دائمة لشعاركم طيلة البث المباشر",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Complete corporate stage branding in the main auditorium",
      ar: "هوية المؤسسة البصرية كاملة على المنصة الرئيسية",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Giant outdoor LED screen entrance broadcast – exclusive video spot",
      ar: "شاشة LED الكبيرة أمام القاعة – بث حصري للمؤسسة",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Opening ceremony corporate video presentation (30 to 60 seconds)",
      ar: "بث فيديو تعريفي للمؤسسة في الافتتاح (30-60 ثانية)",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Permanent sponsor watermark on all official high-res event photographs",
      ar: "علامة مائية لشعاركم على كل الصور الرسمية",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
];

export const companies2025 = [
  "SATIM", "Faderco", "Cevital", "Techno Stationery", "MFG", "Bitr Transpo", 
  "CASH Assurances", "CAARAMA Assurance", "SAA Assurances", "Legal Doctrine", "PayPart", "Yalidine Express", 
  "Henkel", "Beyn", "Canbebe", "Benslimane & Partners", "DZ-IT", "Sylabs", "GIG Algeria", 
  "Hibou Consulting RH", "Hayat", "DealZone", "National Civil Aviation", "Ouedkniss", 
  "El Kendi", "Oussama Promotion Immobilière", "Data Intuition", "Global Job", "Djezzy", "IRAcademy", 
  "GAM Assurances", "Namlatic", "CyBears"
];

export const companies2024 = [
  "IRAcademy", "Apollo", "Cabcof", "CASH Assurances", "DZ Déclic", "Algeria Takaful", 
  "El Kendi", "Fransabank", "Comet Coworking", "Innovation School", "Moustachir", 
  "Namlatic", "MS Pharma", "Yassir", "S.Five Groupe", "Societe Generale", 
  "Tassili Airlines", "Techno Stationery", "Triemploi", "Unilever", "Natixis", 
  "MFG", "ABC Corporation", "Global Job", "AEPI", "CAP", "MPI"
];

export type MediaPartner = {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  website: string;
  description: {
    en: string;
    ar: string;
  };
  keyPoints: {
    en: string[];
    ar: string[];
  };
};

export const placeholderMedias = [
  "ENTV National TV", "Canal Algérie", "Algeria Press Service (APS)", "National Radio"
];

export const mediaPartners = [
  { name: "ENTV National TV", logo: "/partners/chaine-tv-1.png" },
  { name: "Canal Algérie", logo: "/partners/chaine-tv-2.png" },
  { name: "Algeria Press Service (APS)", logo: "/partners/presse-nationale.png" },
  { name: "National Radio", logo: "/partners/radio-nationale.png" }
];

export const mediaPartnersDetails: MediaPartner[] = [
  {
    id: "chaine-tv-1",
    name: "ENTV (التلفزيون الجزائري)",
    shortName: "ENTV",
    logo: "/partners/chaine-tv-1.png",
    website: "https://www.entv.dz",
    description: {
      en: "The primary national public channel of the Public Television Enterprise (EPTV), ensuring official broadcast coverage of major national, economic, and academic events.",
      ar: "القناة الأولى للتلفزيون الجزائري (EPTV)، القناة العمومية الوطنية التي تتولى التغطية التلفزيونية الرسمية لأبرز التظاهرات الاقتصادية والأكاديمية والوطنية."
    },
    keyPoints: {
      en: [
        "Official news features and television coverage on HIS Future Talents",
        "Exclusive executive interviews with participating corporate leaders",
        "High-visibility nationwide television audience reach"
      ],
      ar: [
        "تغطية تلفزيونية وإخبارية شاملة لفعاليات صالون HIS Future Talents",
        "حوارات حصرية مع ممثلي المؤسسات العارضة والمسؤولين المشاركين",
        "انتشار واسع ونسبة مشاهدة عالية على المستوى الوطني والدولي"
      ]
    }
  },
  {
    id: "chaine-tv-2",
    name: "Canal Algérie (القناة الثانية)",
    shortName: "Canal Algérie",
    logo: "/partners/chaine-tv-2.png",
    website: "https://www.entv.dz",
    description: {
      en: "Canal Algérie, the national public channel dedicated to continuous coverage of career initiatives, professional employment, and youth innovation.",
      ar: "Canal Algérie، القناة العمومية الوطنية الثانية المخصصة للإعلام والثقافة ومتابعة مبادرات التوظيف والابتكار."
    },
    keyPoints: {
      en: [
        "Spotlighting job opportunities and corporate brands participating in the fair",
        "Economic reports and discussions dedicated to employment trends",
        "Broad viewership across academic and professional circles"
      ],
      ar: [
        "إبراز فرص العمل والعلامة التجارية للمؤسسات المشاركة في الصالون",
        "تقارير اقتصادية وحوارات مخصصة لقطاع التوظيف وسوق العمل",
        "متابعة واسعة من الوسط المهني والجامعي"
      ]
    }
  },
  {
    id: "presse-nationale",
    name: "Algeria Press Service (APS)",
    shortName: "APS Press",
    logo: "/partners/presse-nationale.png",
    website: "https://www.aps.dz",
    description: {
      en: "Algeria Press Service (APS) is the official national news agency of Algeria, distributing economic and academic dispatches to domestic and international media.",
      ar: "وكالة الأنباء الجزائرية (APS) هي وكالة الأنباء الرسمية في الجزائر، وتتولى نشر التغطية الإخبارية والبرقيات الرسمية لكافة وسائل الإعلام الوطنية والدولية."
    },
    keyPoints: {
      en: [
        "Official press wires covering the HIS Future Talents event",
        "Primary news source for leading newspapers and digital portals",
        "Accredited reporting by official journalists and photographers"
      ],
      ar: [
        "برقيات صحفية رسمية لتغطية صالون HIS Future Talents",
        "المصدر الإخباري المعتمد لدى وسائل الإعلام والجرائد",
        "تغطية ميدانية من الصحفيين والمصورين الرسميين للوكالة"
      ]
    }
  },
  {
    id: "radio-nationale",
    name: "Radio Nationale (الإذاعة الجزائرية)",
    shortName: "National Radio",
    logo: "/partners/radio-nationale.png",
    website: "https://www.radioalgerie.dz",
    description: {
      en: "The National Radio Broadcasting Enterprise (Radio Algérienne), the national public network covering the entire Algerian territory through themed channels.",
      ar: "المؤسسة الوطنية للإذاعة الصوتية (الإذاعة الجزائرية)، الشبكة الإذاعية العمومية الوطنية التي تغطي كافة التراب الوطني عبر قنواتها الوطنية والموضوعاتية."
    },
    keyPoints: {
      en: [
        "Live radio coverage and dedicated employment segments",
        "Exclusive interviews with corporate directors and exhibitor teams",
        "Hourly event announcements and live updates"
      ],
      ar: [
        "تغطية إذاعية مباشرة وبرامج مخصصة للتوظيف وسوق العمل",
        "حوارات حصرية مع مسؤولي وممثلي المؤسسات العارضة",
        "موجزات إخبارية وإعلانات إذاعية طيلة أيام التظاهرة"
      ]
    }
  }
];
