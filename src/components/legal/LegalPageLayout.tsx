import Link from "next/link";
import type { ReactNode } from "react";

type LegalSection = {
  title: string;
  content: ReactNode;
};

type LegalPageLayoutProps = {
  pageLabel: string;
  title: string;
  intro: ReactNode;
  sideCard?: ReactNode;
  sections: LegalSection[];
  footerNote?: ReactNode;
};

export default function LegalPageLayout({
  pageLabel,
  title,
  intro,
  sideCard,
  sections,
  footerNote,
}: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10 md:py-10">
        <div className="mb-4 flex justify-end">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-900/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200 transition hover:border-amber-400/80 hover:bg-amber-400/10"
          >
            ← Startseite
          </Link>
        </div>

        <header className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-300">{pageLabel}</p>
          <h1 className="mt-2 font-forum text-4xl text-neutral-50 md:text-5xl">{title}</h1>
          <div className="mt-3 max-w-5xl text-sm leading-relaxed text-neutral-300 md:text-base">{intro}</div>
        </header>

        <div className="mt-6 grid gap-6 xl:grid-cols-[330px_minmax(0,1fr)]">
          {sideCard ? (
            <aside className="h-fit rounded-3xl border border-neutral-800 bg-neutral-900/70 p-5">
              {sideCard}
            </aside>
          ) : null}

          <main className={`space-y-4 ${sideCard ? "" : "xl:col-span-2"}`}>
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5"
                >
                  <h2 className="text-lg font-semibold text-neutral-100">{section.title}</h2>
                  <div className="mt-2 text-sm leading-relaxed text-neutral-300">{section.content}</div>
                </section>
              ))}
            </div>
          </main>
        </div>

        <footer className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-4 text-xs text-neutral-400">
          {footerNote ? <div>{footerNote}</div> : null}
          <p className={footerNote ? "mt-2" : ""}>
            Zurück zur{" "}
            <Link href="/" className="text-amber-300 hover:text-amber-200">
              Startseite
            </Link>
            .
          </p>
        </footer>
      </div>
    </div>
  );
}
