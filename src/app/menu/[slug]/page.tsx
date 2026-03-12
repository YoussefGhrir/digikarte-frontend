"use client";

import { menuPublicBySlug, type MenuPublicDto } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicMenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { locale } = useLanguage();
  const [menu, setMenu] = useState<MenuPublicDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    menuPublicBySlug(slug)
      .then(setMenu)
      .catch(() => setError("notFound"))
      .finally(() => setLoading(false));
  }, [slug]);

  const menuBg = {
    backgroundColor: "var(--eerie-black)",
    backgroundImage: "url(/bg-menu-dark.png)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center font-dm"
        style={{ ...menuBg, color: "var(--gold)" }}
      >
        <p className="text-lg tracking-widest uppercase">
          {t("loading", locale)}
        </p>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-dm"
        style={menuBg}
      >
        <p className="text-red-400">
          {error === "notFound" ? t("notFound", locale) : error}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-dm" style={menuBg}>
      {/* En-tête moderne avec logo circulaire et nom de l'établissement */}
      <header className="px-4 pt-10 pb-4">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-4 sm:gap-5">
          <div className="relative">
            <div className="flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full border-[3px] border-[var(--gold)] bg-[var(--eerie-black-4)] shadow-xl shadow-black/70 overflow-hidden">
              {menu.organizationLogoBase64 ? (
                <img
                  src={`data:image/jpeg;base64,${menu.organizationLogoBase64}`}
                  alt={menu.organizationName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-2xl font-forum" style={{ color: "var(--gold)" }}>
                  {menu.organizationName.charAt(0)}
                </span>
              )}
            </div>
            <div className="pointer-events-none absolute inset-0 -z-10 scale-125 rounded-full border border-[var(--gold)]/30 blur-[1px]" />
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="font-forum text-3xl sm:text-4xl md:text-5xl tracking-tight text-white">
              {menu.organizationName}
            </h1>
            <p
              className="text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--gold)" }}
            >
              {t("menu", locale)}
            </p>
            <p className="font-forum text-xl sm:text-2xl tracking-tight text-white/90">
              {menu.title}
            </p>
            {menu.description && (
              <p
                className="mx-auto mt-2 max-w-xl text-sm md:text-base leading-relaxed"
                style={{ color: "var(--quick-silver)" }}
              >
                {menu.description}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-3 pb-10 pt-4 sm:px-4 sm:pb-12 sm:pt-6">

        {/* Regrouper les produits par section (catégorie) */}
        <div className="mt-10 space-y-8 sm:mt-14 sm:space-y-10">
          {Object.entries(
            (menu.items ?? []).reduce<Record<string, typeof menu.items>>(
              (acc, item) => {
                const key = (item.section || "").trim() || "_no_section";
                if (!acc[key]) acc[key] = [];
                acc[key].push(item);
                return acc;
              },
              {}
            )
          ).map(([sectionKey, items]) => (
            <section key={sectionKey}>
              {sectionKey !== "_no_section" && (
                <>
                  <h2 className="font-forum text-2xl uppercase tracking-[0.3em] text-center md:text-left" style={{ color: "var(--gold)" }}>
                    {sectionKey}
                  </h2>
                  <div
                    className="mt-2 mb-4 h-px w-24 md:w-32"
                    style={{ backgroundColor: "var(--gold)" }}
                  />
                </>
              )}
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-[var(--white-alpha-20)]/80 bg-[var(--eerie-black-2)]/90 px-4 py-3 md:px-6 md:py-4 shadow-sm shadow-black/50"
                  >
                    <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                      <h3 className="font-forum text-xl text-white md:text-2xl">
                        {item.name}
                      </h3>
                      {item.price != null && (
                        <p
                          className="font-forum text-lg md:text-xl"
                          style={{ color: "var(--gold)" }}
                        >
                          {Number(item.price).toFixed(2)} €
                        </p>
                      )}
                    </div>
                    {item.description && (
                      <p
                        className="mt-1 text-sm leading-relaxed"
                        style={{ color: "var(--quick-silver)" }}
                      >
                        {item.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {(!menu.items || menu.items.length === 0) && (
          <div
            className="rounded-3xl border-2 border-dashed p-12 text-center"
            style={{
              borderColor: "var(--gold)",
              backgroundColor: "var(--eerie-black-2)",
            }}
          >
            <p style={{ color: "var(--quick-silver)" }}>
              {t("noItems", locale)}
            </p>
          </div>
        )}

        <p
          className="mt-16 text-center text-xs tracking-widest"
          style={{ color: "var(--quick-silver)" }}
        >
          {t("digikarte", locale)}
        </p>
      </main>
    </div>
  );
}
