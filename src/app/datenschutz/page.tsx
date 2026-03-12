import Link from "next/link";

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="font-forum text-3xl text-neutral-50 md:text-4xl">
          Datenschutzerklärung
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Der Schutz deiner personenbezogenen Daten ist uns ein wichtiges
          Anliegen. Nachfolgend informieren wir dich darüber, wie wir deine
          Daten im Rahmen der Nutzung von{" "}
          <span className="font-medium text-neutral-100">DigiKarte</span>{" "}
          verarbeiten.
        </p>

        <section className="mt-8 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            1. Verantwortlicher
          </h2>
          <p className="whitespace-pre-line">
            Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
            {"\n"}[Name der Firma / des Verantwortlichen]
            {"\n"}[Straße und Hausnummer]
            {"\n"}[PLZ und Ort]
            {"\n"}[Land]
            {"\n"}E-Mail: [Datenschutz-Kontaktadresse]
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            2. Zwecke und Rechtsgrundlagen der Datenverarbeitung
          </h2>
          <p>
            Wir verarbeiten personenbezogene Daten zur Bereitstellung und
            Optimierung unserer digitalen Speisekarten-Plattform, zur
            Registrierung und Verwaltung von Nutzerkonten, zur Abrechnung
            unserer Leistungen sowie zur Kommunikation mit dir.
          </p>
          <p>
            Die Verarbeitung erfolgt insbesondere auf Grundlage von Art. 6 Abs.
            1 lit. b DSGVO (Vertragserfüllung), Art. 6 Abs. 1 lit. c DSGVO
            (rechtliche Verpflichtung) sowie Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse). Soweit wir eine Einwilligung einholen,
            erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. a
            DSGVO.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            3. Erhobene Datenkategorien
          </h2>
          <p>
            Im Rahmen der Nutzung von DigiKarte können insbesondere folgende
            Daten verarbeitet werden:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-300">
            <li>Stammdaten (z. B. Name, Kontaktdaten, Unternehmensdaten).</li>
            <li>
              Zugangsdaten (z. B. E-Mail-Adresse, Passwort – als Hash
              gespeichert).
            </li>
            <li>
              Nutzungsdaten (z. B. aufgerufene Seiten, Interaktionen mit Menüs,
              Logdaten).
            </li>
            <li>
              Kommunikationsdaten (z. B. Anfragen per Kontaktformular oder
              E-Mail).
            </li>
          </ul>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            4. Server-Logfiles
          </h2>
          <p>
            Beim Aufruf unserer Seiten werden durch den von uns eingesetzten
            Server automatisch Informationen in so genannten Server-Logfiles
            erhoben und gespeichert. Dies sind insbesondere:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-300">
            <li>
              IP-Adresse des anfragenden Endgeräts (gekürzt, soweit möglich),
            </li>
            <li>Datum und Uhrzeit des Zugriffs,</li>
            <li>aufgerufene Seite/Datei,</li>
            <li>übertragene Datenmenge,</li>
            <li>verwendeter Browser und Betriebssystem.</li>
          </ul>
          <p>
            Die Verarbeitung erfolgt auf Grundlage unseres berechtigten
            Interesses an der technischen Bereitstellung, Stabilität und
            Sicherheit unseres Angebots (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            5. Cookies und vergleichbare Technologien
          </h2>
          <p>
            Soweit wir Cookies oder vergleichbare Technologien einsetzen,
            dienen diese insbesondere dazu, grundlegende Funktionen der
            Plattform bereitzustellen (z. B. Login, Session-Verwaltung) sowie
            die Nutzung zu analysieren und zu verbessern.
          </p>
          <p>
            Soweit gesetzlich erforderlich, holen wir vor dem Setzen nicht
            technisch notwendiger Cookies deine Einwilligung ein (Art. 6 Abs. 1
            lit. a DSGVO, § 25 TTDSG). Du kannst deine Einwilligung jederzeit
            mit Wirkung für die Zukunft widerrufen.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            6. Empfänger und Drittlandübermittlungen
          </h2>
          <p>
            Wir geben personenbezogene Daten nur an Dritte weiter, soweit dies
            zur Vertragserfüllung, zur Erfüllung rechtlicher Pflichten, zur
            Wahrung unserer berechtigten Interessen oder auf Grundlage deiner
            Einwilligung erforderlich ist.
          </p>
          <p>
            Eine Übermittlung in Drittländer (außerhalb der EU/des EWR) erfolgt
            nur, wenn hierfür ein angemessenes Datenschutzniveau besteht oder
            geeignete Garantien im Sinne der Art. 44 ff. DSGVO vorliegen.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            7. Speicherdauer
          </h2>
          <p>
            Wir verarbeiten und speichern personenbezogene Daten nur so lange,
            wie es für die jeweiligen Zwecke erforderlich ist oder gesetzliche
            Aufbewahrungsfristen bestehen. Nach Wegfall des Zwecks bzw.
            Ablauf der Fristen werden die Daten gelöscht oder anonymisiert.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            8. Deine Rechte
          </h2>
          <p>
            Dir stehen nach der DSGVO insbesondere folgende Rechte zu:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-300">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Recht auf Widerspruch (Art. 21 DSGVO)</li>
            <li>
              Recht, eine erteilte Einwilligung jederzeit mit Wirkung für die
              Zukunft zu widerrufen (Art. 7 Abs. 3 DSGVO)
            </li>
          </ul>
          <p className="mt-2">
            Zur Ausübung deiner Rechte kannst du dich jederzeit an uns wenden
            (Kontaktdaten siehe oben unter Ziff. 1).
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            9. Beschwerderecht bei einer Aufsichtsbehörde
          </h2>
          <p>
            Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde über
            die Verarbeitung deiner personenbezogenen Daten zu beschweren (Art.
            77 DSGVO). Zuständig ist insbesondere die Aufsichtsbehörde deines
            gewöhnlichen Aufenthaltsortes, deines Arbeitsplatzes oder des Orts
            des mutmaßlichen Verstoßes.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            10. Aktualität und Änderungen dieser Datenschutzerklärung
          </h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf zu
            aktualisieren, um sie an geänderte Rechtslagen oder Änderungen
            unserer Dienste anzupassen. Die jeweils aktuelle Version ist auf
            dieser Seite abrufbar.
          </p>
        </section>

        <section className="mt-10 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
          <p>
            Hinweis: Diese Datenschutzerklärung ist ein allgemeines Muster und
            ersetzt keine individuelle rechtliche Beratung. Bitte passe alle
            Platzhalter und Angaben an dein konkretes Geschäftsmodell, deine
            technischen Prozesse und eingesetzten Dienstleister an und lass den
            Text im Zweifel rechtlich prüfen.
          </p>
          <p className="mt-3">
            Zurück zur{" "}
            <Link href="/" className="text-amber-300 hover:text-amber-200">
              Startseite
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

