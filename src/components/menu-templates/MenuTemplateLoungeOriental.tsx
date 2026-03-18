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
 * Lounge Oriental – marbre noir & or, 3 langues.
 * Variante plus chaude du lounge, avec fond lounge2.
 */
export function MenuTemplateLoungeOriental({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);
  const backgroundImage = "/backgrounds/lounge2.png";

  return (
    <div
      className="min-h-screen w-full font-dm text-[#f5f0e8] bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundColor: "#02010a",
      }}
    >
      <div className="min-h-screen bg-black/70">
        <div
          className="menu-page-outer min-h-screen"
          style={{ ["--menu-page-border" as string]: "rgba(248,250,252,0.25)" }}
        >
          <div className="menu-page-inner relative overflow-hidden">
            <header className="relative z-10 px-5 pt-10 pb-6 sm:px-7 sm:pt-12 sm:pb-8">
              <div className="mx-auto flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-center">
                {menu.organizationLogoBase64 && (
                  <MenuLogoFrame
                    accentColor="#facc6b"
                    accentOpacity={0.9}
                    sizeRem={11}
                    innerBgClassName="bg-black/90"
                    className="shrink-0 shadow-[0_0_40px_rgba(250,204,100,0.6)]"
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
                    <h1 className="font-forum text-3xl sm:text-4xl font-semibold tracking-[0.16em] text-[#fefce8] drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                      {menu.organizationName}
                    </h1>
                  )}
                  {menu.organizationSlogan && (
                    <p className="mt-1 font-forum text-2xl sm:text-3xl font-semibold italic text-[#fde68a] drop-shadow-[0_3px_14px_rgba(0,0,0,0.9)]">
                      {menu.organizationSlogan}
                    </p>
                  )}
                  <p className="mt-2 font-forum text-xl text-[#fefce8] sm:text-2xl tracking-wide">
                    {menu.title}
                  </p>
                  {menu.description && (
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#e5e7eb]/90">
                      {menu.description}
                    </p>
                  )}
                </div>
              </div>
            </header>

            <main className="relative z-10 mx-auto w-full max-w-4xl px-5 pb-12 sm:px-7">
              {/* Bandeau sombre MENU + motif */}
              <div className="mt-2 mb-3 rounded-2xl bg-black/80 px-4 py-4">
                <div className="flex justify-center">
                  <p className="font-forum text-sm sm:text-base font-semibold uppercase tracking-[0.4em] text-[#fefce8]">
                    {t("menu", locale)}
                  </p>
                </div>
                <MenuDividerGravure color="#facc6b" className="px-2" />
              </div>

              <div
                className="menu-contour-outer menu-contour-subtle mt-6"
                style={{ ["--menu-contour-color" as string]: "#facc6b" }}
              >
                <div className="menu-contour-inner bg-black/80 px-4 py-8 sm:px-6 sm:py-10">
                  <div className="space-y-10">
                    {sections.map(([sectionKey, blocks]) => (
                      <section key={sectionKey}>
                        {sectionKey !== "_no_section" && (
                          <MenuSectionTitle
                            accentColor="#facc6b"
                            className="mb-6 text-sm tracking-[0.32em] text-[#fefce8]"
                          >
                            {sectionKey}
                          </MenuSectionTitle>
                        )}
                        <ul className="space-y-4">
                          {blocks.map(({ root: item, children: subItems }) => (
                            <li
                              key={item.id}
                              className="group rounded-2xl border border-[#4b5563] bg-black/70 px-4 py-4 shadow-[0_18px_45px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-0.5 hover:border-[#facc6b] hover:shadow-[0_22px_60px_rgba(250,204,100,0.65)] sm:px-5 sm:py-5"
                            >
                              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                                <div className="min-w-0 flex-1">
                                  <p className="text-lg font-semibold tracking-wide text-[#fefce8] sm:text-xl">
                                    {item.name}
                                  </p>
                                  {item.description && (
                                    <p className="mt-1 text-xs leading-snug text-slate-200">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                                {item.price != null && (
                                  <span className="shrink-0 text-lg font-semibold tabular-nums sm:text-xl text-[#fde68a]">
                                    {Number(item.price).toFixed(2)}{" "}
                                    {formatPriceSymbol(menu.priceCurrency)}
                                  </span>
                                )}
                              </div>
                              {subItems.length > 0 && (
                                <ul className="mt-3 space-y-1.5 border-l border-[#facc6b]/50 pl-3">
                                  {subItems.map((sub) => (
                                    <li
                                      key={sub.id}
                                      className="flex flex-wrap items-baseline justify-between gap-2 text-sm font-medium text-slate-100"
                                    >
                                      <span>↳ {sub.name}</span>
                                      {sub.price != null && (
                                        <span className="tabular-nums text-[#facc6b]">
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
                    <div className="mt-10 rounded-2xl border border-dashed border-slate-600/80 bg-black/70 px-6 py-12 text-center">
                      <p className="text-xs text-slate-300">{t("noItems", locale)}</p>
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

