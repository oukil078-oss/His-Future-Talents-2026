export interface ProgramItem {
  time: string;
  title: {
    en?: string;
    fr: string;
    ar: string;
  };
}

export interface Speaker {
  name: string;
  role: {
    en?: string;
    fr: string;
    ar: string;
  };
  specialty: {
    en?: string;
    fr: string;
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
    en?: string;
    fr: string;
    ar: string;
  };
  bronze: boolean;
  silver: boolean;
  gold: boolean;
}

export const eventDetails = {
  date: {
    en: "Tuesday, September 29, 2026",
    fr: "Mardi 29 Septembre 2026",
    ar: "الثلاثاء 29 سبتمبر 2026",
  },
  location: {
    en: "HIS University, Algiers",
    fr: "HIS University, Alger",
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
      fr: "Mise en place des stands",
      ar: "تهيئة الأجنحة والاستعداد",
    },
  },
  {
    time: "09:00",
    title: {
      en: "Doors open & participant check-in",
      fr: "Ouverture des portes & accueil",
      ar: "فتح الأبواب واستقبال المشاركين",
    },
  },
  {
    time: "10:00",
    title: {
      en: "Opening ceremony & keynote addresses",
      fr: "Conférence d'ouverture — Keynote",
      ar: "Keynote — الجلسة الافتتاحية",
    },
  },
  {
    time: "12:00",
    title: {
      en: "Executive & VIP networking lunch",
      fr: "Networking Lunch",
      ar: "Networking Lunch — غداء وتواصل مهني",
    },
  },
  {
    time: "13:00",
    title: {
      en: "Parallel thematic sessions & interactive workshops",
      fr: "Sessions & Workshops — 3 en parallèle",
      ar: "جلسات وورشات تطبيقية — 3 ورشات بالتوازي",
    },
  },
  {
    time: "15:30",
    title: {
      en: "HIS Talent Awards ceremony & official closing",
      fr: "HIS Talent Awards & Clôture",
      ar: "HIS Talent Awards والاختتام",
    },
  },
];

export const speakersData: Speaker[] = [
  // --- EDITION 2025 ---
  {
    name: "Abdelmalek Cheta",
    role: {
      fr: "Fondateur d'Etihad Group",
      ar: "مؤسس مجموعة الإتحاد",
    },
    specialty: {
      fr: "Keynote Speaker • Conférence 2025",
      ar: "متحدث رئيسي • مؤتمر 2025",
    },
    avatarPlaceholder: "bg-[#f05a22]/10 text-[#f05a22]",
    edition: "2025",
  },
  {
    name: "Yacine Mahdid",
    role: {
      fr: "Expert en Ressources Humaines",
      ar: "خبير في الموارد البشرية",
    },
    specialty: {
      fr: "Keynote Speaker • Conférence 2025",
      ar: "متحدث رئيسي • مؤتمر 2025",
    },
    avatarPlaceholder: "bg-[#003876]/10 text-[#003876]",
    edition: "2025",
  },
  // --- EDITION 2024 ---
  {
    name: "Bouzid Moumen",
    role: {
      fr: "DRH chez El Kendi",
      ar: "مدير الموارد البشرية بشركة الكندي",
    },
    specialty: {
      fr: "Keynote Speaker • Conférence 2024",
      ar: "متحدث رئيسي • مؤتمر 2024",
    },
    avatarPlaceholder: "bg-[#0076a3]/10 text-[#0076a3]",
    edition: "2024",
  },
  {
    name: "Nabil Djenadi",
    role: {
      fr: "DRH chez El Hayat",
      ar: "مدير الموارد البشرية بشركة الحياة",
    },
    specialty: {
      fr: "Keynote Speaker • Conférence 2024",
      ar: "متحدث رئيسي • مؤتمر 2024",
    },
    avatarPlaceholder: "bg-[#7a2b16]/10 text-[#7a2b16]",
    edition: "2024",
  },
  {
    name: "Samir Gherbi",
    role: {
      fr: "Directeur chez Lafarge",
      ar: "مدير بشركة لافارج",
    },
    specialty: {
      fr: "Keynote Speaker • Conférence 2024",
      ar: "متحدث رئيسي • مؤتمر 2024",
    },
    avatarPlaceholder: "bg-[#fdb913]/10 text-[#fdb913]",
    edition: "2024",
  },
  // --- WORKSHOPS ---
  {
    name: "Anis Hadadi",
    role: {
      fr: "Directeur Marketing chez Oussama Promotion Immobilière",
      ar: "مدير التسويق، أسامة للترقية العقارية",
    },
    specialty: {
      fr: "Speaker Workshop • Ateliers",
      ar: "متحدث • ورشات العمل",
    },
    avatarPlaceholder: "bg-[#2f2f2f]/10 text-[#2f2f2f]",
    edition: "workshop",
  },
  {
    name: "Sami Hamari",
    role: {
      fr: "Fondateur de Data Intuition",
      ar: "مؤسس داتا إنتويشن",
    },
    specialty: {
      fr: "Speaker Workshop • Ateliers",
      ar: "متحدث • ورشات العمل",
    },
    avatarPlaceholder: "bg-[#003876]/10 text-[#003876]",
    edition: "workshop",
  },
  {
    name: "Bouthaina Mobarki",
    role: {
      fr: "Chef de Projet chez Sylabs",
      ar: "مديرة مشاريع في سايلايبس",
    },
    specialty: {
      fr: "Speaker Workshop • Ateliers",
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
      fr: "Espace d'exposition premium (stand)",
      ar: "مساحة عرض مميزة (جناح خاص)",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Logo and hyperlink featured on the official event website",
      fr: "Logo + lien sur le site officiel",
      ar: "الشعار مع رابط للموقع الإلكتروني الرسمي",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Partner logo slideshow rotation across on-site event screens",
      fr: "Slideshow des partenaires sur les écrans de l'événement",
      ar: "عرض شعار المؤسسة على شاشات الفعالية",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Official press Photo Wall displaying your corporate logo",
      fr: "Photo Wall officiel avec logo du partenaire",
      ar: "جدار الصور الرسمي حامل لشعار المؤسسة",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Official partner speaking slot (4-5 min presentation & award handover)",
      fr: "Intervention partenaires · 4-5 min (certificat & présentation)",
      ar: "كلمة للمؤسسة مدتها 4-5 د (تقديم وتسليم شهادة)",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Special mention across official press releases and national media coverage",
      fr: "Mention dans les communiqués de presse officiels",
      ar: "ذكر المؤسسة في البيانات الصحفية الرسمية",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Dedicated social media spotlight posts across our digital channels",
      fr: "Publications dédiées sur les réseaux sociaux de l'événement",
      ar: "منشورات مخصصة على حسابات التواصل الاجتماعي",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Comprehensive post-event report with detailed recruitment analytics",
      fr: "Rapport post-événement avec statistiques détaillées",
      ar: "تقرير ما بعد الحدث متضمن إحصائيات مفصلة",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Official recognition certificate for distinguished partners",
      fr: "Certificat de reconnaissance officiel pour les partenaires",
      ar: "شهادة تقدير رسمية للشركاء والمساهمين",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Corporate logo printed on official participant badges",
      fr: "Logo sur les badges officiels des participants",
      ar: "وضع الشعار على البطاقات التعريفية الرسمية",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Event flags and prominent entrance signage",
      fr: "Event Flags – signalétique premium à l'entrée",
      ar: "أعلام ورايات إعلانية مميزة عند المدخل الرئيسي",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Official event organizer t-shirts co-branded with your logo",
      fr: "T-shirts des organisateurs au nom du partenaire",
      ar: "شعار المؤسسة مطبوع على قمصان المنظمين",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Promotional event brochures and flyers featuring your brand",
      fr: "Flyers distribués pendant l'événement avec logo du partenaire",
      ar: "توزيع مطويات ترويجية تحمل شعار المؤسسة",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Livestream video outro sequence with prominent partner credit",
      fr: "Outro vidéo du live avec mention du partenaire",
      ar: "خاتمة البث المباشر متضمنة شعار المؤسسة",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Lower-third digital banner overlay during live broadcast",
      fr: "Bannière 'Lower Third' pendant le live stream",
      ar: "شريط إعلاني أسفل شاشة البث المباشر",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Exclusive social media feature: 1 Story + 3 dedicated Reels",
      fr: "1 Story + 3 Reels dédiés sur les réseaux sociaux",
      ar: "قصة واحدة (Story) و 3 مقاطع (Reels) على شبكاتنا",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Keynote / panel discussion seat in thematic industry workshops",
      fr: "Prise de parole dans les panels et ateliers thématiques",
      ar: "المشاركة في الحلقات النقاشية وورشات العمل الموضوعاتية",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      en: "Exclusive full access to the complete candidate CV database (CVthèque)",
      fr: "Accès privilégié à la base de CVs (CVthèque)",
      ar: "ولوج مميز لقاعدة السير الذاتية الكاملة للطلاب",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Permanent on-screen logo watermark during the full live broadcast",
      fr: "Watermark permanent du logo pendant toute la durée du live",
      ar: "علامة مائية دائمة لشعاركم طيلة البث المباشر",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Complete corporate stage branding in the main auditorium",
      fr: "Branding complet sur la scène principale",
      ar: "هوية المؤسسة البصرية كاملة على المنصة الرئيسية",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Giant outdoor LED screen entrance broadcast – exclusive video spot",
      fr: "Écran LED devant la salle – diffusion exclusive",
      ar: "شاشة LED الكبيرة أمام القاعة – بث حصري للمؤسسة",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Opening ceremony corporate video presentation (30 to 60 seconds)",
      fr: "Vidéo de présentation d'ouverture (30 à 60 secondes)",
      ar: "بث فيديو تعريفي للمؤسسة في الافتتاح (30-60 ثانية)",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      en: "Permanent sponsor watermark on all official high-res event photographs",
      fr: "Watermark permanent sur toutes les photos officielles",
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
    en?: string;
    fr: string;
    ar: string;
  };
  keyPoints: {
    en?: string[];
    fr: string[];
    ar: string[];
  };
};

export const placeholderMedias = [
  "Chaîne TV 1", "Chaîne TV 2", "Presse Nationale", "Radio Nationale"
];

export const mediaPartners = [
  { name: "Chaîne TV 1", logo: "/partners/chaine-tv-1.png" },
  { name: "Chaîne TV 2", logo: "/partners/chaine-tv-2.png" },
  { name: "Presse Nationale", logo: "/partners/presse-nationale.png" },
  { name: "Radio Nationale", logo: "/partners/radio-nationale.png" }
];

export const mediaPartnersDetails: MediaPartner[] = [
  {
    id: "chaine-tv-1",
    name: "Chaîne TV 1 (التلفزيون الجزائري)",
    shortName: "Chaîne TV 1",
    logo: "/partners/chaine-tv-1.png",
    website: "https://www.entv.dz",
    description: {
      fr: "La première chaîne publique nationale de l'Établissement Public de Télévision (EPTV), assurant la couverture audiovisuelle officielle des événements majeurs nationaux, économiques et académiques.",
      ar: "القناة الأولى للتلفزيون الجزائري (EPTV)، القناة العمومية الوطنية التي تتولى التغطية التلفزيونية الرسمية لأبرز التظاهرات الاقتصادية والأكاديمية والوطنية."
    },
    keyPoints: {
      fr: [
        "Toutes les actualités officielles et reportages télévisés sur le salon HFT",
        "Interviews exclusives des représentants d'entreprises et décideurs",
        "Audience et portée majeure à l'échelle nationale et internationale"
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
    name: "Chaîne TV 2 (Canal Algérie)",
    shortName: "Chaîne TV 2",
    logo: "/partners/chaine-tv-2.png",
    website: "https://www.entv.dz",
    description: {
      fr: "Canal Algérie, la deuxième chaîne publique d'information et de culture de l'EPTV, dédiée au suivi des initiatives d'emploi, de recrutement et d'innovation.",
      ar: "Canal Algérie، القناة العمومية الوطنية الثانية المخصصة للإعلام والثقافة ومتابعة مبادرات التوظيف والابتكار."
    },
    keyPoints: {
      fr: [
        "Mise en valeur des opportunités de carrière et des entreprises exposantes",
        "Interviews et reportages économiques dédiés au recrutement",
        "Vaste diffusion auprès de la communauté professionnelle et universitaire"
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
    shortName: "Presse Nationale",
    logo: "/partners/presse-nationale.png",
    website: "https://www.aps.dz",
    description: {
      fr: "L'Agence Presse Service (APS) est l'agence de presse officielle nationale d'Algérie, diffusant l'actualité économique et universitaire auprès des médias nationaux et internationaux.",
      ar: "وكالة الأنباء الجزائرية (APS) هي وكالة الأنباء الرسمية في الجزائر، وتتولى نشر التغطية الإخبارية والبرقيات الرسمية لكافة وسائل الإعلام الوطنية والدولية."
    },
    keyPoints: {
      fr: [
        "Dépêches de presse officielles couvrant le salon HIS Future Talents",
        "Source d'information prioritaire pour les journaux et portails d'actualités",
        "Couverture par les journalistes et photographes officiels de l'agence"
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
    shortName: "Radio Nationale",
    logo: "/partners/radio-nationale.png",
    website: "https://www.radioalgerie.dz",
    description: {
      fr: "L'Entreprise Nationale de Radiodiffusion Sonore (Radio Algérienne), le réseau de radiodiffusion publique nationale couvrant l'ensemble du territoire à travers ses chaînes et radios thématiques.",
      ar: "المؤسسة الوطنية للإذاعة الصوتية (الإذاعة الجزائرية)، الشبكة الإذاعية العمومية الوطنية التي تغطي كافة التراب الوطني عبر قنواتها الوطنية والموضوعاتية."
    },
    keyPoints: {
      fr: [
        "Couverture radio en direct et émissions thématiques sur l'emploi",
        "Interviews exclusives avec les dirigeants et exposants du salon",
        "Diffusion de flashs d'information tout au long de l'événement"
      ],
      ar: [
        "تغطية إذاعية مباشرة وبرامج مخصصة للتوظيف وسوق العمل",
        "حوارات حصرية مع مسؤولي وممثلي المؤسسات العارضة",
        "موجزات إخبارية وإعلانات إذاعية طيلة أيام التظاهرة"
      ]
    }
  }
];
