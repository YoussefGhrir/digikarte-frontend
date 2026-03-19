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
    <main className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-4xl font-semibold">{article.title}</h1>
      <p className="mt-4 text-neutral-300">
        In diesem Leitfaden zeigen wir, wie Restaurants mit digitalen Menus, QR-Codes und klaren Prozessen mehr
        Effizienz, bessere Gasterlebnisse und messbare Ergebnisse erreichen.
      </p>

      {article.sections.map((section) => (
        <section key={section.title} className="mt-8">
          <h2 className="text-2xl font-semibold">{section.title}</h2>
          <p className="mt-3 text-neutral-300">{section.body}</p>
        </section>
      ))}

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <h3 className="mt-4 text-xl font-semibold">Wie schnell kann ich starten?</h3>
        <p className="mt-2 text-neutral-300">Mit Digi-Karte in wenigen Minuten: Menu erstellen, QR drucken, live schalten.</p>
        <h3 className="mt-4 text-xl font-semibold">Ist das fur mehrere Standorte geeignet?</h3>
        <p className="mt-2 text-neutral-300">Ja, mehrere Organisationen und Menus lassen sich zentral verwalten.</p>
      </section>

      <section className="mt-10 rounded-xl border border-amber-400/40 p-5">
        <h2 className="text-2xl font-semibold">Jetzt kostenlos starten</h2>
        <p className="mt-2 text-neutral-300">Erstelle deine digitale Speisekarte und veroffentliche sofort QR-Codes fur dein Restaurant.</p>
        <Link href="/register" className="mt-4 inline-block rounded-full bg-amber-400 px-5 py-2 font-semibold text-black">
          Kostenlos starten
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Weitere Artikel</h2>
        <div className="mt-4 space-y-2">
          {related.map((item) => (
            <p key={item.slug}>
              <Link href={`/de/blog/${item.slug}`} className="underline">
                {item.title}
              </Link>
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
