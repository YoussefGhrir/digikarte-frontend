"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { groupSectionBlocks, formatPriceSymbol, type MenuColorThemeId } from "./utils";
import { MenuPublicFooter } from "./MenuPublicFooter";
import { MenuLogoFrame } from "./MenuLogoFrame";
import { MenuDividerGravure } from "./MenuDividerGravure";
import { MenuSectionTitle } from "./MenuSectionTitle";

const CR_PAPER_DEFAULT = "#fdf7ec"; // fond papier clair
const CR_ACCENT_DEFAULT = "#c05621"; // orange brûlé
const CR_ACCENT_SOFT_DEFAULT = "#f6ad55";
const CR_TEXT_DEFAULT = "#1a202c"; // gris très foncé
const CR_MUTED_DEFAULT = "#4a5568";

const CAFE_THEME_PALETTES: Record<Exclude<MenuColorThemeId, "default">, {
  paper: string;
  accent: string;
  accentSoft: string;
  text: string;
  muted: string;
}> = {
  amber: {
    paper: "#fdf7ec",
    accent: "#c05621",
    accentSoft: "#f6ad55",
    text: "#1a202c",
    muted: "#4a5568",
  },
  emerald: {
    paper: "#f0fdf4",
    accent: "#059669",
    accentSoft: "#6ee7b7",
    text: "#052e16",
    muted: "#166534",
  },
  bordeaux: {
    paper: "#fff5f5",
    accent: "#9b2c2c",
    accentSoft: "#feb2b2",
    text: "#2a0a0a",
    muted: "#742a2a",
  },
  slate: {
    paper: "#f8fafc",
    accent: "#1f2933",
    accentSoft: "#9ca3af",
    text: "#020617",
    muted: "#4b5563",
  },
};

/**
 * Café / Restaurant de jour
 * Style carte papier chaleureuse, tons beiges / terracotta,
 * très différent du lounge néon de nuit.
 */
export function MenuTemplateCafeResto({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);
  const themeId: MenuColorThemeId =
    (menu.colorTheme as MenuColorThemeId) && (["default", "amber", "emerald", "bordeaux", "slate"] as MenuColorThemeId[]).includes(menu.colorTheme as MenuColorThemeId)
      ? (menu.colorTheme as MenuColorThemeId)
      : "default";
  const palette =
    themeId === "default"
      ? {
          paper: CR_PAPER_DEFAULT,
          accent: CR_ACCENT_DEFAULT,
          accentSoft: CR_ACCENT_SOFT_DEFAULT,
          text: CR_TEXT_DEFAULT,
          muted: CR_MUTED_DEFAULT,
        }
      : CAFE_THEME_PALETTES[themeId as Exclude<MenuColorThemeId, "default">];

  return (
    <div className="min-h-screen w-full font-dm" style={{ backgroundColor: "#f3e6d3" }}>
      <div
        className="menu-page-outer min-h-screen"
        style={{ ["--menu-page-border" as string]: "rgba(192,86,33,0.3)" }}
      >
        <div
          className="menu-page-inner"
          style={{
            backgroundImage:
              "radial-gradient(circle at top left, rgba(250,240,230,0.9), transparent 55%), radial-gradient(circle at bottom right, rgba(248,214,182,0.9), transparent 55%)",
          }}
        >
          <header className="relative z-10 px-5 pt-10 pb-8 sm:px-7 sm:pt-12 sm:pb-9">
            <div className="mx-auto flex max-w-4xl flex-col gap-6 sm:flex-row sm:items-center">
              {menu.organizationLogoBase64 && (
                <MenuLogoFrame
                  accentColor={palette.accent}
                  accentOpacity={0.85}
                  sizeRem={10}
                  innerBgClassName="bg-white"
                  className="shrink-0 shadow-[0_18px_45px_rgba(160,82,45,0.35)]"
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
                  <h1 className="font-forum text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                    {menu.organizationName}
                  </h1>
                )}
                {menu.organizationSlogan && (
                  <p className="mt-1 text-sm italic" style={{ color: palette.muted }}>
                    {menu.organizationSlogan}
                  </p>
                )}
                <div className="mt-2 inline-flex flex-wrap items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.35em]">
                  <span className="rounded-full bg-white/70 px-3 py-1 text-neutral-700 ring-1 ring-amber-300/60">
                    {t("menu", locale)}
                  </span>
                </div>
                <p className="mt-3 font-forum text-xl text-neutral-900 sm:text-2xl">
                  {menu.title}
                </p>
                {menu.description && (
                  <p className="mt-2 max-w-xl text-sm leading-relaxed" style={{ color: palette.muted }}>
                    {menu.description}
                  </p>
                )}
              </div>
            </div>
          </header>

          <main className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-12 sm:px-7">
            <MenuDividerGravure color={palette.accent} className="px-2" />
            <div
              className="menu-contour-outer menu-contour-subtle mt-6"
              style={{ ["--menu-contour-color" as string]: palette.accentSoft }}
            >
              <div
                className="menu-contour-inner px-4 py-8 sm:px-6 sm:py-10"
                style={{
                  backgroundColor: palette.paper,
                  backgroundImage:
                    "repeating-linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.03) 1px, transparent 1px, transparent 6px)",
                }}
              >
                <div className="space-y-10">
                  {sections.map(([sectionKey, blocks]) => (
                    <section key={sectionKey}>
                      {sectionKey !== "_no_section" && (
                        <MenuSectionTitle
                          accentColor={palette.accent}
                          className="mb-4 text-sm tracking-[0.28em] uppercase"
                        >
                          {sectionKey}
                        </MenuSectionTitle>
                      )}
                      <ul className="space-y-3">
                        {blocks.map(({ root: item, children: subItems }) => (
                          <li
                            key={item.id}
                            className="rounded-xl border border-amber-200/70 bg-white/80 px-3 py-3 shadow-sm sm:px-4 sm:py-4"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
                              <div className="min-w-0 flex-1">
                                <p className="text-[0.98rem] font-semibold tracking-wide text-neutral-900 sm:text-base">
                                  {item.name}
                                </p>
                                {item.description && (
                                  <p className="mt-0.5 text-xs leading-snug" style={{ color: palette.muted }}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              {item.price != null && (
                                <span className="shrink-0 font-forum text-base font-semibold tabular-nums sm:text-lg whitespace-nowrap" style={{ color: palette.accent }}>
                                  {Number(item.price).toFixed(2)}{" "}
                                  {formatPriceSymbol(menu.priceCurrency)}
                                </span>
                              )}
                            </div>
                            {subItems.length > 0 && (
                              <ul className="mt-2 space-y-1 border-l border-amber-300/60 pl-3">
                                {subItems.map((sub) => (
                                  <li
                                    key={sub.id}
                                    className="flex flex-wrap items-baseline justify-between gap-2 text-[0.85rem] font-medium"
                                    style={{ color: palette.text }}
                                  >
                                    <span>↳ {sub.name}</span>
                                    {sub.price != null && (
                                      <span className="tabular-nums" style={{ color: palette.accent }}>
                                        {Number(sub.price).toFixed(2)}{" "}
                                        {formatPriceSymbol(menu.priceCurrency)}
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
                  <div className="mt-10 rounded-2xl border-2 border-dashed border-amber-300/70 bg-white/70 px-6 py-12 text-center">
                    <p className="text-xs" style={{ color: palette.muted }}>
                      {t("noItems", locale)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <MenuPublicFooter menu={menu} locale={locale} />

            <p
              className="mt-6 text-center text-[0.65rem] font-medium uppercase tracking-[0.3em]"
              style={{ color: palette.muted }}
            >
              {t("digikarte", locale)}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}

