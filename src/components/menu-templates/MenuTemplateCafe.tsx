"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { groupSectionBlocks, formatPriceSymbol } from "./utils";
import { MenuPublicFooter } from "./MenuPublicFooter";
import { MenuLogoFrame } from "./MenuLogoFrame";
import { MenuDividerGravure } from "./MenuDividerGravure";
import { MenuSectionTitle } from "./MenuSectionTitle";

export function MenuTemplateCafe({
  menu,
  locale,
}: {
  menu: MenuPublicDto;
  locale: Locale;
}) {
  const sections = groupSectionBlocks(menu.items ?? []);
  const backgroundImage = "/backgrounds/coffee.jpg";

  return (
    <div
      className="menu-bg-france-artnouveau min-h-screen font-dm text-[#3d2c29] bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundRepeat: "no-repeat",
        // montrer presque toute l'image sans zoom excessif
        backgroundSize: "contain",
        backgroundPosition: "center top",
        backgroundColor: "#020202",
      }}
    >
      <div className="menu-page-outer min-h-screen" style={{ ["--menu-page-border" as string]: "rgba(139,90,43,0.35)" }}>
        <div className="menu-page-inner">
      <header className="relative z-10 px-4 pt-8 pb-6 sm:px-6 bg-gradient-to-b from-black/80 via-black/65 to-transparent">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
          {menu.organizationLogoBase64 && (
            <MenuLogoFrame
              accentColor="#8b5a2b"
              accentOpacity={0.9}
              sizeRem={8}
              innerBgClassName="bg-white"
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
              <h1 className="font-forum text-3xl sm:text-4xl font-semibold text-[#f5f0e8] drop-shadow-[0_3px_10px_rgba(0,0,0,0.8)]">
                {menu.organizationName}
              </h1>
            )}
            {menu.organizationSlogan && (
              <p className="mt-1 font-forum text-2xl sm:text-3xl font-semibold italic text-[#facc6b] drop-shadow-[0_3px_12px_rgba(0,0,0,0.85)]">
                {menu.organizationSlogan}
              </p>
            )}
            <p className="font-forum text-xl text-[#f5f0e8] mt-1 tracking-wide">
              {menu.title}
            </p>
            {menu.description && (
              <p className="text-sm text-[#f5e6d5] max-w-md mt-2">
                {menu.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-2xl px-4 pb-12 pt-6">
        {/* Bandeau sombre derrière le mot MENU pour garantir la lisibilité sur le bg café */}
        <div className="mt-2 rounded-2xl bg-black/75 px-4 py-4">
          <div className="flex justify-center">
            <p className="font-forum text-sm sm:text-base font-semibold uppercase tracking-[0.4em] text-[#facc6b]">
              {t("menu", locale)}
            </p>
          </div>
          <MenuDividerGravure color="#facc6b" className="px-2" />
        </div>
        <div
          className="menu-contour-outer"
          style={{ ["--menu-contour-color" as string]: "#8b5a2b" }}
        >
          <div
            className="menu-contour-inner"
            style={{
              backgroundColor: "rgba(255, 250, 241, 0.9)",
              backdropFilter: "blur(10px)",
            }}
          >
        <div className="space-y-10">
          {sections.map(([sectionKey, blocks]) => (
            <section key={sectionKey}>
              {sectionKey !== "_no_section" && (
                <MenuSectionTitle accentColor="#8b5a2b">{sectionKey}</MenuSectionTitle>
              )}
              <ul className="space-y-0">
                {blocks.map(({ root: item, children }) => (
                  <li key={item.id} className="border-b border-[#e8d5c4]/60 py-3 last:border-b-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div className="min-w-0 flex-1 flex items-baseline gap-3">
                        {item.imageUrl && (
                          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#e8d5c4]/50">
                            <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div>
                          <span className="font-forum text-lg font-bold text-[#3d2c29]">{item.name}</span>
                          {item.description && (
                            <p className="text-xs font-normal text-[#3d2c29]/90 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>
                      {item.price != null && (
                        <span className="font-forum text-lg font-bold text-[#8b5a2b] whitespace-nowrap tabular-nums">
                          {Number(item.price).toFixed(2)} {formatPriceSymbol(menu.priceCurrency)}
                        </span>
                      )}
                    </div>
                    {children.length > 0 && (
                      <ul className="mt-2 space-y-1 border-l border-[#8b5a2b]/30 pl-3 ml-2">
                        {children.map((sub) => (
                          <li key={sub.id} className="flex justify-between gap-2 text-base font-semibold">
                            <span className="text-[#3d2c29]">↳ {sub.name}{sub.description && <span className="block text-xs font-normal text-[#3d2c29]/90 mt-0.5"> {sub.description}</span>}</span>
                            {sub.price != null && <span className="tabular-nums text-[#8b5a2b]">{Number(sub.price).toFixed(2)} {formatPriceSymbol(menu.priceCurrency)}</span>}
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
          <div className="rounded-2xl border-2 border-dashed border-[#8b5a2b]/60 bg-white/70 p-12 text-center">
            <p className="text-[#6b5344]">{t("noItems", locale)}</p>
          </div>
        )}

        <div className="mt-10 rounded-3xl bg-black/80 px-4 py-6">
          <MenuPublicFooter menu={menu} locale={locale} variant="dark" />
        </div>

        <p className="mt-6 text-center text-[0.7rem] uppercase tracking-[0.32em] text-[#f5f0e8]/90">
          {t("digikarte", locale)}
        </p>
      </main>
        </div>
      </div>
    </div>
  );
}
