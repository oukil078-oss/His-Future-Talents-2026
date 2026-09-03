export type Speaker = {
  name: string;
  role: {
    en: string;
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
      en: "Founder of Etihad Group",
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
      en: "Human Resources Expert",
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
      en: "HR Director at El Kendi",
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
      en: "HR Director at El Hayat",
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
      en: "Director at Lafarge",
      ar: "مدير في لافارج",
    },
    category: "conference",
    edition: 2024,
    imageStatus: "placeholder"
  },

  // Workshop Speakers — Edition 2025
  {
    name: "Anis Hadadi",
    role: {
      en: "Head of Marketing",
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
      en: "Founder",
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
      en: "Project Manager",
      ar: "مديرة مشاريع",
    },
    company: "Sylabs",
    category: "workshop",
    edition: 2025,
    image: "/speakers/bouthaina-mobarki.png",
    imageStatus: "confirmed"
  }
];
