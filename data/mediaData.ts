export type MediaPartner = {
  name: string;
  fullName?: string;
  logo: string;
  edition: "2025";
  website?: string;
  description: {
    en?: string;
    fr?: string;
    ar: string;
  };
  keyPoints?: {
    en?: string[];
    fr?: string[];
    ar: string[];
  };
};

export const verifiedMediaChannels: MediaPartner[] = [
  {
    name: "ENTV",
    fullName: "Algerian National Television (ENTV)",
    logo: "/images/media/entv.png",
    edition: "2025",
    website: "https://www.entv.dz",
    description: {
      en: "The Public National Television Enterprise (ENTV) is Algeria's primary public broadcast network, providing comprehensive official coverage of major economic and academic events.",
      fr: "L'Entreprise Nationale de Télévision (ENTV) est le groupe public de télévision en Algérie. Elle assure la couverture intégrale des grands événements nationaux, académiques et économiques.",
      ar: "المؤسسة الوطنية للتلفزيون الجزائري هي المجمّع العمومي التلفزيوني في الجزائر، وتضمن التغطية الشاملة لأبرز الفعاليات الوطنية، الأكاديمية والاقتصادية."
    },
    keyPoints: {
      en: [
        "National public broadcasting network providing official event coverage.",
        "Comprehensive news features and interviews during the 2nd Edition of HIS Future Talents.",
        "Nationwide television viewership reach."
      ],
      fr: [
        "Chaîne nationale publique d'information et de couverture officielle.",
        "Reportages complets et interviews lors de la 2e édition de HIS Future Talents.",
        "Rayonnement audiovisuel à l'échelle nationale."
      ],
      ar: [
        "القناة الوطنية العمومية للرصد الإخباري والتغطية الرسمية.",
        "تقارير صحفية وحوارات شاملة خلال الدورة الثانية لصالون HIS Future Talents.",
        "انتشار إعلامي واسع على المستوى الوطني."
      ]
    }
  },
  {
    name: "Ennahar TV",
    fullName: "Ennahar News TV 24/7",
    logo: "/images/media/ennahar-tv.png",
    edition: "2025",
    website: "https://www.ennaharonline.com",
    description: {
      en: "Ennahar TV is the leading 24/7 continuous news channel in Algeria, broadcasting live reports on economic trends, employment initiatives, and student careers.",
      fr: "Ennahar TV est la première chaîne d'information en continu en Algérie. Elle couvre en direct l'actualité économique, l'emploi et les initiatives estudiantines.",
      ar: "قناة النهار تي في هي أول قناة إخبارية مستمرة في الجزائر، تغطي مباشرة المستجدات الاقتصادية، فرص التوظيف والمبادرات الطلابية."
    },
    keyPoints: {
      en: [
        "Leading continuous news network in Algeria (24/7 live broadcasting).",
        "Live coverage and spotlight on career opportunities at the fair.",
        "Strong reach among university students and young professionals."
      ],
      fr: [
        "1ère chaîne d'information continue en Algérie (News 24/7).",
        "Directs et reportages sur les opportunités de recrutement du salon.",
        "Forte audience auprès des jeunes et professionnels."
      ],
      ar: [
        "القناة الإخبارية الأولى في الجزائر على مدار 24 ساعة.",
        "بث مباشر وتقارير حول فرص التوظيف والتربصات المتاحة بالصالون.",
        "نسبة متابعة قياسية لدى فئة الشباب والمهنيين."
      ]
    }
  },
  {
    name: "El Wataniya TV",
    fullName: "El Wataniya National TV Network",
    logo: "/images/media/el-wataniya-tv.png",
    edition: "2025",
    website: "https://elwataniya.dz",
    description: {
      en: "El Wataniya TV is a prominent private television broadcaster highlighting national economic development, higher education, and technological innovation.",
      fr: "El Wataniya TV est une chaîne de télévision privée algérienne dédiée à la valorisation de l'économie national, de l'éducation et de l'innovation.",
      ar: "قناة الوطنية تي في هي قناة تلفزيونية خاصة تسلط الضوء على الاقتصاد الوطني، التعليم العالي والابتكار."
    },
    keyPoints: {
      en: [
        "Dedicated coverage of career fairs and university academic tracks.",
        "Exclusive interviews with event organizers and exhibitor executives."
      ],
      fr: [
        "Couverture dédiée aux forums carrières et à l'orientation universitaire.",
        "Interviews exclusives avec les organisateurs et exposants."
      ],
      ar: [
        "تغطية خاصة لصالونات التوظيف والتوجيه الجامعي.",
        "لقاءات حصرية مع القائمين على الصالون والشركات العارضة."
      ]
    }
  },
  {
    name: "Vision TV",
    fullName: "Vision TV Algeria Media Channel",
    logo: "/images/media/vision-tv.jpg",
    edition: "2025",
    website: "https://visiontv.dz",
    description: {
      en: "Vision TV spotlights Algerian youth entrepreneurship, student success stories, and corporate talent acquisition.",
      fr: "Vision TV met en avant l'entrepreneuriat, les success-stories de la jeunesse algérienne et le monde de l'entreprise.",
      ar: "قناة رؤية تي في تسلط الضوء على ريادة الأعمال، قصص نجاح الشباب الجزائري وعالم المؤسسات."
    },
    keyPoints: {
      en: [
        "Focus on innovation and employment integration for fresh graduates.",
        "Video reports and candidate spotlight interviews."
      ],
      fr: [
        "Focus sur l'innovation et l'insertion des jeunes diplômés.",
        "Reportages vidéo et capsules d'interviews des candidats."
      ],
      ar: [
        "تركيز على الابتكار وإدماج الخريجين الجدد.",
        "تقارير مصورة وحوارات مع المترشحين والمسيرين."
      ]
    }
  },
  {
    name: "El Hayat TV",
    fullName: "El Hayat General & News TV",
    logo: "/images/media/el-hayat-tv.png",
    edition: "2025",
    website: "https://elhayat.dz",
    description: {
      en: "El Hayat TV is a generalist news and current affairs broadcaster reporting on economic forums and key career events across Algeria.",
      fr: "El Hayat TV est une chaîne d'information et d'actualités générale couvrant les salons économiques et les grands rendez-vous carrières en Algérie.",
      ar: "قناة الحياة تي في هي قناة إخبارية تغطي الصالونات الاقتصادية وأبرز مواعيد التوظيف والتعليم في الجزائر."
    },
    keyPoints: {
      en: [
        "Coverage of fair keynotes, panel discussions, and masterclasses.",
        "Post-event televised summary reports and organizer insights."
      ],
      fr: [
        "Couverture des temps forts du forum et des ateliers.",
        "Diffusion de reportages télévisés post-événement."
      ],
      ar: [
        "تغطية لأهم محطات الصالون والورشات التدريبية.",
        "بث تقارير إعلامية عقب اختتام الفعالية."
      ]
    }
  }
];
