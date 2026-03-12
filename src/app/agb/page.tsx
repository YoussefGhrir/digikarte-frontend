import Link from "next/link";

export default function AgbPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="font-forum text-3xl text-neutral-50 md:text-4xl">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der
          Plattform{" "}
          <span className="font-medium text-neutral-100">DigiKarte</span>{" "}
          sowie die vertraglichen Beziehungen zwischen uns als Anbieter und
          unseren gewerblichen Kundinnen und Kunden (z. B. Gastronomiebetriebe).
        </p>

        <section className="mt-8 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            1. Geltungsbereich
          </h2>
          <p>
            (1) Diese AGB gelten für alle Verträge über die Nutzung der
            DigiKarte-Plattform zwischen dem Anbieter und gewerblichen
            Kundinnen und Kunden (nachfolgend „Kunde“ genannt).
          </p>
          <p>
            (2) Abweichende, entgegenstehende oder ergänzende Allgemeine
            Geschäftsbedingungen des Kunden werden nur dann und insoweit
            Vertragsbestandteil, als wir ihrer Geltung ausdrücklich schriftlich
            zugestimmt haben.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            2. Vertragspartner und Kontakt
          </h2>
          <p className="whitespace-pre-line">
            Vertragspartner ist:
            {"\n"}[Name der Firma / des Anbieters]
            {"\n"}[Straße und Hausnummer]
            {"\n"}[PLZ und Ort]
            {"\n"}[Land]
            {"\n"}E-Mail: [Kontaktadresse]
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            3. Leistungsgegenstand
          </h2>
          <p>
            (1) Wir stellen dem Kunden eine webbasierte Plattform zur Verfügung,
            mit der digitale Speisekarten erstellt, verwaltet und über QR-Codes
            oder Links bereitgestellt werden können.
          </p>
          <p>
            (2) Der konkrete Leistungsumfang (z. B. Anzahl Menüs, Filialen,
            Zusatzfunktionen) ergibt sich aus der jeweils vereinbarten
            Leistungsbeschreibung bzw. dem gewählten Tarif.
          </p>
          <p>
            (3) Ein bestimmter wirtschaftlicher Erfolg (z. B. Umsatzsteigerung)
            ist nicht geschuldet.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            4. Registrierung und Kundenkonto
          </h2>
          <p>
            (1) Für die Nutzung der Plattform ist eine Registrierung und
            Einrichtung eines Kundenkontos erforderlich. Die bei der
            Registrierung abgefragten Daten sind vollständig und wahrheitsgemäß
            anzugeben.
          </p>
          <p>
            (2) Der Kunde ist verpflichtet, Zugangsdaten vertraulich zu
            behandeln und vor dem Zugriff Dritter zu schützen.
          </p>
          <p>
            (3) Der Kunde haftet für alle Aktivitäten, die über sein Kundenkonto
            erfolgen, soweit er diese zu vertreten hat.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            5. Preise, Zahlungsbedingungen
          </h2>
          <p>
            (1) Es gelten die jeweils zum Zeitpunkt des Vertragsschlusses
            vereinbarten Preise bzw. Tarife. Alle Preise verstehen sich
            grundsätzlich netto zuzüglich der gesetzlichen Umsatzsteuer, sofern
            nichts anderes angegeben ist.
          </p>
          <p>
            (2) Die Abrechnung erfolgt je nach Vereinbarung (z. B. monatlich,
            jährlich). Zahlungen sind mit Rechnungsstellung ohne Abzug fällig,
            sofern keine anderen Zahlungsfristen angegeben sind.
          </p>
          <p>
            (3) Gerät der Kunde mit Zahlungen in Verzug, sind wir berechtigt,
            den Zugang zur Plattform nach vorheriger Ankündigung vorläufig zu
            sperren.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            6. Pflichten des Kunden, Inhalte
          </h2>
          <p>
            (1) Der Kunde ist für die Inhalte seiner digitalen Speisekarten (z. B.
            Speisen, Preise, Allergeninformationen, Bilder, Logos, Texte) selbst
            verantwortlich. Er stellt sicher, dass alle Inhalte mit den
            geltenden gesetzlichen Vorgaben (insbesondere Lebensmittelrecht,
            Preisangabenverordnung, Urheberrecht, Markenrecht) vereinbar sind.
          </p>
          <p>
            (2) Der Kunde stellt uns von sämtlichen Ansprüchen Dritter frei, die
            aus einer rechtswidrigen Verwendung von Inhalten oder der sonstigen
            Nutzung der Plattform durch den Kunden resultieren, soweit ihn ein
            Verschulden trifft.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            7. Verfügbarkeit und Wartung
          </h2>
          <p>
            (1) Wir bemühen uns um eine hohe Verfügbarkeit der Plattform im
            Rahmen des wirtschaftlich Zumutbaren. Zeitlich begrenzte
            Einschränkungen können sich insbesondere durch Wartungsarbeiten,
            Sicherheitsupdates oder Ereignisse höherer Gewalt ergeben.
          </p>
          <p>
            (2) Planbare Wartungsarbeiten werden – soweit möglich – in
            nutzungsarmen Zeiten durchgeführt und vorab angekündigt.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            8. Haftung
          </h2>
          <p>
            (1) Wir haften unbeschränkt für Schäden aus der Verletzung des
            Lebens, des Körpers oder der Gesundheit, die auf einer vorsätzlichen
            oder fahrlässigen Pflichtverletzung beruhen, sowie für Schäden, die
            auf vorsätzlichen oder grob fahrlässigen Pflichtverletzungen
            beruhen.
          </p>
          <p>
            (2) Bei leicht fahrlässiger Verletzung wesentlicher
            Vertragspflichten (Kardinalpflichten) ist unsere Haftung auf den
            vertragstypischen, vorhersehbaren Schaden begrenzt. Im Übrigen ist
            die Haftung für leichte Fahrlässigkeit ausgeschlossen.
          </p>
          <p>
            (3) Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            9. Laufzeit und Kündigung
          </h2>
          <p>
            (1) Die Mindestvertragslaufzeit und Kündigungsfristen ergeben sich
            aus dem jeweils gewählten Tarif bzw. der individuellen Vereinbarung.
          </p>
          <p>
            (2) Das Recht zur außerordentlichen Kündigung aus wichtigem Grund
            bleibt unberührt.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            10. Urheberrecht, Nutzungsrechte
          </h2>
          <p>
            (1) An der Plattform sowie an den zugrunde liegenden Software- und
            Designbestandteilen bestehen Urheber- und/oder sonstige
            Schutzrechte, die ausschließlich uns oder unseren Lizenzgebern
            zustehen.
          </p>
          <p>
            (2) Der Kunde erhält für die Dauer des Vertrags ein einfaches,
            nicht übertragbares Recht, die Plattform im vertraglich vereinbarten
            Umfang zu nutzen.
          </p>
        </section>

        <section className="mt-6 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            11. Schlussbestimmungen
          </h2>
          <p>
            (1) Es gilt das Recht der Bundesrepublik Deutschland unter
            Ausschluss des UN-Kaufrechts.
          </p>
          <p>
            (2) Ist der Kunde Kaufmann, juristische Person des öffentlichen
            Rechts oder öffentlich-rechtliches Sondervermögen, ist – soweit
            gesetzlich zulässig – unser Sitz Gerichtsstand für alle
            Streitigkeiten aus dem Vertragsverhältnis.
          </p>
          <p>
            (3) Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise
            unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen
            Bestimmungen unberührt.
          </p>
        </section>

        <section className="mt-10 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
          <p>
            Hinweis: Diese AGB sind ein allgemeines Muster und ersetzen keine
            individuelle rechtliche Beratung. Bitte passe alle Platzhalter und
            Inhalte an dein konkretes Angebot, deine Preise und Prozesse an und
            lass den Text im Zweifel rechtlich prüfen.
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

