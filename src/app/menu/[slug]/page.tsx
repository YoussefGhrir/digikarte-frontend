"use client";

import { menuPublicBySlug, type MenuPublicDto } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import { t, type Locale } from "@/lib/i18n";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  MenuTemplateRenderer,
  getDemoMenuPublicDto,
  normalizeTemplateId,
  type MenuTemplateId,
} from "@/components/menu-templates";

const menuBg = {
  backgroundColor: "var(--eerie-black)",
  backgroundImage: "url(/bg-menu-dark.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
};

export default function PublicMenuPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const { locale } = useLanguage();
  const isDemo = (slug ?? "").toLowerCase() === "demo";
  const selectedTemplate = useMemo<MenuTemplateId>(() => {
    const value = searchParams.get("template");
    if (!value) return "classic";
    return normalizeTemplateId(value);
  }, [searchParams]);
  const [menu, setMenu] = useState<MenuPublicDto | null>(null);
  const [loading, setLoading] = useState(!isDemo);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isDemo) {
      setLoading(false);
      setError("");
      setMenu(null);
      return;
    }
    if (!slug) return;
    menuPublicBySlug(slug)
      .then(setMenu)
      .catch(() => setError("notFound"))
      .finally(() => setLoading(false));
  }, [isDemo, slug]);

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
    if (isDemo) {
      const demoMenu = getDemoMenuPublicDto(selectedTemplate);
      demoMenu.organizationName = "DigiKarte Demo Cafe";
      demoMenu.title =
        locale === "de"
          ? "Demo Menu: Café & Restaurant"
          : locale === "fr"
            ? "Menu Démo: Café & Restaurant"
            : "Demo Menu: Cafe & Restaurant";
      demoMenu.description =
        locale === "de"
          ? "Vollständiger Ablauf mit Blöcken, Preisen, Vorlagen und QR-Nutzung."
          : locale === "fr"
            ? "Parcours complet: blocs, prix, modèles et utilisation des QR."
            : "Complete walkthrough: blocks, prices, templates and QR usage.";
      return (
        <DemoScenarioPage
          locale={locale}
          selectedTemplate={selectedTemplate}
          demoMenu={demoMenu}
        />
      );
    }
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

function DemoScenarioPage({
  locale,
  selectedTemplate,
  demoMenu,
}: {
  locale: Locale;
  selectedTemplate: MenuTemplateId;
  demoMenu: MenuPublicDto;
}) {
  const text = getDemoTexts(locale);
  const demoUrl = "https://www.digi-karte.com/menu/demo";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    demoUrl,
  )}`;
  const templateItems: { id: MenuTemplateId; label: string }[] = [
    { id: "classic", label: t("menuTemplateClassic", locale) },
    { id: "cafe", label: t("menuTemplateCafe", locale) },
    { id: "bistro", label: t("menuTemplateBistro", locale) },
    { id: "minimal", label: t("menuTemplateMinimal", locale) },
    { id: "cards", label: t("menuTemplateCards", locale) },
    { id: "elegant", label: t("menuTemplateElegant", locale) },
    { id: "restaurant", label: t("menuTemplateRestaurant", locale) },
    { id: "terrasse", label: t("menuTemplateTerrasse", locale) },
    { id: "lounge", label: t("menuTemplateLounge", locale) },
    { id: "loungeOriental", label: t("menuTemplateLoungeOriental", locale) },
    { id: "cafeResto", label: t("menuTemplateCafeResto", locale) },
    { id: "steakhouseCoffee", label: t("menuTemplateSteakhouseCoffee", locale) },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
        <section className="rounded-3xl border border-amber-500/35 bg-neutral-900/70 p-6 shadow-xl md:p-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300">
            DigiKarte · Demo
          </p>
          <h1 className="mt-3 font-forum text-3xl text-neutral-50 md:text-4xl">{text.heroTitle}</h1>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-neutral-300">{text.heroSubtitle}</p>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {text.steps.map((step) => (
            <article key={step.title} className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
              <p className="text-[11px] uppercase tracking-[0.24em] text-amber-300">{step.kicker}</p>
              <h2 className="mt-2 font-forum text-xl text-neutral-50">{step.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-neutral-300">{step.text}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-3xl border border-neutral-800 bg-neutral-900/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-forum text-2xl text-neutral-50">{text.templatesTitle}</h2>
            <p className="text-xs text-neutral-400">{text.templatesHint}</p>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {templateItems.map((template) => {
              const active = template.id === selectedTemplate;
              return (
                <a
                  key={template.id}
                  href={`/menu/demo?template=${template.id}`}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    active
                      ? "border-amber-400 bg-amber-400/15 text-amber-200"
                      : "border-neutral-700 bg-neutral-950/40 text-neutral-300 hover:border-neutral-500 hover:text-neutral-100"
                  }`}
                >
                  {template.label}
                </a>
              );
            })}
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/70">
          <div className="border-b border-neutral-800 px-5 py-4 text-sm text-neutral-300">
            {text.previewTitle}:{" "}
            <span className="font-semibold text-amber-300">
              {templateItems.find((x) => x.id === selectedTemplate)?.label ?? selectedTemplate}
            </span>
          </div>
          <MenuTemplateRenderer menu={demoMenu} locale={locale} />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
            <h3 className="font-forum text-xl text-neutral-50">{text.qrTableTitle}</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-300">{text.qrTableText}</p>
            <div className="mt-4 rounded-2xl border border-neutral-700 bg-neutral-950/70 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                {text.visualTableLabel}
              </p>
              <QrTableVisual qrSrc={qrSrc} text={text.qrStickerText} />
            </div>
            <ul className="mt-3 space-y-1 text-xs text-neutral-400">
              <li>{text.qrTablePoint1}</li>
              <li>{text.qrTablePoint2}</li>
              <li>{text.qrTablePoint3}</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
            <h3 className="font-forum text-xl text-neutral-50">{text.qrDoorTitle}</h3>
            <p className="mt-2 text-xs leading-relaxed text-neutral-300">{text.qrDoorText}</p>
            <div className="mt-4 rounded-2xl border border-neutral-700 bg-neutral-950/70 p-3">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                {text.visualDoorLabel}
              </p>
              <QrDoorVisual
                qrSrc={qrSrc}
                title={text.qrPosterTitle}
                subtitle={text.qrPosterSubtitle}
                cta={text.qrPosterCta}
              />
            </div>
            <ul className="mt-3 space-y-1 text-xs text-neutral-400">
              <li>{text.qrDoorPoint1}</li>
              <li>{text.qrDoorPoint2}</li>
              <li>{text.qrDoorPoint3}</li>
            </ul>
          </article>
        </section>
      </div>
    </div>
  );
}

function QrTableVisual({ qrSrc, text }: { qrSrc: string; text: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-3">
      <div className="mx-auto max-w-[240px] rounded-xl border border-amber-400/40 bg-white p-3 text-neutral-900 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Table 12
        </p>
        <div className="mx-auto mt-2 h-24 w-24 rounded-lg border border-neutral-200 bg-white p-1">
          <img src={qrSrc} alt="QR table visual" className="h-full w-full rounded-md" />
        </div>
        <p className="mt-2 text-center text-[10px] font-medium text-neutral-700">{text}</p>
      </div>
    </div>
  );
}

function QrDoorVisual({
  qrSrc,
  title,
  subtitle,
  cta,
}: {
  qrSrc: string;
  title: string;
  subtitle: string;
  cta: string;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-3">
      <div className="mx-auto max-w-[260px] rounded-xl border border-neutral-300 bg-white p-4 text-neutral-900 shadow-[0_18px_45px_rgba(0,0,0,0.45)]">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
          {title}
        </p>
        <p className="mt-1 text-center text-[11px] text-neutral-600">{subtitle}</p>
        <div className="mx-auto mt-3 h-28 w-28 rounded-lg border border-neutral-200 bg-white p-1.5">
          <img src={qrSrc} alt="QR door visual" className="h-full w-full rounded-md" />
        </div>
        <p className="mt-3 rounded-lg bg-amber-400 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-900">
          {cta}
        </p>
      </div>
    </div>
  );
}

function getDemoTexts(locale: Locale) {
  if (locale === "de") {
    return {
      heroTitle: "Vollständige Demo: Café/Restaurant Menü mit allen Vorlagen",
      heroSubtitle:
        "Diese Seite zeigt den kompletten Ablauf: Blöcke erstellen, Gerichte mit Namen und Preis eingeben, Design wählen (Classic, Lounge, Oriental, Minimal und weitere), dann QR auf Tisch und an der Tür einsetzen.",
      steps: [
        {
          kicker: "Schritt 1",
          title: "Blöcke anlegen",
          text: "Lege zuerst Kategorien an, z. B. Frühstück, Kaffee, Kalte Getränke, Desserts. Jeder Block strukturiert dein Menü für Gäste.",
        },
        {
          kicker: "Schritt 2",
          title: "Gerichte erfassen",
          text: "Für jedes Gericht: Name, Preis und Beschreibung eingeben. Beispiel: Cappuccino 3,50 EUR, Avocado Toast 9,90 EUR, Tiramisu 5,20 EUR.",
        },
        {
          kicker: "Schritt 3",
          title: "Modell + QR veröffentlichen",
          text: "Wähle eine Vorlage und drucke QR als Tisch-Sticker oder Tür-Poster. Der Link bleibt gleich, Inhalte werden in Echtzeit aktualisiert.",
        },
      ],
      templatesTitle: "Alle verfügbaren Vorlagen",
      templatesHint: "Klicke auf ein Modell, um dieselben Menüdaten im gewählten Stil zu sehen.",
      previewTitle: "Live-Vorschau",
      qrTableTitle: "QR auf dem Tisch (Szenario)",
      qrTableText:
        "Nutze kleine Sticker pro Tisch (z. B. Tisch 1, Tisch 2). Gäste scannen beim Sitzen und öffnen direkt das Menü in ihrer Sprache.",
      qrTablePoint1: "1) Im Dashboard: QR-Codes > PDF-Sticker (Tische)",
      qrTablePoint2: "2) Aufkleber drucken und auf Tischaufsteller kleben",
      qrTablePoint3: "3) Preise/Artikel ändern, QR bleibt identisch",
      qrDoorTitle: "QR an der Tür (Szenario)",
      qrDoorText:
        "Nutze ein großes Poster am Eingang oder Fenster. Gäste sehen sofort die Karte vor dem Betreten (Take-away oder Reservierung).",
      qrDoorPoint1: "1) Im Dashboard: QR-Codes > PDF-Poster (Tür)",
      qrDoorPoint2: "2) A4/A3 gut sichtbar an Eingang und Schaufenster",
      qrDoorPoint3: "3) Gleiches Menü, gleiche URL, jederzeit editierbar",
      visualTableLabel: "Visuelle Vorschau: Tisch-Sticker",
      visualDoorLabel: "Visuelle Vorschau: Tür-Poster",
      qrStickerText: "Scannen Sie für die Speisekarte",
      qrPosterTitle: "Digitales Menü",
      qrPosterSubtitle: "Vor der Bestellung kurz scannen",
      qrPosterCta: "Jetzt scannen",
    };
  }
  if (locale === "fr") {
    return {
      heroTitle: "Démo complète: menu café/resto avec tous les modèles",
      heroSubtitle:
        "Cette page montre le scénario total: création des blocs, saisie des plats avec nom et prix, choix du design (Classic, Lounge, Oriental, Minimal, etc.), puis usage du QR sur table et sur porte.",
      steps: [
        {
          kicker: "Etape 1",
          title: "Créer les blocs",
          text: "Commence par les catégories: petit-déjeuner, cafés, boissons froides, desserts. Chaque bloc organise ton menu.",
        },
        {
          kicker: "Etape 2",
          title: "Saisir les plats",
          text: "Pour chaque plat: nom, prix et description. Exemple: Cappuccino 3,50 EUR, Avocado Toast 9,90 EUR, Tiramisu 5,20 EUR.",
        },
        {
          kicker: "Etape 3",
          title: "Choisir modèle + publier QR",
          text: "Choisis le modèle visuel puis imprime QR en sticker table ou affiche porte. Le lien reste fixe et le contenu se met a jour.",
        },
      ],
      templatesTitle: "Tous les modèles disponibles",
      templatesHint: "Clique sur un modèle pour voir le meme menu en style réel.",
      previewTitle: "Aperçu en direct",
      qrTableTitle: "QR sur la table (scénario)",
      qrTableText:
        "Utilise des stickers par table (Table 1, Table 2). Les clients scannent assis et voient directement le menu dans leur langue.",
      qrTablePoint1: "1) Dashboard: QR codes > PDF Stickers (tables)",
      qrTablePoint2: "2) Imprimer puis coller sur chevalet ou table",
      qrTablePoint3: "3) Modifier prix/plats sans changer le QR",
      qrDoorTitle: "QR sur la porte (scénario)",
      qrDoorText:
        "Utilise une affiche grand format a l'entrée/vitrine. Les clients voient la carte avant d'entrer (utile pour emporter).",
      qrDoorPoint1: "1) Dashboard: QR codes > PDF Affiche (porte)",
      qrDoorPoint2: "2) Positionner A4/A3 a l'entree et vitrine",
      qrDoorPoint3: "3) Meme menu, meme URL, toujours editable",
      visualTableLabel: "Aperçu visuel: sticker table",
      visualDoorLabel: "Aperçu visuel: affiche porte",
      qrStickerText: "Scannez pour voir le menu",
      qrPosterTitle: "Menu digital",
      qrPosterSubtitle: "Scannez avant d'entrer",
      qrPosterCta: "Scanner ici",
    };
  }
  return {
    heroTitle: "Complete demo: cafe/restaurant menu with all templates",
    heroSubtitle:
      "This page shows the full scenario: create menu blocks, enter dish name and price, choose style (Classic, Lounge, Oriental, Minimal, etc.), then deploy QR on tables and at the door.",
    steps: [
      {
        kicker: "Step 1",
        title: "Create blocks",
        text: "Start with categories such as breakfast, coffee, cold drinks, desserts. Each block structures your menu clearly.",
      },
      {
        kicker: "Step 2",
        title: "Enter dishes",
        text: "For each dish, add name, price, and description. Example: Cappuccino EUR 3.50, Avocado Toast EUR 9.90, Tiramisu EUR 5.20.",
      },
      {
        kicker: "Step 3",
        title: "Pick template + publish QR",
        text: "Choose a visual template and print QR as table stickers or a door poster. The link stays stable while content updates live.",
      },
    ],
    templatesTitle: "All available templates",
    templatesHint: "Click a template to preview the same real menu in that style.",
    previewTitle: "Live preview",
    qrTableTitle: "QR on table (scenario)",
    qrTableText:
      "Use small stickers per table. Guests scan while seated and instantly open the menu in their preferred language.",
    qrTablePoint1: "1) Dashboard: QR codes > PDF Stickers (tables)",
    qrTablePoint2: "2) Print and place on table tents",
    qrTablePoint3: "3) Update prices/items, QR stays unchanged",
    qrDoorTitle: "QR at door (scenario)",
    qrDoorText:
      "Use a large poster at the entrance/window. Guests can check the menu before entering (great for takeaway).",
    qrDoorPoint1: "1) Dashboard: QR codes > PDF Poster (door)",
    qrDoorPoint2: "2) Place A4/A3 at entrance and shop window",
    qrDoorPoint3: "3) Same menu, same URL, always editable",
    visualTableLabel: "Visual preview: table sticker",
    visualDoorLabel: "Visual preview: door poster",
    qrStickerText: "Scan to open menu",
    qrPosterTitle: "Digital Menu",
    qrPosterSubtitle: "Scan before entering",
    qrPosterCta: "Scan now",
  };
}
