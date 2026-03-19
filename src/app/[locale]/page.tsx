import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";
import type { Locale } from "@/lib/i18n";
import { alternatesForPath, isSeoLocale, localeOg, type SeoLocale } from "@/lib/seo";

const content: Record<
  SeoLocale,
  {
    title: string;
    description: string;
    keywords: string[];
  }
> = {
  de: {
    title: "Digitale Speisekarte erstellen | QR Code Menü – Digi-Karte",
    description:
      "Erstelle in 2 Minuten eine digitale Speisekarte mit QR-Code für dein Restaurant. Kein technisches Wissen nötig. Jetzt kostenlos testen – Digi-Karte.",
    keywords: [
      "digitale Speisekarte",
      "digitales Menü",
      "QR Code Speisekarte Restaurant",
      "Speisekarte online erstellen",
      "QR Menü App",
      "Menü digitalisieren Restaurant",
    ],
  },
  fr: {
    title: "Menu digital restaurant | Carte QR code – Digi-Karte",
    description:
      "Créez un menu digital restaurant avec QR code en quelques minutes. Simple, rapide et professionnel. Commencez gratuitement avec Digi-Karte.",
    keywords: ["menu digital restaurant", "carte QR code restaurant", "creer menu numerique"],
  },
  en: {
    title: "Digital menu restaurant | QR code menu maker – Digi-Karte",
    description:
      "Build a digital menu restaurant page and QR code in minutes. No technical setup required. Start free today with Digi-Karte.",
    keywords: ["digital menu restaurant", "QR code menu maker", "online restaurant menu builder"],
  },
  es: {
    title: "Menu digital para restaurantes | QR menu – Digi-Karte",
    description:
      "Crea un menu digital para tu restaurante con QR en minutos. Facil de usar y listo para movil. Empieza gratis con Digi-Karte.",
    keywords: ["menu digital restaurante", "carta QR restaurante", "crear menu digital"],
  },
  it: {
    title: "Menu digitale ristorante | QR code menu – Digi-Karte",
    description:
      "Crea un menu digitale per ristorante con QR code in pochi minuti. Nessuna complessita tecnica. Prova gratis Digi-Karte.",
    keywords: ["menu digitale ristorante", "menu qr ristorante", "creare menu digitale"],
  },
};

function appLocaleFromPath(seo: SeoLocale): Locale {
  if (seo === "de" || seo === "fr" || seo === "en") return seo;
  return "en";
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isSeoLocale(params.locale)) return {};
  const locale = params.locale;
  const data = content[locale];
  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: alternatesForPath(""),
    openGraph: {
      title: "Digitale Speisekarte mit QR-Code – Digi-Karte",
      description: "Erstelle in 2 Minuten deine digitale Speisekarte. Einfach, schnell, professionell.",
      url: `https://digi-karte.com/${locale}/`,
      type: "website",
      locale: localeOg[locale],
      images: [{ url: "https://digi-karte.com/og-image-de.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Digitale Speisekarte mit QR-Code – Digi-Karte",
      description: "Erstelle in 2 Minuten deine digitale Speisekarte.",
      images: ["https://digi-karte.com/og-image-de.jpg"],
    },
  };
}

export default function LocalizedHomePage({ params }: { params: { locale: string } }) {
  if (!isSeoLocale(params.locale)) notFound();
  return <LandingPage syncLocale={appLocaleFromPath(params.locale)} />;
}
