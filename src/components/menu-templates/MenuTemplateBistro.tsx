"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { groupSectionBlocks, formatPriceSymbol } from "./utils";
import { MenuPublicFooter } from "./MenuPublicFooter";
import { MenuLogoFrame } from "./MenuLogoFrame";
import { MenuDividerGravure } from "./MenuDividerGravure";

const CORAIL = "#f9735b";
const MOUTARDE = "#facc15";
const VERT_OLIVE = "#4b5563";

const SECTION_COLORS = [
  "bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]",
  "bg-[#fefce8] text-[#854d0e] border-[#fef08a]",
  "bg-[#ecfdf3] text-[#166534] border-[#bbf7d0]",
  "bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]",
];

/**
 * Bistro revisité – clair, chaleureux, moderne.
 * Pastels doux, badges lisibles, cartes propres, bonne hiérarchie des infos.
 */
export function MenuTemplateBistro({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);

  return (
    <div className="menu-bg-france-bistro min-h-screen font-dm text-slate-900">
      <div
        className="menu-page-outer min-h-screen"
        style={{ ["--menu-page-border" as string]: "rgba(107,123,92,0.25)" }}
      >
        <div className="menu-page-inner">
          <header className="relative z-10 flex min-h-[40vh] flex-col items-center justify-center px-6 py-14 text-center sm:px-8 sm:py-16">
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
              {menu.organizationLogoBase64 && (
                <MenuLogoFrame
                  accentColor={VERT_OLIVE}
                  accentOpacity={0.8}
                  sizeRem={12}
                  innerBgClassName="bg-[#faf8f5]"
                  className="mb-4"
                >
                  <img
                    src={`data:image/jpeg;base64,${menu.organizationLogoBase64}`}
                    alt={menu.organizationName}
                    className="h-full w-full object-contain"
                  />
                </MenuLogoFrame>
              )}
              {!menu.organizationLogoBase64 &&
                menu.organizationName && (
                  <h1 className="font-forum text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                    {menu.organizationName}
                  </h1>
                )}
              {menu.organizationSlogan && (
                <p className="text-base italic text-slate-700 sm:text-lg">
                  {menu.organizationSlogan}
                </p>
              )}
              <span className="inline-flex items-center rounded-full border border-amber-300 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.32em] text-amber-700 shadow-sm">
                {t("menu", locale)}
              </span>
              <p className="font-forum text-xl text-slate-900 sm:text-2xl md:text-3xl">
                {menu.title}
              </p>
              {menu.description && (
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-700">
                  {menu.description}
                </p>
              )}
            </div>
          </header>

          <main className="relative z-10 mx-auto max-w-3xl px-6 py-8 sm:px-8 sm:py-10">
            <MenuDividerGravure color={VERT_OLIVE} className="px-2" />
            <div
              className="menu-contour-outer menu-contour-subtle mt-6"
              style={{ ["--menu-contour-color" as string]: VERT_OLIVE }}
            >
              <div className="menu-contour-inner bg-white/85 py-8 sm:py-10">
                <div className="space-y-10">
                  {sections.map(([sectionKey, blocks], sectionIndex) => (
                    <section key={sectionKey}>
                      {sectionKey !== "_no_section" && (
                        <span
                          className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] ${SECTION_COLORS[sectionIndex % SECTION_COLORS.length]}`}
                        >
                          {sectionKey}
                        </span>
                      )}
                      <div className="mt-4 space-y-4">
                        {blocks.map(({ root: item, children: subItems }) => (
                          <div
                            key={item.id}
                            className="group rounded-2xl border border-amber-100/90 bg-white px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg"
                          >
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                              <span className="font-forum text-lg font-semibold text-slate-900 sm:text-xl">
                                {item.name}
                              </span>
                              {item.price != null && (
                                <span className="shrink-0 font-forum text-lg font-semibold tabular-nums text-amber-600 sm:text-xl whitespace-nowrap">
                                  {Number(item.price).toFixed(2)}{" "}
                                  {formatPriceSymbol(menu.priceCurrency)}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="mt-0.5 text-xs font-normal leading-snug text-slate-600">
                                {item.description}
                              </p>
                            )}
                            {subItems.length > 0 && (
                              <ul className="mt-3 space-y-1.5 border-l-2 border-amber-300/70 pl-4">
                                {subItems.map((sub) => (
                                  <li
                                    key={sub.id}
                                    className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-semibold text-slate-900"
                                  >
                                    <span>↳ {sub.name}</span>
                                    {sub.price != null && (
                                      <span className="tabular-nums font-medium text-amber-600">
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
                  <div className="rounded-2xl border-2 border-dashed border-amber-200/80 bg-white/80 px-6 py-14 text-center">
                    <p className="text-sm text-slate-600">{t("noItems", locale)}</p>
                  </div>
                )}
              </div>
            </div>

            <MenuPublicFooter menu={menu} locale={locale} variant="light" />

            <p className="mt-8 text-center text-xs font-medium uppercase tracking-widest text-[#6b7b5c]/70">
              {t("digikarte", locale)}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
