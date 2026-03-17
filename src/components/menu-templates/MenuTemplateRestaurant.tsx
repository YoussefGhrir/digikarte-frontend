"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { groupSectionBlocks, formatPriceSymbol } from "./utils";
import { MenuPublicFooter } from "./MenuPublicFooter";
import { MenuLogoFrame } from "./MenuLogoFrame";
import { MenuDividerGravure } from "./MenuDividerGravure";
import { MenuSectionTitle } from "./MenuSectionTitle";

/**
 * Dark Moody Editorial – Fine dining nocturne, luxe mystérieux.
 * Palette variée : titres, sous-titres, sections, prix.
 */
const ROSE_GOLD = "#b76e79";
const COPPER = "#b87333";
const GOLD = "#c9a86c";
const WARM_BEIGE = "#c4a77d";
const CREAM = "#e8e4df";
const STONE = "#a8a29e";
const MUTED = "#78716c";

export function MenuTemplateRestaurant({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);

  return (
    <div className="menu-bg-restaurant min-h-screen w-full font-dm text-[#e8e4df]">
      <div
        className="menu-page-outer min-h-screen w-full"
        style={{ ["--menu-page-border" as string]: "rgba(184,115,51,0.2)" }}
      >
        <div className="menu-page-inner w-full bg-[#080807]/98">
          <header className="relative z-10 border-b border-white/[0.06] px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
              {menu.organizationLogoBase64 && (
                <div className="shrink-0">
                  <MenuLogoFrame
                    accentColor={COPPER}
                    accentOpacity={0.85}
                    sizeRem={8}
                    innerBgClassName="bg-[#0f0e0d]"
                  >
                    <img
                      src={`data:image/jpeg;base64,${menu.organizationLogoBase64}`}
                      alt={menu.organizationName}
                      className="h-full w-full object-contain"
                    />
                  </MenuLogoFrame>
                </div>
              )}
              <div className="min-w-0 flex-1">
                {/* Titre organisation uniquement sans logo (le nom est souvent déjà sur le logo) */}
                {!menu.organizationLogoBase64 && menu.organizationName && (
                  <h1
                    className="font-forum text-2xl font-bold lowercase tracking-[0.3em] sm:text-3xl md:text-4xl"
                    style={{ color: ROSE_GOLD }}
                  >
                    {menu.organizationName}
                  </h1>
                )}
                {menu.organizationSlogan && (
                  <p className="text-xs italic" style={{ color: WARM_BEIGE }}>
                    {menu.organizationSlogan}
                  </p>
                )}
                <div
                  className="mt-3 h-px w-16 opacity-60 sm:mt-4"
                  style={{ backgroundColor: GOLD }}
                  aria-hidden
                />
                <p
                  className="mt-2 text-[0.6rem] font-semibold uppercase tracking-[0.45em]"
                  style={{ color: COPPER }}
                >
                  {t("menu", locale)}
                </p>
                <p
                  className="font-forum text-lg lowercase tracking-[0.18em] sm:text-xl"
                  style={{ color: CREAM }}
                >
                  {menu.title}
                </p>
                {menu.description && (
                  <p className="mt-1.5 max-w-md text-xs leading-relaxed" style={{ color: MUTED }}>
                    {menu.description}
                  </p>
                )}
              </div>
            </div>
          </header>

          <main className="relative z-10 mx-auto w-full max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
            <MenuDividerGravure color={GOLD} className="px-2" />
            <div
              className="menu-contour-outer menu-contour-subtle mt-5 border border-white/[0.04]"
              style={{ ["--menu-contour-color" as string]: COPPER }}
            >
              <div className="menu-contour-inner bg-transparent py-5">
                <div className="space-y-8">
                  {sections.map(([sectionKey, blocks]) => (
                    <section key={sectionKey}>
                      {sectionKey !== "_no_section" && (
                        <h2
                          className="mb-5 font-forum text-xl lowercase tracking-[0.22em] sm:text-2xl"
                          style={{ color: GOLD }}
                        >
                          {sectionKey}
                        </h2>
                      )}
                      <ul className="space-y-0">
                        {blocks.map(({ root: item, children }) => (
                          <li
                            key={item.id}
                            className="group border-b border-white/[0.05] py-3.5 last:border-b-0"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                              <div className="min-w-0 flex-1">
                                <span
                                  className="font-forum text-lg font-bold lowercase tracking-[0.12em] transition-colors duration-300 group-hover:opacity-90 sm:text-xl"
                                  style={{ color: CREAM }}
                                >
                                  {item.name}
                                </span>
                                {item.description && (
                                  <p className="mt-0.5 text-xs font-normal leading-snug text-white/75" style={{ color: MUTED }}>
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              {item.price != null && (
                                <span
                                  className="shrink-0 font-forum text-base font-light tabular-nums sm:text-lg"
                                  style={{ color: WARM_BEIGE }}
                                >
                                  {Number(item.price).toFixed(2)}{" "}
                                  {formatPriceSymbol(menu.priceCurrency)}
                                </span>
                              )}
                            </div>
                            {children.length > 0 && (
                              <ul className="mt-2 space-y-1.5 border-l pl-3 ml-1" style={{ borderColor: "rgba(196,167,125,0.3)" }}>
                                {children.map((sub) => (
                                  <li
                                    key={sub.id}
                                    className="flex flex-wrap items-baseline justify-between gap-x-2 text-base font-semibold"
                                  >
                                    <span style={{ color: STONE }}>↳ {sub.name}</span>
                                    {sub.price != null && (
                                      <span
                                        className="tabular-nums"
                                        style={{ color: COPPER }}
                                      >
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
              </div>
            </div>

            {(!menu.items || menu.items.length === 0) && (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] py-10 text-center">
                <p className="text-xs" style={{ color: MUTED }}>{t("noItems", locale)}</p>
              </div>
            )}

            <MenuPublicFooter menu={menu} locale={locale} />

            <p className="mt-6 text-center text-[9px] font-medium uppercase tracking-[0.3em]" style={{ color: MUTED }}>
              {t("digikarte", locale)}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
