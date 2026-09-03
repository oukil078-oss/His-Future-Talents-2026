export type MediaPartner = {
  name: string;
  fullName?: string;
  logo: string;
  edition: "2025";
  website?: string;
  description: {
    en: string;
    ar: string;
  };
  keyPoints?: {
    en?: string[];
    ar?: string[];
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
      ar: "المؤسسة الوطنية للتلفزيون الجزائري هي المجمّع العمومي التلفزيوني في الجزائر، وتضمن التغطية الشاملة لأبرز الفعاليات الوطنية، الأكاديمية والاقتصادية."
    },
    keyPoints: {
      en: [
        "National public broadcasting network providing official event coverage.",
        "Comprehensive news features and interviews during the 2nd Edition of HIS Future Talents.",
        "Nationwide television viewership reach."
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
      ar: "قناة النهار تي في هي أول قناة إخبارية مستمرة في الجزائر، تغطي مباشرة المستجدات الاقتصادية، فرص التوظيف والمبادرات الطلابية."
    },
    keyPoints: {
      en: [
        "Leading continuous news network in Algeria (24/7 live broadcasting).",
        "Live coverage and spotlight on career opportunities at the fair.",
        "Strong reach among university students and young professionals."
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
      ar: "قناة الوطنية تي في هي قناة تلفزيونية خاصة تسلط الضوء على الاقتصاد الوطني، التعليم العالي والابتكار."
    },
    keyPoints: {
      en: [
        "Dedicated coverage of career fairs and university academic tracks.",
        "Exclusive interviews with event organizers and exhibitor executives."
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
      ar: "قناة رؤية تي في تسلط الضوء على ريادة الأعمال، قصص نجاح الشباب الجزائري وعالم المؤسسات."
    },
    keyPoints: {
      en: [
        "Focus on innovation and employment integration for fresh graduates.",
        "Video reports and candidate spotlight interviews."
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
      ar: "قناة الحياة تي في هي قناة إخبارية تغطي الصالونات الاقتصادية وأبرز مواعيد التوظيف والتعليم في الجزائر."
    },
    keyPoints: {
      en: [
        "Coverage of fair keynotes, panel discussions, and masterclasses.",
        "Post-event televised summary reports and organizer insights."
      ],
      ar: [
        "تغطية لأهم محطات الصالون والورشات التدريبية.",
        "بث تقارير إعلامية عقب اختتام الفعالية."
      ]
    }
  }
];
