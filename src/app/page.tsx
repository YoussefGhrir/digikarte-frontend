"use client";

import { useAuth } from "@/lib/auth-context";
import { localeLabels, t, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading, token } = useAuth();
  const { locale, setLocale } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && token) {
      router.replace("/dashboard");
    }
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="text-sm tracking-[0.3em] text-neutral-400 uppercase">
          Chargement…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Top bar avec langue + login/register */}
      <header className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-2xl border border-amber-500/60 bg-neutral-900">
            <Image
              src="/digikarte-logo.png"
              alt="DigiKarte"
              fill
              className="object-contain p-1.5"
            />
          </div>
          <div className="leading-tight">
            <p className="font-forum text-xl tracking-wide text-amber-400">
              DigiKarte
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-500">
              Digital menu platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-neutral-700 bg-neutral-900/60 px-2 py-1 text-xs text-neutral-300 sm:flex">
            {(["de", "fr", "en"] as Locale[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLocale(lang)}
                className={`rounded-full px-2 py-0.5 transition ${
                  locale === lang
                    ? "bg-amber-500 text-neutral-900"
                    : "text-neutral-300 hover:text-neutral-50"
                }`}
              >
                {localeLabels[lang]}
              </button>
            ))}
          </div>
          <Link
            href="/login"
            className="hidden rounded-full border border-neutral-700 px-4 py-1.5 text-xs font-medium text-neutral-200 hover:border-amber-500/70 hover:bg-amber-500/10 sm:inline-block"
          >
            {t("ctaLogin", locale)}
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-neutral-900 shadow hover:bg-amber-400"
          >
            {t("ctaGetStarted", locale)}
          </Link>
        </div>
      </header>

      {/* HERO + sections fonctionnalités */}
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-10 md:py-16">
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
              QR Menu · SaaS
            </p>
            <h1 className="font-forum text-4xl tracking-tight text-neutral-50 md:text-5xl">
              {t("heroTitle", locale)}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-300">
              {t("heroSubtitle", locale)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-neutral-900 shadow-lg shadow-amber-500/30 hover:bg-amber-400"
              >
                {t("ctaGetStarted", locale)}
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-neutral-700 px-6 py-2 text-sm font-medium text-neutral-200 hover:border-amber-500/70 hover:bg-amber-500/5"
              >
                {t("ctaLogin", locale)}
              </Link>
            </div>
            <div className="mt-8 grid gap-4 text-xs text-neutral-400 sm:grid-cols-3">
              <div>
                <p className="text-sm font-semibold text-neutral-100">
                  3 langues
                </p>
                <p>Deutsch · Français · English</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-100">
                  QR multi-modèles
                </p>
                <p>Pour tables, flyers et stickers.</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-100">
                  Backend Spring Boot
                </p>
                <p>Sécurisé avec JWT & MySQL.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-amber-500/20 via-transparent to-emerald-500/10 blur-2xl" />
            <div className="relative rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-xl shadow-black/40">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400">
                Aperçu en temps réel
              </p>
              <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-forum text-lg text-neutral-50">
                    Café Latte
                  </span>
                  <span className="font-forum text-lg text-amber-300">
                    4.50 €
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Espresso doux, lait velouté, parfait pour commencer la
                  journée.
                </p>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-xs text-neutral-300">
                  <p className="font-semibold text-neutral-100">
                    Organisations
                  </p>
                  <p className="mt-1 text-2xl font-forum text-amber-300">
                    3
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Gère plusieurs lieux : restaurant, bar, coffee shop…
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-3 text-xs text-neutral-300">
                  <p className="font-semibold text-neutral-100">QR actifs</p>
                  <p className="mt-1 text-2xl font-forum text-emerald-300">
                    12
                  </p>
                  <p className="mt-1 text-[11px] text-neutral-500">
                    Un QR par menu, instantanément à jour après chaque
                    modification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="font-forum text-2xl text-neutral-50">
            Pourquoi DigiKarte ?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title={t("feature1Title", locale)}
              text={t("feature1Text", locale)}
            />
            <FeatureCard
              title={t("feature2Title", locale)}
              text={t("feature2Text", locale)}
            />
            <FeatureCard
              title={t("feature3Title", locale)}
              text={t("feature3Text", locale)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 text-sm text-neutral-300 shadow-sm shadow-black/40">
      <h3 className="font-forum text-lg text-neutral-50">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-neutral-400">{text}</p>
    </div>
  );
}
