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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_48%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.12),_transparent_48%)]">
      <section className="mx-auto max-w-6xl px-6 pb-12 pt-14">
        <div className="rounded-3xl border border-neutral-700/60 bg-neutral-950/70 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">Digi-Karte Insights</p>
          <h1 className="mt-3 text-4xl font-semibold text-neutral-50 md:text-5xl">Blog fur digitale Menus und QR Code Wachstum</h1>
          <p className="mt-4 max-w-3xl text-neutral-300">
            Moderne Strategien fur Restaurants, Cafes und Bars: SEO, digitale Speisekarten, QR-Optimierung und
            skalierbare Prozesse fur 2026.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/de/digitale-speisekarte/" className="rounded-full border border-amber-400/50 px-4 py-1.5 text-amber-200 hover:bg-amber-500/10">
              Digitale Speisekarte
            </Link>
            <Link href="/de/qr-code-menu/" className="rounded-full border border-emerald-400/50 px-4 py-1.5 text-emerald-200 hover:bg-emerald-500/10">
              QR Code Menu
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          {blogDeArticles.map((article) => (
            <article
              key={article.slug}
              className="group rounded-2xl border border-neutral-700/70 bg-neutral-950/75 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-amber-400/40"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Artikel</p>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-50">
                <Link href={`/de/blog/${article.slug}`} className="hover:text-amber-200">
                  {article.title}
                </Link>
              </h2>
              <p className="mt-3 text-neutral-300">{article.description}</p>
              <div className="mt-5">
                <Link
                  href={`/de/blog/${article.slug}`}
                  className="inline-flex rounded-full bg-amber-400 px-4 py-1.5 text-sm font-semibold text-neutral-900 shadow-[0_12px_30px_rgba(251,191,36,0.45)] transition group-hover:bg-amber-300"
                >
                  Artikel lesen
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
