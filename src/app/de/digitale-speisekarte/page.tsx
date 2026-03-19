import { KeywordLanding, createKeywordMetadata } from "@/components/seo/KeywordLanding";

export const metadata = createKeywordMetadata({
  locale: "de",
  slug: "digitale-speisekarte",
  title: "Digitale Speisekarte | Speisekarte online erstellen – Digi-Karte",
  description:
    "Digitale Speisekarte fur Restaurants erstellen, verwalten und per QR veroffentlichen. Schnell, DSGVO-bewusst und mobil optimiert. Jetzt kostenlos starten.",
  keywords: ["digitale Speisekarte", "digitales Menü", "Speisekarte online erstellen"],
});

export default function Page() {
  return (
    <KeywordLanding
      locale="de"
      h1="Digitale Speisekarte fur Restaurant, Cafe und Bar"
      keyword="digitale Speisekarte"
      body="Mit Digi-Karte kannst du deine Speisekarte online erstellen, in mehreren Sprachen pflegen und in Echtzeit aktualisieren. Ein Link, ein QR-Code, immer aktuell."
    />
  );
}
