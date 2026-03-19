import { KeywordLanding, createKeywordMetadata } from "@/components/seo/KeywordLanding";

export const metadata = createKeywordMetadata({
  locale: "en",
  slug: "digital-menu-restaurant",
  title: "Digital menu restaurant | Online menu builder – Digi-Karte",
  description:
    "Launch a digital menu restaurant experience with QR codes and real-time updates. Built for hospitality teams. Start free with Digi-Karte today.",
  keywords: ["digital menu restaurant", "QR code menu maker", "online restaurant menu builder"],
});

export default function Page() {
  return (
    <KeywordLanding
      locale="en"
      h1="Digital menu restaurant builder"
      keyword="digital menu restaurant"
      body="Create online menus, generate QR codes, and keep every location synchronized from one dashboard. Digi-Karte is designed for restaurants, cafes, bars and lounges."
    />
  );
}
