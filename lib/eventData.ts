export interface ProgramItem {
  time: string;
  title: {
    fr: string;
    ar: string;
  };
}

export interface Speaker {
  name: string;
  role: {
    fr: string;
    ar: string;
  };
  specialty: {
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
    fr: string;
    ar: string;
  };
  bronze: boolean;
  silver: boolean;
  gold: boolean;
}

export const eventDetails = {
  date: {
    fr: "Lundi 29 Septembre 2026",
    ar: "الإثنين 29 سبتمبر 2026",
  },
  location: {
    fr: "HIS University, Alger",
    ar: "جامعة معهد العلوم، الجزائر العاصمة",
  },
  targetDate: "2026-09-29T08:00:00+01:00", // Algerian Timezone (GMT+1)
  stats: {
    visitors: 600,
    companies: 36,
    workshops: 5,
    satisfaction: 96,
  },
  targetStats: {
    visitors: "Jusqu'à 1 000",
    visitorsAr: "تصل إلى 1000",
    companies: 45,
  }
};

export const programData: ProgramItem[] = [
  {
    time: "08:00",
    title: {
      fr: "Mise en place des stands",
      ar: "تهيئة وتجهيز الأجنحة",
    },
  },
  {
    time: "09:00",
    title: {
      fr: "Ouverture des portes & accueil des participants",
      ar: "فتح الأبواب واستقبال المشاركين",
    },
  },
  {
    time: "10:00",
    title: {
      fr: "Conférence d'ouverture — Keynote speakers",
      ar: "المحاضرة الافتتاحية والمداخلات الرئيسية",
    },
  },
  {
    time: "12:00",
    title: {
      fr: "Networking Lunch (Déjeuner réseau)",
      ar: "غداء عمل وتواصل مهني",
    },
  },
  {
    time: "13:00",
    title: {
      fr: "Sessions & Workshops (x3 en parallèle)",
      ar: "جلسات وورشات عمل (3 ورشات بالتوازي)",
    },
  },
  {
    time: "15:30",
    title: {
      fr: "HIS Talent Awards & Clôture officielle",
      ar: "توزيع جوائز المعهد واختتام الفعالية رسمياً",
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
      fr: "Espace d'exposition premium (stand)",
      ar: "مساحة عرض مميزة (جناح خاص)",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Logo + lien sur le site officiel",
      ar: "الشعار مع رابط للموقع الإلكتروني الرسمي",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Slideshow des partenaires sur les écrans de l'événement",
      ar: "عرض شعار المؤسسة على شاشات الفعالية",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Photo Wall officiel avec logo du partenaire",
      ar: "جدار الصور الرسمي حامل لشعار المؤسسة",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Intervention partenaires · 4-5 min (certificat & présentation)",
      ar: "كلمة للمؤسسة مدتها 4-5 د (تقديم وتسليم شهادة)",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Mention dans les communiqués de presse officiels",
      ar: "ذكر المؤسسة في البيانات الصحفية الرسمية",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Publications dédiées sur les réseaux sociaux de l'événement",
      ar: "منشورات مخصصة على حسابات التواصل الاجتماعي",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Rapport post-événement avec statistiques détaillées",
      ar: "تقرير ما بعد الحدث متضمن إحصائيات مفصلة",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Certificat de reconnaissance officiel pour les partenaires",
      ar: "شهادة تقدير رسمية للشركاء والمساهمين",
    },
    bronze: true,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Logo sur les badges officiels des participants",
      ar: "وضع الشعار على البطاقات التعريفية الرسمية",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Event Flags – signalétique premium à l'entrée",
      ar: "أعلام ورايات إعلانية مميزة عند المدخل الرئيسي",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "T-shirts des organisateurs au nom du partenaire",
      ar: "شعار المؤسسة مطبوع على قمصان المنظمين",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Flyers distribués pendant l'événement avec logo du partenaire",
      ar: "توزيع مطويات ترويجية تحمل شعار المؤسسة",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Outro vidéo du live avec mention du partenaire",
      ar: "خاتمة البث المباشر متضمنة شعار المؤسسة",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Bannière 'Lower Third' pendant le live stream",
      ar: "شريط إعلاني أسفل شاشة البث المباشر",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "1 Story + 3 Reels dédiés sur les réseaux sociaux",
      ar: "قصة واحدة (Story) و 3 مقاطع (Reels) على شبكاتنا",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Prise de parole dans les panels et ateliers thématiques",
      ar: "المشاركة في الحلقات النقاشية وورشات العمل الموضوعاتية",
    },
    bronze: false,
    silver: true,
    gold: true,
  },
  {
    label: {
      fr: "Accès privilégié à la base de CVs (CVthèque)",
      ar: "ولوج مميز لقاعدة السير الذاتية الكاملة للطلاب",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      fr: "Watermark permanent du logo pendant toute la durée du live",
      ar: "علامة مائية دائمة لشعاركم طيلة البث المباشر",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      fr: "Branding complet sur la scène principale",
      ar: "هوية المؤسسة البصرية كاملة على المنصة الرئيسية",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      fr: "Écran LED devant la salle – diffusion exclusive",
      ar: "شاشة LED الكبيرة أمام القاعة – بث حصري للمؤسسة",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
      fr: "Vidéo de présentation d'ouverture (30 à 60 secondes)",
      ar: "بث فيديو تعريفي للمؤسسة في الافتتاح (30-60 ثانية)",
    },
    bronze: false,
    silver: false,
    gold: true,
  },
  {
    label: {
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
    fr: string;
    ar: string;
  };
  keyPoints: {
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
