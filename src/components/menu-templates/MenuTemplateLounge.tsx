"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { groupSectionBlocks, formatPriceSymbol, MENU_COLOR_THEME_IDS, type MenuColorThemeId } from "./utils";
import { MenuPublicFooter } from "./MenuPublicFooter";
import { MenuLogoFrame } from "./MenuLogoFrame";
import { MenuDividerGravure } from "./MenuDividerGravure";
import { MenuSectionTitle } from "./MenuSectionTitle";

const LOUNGE_BG = "#020617"; // slate-950
const LOUNGE_PANEL = "#020617"; // same, with gradients on top
const LOUNGE_NEON_PURPLE = "#a855f7"; // purple-500
const LOUNGE_NEON_PINK = "#ec4899"; // pink-500
const LOUNGE_NEON_BLUE = "#38bdf8"; // sky-400
const LOUNGE_TEXT_MUTED = "#9ca3af"; // gray-400

const LOUNGE_THEME_PALETTES: Record<MenuColorThemeId, {
  border: string;
  haloA: string;
  haloB: string;
  haloC: string;
  divider: string;
  sectionAccent: string;
  price: string;
  subBorder: string;
}> = {
  amber: {
    border: "rgba(251,191,36,0.45)",
    haloA: "bg-amber-500/30",
    haloB: "bg-amber-400/30",
    haloC: "bg-orange-500/25",
    divider: "#fbbf24",
    sectionAccent: "#facc15",
    price: "#fed7aa",
    subBorder: "border-amber-400/40",
  },
  emerald: {
    border: "rgba(16,185,129,0.45)",
    haloA: "bg-emerald-500/30",
    haloB: "bg-emerald-400/30",
    haloC: "bg-teal-400/25",
    divider: "#34d399",
    sectionAccent: "#6ee7b7",
    price: "#a7f3d0",
    subBorder: "border-emerald-400/40",
  },
  bordeaux: {
    border: "rgba(190,24,93,0.5)",
    haloA: "bg-rose-600/35",
    haloB: "bg-rose-500/30",
    haloC: "bg-purple-600/25",
    divider: "#fb7185",
    sectionAccent: "#fb7185",
    price: "#fecaca",
    subBorder: "border-rose-400/40",
  },
  default: {
    border: "rgba(168,85,247,0.5)",
    haloA: "bg-fuchsia-500/35",
    haloB: "bg-fuchsia-400/25",
    haloC: "bg-purple-500/20",
    divider: "#e9d5ff",
    sectionAccent: "#e9d5ff",
    price: "#fde8ff",
    subBorder: "border-fuchsia-400/40",
  },
  slate: {
    border: "rgba(148,163,184,0.5)",
    haloA: "bg-slate-500/35",
    haloB: "bg-slate-400/30",
    haloC: "bg-sky-500/25",
    divider: "#a5b4fc",
    sectionAccent: "#e5e7eb",
    price: "#e5e7eb",
    subBorder: "border-slate-400/40",
  },
};

/**
 * Night Lounge – Dark Neon
 * Pour lounge / shisha / cocktail bar : fond très sombre, accents néon,
 * grosses typos pour les cocktails, style très 2025/2026.
 */
export function MenuTemplateLounge({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);
  const themeId: MenuColorThemeId = (menu.colorTheme && MENU_COLOR_THEME_IDS.includes(menu.colorTheme as MenuColorThemeId))
    ? (menu.colorTheme as MenuColorThemeId)
    : "default";
  const palette = LOUNGE_THEME_PALETTES[themeId];

  return (
    <div
      className="min-h-screen w-full font-dm text-[#f5f0e8] bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/backgrounds/lounge1.png')",
        backgroundRepeat: "no-repeat",
        // réduire le zoom comme pour le template café pour mieux voir l'image
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: LOUNGE_BG,
      }}
    >
      <div className="min-h-screen bg-black/70">
      <div
        className="menu-page-outer min-h-screen"
        style={{ ["--menu-page-border" as string]: palette?.border ?? "rgba(168,85,247,0.35)" }}
      >
        <div className="menu-page-inner relative overflow-hidden">
          {/* Halo néon en arrière-plan */}
          <div
            className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen"
            aria-hidden
          >
            <div className={`absolute -left-32 -top-40 h-72 w-72 rounded-full blur-3xl ${palette ? palette.haloA : "bg-fuchsia-500/30"}`} />
            <div className={`absolute -right-32 -bottom-40 h-80 w-80 rounded-full blur-3xl ${palette ? palette.haloB : "bg-sky-500/30"}`} />
            <div className={`absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl ${palette ? palette.haloC : "bg-purple-500/25"}`} />
          </div>

          <header className="relative z-10 px-5 pt-10 pb-6 sm:px-7 sm:pt-12 sm:pb-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
              {menu.organizationLogoBase64 && (
                <MenuLogoFrame
                  accentColor={palette?.divider ?? LOUNGE_NEON_PINK}
                  accentOpacity={0.9}
                  sizeRem={8}
                  innerBgClassName="bg-slate-950/90"
                  className="shrink-0 shadow-[0_0_40px_rgba(236,72,153,0.5)]"
                >
                  <img
                    src={`data:image/jpeg;base64,${menu.organizationLogoBase64}`}
                    alt={menu.organizationName}
                    className="h-full w-full object-contain"
                  />
                </MenuLogoFrame>
              )}
              <div className="min-w-0 flex-1">
                {!menu.organizationLogoBase64 && menu.organizationName && (
                  <h1 className="font-forum text-3xl font-semibold tracking-[0.18em] text-slate-50 sm:text-4xl">
                    {menu.organizationName}
                  </h1>
                )}
                {menu.organizationSlogan && (
                  <p className="mt-1 font-forum text-2xl sm:text-3xl font-semibold italic text-slate-50">
                    {menu.organizationSlogan}
                  </p>
                )}
                <p className="mt-3 font-forum text-xl text-slate-100 sm:text-2xl">
                  {menu.title}
                </p>
                {menu.description && (
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300/80">
                    {menu.description}
                  </p>
                )}
              </div>
            </div>
          </header>

          <main className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-12 sm:px-7">
            {/* Bandeau sombre pour MENU + motif, comme sur les templates café */}
            <div className="mt-2 mb-3 rounded-2xl bg-black/80 px-4 py-4">
              <div className="flex justify-center">
                <p className="font-forum text-sm sm:text-base font-semibold uppercase tracking-[0.4em] text-slate-50">
                  {t("menu", locale)}
                </p>
              </div>
              <MenuDividerGravure color={palette?.divider ?? LOUNGE_NEON_PURPLE} className="px-2" />
            </div>
            <div
              className="menu-contour-outer menu-contour-subtle mt-6"
              style={{ ["--menu-contour-color" as string]: palette?.divider ?? LOUNGE_NEON_PURPLE }}
            >
              <div
                className="menu-contour-inner bg-slate-950/80 px-4 py-8 sm:px-6 sm:py-10"
                style={{ backgroundImage: `radial-gradient(circle at top, rgba(56,189,248,0.16), transparent 55%)` }}
              >
                <div className="space-y-10">
                  {sections.map(([sectionKey, blocks]) => (
                    <section key={sectionKey}>
                      {sectionKey !== "_no_section" && (
                        <MenuSectionTitle
                          accentColor={palette?.sectionAccent ?? LOUNGE_NEON_BLUE}
                          className="mb-6 text-sm tracking-[0.35em] text-slate-200"
                        >
                          {sectionKey}
                        </MenuSectionTitle>
                      )}
                      <ul className="space-y-4">
                        {blocks.map(({ root: item, children: subItems }) => (
                          <li
                            key={item.id}
                            className="group rounded-2xl border border-slate-800/80 bg-slate-900/70 px-4 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)] transition-transform duration-300 hover:-translate-y-0.5 hover:border-fuchsia-500/70 hover:shadow-[0_22px_60px_rgba(236,72,153,0.55)] sm:px-5 sm:py-5"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                              <div className="min-w-0 flex-1">
                                <p className="text-lg font-semibold tracking-wide text-slate-50 sm:text-xl">
                                  {item.name}
                                </p>
                                {item.description && (
                                  <p className="mt-1 text-xs leading-snug text-slate-300">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              {item.price != null && (
                                <span className={`shrink-0 text-lg font-semibold tabular-nums sm:text-xl ${palette ? "" : "text-sky-300"}`} style={palette ? { color: palette.price } : undefined}>
                                  {Number(item.price).toFixed(2)} {formatPriceSymbol(menu.priceCurrency)}
                                </span>
                              )}
                            </div>
                            {subItems.length > 0 && (
                              <ul className={`mt-3 space-y-1.5 border-l pl-3 ${palette ? palette.subBorder : "border-fuchsia-500/40"}`}>
                                {subItems.map((sub) => (
                                  <li
                                    key={sub.id}
                                    className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-medium text-slate-100"
                                  >
                                    <span>↳ {sub.name}</span>
                                    {sub.price != null && (
                                      <span className="tabular-nums text-sky-300/90">
                                        {Number(sub.price).toFixed(2)} {formatPriceSymbol(menu.priceCurrency)}
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>

                {(!menu.items || menu.items.length === 0) && (
                  <div className="mt-10 rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/60 px-6 py-12 text-center">
                    <p className="text-xs text-slate-400">{t("noItems", locale)}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-black/85 px-4 py-6">
              <MenuPublicFooter menu={menu} locale={locale} />
            </div>

            <p className="mt-6 text-center text-[0.7rem] font-medium uppercase tracking-[0.3em] text-slate-100/90">
              {t("digikarte", locale)}
            </p>
          </main>
        </div>
      </div>
      </div>
    </div>
  );
}

