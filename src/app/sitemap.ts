import type { MetadataRoute } from "next";
import { blogDeArticles } from "@/lib/blog-de";

const locales = ["de", "fr", "en", "es", "it"] as const;
const base = "https://digi-karte.com";

function withAlternates(pathByLocale: Record<(typeof locales)[number], string>) {
  const url = `${base}${pathByLocale.de}`;
  const languages = Object.fromEntries(
    locales.map((locale) => [locale, `${base}${pathByLocale[locale]}`]),
  ) as Record<string, string>;
  return {
    url,
    alternates: { languages },
    changeFrequency: "weekly" as const,
    priority: 1,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    withAlternates({ de: "/de/", fr: "/fr/", en: "/en/", es: "/es/", it: "/it/" }),
    withAlternates({
      de: "/de/digitale-speisekarte/",
      fr: "/fr/menu-digital-restaurant/",
      en: "/en/digital-menu-restaurant/",
      es: "/es/",
      it: "/it/",
    }),
    withAlternates({
      de: "/de/qr-code-menu/",
      fr: "/fr/menu-digital-restaurant/",
      en: "/en/digital-menu-restaurant/",
      es: "/es/",
      it: "/it/",
    }),
    {
      url: `${base}/de/blog/`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const blogPages = blogDeArticles.map((article) => ({
    url: `${base}/de/blog/${article.slug}/`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
