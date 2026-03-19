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

  if (pathname === "/") {
    const localized = req.nextUrl.clone();
    localized.pathname = `/${resolvedLocale}/`;
    return NextResponse.redirect(localized, 302);
  }

  // Keep legacy public URLs working while forcing canonical locale-first paths.
  const legacyRedirects: Record<string, string> = {
    "/digitale-speisekarte": "/de/digitale-speisekarte/",
    "/qr-code-menu": "/de/qr-code-menu/",
    "/menu-digital-restaurant": "/fr/menu-digital-restaurant/",
    "/digital-menu-restaurant": "/en/digital-menu-restaurant/",
    "/blog": "/de/blog/",
  };
  const normalizedPath = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const legacyTarget = legacyRedirects[normalizedPath];
  if (legacyTarget) {
    const url = req.nextUrl.clone();
    url.pathname = legacyTarget;
    return NextResponse.redirect(url, 301);
  }

  if (hasLocaleCookie) return NextResponse.next();

  const res = NextResponse.next();
  const secure = req.nextUrl.protocol === "https:";
  res.cookies.set(COOKIE_KEY, resolvedLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
    sameSite: "lax",
    secure,
    httpOnly: false, // needed so the client can read it
  });

  return res;
}

export const config = {
  // Skip Next assets + common non-page routes
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)"],
};

