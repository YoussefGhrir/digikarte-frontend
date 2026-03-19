import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogDeArticles, blogDeMap } from "@/lib/blog-de";
import { alternatesForPath } from "@/lib/seo";

export function generateStaticParams() {
  return blogDeArticles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = blogDeMap.get(params.slug);
  if (!article) return {};
  return {
    title: `${article.title} | Digi-Karte Blog`,
    description: article.description,
    alternates: alternatesForPath(`blog/${article.slug}`),
  };
}

export default function DeBlogArticlePage({ params }: { params: { slug: string } }) {
  const article = blogDeMap.get(params.slug);
  if (!article) notFound();
  const related = blogDeArticles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_45%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.12),_transparent_45%)]">
      <article className="mx-auto max-w-4xl px-6 py-14">
        <header className="rounded-3xl border border-neutral-700/60 bg-neutral-950/70 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.55)] backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Digi-Karte Blog</p>
          <h1 className="mt-3 text-4xl font-semibold text-neutral-50 md:text-5xl">{article.title}</h1>
          <p className="mt-4 text-neutral-300">
            In diesem Leitfaden zeigen wir, wie Restaurants mit digitalen Menus, QR-Codes und klaren Prozessen mehr
            Effizienz, bessere Gasterlebnisse und messbare Ergebnisse erreichen.
          </p>
        </header>

        {article.sections.map((section, index) => (
          <section
            key={section.title}
            className="mt-8 rounded-2xl border border-neutral-700/60 bg-neutral-950/75 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">Kapitel {String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-50">{section.title}</h2>
            <p className="mt-3 text-neutral-300">{section.body}</p>
          </section>
        ))}

        <section className="mt-10 rounded-2xl border border-neutral-700/60 bg-neutral-950/75 p-6">
          <h2 className="text-2xl font-semibold text-neutral-50">FAQ</h2>
          <h3 className="mt-4 text-xl font-semibold text-neutral-100">Wie schnell kann ich starten?</h3>
          <p className="mt-2 text-neutral-300">Mit Digi-Karte in wenigen Minuten: Menu erstellen, QR drucken, live schalten.</p>
          <h3 className="mt-4 text-xl font-semibold text-neutral-100">Ist das fur mehrere Standorte geeignet?</h3>
          <p className="mt-2 text-neutral-300">Ja, mehrere Organisationen und Menus lassen sich zentral verwalten.</p>
        </section>

        <section className="mt-10 rounded-2xl border border-amber-400/40 bg-amber-500/10 p-6">
          <h2 className="text-2xl font-semibold text-neutral-50">Jetzt kostenlos starten</h2>
          <p className="mt-2 text-neutral-300">
            Erstelle deine digitale Speisekarte und veroffentliche sofort QR-Codes fur dein Restaurant.
          </p>
          <Link
            href="/de/register"
            className="mt-4 inline-flex rounded-full bg-amber-400 px-5 py-2 font-semibold text-neutral-900 shadow-[0_14px_35px_rgba(251,191,36,0.5)] hover:bg-amber-300"
          >
            Kostenlos starten
          </Link>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold text-neutral-50">Weitere Artikel</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/de/blog/${item.slug}`}
                className="rounded-xl border border-neutral-700 bg-neutral-950/70 p-4 text-neutral-200 transition hover:border-amber-400/40 hover:text-amber-200"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
