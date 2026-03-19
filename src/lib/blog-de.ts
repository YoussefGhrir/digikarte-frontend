export type BlogArticle = {
  slug: string;
  title: string;
  description: string;
  sections: { title: string; body: string }[];
};

export const blogDeArticles: BlogArticle[] = [
  {
    slug: "digitale-speisekarte-vorteile-restaurant-2025",
    title: "Digitale Speisekarte: Vorteile fur Ihr Restaurant 2025",
    description: "Warum digitale Menus 2025 fur Restaurants ein klarer Wettbewerbsvorteil sind.",
    sections: [
      { title: "Schnellere Aktualisierung", body: "Preise und Gerichte lassen sich sofort live anpassen." },
      { title: "Mehrsprachigkeit", body: "Internationale Gaste erhalten Menus in passender Sprache." },
      { title: "Bessere Hygiene", body: "QR statt Papier reduziert Kontaktpunkte im Service." },
      { title: "Kosteneffizienz", body: "Weniger Nachdruck spart laufend Kosten." },
    ],
  },
  {
    slug: "qr-code-menu-erstellen-anleitung",
    title: "QR Code Menu erstellen - Schritt-fur-Schritt Anleitung",
    description: "Praxisanleitung: vom ersten Menu bis zum gedruckten QR-Code.",
    sections: [
      { title: "Schritt 1: Menu anlegen", body: "Lege Kategorien und Gerichte mit Preisen an." },
      { title: "Schritt 2: QR erzeugen", body: "Erstelle fur jedes Menu einen eigenen QR-Link." },
      { title: "Schritt 3: Druckvorlagen", body: "Nutze Sticker und Poster fur Tisch und Eingang." },
      { title: "Schritt 4: Messen und optimieren", body: "Teste Scanrate und optimiere Platzierung." },
    ],
  },
  {
    slug: "warum-restaurants-auf-digitale-menues-umsteigen",
    title: "Warum Restaurants auf digitale Menus umsteigen",
    description: "Die wichtigsten Grunde fur den Umstieg von Papier auf digitale Menus.",
    sections: [
      { title: "Gaste erwarten Mobilfreundlichkeit", body: "Mobile-first Nutzung ist heute Standard." },
      { title: "Betriebsprozesse werden einfacher", body: "Anderungen sind zentral und sofort sichtbar." },
      { title: "Markenauftritt wird konsistent", body: "Einheitliche Darstellung uber alle Standorte." },
      { title: "Skalierung fur Ketten", body: "Mehrere Filialen lassen sich zentral steuern." },
    ],
  },
  {
    slug: "kostenlose-vs-kostenpflichtige-qr-menu-tools-vergleich",
    title: "Kostenlose vs. kostenpflichtige QR Menu Tools - Vergleich",
    description: "Welche Unterschiede bei Funktionen, Support und Skalierung wirklich zahlen.",
    sections: [
      { title: "Funktionsumfang", body: "Kostenlose Tools sind oft in Anzahl und Branding limitiert." },
      { title: "Support und Zuverlassigkeit", body: "SaaS-Plattformen bieten stabilere Betriebsprozesse." },
      { title: "Datenschutz und Hosting", body: "Professionelle Anbieter dokumentieren Sicherheit klar." },
      { title: "Gesamtkosten", body: "Zeitaufwand und Ausfalle sind oft teurer als ein Abo." },
    ],
  },
  {
    slug: "dsgvo-konformes-digitales-menue-restaurants",
    title: "DSGVO-konformes digitales Menu fur Restaurants",
    description: "So setzen Restaurants digitale Menus datenschutzkonform um.",
    sections: [
      { title: "Datensparsamkeit", body: "Nur notwendige Daten erfassen und klar kommunizieren." },
      { title: "Sichere Infrastruktur", body: "HTTPS, sichere Header und Zugriffsschutz verwenden." },
      { title: "Rechtstexte", body: "Impressum und Datenschutzerklarung gut auffindbar halten." },
      { title: "Dienstleisterprufung", body: "Auftragsverarbeiter und Vertrage sauber dokumentieren." },
    ],
  },
];

export const blogDeMap = new Map(blogDeArticles.map((a) => [a.slug, a]));
