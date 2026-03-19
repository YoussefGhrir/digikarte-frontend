import type { Metadata } from "next";
import Link from "next/link";
import { alternatesForPath, localeOg, type SeoLocale } from "@/lib/seo";

export function createKeywordMetadata({
  locale,
  slug,
  title,
  description,
  keywords,
}: {
  locale: SeoLocale;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: alternatesForPath(slug),
    openGraph: {
      title,
      description,
      url: `https://digi-karte.com/${locale}/${slug}/`,
      type: "website",
      locale: localeOg[locale],
      images: [{ url: "https://digi-karte.com/og-image-de.jpg" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://digi-karte.com/og-image-de.jpg"],
    },
  };
}

export function KeywordLanding({
  locale,
  h1,
  body,
  keyword,
}: {
  locale: SeoLocale;
  h1: string;
  body: string;
  keyword: string;
}) {
  const blogLink = locale === "de" ? "/de/blog" : `/${locale}/`;
  const primaryLink =
    locale === "de"
      ? "/de/qr-code-menu/"
      : locale === "fr"
        ? "/fr/menu-digital-restaurant/"
        : locale === "en"
          ? "/en/digital-menu-restaurant/"
          : `/${locale}/`;

  return (
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-4xl font-semibold">{h1}</h1>
      <p className="mt-5 text-lg text-neutral-300">{body}</p>
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold">Warum {keyword} fur Restaurants wichtig ist</h2>
        <p>
          Eine moderne Gastronomie braucht schnelle Updates, saubere mobile Darstellung und eine klare Nutzerfuhrung.
          Genau hier hilft Digi-Karte: Menus werden zentral gepflegt, automatisch ausgeliefert und fur den Scan per
          QR optimiert.
        </p>
        <h3 className="text-xl font-semibold">Vorteile auf einen Blick</h3>
        <p>
          Du aktualisierst Preise ohne Neudruck, reduzierst operative Reibung im Team und bietest Gasten ein
          professionelles digitales Erlebnis in mehreren Sprachen.
        </p>
      </section>
      <section className="mt-8 rounded-xl border border-neutral-800 p-5">
        <h2 className="text-2xl font-semibold">Interne Links fur besseres SEO</h2>
        <p className="mt-2 text-neutral-300">
          Entdecke passende Inhalte und stärke die thematische Relevanz deiner Seiten.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href={primaryLink} className="underline">
            Mehr zu QR Menu und Umsetzung
          </Link>
          <Link href={blogLink} className="underline">
            Blog und Praxisleitfaden
          </Link>
          <Link href={`/${locale}/register`} className="underline">
            Kostenlos starten
          </Link>
        </div>
      </section>
    </main>
  );
}
