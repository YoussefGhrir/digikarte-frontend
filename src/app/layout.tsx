import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Forum, DM_Sans, Dancing_Script } from "next/font/google";
import { cookies, headers } from "next/headers";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";
import type { Locale } from "@/lib/i18n";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const forum = Forum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-forum",
});

const dmSans = DM_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dancingScript = Dancing_Script({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-menu-script",
});

export const metadata: Metadata = {
  title: "DigiKarte – Menu digital",
  description: "Créez et gérez vos menus digitaux avec codes QR",
  icons: {
    // Heroku/audits demandent souvent explicitement `/favicon.ico`.
    icon: "/favicon.ico",
    // Garder l'icône brandée pour l'écran d'accueil Apple.
    apple: "/digikarte-favicon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const COOKIE_KEY = "digikarte-lang";
  const validLocales: Locale[] = ["de", "fr", "en"];
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

  const isLocale = (value: unknown): value is Locale => typeof value === "string" && validLocales.includes(value as Locale);

  const cookieLocale = cookies().get(COOKIE_KEY)?.value;
  if (isLocale(cookieLocale)) {
    return (
      <html lang={cookieLocale} className="dark">
        <body
          className={`${inter.variable} ${jetbrainsMono.variable} ${forum.variable} ${dmSans.variable} ${dancingScript.variable} antialiased`}
        >
          <AuthProvider>
            <LanguageProvider initialLocale={cookieLocale}>
              <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </LanguageProvider>
          </AuthProvider>
        </body>
      </html>
    );
  }

  // First visit (no cookie): resolve from GeoIP headers, so language is correct immediately.
  const h = headers();
  const country =
    h.get("cf-ipcountry") ||
    h.get("x-vercel-ip-country") ||
    h.get("x-country-code") ||
    h.get("x-geoip-country") ||
    null;
  const acceptLanguage = h.get("accept-language");

  const cc = country?.toUpperCase();
  let initialLocale: Locale;
  if (cc && FRENCH_COUNTRIES.has(cc)) {
    initialLocale = "fr";
  } else {
    // Important: for the "first impression" we rely primarily on geo (country).
    // If the country is not in our FR list, default to English (not browser language).
    if (!cc) {
      // If we can't infer country, fallback to browser language to decide FR vs EN.
      const first = acceptLanguage?.split(",")[0]?.trim();
      const lang = first?.split(";")[0]?.toLowerCase() ?? "";
      initialLocale = lang.startsWith("fr") ? "fr" : "en";
    } else {
      initialLocale = "en";
    }
  }

  return (
    <html lang={initialLocale} className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${forum.variable} ${dmSans.variable} ${dancingScript.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider initialLocale={initialLocale}>
            <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
