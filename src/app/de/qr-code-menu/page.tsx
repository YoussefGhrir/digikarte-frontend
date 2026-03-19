import { KeywordLanding, createKeywordMetadata } from "@/components/seo/KeywordLanding";

export const metadata = createKeywordMetadata({
  locale: "de",
  slug: "qr-code-menu",
  title: "QR Code Speisekarte Restaurant | QR Menü App – Digi-Karte",
  description:
    "QR Code Speisekarte fur Restaurants in 2 Minuten erstellen. Ideal fur Tischaufsteller und Turposter. Jetzt kostenlos testen und digital durchstarten.",
  keywords: ["QR Code Speisekarte Restaurant", "QR Menü kostenlos", "QR Menü App"],
});

export default function Page() {
  return (
    <KeywordLanding
      locale="de"
      h1="QR Code Speisekarte fur Restaurants"
      keyword="QR Code Speisekarte Restaurant"
      body="Erzeuge QR-Codes fur jedes Menü, drucke Sticker oder Poster und aktualisiere deine Inhalte zentral im Dashboard. Deine Gaste scannen und sehen sofort die aktuelle Karte."
    />
  );
}
