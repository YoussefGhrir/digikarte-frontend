"use client";

import type { MenuItemDto, MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { groupSectionBlocks, formatPriceSymbol } from "./utils";
import { MenuPublicFooter } from "./MenuPublicFooter";
import { MenuLogoFrame } from "./MenuLogoFrame";
import { MenuDividerGravure } from "./MenuDividerGravure";
import { MenuSectionTitle } from "./MenuSectionTitle";

const ACCENT = "#0d9488";
const ACCENT_TEAL = "#14b8a6";

/**
 * Asymmetric Grid + Big Imagery – Magazine culinaire moderne, Instagramable.
 * Fond vert doux (herbe soie), accent emerald/teal, cards avec photo en overlay ou lignes texte.
 */
export function MenuTemplateCards({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);

  return (
    <div className="menu-bg-herbe-soie min-h-screen font-dm text-[#1c2522]">
      <div
        className="menu-page-outer min-h-screen"
        style={{ ["--menu-page-border" as string]: "rgba(13,148,136,0.2)" }}
      >
        <div className="menu-page-inner">
          <header className="relative z-10 px-4 pt-10 pb-6 sm:px-6">
            <div className="mx-auto flex max-w-4xl flex-col sm:flex-row sm:items-center gap-6 text-left">
              {menu.organizationLogoBase64 && (
                <MenuLogoFrame
                  accentColor={ACCENT}
                  accentOpacity={0.8}
                  sizeRem={11}
                  innerBgClassName="bg-[#f8fbf9]"
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
                  <h1 className="text-2xl font-semibold text-[#1c2522] sm:text-3xl">
                    {menu.organizationName}
                  </h1>
                )}
                {menu.organizationSlogan && (
                  <p className="mt-0.5 text-sm italic text-[#0d9488]">
                    {menu.organizationSlogan}
                  </p>
                )}
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#0d9488]">
                  {t("menu", locale)}
                </p>
                <p className="text-lg text-[#2d3d36] mt-0.5">{menu.title}</p>
                {menu.description && (
                  <p className="mt-2 max-w-md text-sm text-[#4a5c54]">
                    {menu.description}
                  </p>
                )}
              </div>
            </div>
          </header>

          <main className="relative z-10 mx-auto max-w-5xl px-4 pb-12 sm:px-6">
            <MenuDividerGravure color={ACCENT} className="px-2" />
            <div
              className="menu-contour-outer menu-contour-subtle mt-6"
              style={{ ["--menu-contour-color" as string]: ACCENT }}
            >
              <div className="menu-contour-inner bg-white/30 py-8 sm:py-10">
                <div className="space-y-10">
                  {sections.map(([sectionKey, blocks]) => (
                    <section key={sectionKey}>
                      {sectionKey !== "_no_section" && (
                        <MenuSectionTitle
                          accentColor={ACCENT}
                          className="mb-6"
                        >
                          {sectionKey}
                        </MenuSectionTitle>
                      )}
                      <div className="columns-1 gap-6 space-y-6 md:columns-2 lg:columns-3">
                        {blocks.map(({ root: item, children: subItems }) => (
                          <div key={item.id} className="break-inside-avoid space-y-0">
                            {item.imageUrl ? (
                              <CardWithImage item={item} menu={menu} />
                            ) : (
                              <div className="rounded-xl border border-stone-200/60 bg-white/50 px-4 py-3 shadow-sm transition-shadow duration-300 hover:shadow-md">
                                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                                  <span className="font-semibold text-[#1c2522]">
                                    {item.name}
                                  </span>
                                  {item.price != null && (
                                    <span className="text-[#0d9488] tabular-nums font-medium whitespace-nowrap">
                                      {Number(item.price).toFixed(2)}{" "}
                                      {formatPriceSymbol(menu.priceCurrency)}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="mt-0.5 text-xs font-normal text-[#1c2522]/90 leading-snug">
                                    {item.description}
                                  </p>
                                )}
                                {subItems.length > 0 && (
                                  <ul className="mt-3 space-y-1.5 border-l-2 border-[#0d9488]/40 pl-3">
                                    {subItems.map((sub) => (
                                      <li key={sub.id} className="flex flex-wrap items-baseline justify-between gap-2 text-base font-medium text-[#1c2522]">
                                        <span>↳ {sub.name}</span>
                                        {sub.price != null && (
                                          <span className="tabular-nums font-medium text-[#0d9488]/90">
                                            {Number(sub.price).toFixed(2)} {formatPriceSymbol(menu.priceCurrency)}
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                            {item.imageUrl && subItems.length > 0 && (
                              <ul className="mt-2 rounded-lg border border-stone-200/50 bg-white/40 px-3 py-2">
                                {subItems.map((sub) => (
                                  <li key={sub.id} className="flex flex-wrap items-baseline justify-between gap-2 text-base font-medium text-white/95">
                                    <span>↳ {sub.name}</span>
                                    {sub.price != null && (
                                      <span className="tabular-nums font-medium text-[#0d9488]/90">
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
                  <div className="rounded-2xl border-2 border-dashed border-teal-300/50 bg-white/50 p-12 text-center">
                    <p className="text-[#4a5c54]">{t("noItems", locale)}</p>
                  </div>
                )}
              </div>
            </div>

            <MenuPublicFooter menu={menu} locale={locale} variant="light" />

            <p className="mt-8 text-center text-xs tracking-widest text-[#0d9488]/70">
              {t("digikarte", locale)}
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}

function CardWithImage({
  item,
  menu,
}: {
  item: MenuItemDto;
  menu: MenuPublicDto;
}) {
  return (
    <div className="break-inside-avoid mb-6 overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.02]">
      <div className="relative aspect-[4/3] w-full">
        <img
          src={item.imageUrl}
          alt=""
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <h3 className="text-xl font-bold sm:text-2xl">{item.name}</h3>
          {item.description && (
            <p className="mt-0.5 line-clamp-2 text-xs font-normal text-white/90">
              {item.description}
            </p>
          )}
          {item.price != null && (
            <p className="mt-1 text-lg font-medium tabular-nums text-white/95">
              {Number(item.price).toFixed(2)}{" "}
              {formatPriceSymbol(menu.priceCurrency)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
