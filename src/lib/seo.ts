export const SITE_URL = "https://digi-karte.com";

export const supportedLocales = ["de", "fr", "en", "es", "it"] as const;
export type SeoLocale = (typeof supportedLocales)[number];

export const localeOg: Record<SeoLocale, string> = {
  de: "de_DE",
  fr: "fr_FR",
  en: "en_US",
  es: "es_ES",
  it: "it_IT",
};

export function isSeoLocale(value: string): value is SeoLocale {
  return supportedLocales.includes(value as SeoLocale);
}

export function localePath(locale: SeoLocale, slug = ""): string {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");
  return cleanSlug ? `/${locale}/${cleanSlug}` : `/${locale}/`;
}

export function alternatesForPath(slug = "") {
  const languages = Object.fromEntries(
    supportedLocales.map((locale) => [locale, `${SITE_URL}${localePath(locale, slug)}`]),
  ) as Record<SeoLocale, string>;

  return {
    canonical: `${SITE_URL}${localePath("de", slug)}`,
    languages: {
      ...languages,
      "x-default": `${SITE_URL}/de/`,
    },
  };
}
