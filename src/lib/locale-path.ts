import type { Locale } from "@/lib/i18n";

/** Locales présentes dans l’URL (aligné sur middleware.ts) */
export const APP_URL_LOCALES = ["de", "fr", "en"] as const satisfies readonly Locale[];

/**
 * Enlève le préfixe /de | /fr | /en du pathname affiché dans le navigateur.
 * Si aucun préfixe SEO → renvoie le pathname tel quel (routes legacy / compat).
 */
export function stripLocaleFromPathname(pathname: string): string {
  const m = pathname.match(/^\/(de|fr|en)(\/.*)?$/);
  if (!m) return pathname;
  const tail = m[2];
  if (!tail || tail === "") return "/";
  return tail;
}

/** Préfixe une route applicative (/login, /dashboard/…) avec la locale URL. */
export function prefixWithLocale(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}

/**
 * Remplace la locale dans la barre d’adresse, ou préfixe si l’URL était sans locale.
 */
export function swapLocaleInBrowserPath(pathname: string, newLocale: Locale): string {
  if (/^\/(de|fr|en)(\/|$)/.test(pathname)) {
    return pathname.replace(/^\/(de|fr|en)(?=\/|$)/, `/${newLocale}`);
  }
  if (pathname === "/" || pathname === "") return `/${newLocale}/`;
  return prefixWithLocale(pathname, newLocale);
}
