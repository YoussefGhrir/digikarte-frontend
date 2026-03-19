import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { alternatesForPath, isSeoLocale, localeOg, type SeoLocale } from "@/lib/seo";

const content: Record<
  SeoLocale,
  {
    title: string;
    description: string;
    keywords: string[];
    h1: string;
    intro: string;
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
    h1: "Digitale Speisekarte und QR Code Menü für Restaurants",
    intro:
      "Digi-Karte hilft Restaurants, Cafes, Bars und Lounges dabei, ein digitales Menü in Minuten zu veröffentlichen und per QR-Code direkt am Tisch verfügbar zu machen.",
  },
  fr: {
    title: "Menu digital restaurant | Carte QR code – Digi-Karte",
    description:
      "Créez un menu digital restaurant avec QR code en quelques minutes. Simple, rapide et professionnel. Commencez gratuitement avec Digi-Karte.",
    keywords: ["menu digital restaurant", "carte QR code restaurant", "creer menu numerique"],
    h1: "Menu digital restaurant et carte QR code",
    intro:
      "Digi-Karte permet aux restaurants, cafes et bars de publier une carte numerique et un QR code sans complexite technique.",
  },
  en: {
    title: "Digital menu restaurant | QR code menu maker – Digi-Karte",
    description:
      "Build a digital menu restaurant page and QR code in minutes. No technical setup required. Start free today with Digi-Karte.",
    keywords: ["digital menu restaurant", "QR code menu maker", "online restaurant menu builder"],
    h1: "Digital menu restaurant builder with QR codes",
    intro:
      "Digi-Karte helps hospitality teams launch and update online menus across locations, languages, and services from one platform.",
  },
  es: {
    title: "Menu digital para restaurantes | QR menu – Digi-Karte",
    description:
      "Crea un menu digital para tu restaurante con QR en minutos. Facil de usar y listo para movil. Empieza gratis con Digi-Karte.",
    keywords: ["menu digital restaurante", "carta QR restaurante", "crear menu digital"],
    h1: "Menu digital con QR para restaurantes",
    intro:
      "Digi-Karte permite crear menus digitales profesionales con QR para restaurantes, cafes y bares en Europa.",
  },
  it: {
    title: "Menu digitale ristorante | QR code menu – Digi-Karte",
    description:
      "Crea un menu digitale per ristorante con QR code in pochi minuti. Nessuna complessita tecnica. Prova gratis Digi-Karte.",
    keywords: ["menu digitale ristorante", "menu qr ristorante", "creare menu digitale"],
    h1: "Menu digitale e QR code per ristoranti",
    intro:
      "Digi-Karte aiuta ristoranti, bar e cafe a pubblicare menu digitali multilingua con QR code e aggiornamenti in tempo reale.",
  },
};

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
  const locale = params.locale;
  const data = content[locale];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Digi-Karte",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: "Creer une carte digitale et un QR code pour votre restaurant en quelques minutes.",
    url: "https://digi-karte.com",
    offers: {
      "@type": "Offer",
      price: "9.99",
      priceCurrency: "EUR",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Was ist eine digitale Speisekarte?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Eine digitale Speisekarte ist eine online zugangliche Version der Restaurantkarte, die uber einen QR-Code aufgerufen werden kann.",
        },
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_45%)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14">
        <div className="rounded-3xl border border-neutral-700/70 bg-neutral-950/70 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Digi-Karte SaaS</p>
          <h1 className="mt-3 text-4xl font-semibold text-neutral-50 md:text-5xl">{data.h1}</h1>
          <p className="mt-4 max-w-3xl text-lg text-neutral-300">{data.intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/`}
              className="rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-neutral-900 shadow-[0_14px_35px_rgba(251,191,36,0.45)] hover:bg-amber-300"
            >
              Startseite
            </Link>
            <Link href={`/${locale}/blog/`} className="rounded-full border border-neutral-600 px-5 py-2 text-sm text-neutral-200 hover:border-amber-400/50 hover:text-amber-200">
              Blog
            </Link>
            <Link href={`/${locale}/register`} className="rounded-full border border-emerald-500/50 px-5 py-2 text-sm text-emerald-200 hover:bg-emerald-500/10">
              Kostenlos starten
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-16 md:grid-cols-3">
        <article className="rounded-2xl border border-neutral-700/70 bg-neutral-950/75 p-6">
          <h2 className="text-xl font-semibold text-neutral-50">Digitale Speisekarte</h2>
          <p className="mt-2 text-neutral-300">Mobile-first Menus fur Restaurant, Bar und Cafe mit sofortigen Updates.</p>
          <Link href="/de/digitale-speisekarte/" className="mt-4 inline-block text-amber-200 underline">
            Mehr erfahren
          </Link>
        </article>
        <article className="rounded-2xl border border-neutral-700/70 bg-neutral-950/75 p-6">
          <h2 className="text-xl font-semibold text-neutral-50">QR Code Menu</h2>
          <p className="mt-2 text-neutral-300">QR-Sticker und Poster fur Tisch, Tur und Fenster mit einem stabilen Link.</p>
          <Link href="/de/qr-code-menu/" className="mt-4 inline-block text-amber-200 underline">
            QR optimieren
          </Link>
        </article>
        <article className="rounded-2xl border border-neutral-700/70 bg-neutral-950/75 p-6">
          <h2 className="text-xl font-semibold text-neutral-50">SEO Wachstum</h2>
          <p className="mt-2 text-neutral-300">Inhalte, hreflang und Struktur fur starke organische Sichtbarkeit.</p>
          <Link href="/de/blog/" className="mt-4 inline-block text-amber-200 underline">
            Zum Blog
          </Link>
        </article>
      </section>
    </main>
  );
}
