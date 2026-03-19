"use client";

import { menuPublicBySlug, type MenuPublicDto } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuTemplateRenderer } from "@/components/menu-templates";

const menuBg = {
  backgroundColor: "var(--eerie-black)",
  backgroundImage: "url(/bg-menu-dark.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
};

export default function PublicMenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { locale } = useLanguage();
  const [menu, setMenu] = useState<MenuPublicDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    // Cas spécial: page de démonstration publique (/menu/demo)
    // On évite d'appeler le backend et on injecte un menu vitrine
    if (slug === "demo") {
      const demoMenu: MenuPublicDto = {
        title: "DigiKarte – Demo Menü",
        description:
          "Beispielkarte, um zu zeigen, wie Ihre digitale Speisekarte mit DigiKarte aussehen kann.",
        organizationName: "Demo Café Berlin",
        organizationSlogan: "Digitales Menü in 3 Sprachen – DE / FR / EN",
        organizationLogoBase64: null,
        organizationAddress: "Musterstraße 12, 10115 Berlin",
        organizationPhone: "+49 30 123456",
        organizationEmail: "info@demo-cafe.de",
        displayTemplate: "cafe",
        colorTheme: "amber",
        priceCurrency: "EUR",
        available: true,
        items: [
          {
            id: 1,
            section: "Kaffee · Café · Coffee",
            name: "Caffè Latte / Café au lait / Latte",
            description:
              "Espresso mit cremiger Milch – perfekt für den Start in den Tag.",
            price: 4.9,
          },
          {
            id: 2,
            section: "Kaffee · Café · Coffee",
            name: "Cappuccino / Cappuccino / Cappuccino",
            description:
              "Klassischer Cappuccino mit feinporigem Milchschaum.",
            price: 4.5,
          },
          {
            id: 3,
            section: "Snacks · Snacks · Snacks",
            name: "Croissant beurre / Buttercroissant / Butter croissant",
            description:
              "Frisches Croissant – ideal mit Kaffee oder Tee, morgens oder nachmittags.",
            price: 2.5,
          },
          {
            id: 4,
            section: "Desserts · Desserts · Desserts",
            name: "Tarte au citron / Zitronentarte / Lemon tart",
            description:
              "Hausgemachte Zitronentarte mit feinem Mürbeteig und frischer Creme.",
            price: 5.9,
          },
        ],
      };

      setMenu(demoMenu);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    menuPublicBySlug(slug)
      .then(setMenu)
      .catch(() => setError("notFound"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center font-dm"
        style={{ ...menuBg, color: "var(--gold)" }}
      >
        <p className="text-lg tracking-widest uppercase">
          {t("loading", locale)}
        </p>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-dm"
        style={menuBg}
      >
        <p className="text-red-400">
          {error === "notFound" ? t("notFound", locale) : error}
        </p>
      </div>
    );
  }

  // Menu indisponible (abonnement expiré / non renouvelé)
  if (menu.available === false) {
    const reason = menu.unavailableReason ?? "NO_SUBSCRIPTION";
    const title =
      reason === "NO_SUBSCRIPTION"
        ? t("menuUnavailableTitleNoSubscription", locale)
        : reason === "SUBSCRIPTION_INACTIVE"
          ? t("menuUnavailableTitleInactive", locale)
          : t("menuUnavailableTitleError", locale);
    const subtitle =
      reason === "NO_SUBSCRIPTION"
        ? t("menuUnavailableSubtitleNoSubscription", locale)
        : reason === "SUBSCRIPTION_INACTIVE"
          ? t("menuUnavailableSubtitleInactive", locale)
          : t("menuUnavailableSubtitleError", locale);

    return (
      <div
        className="min-h-screen bg-[var(--background)] text-[var(--foreground)]"
        style={menuBg}
      >
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950/60 p-8 shadow-xl shadow-black/40">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              DigiKarte
            </p>
            <h1 className="mt-3 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-neutral-400">{subtitle}</p>
            <p className="mt-5 text-xs text-neutral-500">
              {menu.organizationName ? `• ${menu.organizationName}` : ""}
            </p>
          </div>

          {/* Publicité / CTA (style page d'accueil) */}
          <section className="mt-8 overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 px-6 py-8 shadow-lg md:px-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">
                  {t("ctaFinalKicker", locale)}
                </p>
                <h2 className="mt-3 font-forum text-2xl text-neutral-900 md:text-3xl">
                  {t("ctaFinalTitle", locale)}
                </h2>
                <p className="mt-3 max-w-xl text-xs leading-relaxed text-neutral-700">
                  {t("ctaFinalText", locale)}
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <a
                  href="/register"
                  className="rounded-full bg-amber-400 px-7 py-2.5 text-sm font-semibold text-neutral-900 shadow-[0_20px_60px_rgba(251,191,36,0.7)] hover:bg-amber-300"
                >
                  {t("ctaGetStarted", locale)}
                </a>
                <p className="text-[11px] text-neutral-500">{t("ctaFinalNote", locale)}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return <MenuTemplateRenderer menu={menu} locale={locale} />;
}
