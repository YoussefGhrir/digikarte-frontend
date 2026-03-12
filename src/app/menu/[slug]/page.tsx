"use client";

import { menuPublicBySlug, type MenuPublicDto } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import { localeLabels, t, type Locale } from "@/lib/i18n";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PublicMenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { locale, setLocale } = useLanguage();
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
      {/* Header + langue */}
      <header
        className="sticky top-0 z-10 border-b px-4 py-4"
        style={{
          backgroundColor: "var(--eerie-black-4)",
          borderColor: "rgba(0,0,0,0.15)",
        }}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span
            className="font-forum text-xl tracking-wide"
            style={{ color: "var(--gold)" }}
          >
            {menu.organizationName}
          </span>
          <div className="flex gap-2">
            {(["de", "fr", "en"] as Locale[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                className="rounded px-3 py-1.5 text-sm font-bold uppercase tracking-wider transition"
                style={{
                  backgroundColor:
                    locale === lang ? "var(--gold)" : "transparent",
                  color: locale === lang ? "var(--smoky-black)" : "var(--gold)",
                  border: "2px solid var(--gold)",
                }}
              >
                {localeLabels[lang]}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        {/* Titre menu */}
        <p
          className="mb-2 text-center text-sm font-bold uppercase tracking-[0.3em]"
          style={{ color: "var(--gold)" }}
        >
          {t("menu", locale)}
        </p>
        <div
          className="mx-auto mb-4 h-1 w-24"
          style={{ backgroundColor: "var(--gold)" }}
        />
        <h1 className="font-forum text-center text-4xl tracking-tight md:text-5xl">
          {menu.title}
        </h1>
        {menu.description && (
          <p
            className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed"
            style={{ color: "var(--quick-silver)" }}
          >
            {menu.description}
          </p>
        )}

        {/* Liste des produits – cartes style Graine-de-cafe */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {(menu.items ?? []).map((item) => (
            <article
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-3xl border-2 transition hover:border-[var(--gold)]"
              style={{
                backgroundColor: "var(--eerie-black-2)",
                borderColor: "var(--white-alpha-20)",
              }}
            >
              {item.imageUrl ? (
                <div className="relative aspect-square overflow-hidden bg-[var(--eerie-black-4)]">
                  <img
                    src={item.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)",
                    }}
                  />
                </div>
              ) : (
                <div
                  className="flex aspect-square items-center justify-center"
                  style={{
                    backgroundColor: "var(--eerie-black-4)",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              )}
              <div className="flex flex-1 flex-col p-6 text-center">
                <h2 className="font-forum text-2xl leading-tight text-white">
                  {item.name}
                </h2>
                {item.description && (
                  <p
                    className="mt-2 flex-1 text-sm leading-relaxed"
                    style={{ color: "var(--quick-silver)" }}
                  >
                    {item.description}
                  </p>
                )}
                {item.price != null && (
                  <p
                    className="mt-4 font-forum text-2xl font-medium"
                    style={{ color: "var(--gold)" }}
                  >
                    {Number(item.price).toFixed(2)} €
                  </p>
                )}
              </div>
            </article>
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
