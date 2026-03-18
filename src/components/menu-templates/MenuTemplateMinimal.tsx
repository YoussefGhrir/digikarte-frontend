"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { groupSectionBlocks, formatPriceSymbol } from "./utils";
import { MenuPublicFooter } from "./MenuPublicFooter";
import { MenuLogoFrame } from "./MenuLogoFrame";
import { MenuDividerGravure } from "./MenuDividerGravure";
import { MenuSectionTitle } from "./MenuSectionTitle";

const STONE = "#44403c";
const SAGE = "#59736a";
const AMBER_DARK = "#b45309";

/**
 * Soft Earthy Japandi – Calme, zen, haut-de-gamme naturel.
 * Beaucoup d'espace, typo propre, bordures fines, prix discret.
 */
export function MenuTemplateMinimal({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);

  return (
    <div className="menu-bg-germany-minimal min-h-screen font-dm text-stone-800">
      <div
        className="menu-page-outer menu-contour-subtle min-h-screen"
        style={{ ["--menu-page-border" as string]: "rgba(68,64,60,0.12)" }}
      >
        <div className="menu-page-inner">
          <header className="relative z-10 px-4 pt-10 pb-6 sm:px-6 sm:pt-12 sm:pb-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
              {menu.organizationLogoBase64 && (
                <div className="shrink-0">
                  <MenuLogoFrame
                    accentColor={STONE}
                    accentOpacity={0.5}
                    sizeRem={10}
                    innerBgClassName="bg-white"
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
                  <h1 className="font-forum text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-stone-800">
                    {menu.organizationName}
                  </h1>
                )}
                {menu.organizationSlogan && (
                  <p className="mt-1 font-forum text-2xl sm:text-3xl font-semibold italic text-stone-700">
                    {menu.organizationSlogan}
                  </p>
                )}
                <p className="mt-3 font-forum text-2xl text-stone-700 sm:text-3xl">
                  {menu.title}
                </p>
                {menu.description && (
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-stone-500">
                    {menu.description}
                  </p>
                )}
              </div>
            </div>
          </header>

          <main className="relative z-10 mx-auto max-w-2xl px-8 pb-28 sm:px-12 sm:pb-32">
            <div className="mt-4 flex justify-center">
              <p className="font-forum text-sm sm:text-base font-semibold uppercase tracking-[0.4em] text-stone-700">
                {t("menu", locale)}
              </p>
            </div>
            <MenuDividerGravure color={SAGE} className="px-2" />
            <div
              className="menu-contour-outer menu-contour-subtle mt-10"
              style={{ ["--menu-contour-color" as string]: SAGE }}
            >
              <div className="menu-contour-inner bg-white/40 py-14 sm:py-16">
                <div className="space-y-16">
                  {sections.map(([sectionKey, blocks]) => (
                    <section key={sectionKey}>
                      {sectionKey !== "_no_section" && (
                        <MenuSectionTitle accentColor={SAGE} variant="modern" className="mb-10">
                          {sectionKey}
                        </MenuSectionTitle>
                      )}
                      <ul className="space-y-0">
                        {blocks.map(({ root: item, children: subItems }) => (
                          <li
                            key={item.id}
                            className="border-b border-stone-200/50 pb-10 pt-1 last:border-b-0"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                              <div className="min-w-0 flex-1">
                                <span className="block text-xl font-medium text-stone-800 sm:text-2xl">
                                  {item.name}
                                </span>
                                {item.description && (
                                  <p className="mt-0.5 text-xs font-normal leading-snug text-stone-600">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              {item.price != null && (
                                <span className="shrink-0 text-sm font-medium tabular-nums text-stone-500">
                                  {Number(item.price).toFixed(2)}{" "}
                                  {formatPriceSymbol(menu.priceCurrency)}
                                </span>
                              )}
                            </div>
                            {subItems.length > 0 && (
                              <ul className="mt-4 space-y-2 border-l-2 border-stone-300/50 pl-4">
                                {subItems.map((sub) => (
                                  <li key={sub.id} className="flex flex-wrap items-baseline justify-between gap-2 text-base font-semibold text-stone-800">
                                    <span>↳ {sub.name}</span>
                                    {sub.price != null && (
                                      <span className="tabular-nums text-stone-500">
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
                  <div className="py-24 text-center">
                    <p className="text-stone-500">{t("noItems", locale)}</p>
                  </div>
                )}
              </div>
            </div>

            <MenuPublicFooter menu={menu} locale={locale} variant="light" />

            <p className="mt-24 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400">
              {t("digikarte", locale)}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
