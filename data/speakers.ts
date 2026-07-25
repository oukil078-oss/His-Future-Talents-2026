export type Speaker = {
  name: string;
  role: {
    fr: string;
    ar: string;
  };
  company?: string;
  category: "conference" | "workshop";
  edition: 2024 | 2025;
  image?: string;
  imageStatus: "confirmed" | "placeholder";
};

export const speakersData: Speaker[] = [
  // Conference Speakers — Edition 2025
  {
    name: "Abdelmalek Cheta",
    role: {
      fr: "Fondateur d'Etihad Group",
      ar: "مؤسس مجموعة الإتحاد",
    },
    category: "conference",
    edition: 2025,
    image: "/speakers/abdelmalek-cheta.jpg",
    imageStatus: "confirmed"
  },
  {
    name: "Yacine Mahdid",
    role: {
      fr: "Expert en Ressources Humaines",
      ar: "خبير في الموارد البشرية",
    },
    category: "conference",
    edition: 2025,
    image: "/speakers/yacine-mahdid.png",
    imageStatus: "confirmed"
  },

  // Conference Speakers — Edition 2024
  {
    name: "Bouzid Moumen",
    role: {
      fr: "DRH El Kendi",
      ar: "مدير الموارد البشرية بشركة الكندي",
    },
    category: "conference",
    edition: 2024,
    image: "/speakers/bouzid-moumen.png",
    imageStatus: "confirmed"
  },
  {
    name: "Nabil Djenadi",
    role: {
      fr: "DRH El Hayat",
      ar: "مدير الموارد البشرية بشركة الحياة",
    },
    category: "conference",
    edition: 2024,
    image: "/speakers/nabil-djenadi.png",
    imageStatus: "confirmed"
  },
  {
    name: "Samir Gherbi",
    role: {
      fr: "Lafarge",
      ar: "لافارج",
    },
    category: "conference",
    edition: 2024,
    imageStatus: "placeholder"
  },

  // Workshop Speakers — Edition 2025
  {
    name: "Anis Hadadi",
    role: {
      fr: "Head of Marketing",
      ar: "مدير التسويق",
    },
    company: "Oussama Promotion Immobilière",
    category: "workshop",
    edition: 2025,
    image: "/speakers/anis-hadadi.png",
    imageStatus: "confirmed"
  },
  {
    name: "Sami Hamari",
    role: {
      fr: "Founder",
      ar: "مؤسس",
    },
    company: "Data Intuition",
    category: "workshop",
    edition: 2025,
    imageStatus: "placeholder"
  },
  {
    name: "Bouthaina Mobarki",
    role: {
      fr: "Project Manager",
      ar: "مديرة مشاريع",
    },
    company: "Sylabs",
    category: "workshop",
    edition: 2025,
    image: "/speakers/bouthaina-mobarki.png",
    imageStatus: "confirmed"
  }
];
