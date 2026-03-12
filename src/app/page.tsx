"use client";

import { useAuth } from "@/lib/auth-context";
import { localeLabels, t, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const { locale, setLocale } = useLanguage();

  const languages: Locale[] = ["de", "fr", "en"];
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="text-sm tracking-[0.3em] text-neutral-500 uppercase">
          {t("landingLoading", locale)}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Background publicitaire */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.16),_transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('/bg-landing.png')] bg-cover bg-center opacity-10" />

      {/* Barre haute : logo + langue + auth + thème */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white shadow-md ring-0 outline-none">
            <Image
              src="/digikarte-logo.png"
              alt="DigiKarte"
              fill
              sizes="44px"
              className="object-contain p-1.5"
            />
          </div>
          <div className="leading-tight">
            <p className="font-forum text-xl tracking-wide text-amber-600 dark:text-amber-400">
              DigiKarte
            </p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-600 dark:text-neutral-400">
              {t("landingBrandTagline", locale)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-black/75 px-3 py-1.5 text-[11px] text-neutral-800 dark:text-neutral-200 shadow-lg backdrop-blur transition hover:border-emerald-500 dark:hover:border-emerald-400/70 hover:text-neutral-900 dark:hover:text-neutral-50"
                aria-haspopup="true"
                aria-expanded={langOpen}
              >
                <FlagIcon code={locale} />
                <span className="hidden sm:inline">
                  {localeLabels[locale]}
                </span>
                <span className="text-[9px] sm:text-[10px]" aria-hidden>
                  {langOpen ? "▲" : "▼"}
                </span>
              </button>
              {langOpen && (
                <div className="absolute right-0 z-40 mt-1 w-40 rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950/95 p-1 text-[11px] shadow-xl">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLocale(lang);
                        setLangOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left transition ${
                        locale === lang
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-200"
                          : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-50"
                      }`}
                    >
                      <FlagIcon code={lang} />
                      <span>{localeLabels[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {user && (
            <Link
              href="/dashboard"
              className="hidden rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-100 hover:bg-emerald-500/20 sm:inline-block"
            >
              {t("headerDashboardButton", locale)}
            </Link>
          )}

          <Link
            href="/login"
            className="hidden rounded-full border border-neutral-400 dark:border-neutral-700 px-4 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:border-amber-500/70 hover:bg-amber-500/10 sm:inline-block"
          >
            {t("ctaLogin", locale)}
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-amber-400 px-4 py-1.5 text-xs font-semibold text-neutral-900 shadow-[0_18px_45px_rgba(251,191,36,0.45)] hover:bg-amber-300"
          >
            {t("ctaGetStarted", locale)}
          </Link>
        </div>
      </header>

      {/* HERO principal : texte + carte QR moderne */}
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-20 pt-8 md:pt-10">
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-center">
          {/* Colonne gauche : texte marketing */}
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-600 dark:text-amber-300/90">
              {t("heroKicker", locale)}
            </p>
            <h1 className="font-forum text-4xl tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl lg:text-[3.2rem]">
              {t("heroTitle", locale)}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              {t("heroSubtitle", locale)}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-neutral-900 shadow-[0_20px_60px_rgba(251,191,36,0.6)] hover:bg-amber-300"
              >
                {t("heroPrimaryCta", locale)}
              </Link>
              <Link
                href="/menu/demo"
                className="rounded-full border border-neutral-400 dark:border-neutral-700/80 bg-neutral-200 dark:bg-neutral-900/70 px-6 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-100 hover:border-amber-500/60 hover:bg-amber-500/5"
              >
                {t("heroSecondaryCta", locale)}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-5 text-xs text-neutral-600 dark:text-neutral-400">
              <HeroBadge
                variant="qr"
                title={t("heroBadge1Title", locale)}
                text={t("heroBadge1Text", locale)}
              />
              <HeroBadge
                variant="multi"
                title={t("heroBadge2Title", locale)}
                text={t("heroBadge2Text", locale)}
              />
              <HeroBadge
                variant="analytics"
                title={t("heroBadge3Title", locale)}
                text={t("heroBadge3Text", locale)}
              />
            </div>
          </div>

          {/* Colonne droite : carte menu + QR stylisé */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-10 rounded-[2.5rem] bg-gradient-to-br from-amber-400/35 via-fuchsia-500/15 to-emerald-400/25 blur-2xl" />
            <div className="relative flex h-[360px] w-full max-w-[380px] -rotate-6 flex-col gap-3 rounded-[2.5rem] border border-neutral-700/80 bg-neutral-950/90 p-4 shadow-[0_35px_90px_rgba(0,0,0,0.9)] backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-neutral-800/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-200">
                  {t("heroCardTag", locale)}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {t("heroCardTableChip", locale)}
                </span>
              </div>
              <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/90 p-4">
                <MenuItem
                  title={t("heroCardItem1Title", locale)}
                  text={t("heroCardItem1Text", locale)}
                  price="4.90 €"
                  accent="amber"
                />
                <MenuItem
                  title={t("heroCardItem2Title", locale)}
                  text={t("heroCardItem2Text", locale)}
                  price="9.50 €"
                  accent="emerald"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1.3fr_minmax(0,1fr)]">
                <StatCard
                  title={t("heroCardStat1Title", locale)}
                  value="3"
                  text={t("heroCardStat1Text", locale)}
                  accent="amber"
                />
                <div className="flex items-stretch gap-3">
                  <StatCard
                    title={t("heroCardStat2Title", locale)}
                    value="12"
                    text={t("heroCardStat2Text", locale)}
                    accent="emerald"
                  />
                  <QrPreview />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section avantages */}
        <section className="space-y-8">
          <h2 className="font-forum text-2xl text-neutral-900 dark:text-neutral-50 md:text-3xl">
            {t("sectionWhyTitle", locale)}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title={t("feature1Title", locale)}
              text={t("feature1Text", locale)}
              accent="amber"
            />
            <FeatureCard
              title={t("feature2Title", locale)}
              text={t("feature2Text", locale)}
              accent="emerald"
            />
            <FeatureCard
              title={t("feature3Title", locale)}
              text={t("feature3Text", locale)}
              accent="sky"
            />
          </div>
        </section>

        {/* Section parcours utilisateur */}
        <section className="space-y-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="font-forum text-2xl text-neutral-900 dark:text-neutral-50 md:text-3xl">
              {t("sectionFlowTitle", locale)}
            </h2>
            <p className="max-w-md text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t("sectionFlowText", locale)}
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <StepCard
              step="01"
              title={t("step1Title", locale)}
              text={t("step1Text", locale)}
            />
            <StepCard
              step="02"
              title={t("step2Title", locale)}
              text={t("step2Text", locale)}
            />
            <StepCard
              step="03"
              title={t("step3Title", locale)}
              text={t("step3Text", locale)}
            />
          </div>
        </section>

        {/* Call to action final */}
        <section className="overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-r from-neutral-100 via-neutral-50 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 px-6 py-8 shadow-lg md:px-10 md:py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600 dark:text-amber-300/90">
                {t("ctaFinalKicker", locale)}
              </p>
              <h3 className="mt-3 font-forum text-2xl text-neutral-900 dark:text-neutral-50 md:text-3xl">
                {t("ctaFinalTitle", locale)}
              </h3>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {t("ctaFinalText", locale)}
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link
                href="/register"
                className="rounded-full bg-amber-400 px-7 py-2.5 text-sm font-semibold text-neutral-900 shadow-[0_20px_60px_rgba(251,191,36,0.7)] hover:bg-amber-300"
              >
                {t("ctaGetStarted", locale)}
              </Link>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {t("ctaFinalNote", locale)}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  text,
  accent = "amber",
}: {
  title: string;
  text: string;
  accent?: "amber" | "emerald" | "sky";
}) {
  const accentTitleClass =
    accent === "amber"
      ? "text-amber-700 dark:text-amber-200"
      : accent === "emerald"
      ? "text-emerald-700 dark:text-emerald-200"
      : "text-sky-700 dark:text-sky-200";
  const borderClass =
    accent === "amber"
      ? "border-amber-500/25"
      : accent === "emerald"
      ? "border-emerald-500/25"
      : "border-sky-500/25";

  return (
    <div
      className={`rounded-2xl border bg-white/80 dark:bg-neutral-950/80 p-5 text-sm text-neutral-600 dark:text-neutral-300 shadow-sm ${borderClass}`}
    >
      <h3 className={`font-forum text-lg ${accentTitleClass}`}>{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{text}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/85 p-5 text-sm text-neutral-600 dark:text-neutral-300 shadow-sm">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),_transparent_60%)]" />
      <p className="text-xs font-semibold tracking-[0.3em] text-neutral-500">
        {step}
      </p>
      <h3 className="mt-2 font-forum text-lg text-neutral-900 dark:text-neutral-50">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{text}</p>
    </div>
  );
}

function HeroBadge({
  variant,
  title,
  text,
}: {
  variant: "qr" | "multi" | "analytics";
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <IconOrb variant={variant} />
      <div>
        <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">
          {title}
        </p>
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{text}</p>
      </div>
    </div>
  );
}

function MenuItem({
  title,
  text,
  price,
  accent,
}: {
  title: string;
  text: string;
  price: string;
  accent: "amber" | "emerald";
}) {
  const priceClass =
    accent === "amber" ? "text-amber-600 dark:text-amber-300" : "text-emerald-600 dark:text-emerald-300";
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="font-forum text-lg text-neutral-900 dark:text-neutral-50">{title}</p>
        <p className="mt-1 text-[11px] text-neutral-600 dark:text-neutral-400">{text}</p>
      </div>
      <p className={`font-forum text-xl ${priceClass} whitespace-nowrap`}>
        {price}
      </p>
    </div>
  );
}

function StatCard({
  title,
  value,
  text,
  accent,
}: {
  title: string;
  value: string;
  text: string;
  accent: "amber" | "emerald";
}) {
  const valueClass =
    accent === "amber" ? "text-amber-300" : "text-emerald-300";
  return (
    <div className="rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900/80 p-3 text-xs text-neutral-600 dark:text-neutral-300">
      <p className="font-semibold text-neutral-800 dark:text-neutral-100">{title}</p>
      <p className={`mt-1 text-2xl font-forum ${valueClass}`}>{value}</p>
      <p className="mt-1 text-[11px] text-neutral-500">{text}</p>
    </div>
  );
}

function QrPreview() {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://digikarte.de";

  const url = `${origin}/menu/demo`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    url,
  )}`;

  return (
    <div className="hidden h-full w-20 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-950/90 p-1.5 text-[9px] text-neutral-400 sm:flex">
      <div className="flex flex-col items-center gap-1.5">
        {/* Vrai QR code (image générée) */}
        <div className="relative h-12 w-12 rounded-[0.9rem] bg-neutral-900 p-1 shadow-[0_6px_14px_rgba(0,0,0,0.6)]">
          <img
            src={qrSrc}
            alt="QR code menu démo"
            className="h-full w-full rounded-[0.6rem] bg-white p-0.5"
          />
        </div>
        <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-400">
          QR MENU
        </span>
      </div>
    </div>
  );
}

function FlagIcon({ code }: { code: Locale }) {
  if (code === "de") {
    return (
      <span className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] ring-1 ring-neutral-800">
        <span className="h-full w-1/3 bg-black" />
        <span className="h-full w-1/3 bg-red-600" />
        <span className="h-full w-1/3 bg-yellow-400" />
      </span>
    );
  }
  if (code === "fr") {
    return (
      <span className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] ring-1 ring-neutral-800">
        <span className="h-full w-1/3 bg-blue-600" />
        <span className="h-full w-1/3 bg-white" />
        <span className="h-full w-1/3 bg-red-600" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] bg-blue-700 ring-1 ring-neutral-800">
      <span className="relative h-full w-full">
        <span className="absolute inset-y-0 left-1/2 w-1 bg-white -translate-x-1/2" />
        <span className="absolute inset-x-0 top-1/2 h-1 bg-white -translate-y-1/2" />
        <span className="absolute inset-y-0 left-1/2 w-0.5 bg-red-600 -translate-x-1/2" />
        <span className="absolute inset-x-0 top-1/2 h-0.5 bg-red-600 -translate-y-1/2" />
      </span>
    </span>
  );
}

function IconOrb({ variant }: { variant: "qr" | "multi" | "analytics" }) {
  const gradientClass =
    variant === "qr"
      ? "from-amber-400 via-orange-500 to-fuchsia-500"
      : variant === "multi"
      ? "from-emerald-400 via-cyan-400 to-sky-500"
      : "from-purple-400 via-indigo-400 to-sky-500";

  return (
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-2xl bg-neutral-900/80 shadow-[0_14px_35px_rgba(0,0,0,0.8)]" />
      <div
        className={`relative flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br ${gradientClass} text-[11px] font-semibold text-neutral-900`}
      >
        {variant === "qr" && "QR"}
        {variant === "multi" && "x3"}
        {variant === "analytics" && "%"}
      </div>
    </div>
  );
}
