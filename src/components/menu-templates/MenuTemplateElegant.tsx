"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { groupSectionBlocks, formatPriceSymbol } from "./utils";
import { MenuPublicFooter } from "./MenuPublicFooter";
import { MenuLogoFrame } from "./MenuLogoFrame";
import { MenuDividerGravure } from "./MenuDividerGravure";
import { MenuSectionTitle } from "./MenuSectionTitle";

const ACCENT = "#f59e0b";
const ACCENT_LIGHT = "#fcd34d";

/**
 * Bold Minimal Luxe – Cher, confident, mode 2025–2026.
 * Grid 2 colonnes, typo serif très grande, accent or → amber, hover subtil.
 */
export function MenuTemplateElegant({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);

  return (
    <div className="menu-bg-rome-elegant min-h-screen font-dm text-[#f5f0e8]">
      <div
        className="menu-page-outer menu-contour-subtle min-h-screen"
        style={{ ["--menu-page-border" as string]: "rgba(245,158,11,0.25)" }}
      >
        <div className="menu-page-inner">
          <header className="relative z-10 px-4 pt-10 pb-8 sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-col sm:flex-row sm:items-center gap-6 text-left">
              {menu.organizationLogoBase64 && (
                <MenuLogoFrame
                  accentColor={ACCENT}
                  accentOpacity={0.9}
                  sizeRem={12}
                  innerBgClassName="bg-neutral-900/90"
                  className="shrink-0"
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
                  <h1 className="font-forum font-ligatures text-3xl font-bold tracking-wide text-[#f5f0e8] sm:text-4xl">
                    {menu.organizationName}
                  </h1>
                )}
                {menu.organizationSlogan && (
                  <p className="mt-1 text-sm italic" style={{ color: ACCENT_LIGHT }}>
                    {menu.organizationSlogan}
                  </p>
                )}
                <p
                  className="mt-2 text-[0.65rem] uppercase tracking-[0.4em]"
                  style={{ color: ACCENT }}
                >
                  {t("menu", locale)}
                </p>
                <p className="font-forum text-xl text-[#e7e0d4] mt-2">{menu.title}</p>
                {menu.description && (
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-[#a8a29e]">
                    {menu.description}
                  </p>
                )}
              </div>
            </div>
          </header>

          <main className="relative z-10 mx-auto max-w-5xl px-4 pb-14 sm:px-6">
            <MenuDividerGravure color={ACCENT} className="px-2" />
            <div
              className="menu-contour-outer menu-contour-subtle mt-8"
              style={{ ["--menu-contour-color" as string]: ACCENT }}
            >
              <div className="menu-contour-inner bg-black/5 py-10 sm:py-14">
                <div className="space-y-16 sm:space-y-20">
                  {sections.map(([sectionKey, blocks]) => (
                    <section key={sectionKey}>
                      {sectionKey !== "_no_section" && (
                        <MenuSectionTitle
                          accentColor={ACCENT}
                          className="mb-10 sm:mb-12"
                        >
                          {sectionKey}
                        </MenuSectionTitle>
                      )}
                      <div className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:gap-x-20 lg:gap-y-16">
                        {blocks.map(({ root: item, children: subItems }) => (
                          <div
                            key={item.id}
                            className="group transition-colors duration-300"
                          >
                            <div className="flex justify-between items-baseline gap-4">
                              <div className="min-w-0">
                                <h3 className="font-forum font-ligatures text-3xl font-bold tracking-tight text-[#f5f0e8] transition-colors duration-300 group-hover:text-amber-400 sm:text-4xl lg:text-5xl">
                                  {item.name}
                                </h3>
                                {item.description && (
                                  <p className="mt-0.5 text-xs font-normal leading-snug text-[#f5f0e8]/85">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              {item.price != null && (
                                <span className="shrink-0 font-forum text-2xl font-light tabular-nums whitespace-nowrap text-amber-300/95 sm:text-3xl">
                                  {Number(item.price).toFixed(2)}{" "}
                                  {formatPriceSymbol(menu.priceCurrency)}
                                </span>
                              )}
                            </div>
                            {subItems.length > 0 && (
                              <ul className="mt-4 space-y-2 border-l-2 border-amber-500/30 pl-4">
                                {subItems.map((sub) => (
                                  <li key={sub.id} className="flex flex-wrap items-baseline justify-between gap-2 text-lg font-semibold text-[#f5f0e8]">
                                    <span>↳ {sub.name}</span>
                                    {sub.price != null && (
                                      <span className="tabular-nums text-amber-300/90">
                                        {Number(sub.price).toFixed(2)} {formatPriceSymbol(menu.priceCurrency)}
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                {(!menu.items || menu.items.length === 0) && (
                  <div
                    className="rounded-lg border border-amber-500/20 bg-black/10 p-12 text-center"
                  >
                    <p className="text-[#a8a29e]">{t("noItems", locale)}</p>
                  </div>
                )}
              </div>
            </div>

            <MenuPublicFooter menu={menu} locale={locale} />

            <p
              className="mt-8 text-center text-[0.65rem] uppercase tracking-[0.3em]"
              style={{ color: "#78716c" }}
            >
              {t("digikarte", locale)}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
