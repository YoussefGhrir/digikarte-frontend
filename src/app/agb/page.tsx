import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function AgbPage() {
  const sections = [
    {
      title: "1. Geltungsbereich",
      content: (
        <>
          <p>
            Diese AGB gelten für alle Verträge über die Nutzung der DigiKarte-Plattform zwischen dem
            Anbieter und gewerblichen Kundinnen und Kunden.
          </p>
          <p className="mt-2">
            Abweichende AGB des Kunden werden nur dann Vertragsbestandteil, wenn wir ihrer Geltung
            ausdrücklich schriftlich zugestimmt haben.
          </p>
        </>
      ),
    },
    {
      title: "2. Vertragspartner und Kontakt",
      content: (
        <p className="whitespace-pre-line">
          Vertragspartner ist:
          {"\n"}Youssef Ghrir
          {"\n"}Straße und Hausnummer: [bitte ergänzen]
          {"\n"}PLZ und Ort: [bitte ergänzen] Kaiserslautern
          {"\n"}Deutschland
          {"\n"}E-Mail: gheriryoussef@gmail.com
        </p>
      ),
    },
    {
      title: "3. Leistungsgegenstand",
      content: (
        <>
          <p>
            Wir stellen eine webbasierte Plattform bereit, mit der digitale Speisekarten erstellt,
            verwaltet und über QR-Codes oder Links bereitgestellt werden.
          </p>
          <p className="mt-2">
            Der konkrete Leistungsumfang ergibt sich aus dem gewählten Tarif bzw. der vereinbarten
            Leistungsbeschreibung.
          </p>
        </>
      ),
    },
    {
      title: "4. Registrierung und Kundenkonto",
      content: (
        <ul className="list-disc space-y-1 pl-5">
          <li>Registrierungsdaten sind vollständig und wahrheitsgemäß anzugeben.</li>
          <li>Zugangsdaten sind vertraulich zu behandeln.</li>
          <li>
            Der Kunde haftet für Aktivitäten über sein Kundenkonto, soweit diese ihm zuzurechnen sind.
          </li>
        </ul>
      ),
    },
    {
      title: "5. Preise und Zahlungsbedingungen",
      content: (
        <>
          <p>
            Es gelten die zum Vertragsschluss vereinbarten Tarife. Preise verstehen sich netto zzgl.
            gesetzlicher Umsatzsteuer, sofern nicht anders angegeben.
          </p>
          <p className="mt-2">
            Bei Zahlungsverzug sind wir berechtigt, den Zugang nach vorheriger Ankündigung vorläufig zu
            sperren.
          </p>
        </>
      ),
    },
    {
      title: "6. Pflichten des Kunden / Inhalte",
      content: (
        <>
          <p>
            Der Kunde ist für Inhalte seiner digitalen Menüs selbst verantwortlich und stellt sicher,
            dass diese den geltenden gesetzlichen Anforderungen entsprechen.
          </p>
          <p className="mt-2">
            Bei rechtswidriger Nutzung stellt der Kunde den Anbieter von Ansprüchen Dritter frei, soweit
            ihn ein Verschulden trifft.
          </p>
        </>
      ),
    },
    {
      title: "7. Verfügbarkeit und Wartung",
      content: (
        <p>
          Wir bemühen uns um hohe Verfügbarkeit. Zeitlich begrenzte Einschränkungen sind insbesondere
          durch Wartungen, Sicherheitsupdates oder höhere Gewalt möglich.
        </p>
      ),
    },
    {
      title: "8. Haftung",
      content: (
        <>
          <p>
            Unbeschränkte Haftung besteht bei Vorsatz, grober Fahrlässigkeit sowie bei Schäden an Leben,
            Körper oder Gesundheit.
          </p>
          <p className="mt-2">
            Bei leichter Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten,
            begrenzt auf den vorhersehbaren, vertragstypischen Schaden.
          </p>
        </>
      ),
    },
    {
      title: "9. Laufzeit und Kündigung",
      content: (
        <p>
          Mindestlaufzeit und Kündigungsfristen richten sich nach dem gewählten Tarif. Das Recht zur
          außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.
        </p>
      ),
    },
    {
      title: "10. Urheberrecht und Nutzungsrechte",
      content: (
        <p>
          Der Kunde erhält für die Vertragsdauer ein einfaches, nicht übertragbares Nutzungsrecht im
          vertraglich vereinbarten Umfang. Alle übrigen Schutzrechte verbleiben beim Anbieter.
        </p>
      ),
    },
    {
      title: "11. Schlussbestimmungen",
      content: (
        <>
          <p>
            Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Ist der Kunde Kaufmann, ist -
            soweit zulässig - der Sitz des Anbieters Gerichtsstand.
          </p>
          <p className="mt-2">
            Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen
            Bestimmungen unberührt.
          </p>
        </>
      ),
    },
  ];

  return (
    <LegalPageLayout
      pageLabel="DigiKarte"
      title="Allgemeine Geschäftsbedingungen (AGB)"
      intro={
        <>
          Diese AGB regeln die Nutzung der Plattform{" "}
          <span className="font-medium text-neutral-100">DigiKarte</span> sowie die vertraglichen
          Beziehungen zwischen Anbieter und gewerblichen Kundinnen und Kunden.
        </>
      }
      sideCard={
        <div className="space-y-3 text-sm text-neutral-300">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Vertragskontakt</p>
          <p>
            E-Mail:{" "}
            <a href="mailto:gheriryoussef@gmail.com" className="text-amber-300 hover:text-amber-200">
              gheriryoussef@gmail.com
            </a>
          </p>
          <p>
            Projektseite:{" "}
            <Link href="/" className="text-amber-300 hover:text-amber-200">
              digi-karte.com
            </Link>
          </p>
          <p className="text-xs text-neutral-500">
            Für individuelle Vertragsbeziehungen gelten ergänzend die konkret vereinbarten Tarifdetails.
          </p>
        </div>
      }
      sections={sections}
      footerNote={
        <p>
          Hinweis: Diese AGB sind ein allgemeines Muster und ersetzen keine individuelle rechtliche
          Beratung.
        </p>
      }
    />
  );
}
