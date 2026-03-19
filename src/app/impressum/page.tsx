import Image from "next/image";
import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function ImpressumPage() {
  const sections = [
    {
      title: "Angaben gemäß § 5 DDG",
      content: (
        <>
          <p>
            <span className="font-semibold text-neutral-100">
              Verantwortlicher / Diensteanbieter:
            </span>
            <br />
            Youssef Ghrir
            <br />
            Software Engineer
            <br />
            Kaiserslautern, Deutschland
          </p>
          <p className="mt-2 text-xs text-neutral-400">
            Hinweis: Für vollständige rechtliche Konformität in Deutschland sollte hier eine
            ladungsfähige Anschrift (Straße, Hausnummer, PLZ, Ort) ergänzt werden.
          </p>
        </>
      ),
    },
    {
      title: "Verantwortlich i. S. d. § 18 Abs. 2 MStV",
      content: <p>Youssef Ghrir, Kaiserslautern, Deutschland.</p>,
    },
    {
      title: "Kontakt und Online-Profile",
      content: (
        <ul className="space-y-1">
          <li>
            E-Mail:{" "}
            <a href="mailto:gheriryoussef@gmail.com" className="text-amber-300 hover:text-amber-200">
              gheriryoussef@gmail.com
            </a>
          </li>
          <li>
            Telefon:{" "}
            <a href="https://wa.me/4915202387840" className="text-amber-300 hover:text-amber-200">
              +49 152 02387840
            </a>
          </li>
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
            Projekt:{" "}
            <Link href="/" className="text-amber-300 hover:text-amber-200">
              digi-karte.com
            </Link>
          </li>
        </ul>
      ),
    },
    {
      title: "Haftung für Inhalte und Links",
      content: (
        <p>
          Die Inhalte dieser Webseite werden mit großer Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität der Inhalte wird jedoch keine Gewähr übernommen. Für Inhalte
          externer Links sind ausschließlich deren Betreiber verantwortlich.
        </p>
      ),
    },
    {
      title: "Urheberrecht",
      content: (
        <p>
          Die auf dieser Webseite veröffentlichten Inhalte, Bilder und Werke unterliegen dem deutschen
          Urheberrecht. Jede Nutzung außerhalb der Grenzen des Urheberrechts bedarf der vorherigen
          schriftlichen Zustimmung.
        </p>
      ),
    },
    {
      title: "EU-Streitbeilegung",
      content: (
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr/"
            target="_blank"
            rel="noreferrer"
            className="text-amber-300 hover:text-amber-200"
          >
            ec.europa.eu/consumers/odr/
          </a>
          . Eine Verpflichtung oder Bereitschaft zur Teilnahme an einem Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle besteht nicht.
        </p>
      ),
    },
  ];

  return (
    <LegalPageLayout
      pageLabel="DigiKarte"
      title="Impressum"
      intro={
        <>
          Rechtliche Angaben für die Webseite und das Projekt{" "}
          <span className="font-semibold text-neutral-100">digi-karte.com</span> gemäß deutschen
          Vorgaben.
        </>
      }
      sideCard={
        <>
          <div className="relative mx-auto h-36 w-36 overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-900 shadow-xl">
            <Image
              src="/ghrir.png"
              alt="Youssef Ghrir"
              fill
              sizes="144px"
              className="object-cover"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="font-semibold text-neutral-100">Youssef Ghrir</p>
            <p className="text-sm text-neutral-400">Software Engineer</p>
          </div>
        </>
      }
      sections={sections}
      footerNote={
        <p>Letzte Aktualisierung: März 2026. Diese Seite ist für Desktop und Mobile optimiert.</p>
      }
    />
  );
}
