import { KeywordLanding, createKeywordMetadata } from "@/components/seo/KeywordLanding";

export const metadata = createKeywordMetadata({
  locale: "fr",
  slug: "menu-digital-restaurant",
  title: "Menu digital restaurant | Carte QR code restaurant – Digi-Karte",
  description:
    "Creez votre menu digital restaurant et votre carte QR code en quelques minutes. Simple a gerer, rapide a deployer. Demarrez gratuitement.",
  keywords: ["menu digital restaurant", "carte QR code restaurant", "creer menu numerique"],
});

export default function Page() {
  return (
    <KeywordLanding
      locale="fr"
      h1="Menu digital restaurant et carte QR code"
      keyword="menu digital restaurant"
      body="Digi-Karte vous permet de creer une carte numerique performante pour votre restaurant, avec QR code, multilingue et mise a jour en temps reel."
    />
  );
}
