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
 * Terrasse – Jardin : fond très clair, vert botanique, style café en plein air / jardin.
 * Distinct de Bistro/Cafe/Minimal (tons chauds). Aéré, frais, naturel.
 */
const TERRASSE_GREEN = "#2d5a4a";
const TERRASSE_SAGE = "#6b8f71";
const TERRASSE_TEXT = "#1c2522";

export function MenuTemplateTerrasse({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);

  return (
    <div className="menu-bg-terrasse min-h-screen font-dm text-[#1c2522]">
      <div
        className="menu-page-outer min-h-screen"
        style={{ ["--menu-page-border" as string]: "rgba(45,90,74,0.2)" }}
      >
        <div className="menu-page-inner">
          <header className="relative z-10 flex min-h-[32vh] flex-col items-center justify-center px-8 py-10 text-center sm:px-12 sm:py-12">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
              {menu.organizationLogoBase64 && (
                <div className="shrink-0">
                  <MenuLogoFrame
                    accentColor={TERRASSE_GREEN}
                    accentOpacity={0.6}
                    sizeRem={8}
                    innerBgClassName="bg-[#f8fbf9]"
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
                {!menu.organizationLogoBase64 && menu.organizationName && (
                  <h1 className="font-forum text-3xl font-bold tracking-tight text-[#1c2522] sm:text-4xl md:text-5xl">
                    {menu.organizationName}
                  </h1>
                )}
                {menu.organizationSlogan && (
                  <p className="mt-1 font-forum text-xl sm:text-2xl italic text-[#214437]">
                    {menu.organizationSlogan}
                  </p>
                )}
                <p className="mt-2 font-forum text-xl text-[#2d3d36] sm:text-2xl md:text-3xl">
                  {menu.title}
                </p>
                {menu.description && (
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-[#4a5c54]">
                    {menu.description}
                  </p>
                )}
              </div>
            </div>
          </header>

          <main className="relative z-10 mx-auto max-w-2xl px-8 py-10 sm:px-12 sm:py-14">
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-8 bg-[#6b8f71]/50" aria-hidden />
              <p className="font-forum text-sm sm:text-base font-semibold uppercase tracking-[0.4em] text-[#2d5a4a]">
                {t("menu", locale)}
              </p>
              <span className="h-px w-8 bg-[#6b8f71]/50" aria-hidden />
            </div>
            <MenuDividerGravure color={TERRASSE_GREEN} className="px-2" />
            <div
              className="menu-contour-outer mt-8"
              style={{ ["--menu-contour-color" as string]: TERRASSE_SAGE }}
            >
              <div className="menu-contour-inner bg-[#f8fbf9]/90">
                <div className="space-y-12">
                  {sections.map(([sectionKey, blocks]) => (
                    <section key={sectionKey}>
                      {sectionKey !== "_no_section" && (
                        <MenuSectionTitle accentColor={TERRASSE_GREEN} className="mb-8">
                          {sectionKey}
                        </MenuSectionTitle>
                      )}
                      <ul className="space-y-0">
                        {blocks.map(({ root: item, children }) => (
                          <li key={item.id} className="border-b border-[#2d5a4a]/10 py-4 last:border-b-0">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                              <div className="min-w-0 flex-1">
                                <span className="font-forum text-lg font-bold text-[#1c2522] sm:text-xl">{item.name}</span>
                                {item.description && <p className="mt-0.5 text-xs font-normal leading-snug text-[#1c2522]/90">{item.description}</p>}
                              </div>
                              {item.price != null && (
                                <span className="shrink-0 font-forum text-lg font-bold tabular-nums text-[#2d5a4a] sm:text-xl whitespace-nowrap">
                                  {Number(item.price).toFixed(2)} {formatPriceSymbol(menu.priceCurrency)}
                                </span>
                              )}
                            </div>
                            {children.length > 0 && (
                              <ul className="mt-3 space-y-2 border-l border-[#6b8f71]/40 pl-3 ml-1">
                                {children.map((sub) => (
                                  <li key={sub.id} className="flex justify-between gap-2 text-base font-semibold text-[#1c2522]">
                                    <span>↳ {sub.name}</span>
                                    {sub.price != null && <span className="tabular-nums font-semibold">{Number(sub.price).toFixed(2)} {formatPriceSymbol(menu.priceCurrency)}</span>}
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
              <div className="rounded-2xl border-2 border-dashed border-[#6b8f71]/40 bg-[#f8fbf9]/95 px-8 py-14 text-center">
                <p className="font-forum text-lg text-[#2d5a4a]">{t("noItems", locale)}</p>
              </div>
            )}

            <MenuPublicFooter menu={menu} locale={locale} variant="light" />

            <p className="mt-12 text-center text-xs font-medium uppercase tracking-widest text-[#6b8f71]/70">
              {t("digikarte", locale)}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
