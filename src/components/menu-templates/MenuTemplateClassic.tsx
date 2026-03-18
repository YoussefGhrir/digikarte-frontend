"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { groupSectionBlocks, formatPriceSymbol } from "./utils";
import { MenuPublicFooter } from "./MenuPublicFooter";
import { MenuLogoFrame } from "./MenuLogoFrame";
import { MenuDividerGravure } from "./MenuDividerGravure";
import { MenuSectionTitle } from "./MenuSectionTitle";

export function MenuTemplateClassic({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);
  const backgroundImage =
    "/backgrounds/top-view-bowl-with-lentils-variety-condiments.jpg";

  return (
    <div
      className="menu-bg-rome min-h-screen font-dm text-white bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* assombri global pour garder le background mais rendre le contenu très lisible */}
      <div className="min-h-screen bg-black/55">
      <div
        className="menu-page-outer min-h-screen"
        style={{ ["--menu-page-border" as string]: "rgba(201,162,39,0.45)" }}
      >
        <div className="menu-page-inner">
      <header className="relative z-10 px-4 pt-10 pb-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-4 sm:gap-5">
          {menu.organizationLogoBase64 && (
            <div className="relative">
              <MenuLogoFrame
                accentColor="var(--gold)"
                accentOpacity={0.9}
                sizeRem={12}
                innerBgClassName="bg-[var(--eerie-black-4)]"
              >
                <img
                  src={`data:image/jpeg;base64,${menu.organizationLogoBase64}`}
                  alt={menu.organizationName}
                  className="h-full w-full object-contain"
                />
              </MenuLogoFrame>
            </div>
          )}
          <div className="space-y-1.5 sm:space-y-2">
            {!menu.organizationLogoBase64 && menu.organizationName && (
              <h1 className="font-forum text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]">
                {menu.organizationName}
              </h1>
            )}
            {menu.organizationSlogan && (
              <p
                className="mt-1 font-forum text-2xl sm:text-3xl font-semibold italic tracking-wide text-white/95"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.8)" }}
              >
                {menu.organizationSlogan}
              </p>
            )}
            <p className="font-forum text-xl sm:text-2xl tracking-tight text-white/90">
              {menu.title}
            </p>
            {menu.description && (
              <p
                className="mx-auto mt-2 max-w-xl text-sm md:text-base leading-relaxed text-white/85"
              >
                {menu.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-3 pb-10 pt-4 sm:px-4 sm:pb-12 sm:pt-6">
        <div className="mt-4 flex justify-center">
          <p
            className="font-forum text-xs sm:text-sm font-semibold uppercase tracking-[0.35em] text-[var(--gold)]"
          >
            {t("menu", locale)}
          </p>
        </div>
        <MenuDividerGravure color="var(--gold)" className="px-2" />
        <div
          className="menu-contour-outer mt-6"
          style={{ ["--menu-contour-color" as string]: "var(--gold)" }}
        >
          <div
            className="menu-contour-inner"
            style={{
              // panneau central plus clair, homogène beige/gris chaud
              background: "linear-gradient(180deg, rgba(20,12,4,0.96), rgba(26,16,6,0.96))",
              backdropFilter: "blur(10px)",
            }}
          >
        <div className="mt-6 space-y-8 sm:space-y-10">
          {sections.map(([sectionKey, blocks]) => (
            <section key={sectionKey}>
              {sectionKey !== "_no_section" && (
                <MenuSectionTitle accentColor="var(--gold)" centered={false}>
                  {sectionKey}
                </MenuSectionTitle>
              )}
              <ul className="space-y-0">
                {blocks.map(({ root: item, children }) => (
                  <li
                    key={item.id}
                    className="border-b border-[var(--white-alpha-20)]/40 py-4 last:border-b-0"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div className="min-w-0 flex-1 flex items-baseline gap-3">
                        {item.imageUrl && (
                          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[var(--eerie-black-4)]">
                            <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-forum text-lg md:text-xl font-semibold text-white">
                            {item.name}
                          </span>
                          {item.description && (
                            <p className="mt-1 text-xs font-normal leading-snug text-white/80">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {item.price != null && (
                        <span
                          className="font-forum text-lg md:text-xl font-semibold shrink-0 whitespace-nowrap tabular-nums"
                          style={{ color: "var(--gold)" }}
                        >
                          {Number(item.price).toFixed(2)} {formatPriceSymbol(menu.priceCurrency)}
                        </span>
                      )}
                    </div>
                    {children.length > 0 && (
                      <ul className="mt-2 space-y-1.5 border-l border-[var(--gold)]/25 pl-3 ml-2">
                        {children.map((sub) => (
                          <li key={sub.id} className="flex flex-wrap items-baseline justify-between gap-2 text-base font-semibold">
                            <div className="min-w-0">
                              <span className="text-white/95">↳ {sub.name}</span>
                              {sub.description && (
                                <p className="text-xs font-normal mt-0.5 text-white/80">{sub.description}</p>
                              )}
                            </div>
                            {sub.price != null && (
                              <span className="shrink-0 tabular-nums" style={{ color: "var(--gold)" }}>
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
          <div
            className="rounded-3xl border-2 border-dashed p-12 text-center"
            style={{ borderColor: "var(--gold)", backgroundColor: "rgba(15,10,6,0.9)" }}
          >
            <p style={{ color: "var(--quick-silver)" }}>{t("noItems", locale)}</p>
          </div>
        )}
          </div>
        </div>

        <MenuPublicFooter menu={menu} locale={locale} />

        <p
          className="mt-8 text-center text-[0.7rem] tracking-[0.35em] uppercase"
          style={{ color: "var(--quick-silver)" }}
        >
          {t("digikarte", locale)}
        </p>
      </main>
        </div>
      </div>
      </div>
    </div>
  );
}
