import Link from "next/link";
import LegalPageLayout from "@/components/legal/LegalPageLayout";

export default function DatenschutzPage() {
  const sections = [
    {
      title: "1. Verantwortlicher",
      content: (
        <p className="whitespace-pre-line">
          Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
          {"\n"}Youssef Ghrir
          {"\n"}Straße und Hausnummer: [bitte ergänzen]
          {"\n"}PLZ und Ort: [bitte ergänzen] Kaiserslautern
          {"\n"}Deutschland
          {"\n"}E-Mail: gheriryoussef@gmail.com
        </p>
      ),
    },
    {
      title: "2. Zwecke und Rechtsgrundlagen",
      content: (
        <>
          <p>
            Wir verarbeiten personenbezogene Daten zur Bereitstellung und zum Betrieb von DigiKarte,
            zur Registrierung und Verwaltung von Nutzerkonten, zur Veröffentlichung deiner Inhalte sowie
            zur Abrechnung von Abonnements.
          </p>
          <p className="mt-2">
            Die Verarbeitung erfolgt insbesondere auf Grundlage von Art. 6 Abs. 1 lit. b, c und f DSGVO
            sowie bei Einwilligungen nach Art. 6 Abs. 1 lit. a DSGVO.
          </p>
        </>
      ),
    },
    {
      title: "3. Datenkategorien",
      content: (
        <ul className="list-disc space-y-1 pl-5">
          <li>Stammdaten (Name, E-Mail, Telefon, Organisationsdaten)</li>
          <li>Zugangsdaten (E-Mail, gehashtes Passwort)</li>
          <li>Nutzungsdaten (Seitenaufrufe, Interaktionen, QR-Aktionen)</li>
          <li>Kommunikationsdaten (Support- und Kontaktanfragen)</li>
          <li>Bild- und Inhaltsdaten (Profilfoto, Logos, Menübilder)</li>
        </ul>
      ),
    },
    {
      title: "4. Server-Logfiles",
      content: (
        <>
          <p>
            Beim Aufruf unserer Seiten werden automatisch Logdaten wie IP-Adresse (gekürzt, soweit
            möglich), Datum/Uhrzeit, aufgerufene Datei, Datenmenge, Browser und Betriebssystem erfasst.
          </p>
          <p className="mt-2">
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (technische Stabilität und Sicherheit).
          </p>
        </>
      ),
    },
    {
      title: "5. Cookies und ähnliche Technologien",
      content: (
        <>
          <p>
            Wir verwenden u. a. den Cookie <span className="font-medium">digikarte-lang</span> zur
            Speicherung der Sprachauswahl.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Zweck: Sprachwahl für aktuelle und zukünftige Besuche</li>
            <li>Speicherdauer: ca. 2 Jahre</li>
            <li>
              Einstellungen: <code>path=/</code>, <code>SameSite=Lax</code>, <code>Secure</code> bei HTTPS
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "6. Empfänger und Drittlandübermittlung",
      content: (
        <>
          <p>
            Eine Weitergabe an Dritte erfolgt nur, soweit dies zur Vertragserfüllung, zur Erfüllung
            rechtlicher Pflichten, auf Grundlage berechtigter Interessen oder mit Einwilligung
            erforderlich ist.
          </p>
          <p className="mt-2">
            Für Zahlungen nutzen wir Stripe. Drittlandübermittlungen erfolgen nur unter den Vorgaben der
            Art. 44 ff. DSGVO.
          </p>
        </>
      ),
    },
    {
      title: "7. Speicherdauer",
      content: (
        <p>
          Daten werden nur so lange gespeichert, wie es für den jeweiligen Zweck erforderlich ist oder
          gesetzliche Aufbewahrungspflichten bestehen. Danach werden Daten gelöscht oder anonymisiert.
        </p>
      ),
    },
    {
      title: "8. Betroffenenrechte",
      content: (
        <>
          <p>Du hast insbesondere folgende Rechte nach DSGVO:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17)</li>
            <li>Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20), Widerspruch (Art. 21)</li>
            <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft</li>
          </ul>
        </>
      ),
    },
    {
      title: "9. Beschwerderecht",
      content: (
        <p>
          Du hast das Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde gemäß Art. 77 DSGVO.
        </p>
      ),
    },
    {
      title: "10. Aktualität und Änderungen",
      content: (
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu aktualisieren. Es gilt jeweils
          die auf dieser Seite veröffentlichte aktuelle Version.
        </p>
      ),
    },
  ];

  return (
    <LegalPageLayout
      pageLabel="DigiKarte"
      title="Datenschutzerklärung"
      intro={
        <>
          Der Schutz deiner personenbezogenen Daten ist uns wichtig. Nachfolgend informieren wir dich
          über die Verarbeitung im Rahmen der Nutzung von{" "}
          <span className="font-medium text-neutral-100">DigiKarte</span>.
        </>
      }
      sideCard={
        <div className="space-y-3 text-sm text-neutral-300">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Schnellkontakt</p>
          <p>
            Datenschutz-Anfragen:{" "}
            <a href="mailto:gheriryoussef@gmail.com" className="text-amber-300 hover:text-amber-200">
              gheriryoussef@gmail.com
            </a>
          </p>
          <p className="text-xs text-neutral-400">
            Bitte füge bei Anfragen möglichst den betroffenen Account und den Zeitraum hinzu.
          </p>
          <p className="pt-3 text-xs text-neutral-500">
            Projektwebseite:{" "}
            <Link href="/" className="text-amber-300 hover:text-amber-200">
              digi-karte.com
            </Link>
          </p>
        </div>
      }
      sections={sections}
      footerNote={
        <p>
          Hinweis: Diese Datenschutzerklärung ist ein allgemeines Muster und ersetzt keine individuelle
          Rechtsberatung.
        </p>
      }
    />
  );
}
