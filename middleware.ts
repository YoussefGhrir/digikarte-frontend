import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_KEY = "digikarte-lang";
const validLocales = ["de", "fr", "en"] as const;

type Locale = (typeof validLocales)[number];

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && validLocales.includes(value as Locale);
}

// Edit these lists as you need.
// FR default for: France/Paris + francophone countries + selected francophone Africa.
const FRENCH_COUNTRIES = new Set([
  // Europe
  "FR",
  "LU",
  "BE",
  "CH",
  // North / West Africa (example list)
  "TN", // Tunisia
  "DZ", // Algeria
  "MA", // Morocco (often French-speaking)
  // Common francophone West/Central Africa (extend as needed)
  "CI",
  "SN",
  "ML",
  "BF",
  "NE",
  "TG",
  "BJ",
  "GA",
  "CM",
  "CG",
  "CD",
  "RW",
  "BI",
]);

const GERMAN_COUNTRIES = new Set([
  "DE",
  "AT",
  "LI",
]);

function resolveLocale(countryCode: string | null, acceptLanguage: string | null): Locale {
  if (countryCode) {
    const cc = countryCode.toUpperCase();
    if (GERMAN_COUNTRIES.has(cc)) return "de";
    if (FRENCH_COUNTRIES.has(cc)) return "fr";
    return "en";
  }

  // Fallback to browser language when we can't infer country.
  if (acceptLanguage) {
    const first = acceptLanguage.split(",")[0]?.trim();
    const lang = first?.split(";")[0]?.toLowerCase() ?? "";
    if (lang.startsWith("fr")) return "fr";
    if (lang.startsWith("de")) return "de";
  }

  return "en";
}

function withLocaleCookie(res: NextResponse, req: NextRequest, locale: Locale) {
  const secure = req.nextUrl.protocol === "https:";
  res.cookies.set(COOKIE_KEY, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2,
    sameSite: "lax",
    secure,
    httpOnly: false,
  });
  return res;
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const host = req.headers.get("host") ?? "";
  if (host.toLowerCase() === "www.digi-karte.com") {
    const apexUrl = req.nextUrl.clone();
    apexUrl.host = "digi-karte.com";
    return NextResponse.redirect(apexUrl, 301);
  }

  const existing = req.cookies.get(COOKIE_KEY)?.value;
  const hasLocaleCookie = isLocale(existing);

  const country =
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("x-country-code") ||
    req.headers.get("x-geoip-country") ||
    null;

  const acceptLanguage = req.headers.get("accept-language");
  const resolvedLocale = hasLocaleCookie ? existing : resolveLocale(country, acceptLanguage);

  const normalizedPath = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const localeFromPath = validLocales.find(
    (locale) => normalizedPath === `/${locale}` || normalizedPath.startsWith(`/${locale}/`),
  );
  const strippedPath = localeFromPath
    ? normalizedPath.replace(new RegExp(`^/${localeFromPath}`), "") || "/"
    : normalizedPath;

  if (normalizedPath === "/") {
    const localized = req.nextUrl.clone();
    localized.pathname = `/${resolvedLocale}/`;
    return withLocaleCookie(NextResponse.redirect(localized, 302), req, resolvedLocale);
  }

  // Keep legacy public URLs working while forcing canonical locale-first paths.
  const legacyRedirects: Record<string, string> = {
    "/digitale-speisekarte": "/de/digitale-speisekarte/",
    "/qr-code-menu": "/de/qr-code-menu/",
    "/menu-digital-restaurant": "/fr/menu-digital-restaurant/",
    "/digital-menu-restaurant": "/en/digital-menu-restaurant/",
    "/blog": "/de/blog/",
  };
  const legacyTarget = legacyRedirects[normalizedPath];
  if (legacyTarget) {
    const url = req.nextUrl.clone();
    url.pathname = legacyTarget;
    return withLocaleCookie(NextResponse.redirect(url, 301), req, resolvedLocale);
  }

  // Force locale-prefixed URLs for the whole site.
  if (!localeFromPath) {
    const url = req.nextUrl.clone();
    url.pathname = `/${resolvedLocale}${normalizedPath}`;
    return withLocaleCookie(NextResponse.redirect(url, 302), req, resolvedLocale);
  }

  // Internally rewrite locale-prefixed app routes to existing route tree.
  const rewritePrefixes = ["/dashboard", "/login", "/register", "/impressum", "/datenschutz", "/agb", "/menu"];
  if (rewritePrefixes.some((prefix) => strippedPath === prefix || strippedPath.startsWith(`${prefix}/`))) {
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = strippedPath;
    return withLocaleCookie(NextResponse.rewrite(rewriteUrl), req, localeFromPath);
  }

  return withLocaleCookie(NextResponse.next(), req, localeFromPath);
}

export const config = {
  // Skip Next assets + common non-page routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)"],
};

