import Link from "next/link";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <h1 className="font-forum text-3xl text-neutral-50 md:text-4xl">
          Impressum
        </h1>
        <p className="mt-3 text-sm text-neutral-400">
          Dieses Impressum gilt für das Online-Angebot{" "}
          <span className="font-medium text-neutral-100">DigiKarte</span> sowie
          alle dazugehörigen Unterseiten.
        </p>

        <section className="mt-8 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            Angaben gemäß § 5 DDG
          </h2>
          <p className="whitespace-pre-line text-sm text-neutral-300">
            Betreiber der Plattform / Diensteanbieter:
            {"\n"}Youssef Ghrir
            {"\n"}Rechtsform: [z. B. Einzelunternehmen / e. K. / GmbH – bitte anpassen]
            {"\n"}Straße und Hausnummer: [bitte ergänzen]
            {"\n"}PLZ und Ort: [bitte ergänzen] Kaiserslautern
            {"\n"}Deutschland
          </p>
        </section>

        <section className="mt-6 space-y-1 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            Vertreten durch
          </h2>
          <p>
            Gesetzlich vertreten durch: Youssef Ghrir.
          </p>
        </section>

        <section className="mt-6 space-y-1 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">Kontakt</h2>
          <p>
            Telefon: +49 152 02387840
            <br />
            E-Mail: gheriryoussef@gmail.com
            <br />
            Website: https://digi-karte.com
          </p>
        </section>

        <section className="mt-6 space-y-1 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            Registereintrag
          </h2>
          <p>
            {/* Falls zutreffend, ansonsten diesen Abschnitt entfernen */}
            Eintragung im Handelsregister.
            <br />
            Registergericht: [bitte ergänzen]
            <br />
            Registernummer: [bitte ergänzen]
          </p>
        </section>

        <section className="mt-6 space-y-1 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            Umsatzsteuer-ID
          </h2>
          <p>
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a
            Umsatzsteuergesetz:
            <br />
            [USt-IdNr., falls vorhanden]
          </p>
        </section>

        <section className="mt-8 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            Verantwortlich für den Inhalt
          </h2>
          <p>
            Verantwortlich für den Inhalt:
            <br />
            Youssef Ghrir
            <br />
            [bitte vollständige Adresse ergänzen]
          </p>
        </section>

        <section className="mt-8 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            Haftung für Inhalte
          </h2>
          <p>
            Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten
            nach den allgemeinen Gesetzen verantwortlich. Wir sind als
            Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
            gespeicherte fremde Informationen allgemein zu überwachen oder
            nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
            hinweisen.
          </p>
          <p>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
            Informationen nach den allgemeinen Gesetzen bleiben hiervon
            unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
            Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei
            Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese
            Inhalte umgehend entfernen.
          </p>
        </section>

        <section className="mt-8 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            Haftung für Links
          </h2>
          <p>
            Unser Angebot enthält ggf. Links zu externen Websites Dritter, auf
            deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
            diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte
            der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich.
          </p>
          <p>
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
            jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
            zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
            derartige Links umgehend entfernen.
          </p>
        </section>

        <section className="mt-8 space-y-2 text-sm text-neutral-300">
          <h2 className="text-lg font-semibold text-neutral-100">
            Urheberrecht
          </h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
            diesen Seiten unterliegen dem deutschen Urheberrecht. Die
            Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
            Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
            schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
          <p>
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
            werden Inhalte Dritter als solche gekennzeichnet. Solltest du
            trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
            wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </section>

        <section className="mt-10 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
          <p>
            Hinweis: Dieses Impressum stellt keine Rechtsberatung dar und
            ersetzt keine individuelle Prüfung durch eine Rechtsanwältin oder
            einen Rechtsanwalt. Bitte passe alle Platzhalter an deine konkreten
            Unternehmensdaten an und lass den Text im Zweifel rechtlich prüfen.
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

