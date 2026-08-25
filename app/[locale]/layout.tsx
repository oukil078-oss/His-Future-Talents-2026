import "../globals.css";
import { Providers } from "./providers";
import { bahij, neulis } from "@/lib/fonts";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "ar" }];
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale === "ar" ? "ar" : "fr";
  const title = locale === "ar" 
    ? "HIS Future Talents — الدورة 3 | فضاء الرعاية والشراكات" 
    : "HIS Future Talents — Édition 3 | Espace Partenaires & Sponsoring";
  const description = locale === "ar"
    ? "اربطوا مؤسستكم بنخبة الكفاءات في الجزائر. اكتشفوا باقات الرعاية والظهور في صالون المهن والتكنولوجيا الخاص بنا."
    : "Associez votre marque au premier salon de recrutement et de formation de l'enseignement supérieur en Algérie. Découvrez nos packs de sponsoring.";
  
  return {
    metadataBase: new URL("https://futuretalents.his.edu.dz"),
    title,
    description,
    icons: {
      icon: "/brand/motifs/Future Talents Icon Orange-01.png",
      apple: "/brand/motifs/Future Talents Icon Orange-01.png",
    },
    alternates: {
      canonical: `https://futuretalents.his.edu.dz/${locale}`,
      languages: {
        fr: "https://futuretalents.his.edu.dz/fr",
        ar: "https://futuretalents.his.edu.dz/ar",
      },
    },
    openGraph: {
      title,
      description,
      locale: locale === "ar" ? "ar_DZ" : "fr_FR",
      type: "website",
      images: [
        {
          url: "/icon.png",
          width: 512,
          height: 512,
          alt: "HIS Future Talents Icon",
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale === "ar" ? "ar" : "fr";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e && e.message && (e.message.indexOf('ethereum') !== -1 || e.message.indexOf('selectedAddress') !== -1)) {
                  e.stopImmediatePropagation();
                  e.preventDefault();
                }
              });
            `,
          }}
        />
      </head>
      <body className={`${neulis.variable} ${bahij.variable} bg-white text-slate-900`}>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
