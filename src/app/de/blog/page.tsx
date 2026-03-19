import Link from "next/link";
import type { Metadata } from "next";
import { alternatesForPath } from "@/lib/seo";
import { blogDeArticles } from "@/lib/blog-de";

export const metadata: Metadata = {
  title: "Digi-Karte Blog | Digitale Speisekarte & QR Code Restaurant",
  description:
    "Fachartikel zu digitaler Speisekarte, QR Code Menu, DSGVO und Online-Marketing fur Restaurants. Jetzt lesen und Wissen direkt umsetzen.",
  alternates: alternatesForPath("blog"),
};

export default function DeBlogIndexPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      <h1 className="text-4xl font-semibold">Digi-Karte Blog fur Restaurants</h1>
      <p className="mt-4 text-neutral-300">
        Strategien und Anleitungen rund um digitale Speisekarten, QR Menus und SEO fur Gastronomie.
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href="/de/digitale-speisekarte/" className="underline">
          Digitale Speisekarte Landing
        </Link>
        <Link href="/de/qr-code-menu/" className="underline">
          QR Code Menu Landing
        </Link>
      </div>
      <div className="mt-10 space-y-4">
        {blogDeArticles.map((article) => (
          <article key={article.slug} className="rounded-xl border border-neutral-800 p-5">
            <h2 className="text-xl font-semibold">
              <Link href={`/de/blog/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className="mt-2 text-neutral-300">{article.description}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
