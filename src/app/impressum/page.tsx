import Link from "next/link";
import Image from "next/image";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-7xl px-6 py-10 md:px-10 md:py-14">
        <div className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)] md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-amber-300">DigiKarte</p>
          <h1 className="mt-2 font-forum text-4xl text-neutral-50 md:text-5xl">Impressum</h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-neutral-300 md:text-base">
            Rechtliche Angaben fur die Webseite und das Projekt{" "}
            <span className="font-semibold text-neutral-100">digi-karte.com</span> gemass deutschen
            Vorgaben.
          </p>
        </div>

        <div className="mt-7 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6">
            <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-900 shadow-xl">
              <Image
                src="/ghrir.png"
                alt="Youssef Ghrir"
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
            <div className="mt-5 space-y-4 text-sm text-neutral-300">
              <p className="text-center font-semibold text-neutral-100">Youssef Ghrir</p>
              <p className="text-center text-neutral-400">Software Engineer</p>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Kontakt</p>
                <p className="mt-2">
                  E-Mail:{" "}
                  <a href="mailto:gheriryoussef@gmail.com" className="text-amber-300 hover:text-amber-200">
                    gheriryoussef@gmail.com
                  </a>
                </p>
                <p className="mt-1">
                  Telefon:{" "}
                  <a href="https://wa.me/4915202387840" className="text-amber-300 hover:text-amber-200">
                    +49 152 02387840
                  </a>
                </p>
              </div>
            </div>
          </aside>

          <main className="space-y-6">
            <section className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6">
              <h2 className="text-xl font-semibold text-neutral-100">Angaben gemass § 5 DDG</h2>
              <div className="mt-3 text-sm leading-relaxed text-neutral-300">
                <p>
                  <span className="font-semibold text-neutral-100">Verantwortlicher / Diensteanbieter:</span>
                  <br />
                  Youssef Ghrir
                  <br />
                  Software Engineer
                  <br />
                  Kaiserslautern, Deutschland
                </p>
                <p className="mt-3 text-xs text-neutral-400">
                  Hinweis: Fur vollstandige rechtliche Konformitat in Deutschland sollte hier eine
                  ladungsfahige Anschrift (Strasse, Hausnummer, PLZ, Ort) angegeben werden.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6">
              <h2 className="text-xl font-semibold text-neutral-100">
                Verantwortlich fur journalistisch-redaktionelle Inhalte (§ 18 Abs. 2 MStV)
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                Youssef Ghrir, Kaiserslautern, Deutschland.
              </p>
            </section>

            <section className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6">
              <h2 className="text-xl font-semibold text-neutral-100">Kontakt und Online-Profile</h2>
              <ul className="mt-3 space-y-2 text-sm text-neutral-300">
                <li>
                  LinkedIn:{" "}
                  <a
                    href="https://linkedin.com/in/youssef-ghrir-8922511a4"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-300 hover:text-amber-200"
                  >
                    linkedin.com/in/youssef-ghrir-8922511a4
                  </a>
                </li>
                <li>
                  GitHub:{" "}
                  <a
                    href="https://github.com/YoussefGhrir"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-300 hover:text-amber-200"
                  >
                    github.com/YoussefGhrir
                  </a>
                </li>
                <li>
                  Instagram:{" "}
                  <a
                    href="https://instagram.com/youssef.ghrir"
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-300 hover:text-amber-200"
                  >
                    @youssef.ghrir
                  </a>
                </li>
                <li>
                  Projektwebseite:{" "}
                  <Link href="/" className="text-amber-300 hover:text-amber-200">
                    digi-karte.com
                  </Link>
                </li>
              </ul>
            </section>

            <section className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6">
              <h2 className="text-xl font-semibold text-neutral-100">Haftung fur Inhalte und Links</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                Die Inhalte dieser Webseite werden mit grosser Sorgfalt erstellt. Fur die Richtigkeit,
                Vollstandigkeit und Aktualitat der Inhalte wird jedoch keine Gewahr ubernommen. Fur
                Inhalte externer Links sind ausschliesslich deren Betreiber verantwortlich.
              </p>
            </section>

            <section className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6">
              <h2 className="text-xl font-semibold text-neutral-100">Urheberrecht</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                Die auf dieser Webseite veroffentlichten Inhalte, Bilder und Werke unterliegen dem
                deutschen Urheberrecht. Jede Nutzung ausserhalb der Grenzen des Urheberrechts bedarf
                der vorherigen schriftlichen Zustimmung.
              </p>
            </section>

            <section className="rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6">
              <h2 className="text-xl font-semibold text-neutral-100">EU-Streitbeilegung</h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                Die Europaische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
                {" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-300 hover:text-amber-200"
                >
                  ec.europa.eu/consumers/odr/
                </a>
                . Eine Verpflichtung oder Bereitschaft zur Teilnahme an einem
                Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle besteht nicht.
              </p>
            </section>
          </main>
        </div>

        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-4 text-xs text-neutral-400">
          <p>
            Letzte Aktualisierung: Marz 2026. Diese Seite wurde fur eine professionelle Darstellung im
            Desktop-Web optimiert.
          </p>
          <p className="mt-2">
            Zuruck zur{" "}
            <Link href="/" className="text-amber-300 hover:text-amber-200">
              Startseite
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
