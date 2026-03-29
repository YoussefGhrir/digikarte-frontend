"use client";

import { useAuth } from "@/lib/auth-context";
import { localeLabels, t, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { prefixWithLocale } from "@/lib/locale-path";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { MenuTemplateClassic } from "@/components/menu-templates/MenuTemplateClassic";
import { getDemoMenuPublicDto } from "@/components/menu-templates/utils";

export default function LandingPage({ syncLocale }: { syncLocale?: Locale }) {
  const { user, loading } = useAuth();
  const { locale, setLocale } = useLanguage();
  const router = useRouter();

  const languages: Locale[] = ["de", "fr", "en"];
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  // Ajuste l'aperçu du menu pour qu'il "remplisse" la hauteur de la carte (min(420px,72vh)).
  // Le template utilise `min-h-screen` => sa hauteur "non-scalée" ~= hauteur d'écran.
  const [heroDemoMenuScale, setHeroDemoMenuScale] = useState(() => {
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    const scale = Math.min(0.72, 420 / (h || 1));
    return Math.max(0.35, Math.min(0.72, scale));
  });
  const heroPreviewOuterRef = useRef<HTMLDivElement | null>(null);
  const heroPreviewInnerRef = useRef<HTMLDivElement | null>(null);
  const heroDemoMenuScaleRef = useRef(heroDemoMenuScale);
  const heroUpdateScaleFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    heroDemoMenuScaleRef.current = heroDemoMenuScale;
  }, [heroDemoMenuScale]);

  useEffect(() => {
    if (syncLocale) setLocale(syncLocale);
  }, [syncLocale, setLocale]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    const outerEl = heroPreviewOuterRef.current;
    const innerEl = heroPreviewInnerRef.current;
    if (!outerEl || !innerEl) return;

    // On limite le scale pour éviter des extrêmes, mais on laisse passer > 1 si besoin.
    const clamp = (v: number) => Math.max(0.35, Math.min(1.2, v));

    const updateScaleFromMeasurement = () => {
      const outerRect = outerEl.getBoundingClientRect();
      const outerH = outerRect.height;
      const outerW = outerRect.width;
      if (!outerH) return;

      // Mesure robuste :
      // - on force temporairement `scale(1)` sur l'élément preview
      // - on mesure sa hauteur "base"
      // - on calcule ensuite le scale pour remplir `outerH`
      const prevTransform = innerEl.style.transform;

      innerEl.style.transform = "translateX(-50%) scale(1)";
      const baseH = innerEl.getBoundingClientRect().height;
      innerEl.style.transform = prevTransform;

      if (!baseH) return;

      const desired = outerH / baseH;
      const next = clamp(desired);

      if (Math.abs(next - heroDemoMenuScaleRef.current) > 0.01) {
        setHeroDemoMenuScale(next);
      }
    };

    heroUpdateScaleFnRef.current = updateScaleFromMeasurement;

    updateScaleFromMeasurement();
    window.addEventListener("resize", updateScaleFromMeasurement);

    // Certaines variations de "zoom" navigateur ne déclenchent pas toujours `resize` de façon fiable.
    // On surveille donc aussi `innerHeight` et `devicePixelRatio` via un petit polling léger.
    let lastH = Math.round(window.innerHeight);
    let lastDpr = Math.round(window.devicePixelRatio * 100) / 100;
    const timer = window.setInterval(() => {
      const hNow = Math.round(window.innerHeight);
      const dprNow = Math.round(window.devicePixelRatio * 100) / 100;
      if (hNow !== lastH || dprNow !== lastDpr) {
        lastH = hNow;
        lastDpr = dprNow;
        heroUpdateScaleFnRef.current?.();
      }
    }, 450);

    return () => {
      window.removeEventListener("resize", updateScaleFromMeasurement);
      window.clearInterval(timer);
      heroUpdateScaleFnRef.current = null;
    };
  }, [locale]);

  const heroDemoMenu = useMemo(() => getDemoMenuPublicDto("classic", locale), [locale]);

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
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
      {/* Background publicitaire */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.16),_transparent_55%)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('/bg-landing.png')] bg-cover bg-center opacity-10" />

      {/* Barre haute : logo + langue + auth + thème */}
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-700 bg-white shadow-md ring-0 outline-none">
            <Image
              src="/digikarte-logo.png"
              alt="DigiKarte"
              fill
              sizes="44px"
              className="object-contain p-1.5"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate font-forum text-lg tracking-wide text-amber-600 dark:text-amber-400 sm:text-xl">
              DigiKarte
            </p>
            <p className="truncate text-[10px] uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400 sm:text-[11px] sm:tracking-[0.25em]">
              {t("landingBrandTagline", locale)}
            </p>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex items-center gap-1 rounded-full border border-neutral-300 dark:border-neutral-800 bg-neutral-100 dark:bg-black/75 px-2.5 py-1.5 text-[10px] text-neutral-800 dark:text-neutral-200 shadow-lg backdrop-blur transition hover:border-emerald-500 dark:hover:border-emerald-400/70 hover:text-neutral-900 dark:hover:text-neutral-50 sm:gap-1.5 sm:px-3 sm:text-[11px]"
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
                        router.push(`/${lang}/`);
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
              href={prefixWithLocale("/dashboard", locale)}
              className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-medium text-emerald-800 dark:text-emerald-100 hover:bg-emerald-500/20 sm:px-3.5 sm:text-[11px]"
            >
              {t("headerDashboardButton", locale)}
            </Link>
          )}

          <Link
            href={prefixWithLocale("/login", locale)}
            className="rounded-full border border-neutral-400 dark:border-neutral-700 px-3 py-1.5 text-[10px] font-medium text-neutral-700 dark:text-neutral-200 hover:border-amber-500/70 hover:bg-amber-500/10 sm:px-3.5 sm:text-[11px]"
          >
            {t("ctaLogin", locale)}
          </Link>
          <Link
            href={prefixWithLocale("/register", locale)}
            className="rounded-full bg-amber-400 px-3.5 py-1.5 text-[11px] font-semibold text-neutral-900 shadow-[0_18px_45px_rgba(251,191,36,0.45)] hover:bg-amber-300 sm:px-4 sm:text-xs"
          >
            {t("ctaGetStarted", locale)}
          </Link>
        </div>
      </header>

      {/* HERO principal : texte + carte QR moderne */}
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 overflow-x-hidden px-6 pb-20 pt-8 md:pt-10">
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
                href={prefixWithLocale("/register", locale)}
                className="rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-neutral-900 shadow-[0_20px_60px_rgba(251,191,36,0.6)] hover:bg-amber-300"
              >
                {t("heroPrimaryCta", locale)}
              </Link>
              <Link
                href={prefixWithLocale("/menu/demo", locale)}
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

          {/* Colonne droite : aperçu plus clair + gros QR (responsive) */}
          <div className="relative flex flex-col items-center justify-center gap-6 md:flex-row md:items-start md:justify-end">
            <div className="absolute -inset-10 rounded-[2.5rem] bg-gradient-to-br from-amber-400/35 via-fuchsia-500/15 to-emerald-400/25 blur-2xl" />

            <div className="w-full md:max-w-[420px]">
              <Link
                href={prefixWithLocale("/menu/demo", locale)}
                className="group relative z-10 block w-full max-w-[420px] -rotate-6 transition-transform duration-300 hover:-rotate-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                aria-label={t("heroSecondaryCta", locale)}
              >
                <div className="relative overflow-hidden rounded-[2.5rem] border border-neutral-700/80 bg-neutral-950 shadow-[0_35px_90px_rgba(0,0,0,0.9)] ring-1 ring-white/5 transition group-hover:border-amber-500/35 group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.95)]">
                  <div
                    ref={heroPreviewOuterRef}
                    className="pointer-events-none relative h-[min(420px,72vh)] w-full overflow-hidden"
                  >
                    <div
                      ref={heroPreviewInnerRef}
                      className="menu-preview-root absolute left-1/2 top-0 w-[min(110vw,900px)] origin-top"
                      style={{
                        transform: `translateX(-50%) scale(${heroDemoMenuScale})`,
                      }}
                    >
                      <MenuTemplateClassic menu={heroDemoMenu} locale={locale} />
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
                  <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-500 transition group-hover:text-amber-400/90">
                    {t("heroCardTag", locale)}
                  </p>
                </div>
              </Link>
            </div>

            <div className="w-full md:w-auto">
              <HeroQrCard locale={locale} />
            </div>
          </div>
        </section>

        <div className="w-full">
          <aside
            className="relative overflow-hidden rounded-2xl border border-amber-500/15 bg-white/60 px-3.5 py-3 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-md dark:border-amber-400/10 dark:bg-neutral-950/40 dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] sm:px-4 sm:py-3.5"
            aria-label={t("landingMenuSetupNoteLabel", locale)}
          >
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400/80 via-amber-500/50 to-emerald-500/60 dark:from-amber-300/70 dark:via-amber-400/40 dark:to-emerald-400/50"
              aria-hidden
            />
            <div className="flex gap-3 pl-2 sm:gap-3.5 sm:pl-2.5">
              <span
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-neutral-200/80 bg-neutral-50/90 text-neutral-500 dark:border-neutral-700/80 dark:bg-neutral-900/80 dark:text-neutral-400"
                aria-hidden
              >
                <span className="flex items-end gap-0.5">
                  <svg
                    width="14"
                    height="20"
                    viewBox="0 0 14 20"
                    fill="none"
                    className="text-amber-600/90 dark:text-amber-400/80"
                    aria-hidden
                  >
                    <rect
                      x="1"
                      y="1"
                      width="12"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    />
                    <circle cx="7" cy="16" r="0.75" fill="currentColor" />
                  </svg>
                  <svg
                    width="22"
                    height="16"
                    viewBox="0 0 22 16"
                    fill="none"
                    className="text-emerald-600/85 dark:text-emerald-400/75"
                    aria-hidden
                  >
                    <rect
                      x="1"
                      y="2"
                      width="20"
                      height="12"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.25"
                    />
                    <path d="M4 14.5h14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </svg>
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-700/90 dark:text-amber-300/85">
                  {t("landingMenuSetupNoteLabel", locale)}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-neutral-600 dark:text-neutral-300 sm:text-sm sm:leading-relaxed">
                  {t("landingMenuSetupNoteBody", locale)}
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Section avantages */}
        <section className="mt-10 space-y-8 md:mt-14">
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

        {/* Section explication : ajouter et personnaliser (visuels du projet) */}
        <section className="space-y-10">
          <div className="text-center md:text-left">
            <h2 className="font-forum text-2xl text-neutral-900 dark:text-neutral-50 md:text-3xl">
              {t("explainHowTitle", locale)}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t("explainHowSubtitle", locale)}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <ExplainCard
              locale={locale}
              step={1}
              title={t("explainAddOrgTitle", locale)}
              text={t("explainAddOrgText", locale)}
              variant="org"
            />
            <ExplainCard
              locale={locale}
              step={2}
              title={t("explainPersonalizeTitle", locale)}
              text={t("explainPersonalizeText", locale)}
              variant="menu"
            />
            <ExplainCard
              locale={locale}
              step={3}
              title={t("explainQrTitle", locale)}
              text={t("explainQrText", locale)}
              variant="qr"
            />
          </div>
        </section>

        {/* Section Tarifs / Essai gratuit – bloc pub */}
        <section className="border-t border-neutral-200/60 pt-8 dark:border-neutral-800/60 md:border-0 md:pt-0">
          <div className="overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-neutral-50 via-amber-50/30 to-emerald-50/20 px-5 py-6 shadow-xl dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 md:px-8 md:py-8">
            <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-center">
              {/* Colonne texte + plans */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-amber-700 dark:text-amber-300">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
                    {t("pricingTitle", locale)}
                  </p>
                  <h2 className="font-forum text-2xl text-neutral-900 dark:text-neutral-50 md:text-3xl">
                    {t("pricingTitle", locale)}
                  </h2>
                  <p className="max-w-xl text-sm text-neutral-700 dark:text-neutral-300">
                    {t("pricingSubtitle", locale)}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md">
                    {t("pricingTrialNote", locale)}
                  </p>
                </div>

                {/* Cartes des trois rythmes */}
                <div className="grid gap-4 md:grid-cols-3">
                  {/* Mensuel */}
                  <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-600/70 bg-gradient-to-br from-neutral-950 via-neutral-925 to-neutral-900 p-4 shadow-lg shadow-emerald-500/25 transition-transform duration-200 hover:-translate-y-1 hover:shadow-emerald-500/40">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-neutral-400">
                      {t("subscriptionPlanMonthly", locale)}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-forum text-3xl text-neutral-50">9,99 €</span>
                      <span className="text-xs text-neutral-500">
                        {t("pricingPerMonthShort", locale)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-neutral-400">
                      {t("subscriptionMonthlyHint", locale)}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-neutral-300">
                      <li>• {t("subscriptionFeatureUnlimitedMenus", locale)}</li>
                      <li>• {t("subscriptionFeatureQr", locale)}</li>
                      <li>• {t("subscriptionFeatureSupport", locale)}</li>
                    </ul>
                    <Link
                      href={prefixWithLocale("/register", locale)}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-2 text-xs font-semibold text-neutral-900 shadow-[0_14px_30px_rgba(16,185,129,0.55)] transition hover:-translate-y-0.5 hover:bg-emerald-300 md:mt-auto"
                    >
                      {t("pricingCtaChoosePlan", locale)}
                    </Link>
                  </article>

                  {/* Semestriel – recommandé */}
                  <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-500/80 bg-neutral-950/95 p-4 pt-8 shadow-lg shadow-amber-500/25 transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-amber-500/40">
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-neutral-900">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-neutral-900" />
                      {t("subscriptionBadgePopular", locale)}
                    </div>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-amber-300">
                      {t("subscriptionPlanSemiannual", locale)}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-forum text-3xl text-neutral-50">49 €</span>
                      <span className="text-xs text-neutral-400">
                        {t("pricingPer6MonthsShort", locale)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-300">
                      {t("subscriptionSemiannualSaving", locale)}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {t("subscriptionSemiannualHint", locale)}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-neutral-300">
                      <li>• {t("subscriptionFeatureUnlimitedMenus", locale)}</li>
                      <li>• {t("subscriptionFeatureQr", locale)}</li>
                      <li>• {t("subscriptionFeatureSupport", locale)}</li>
                    </ul>
                    <Link
                      href={prefixWithLocale("/register", locale)}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-4 py-2 text-xs font-semibold text-neutral-900 shadow-[0_14px_30px_rgba(251,191,36,0.5)] transition hover:-translate-y-0.5 hover:bg-amber-300 md:mt-auto"
                    >
                      {t("pricingCtaChoosePlan", locale)}
                    </Link>
                  </article>

                  {/* Annuel */}
                  <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-500/80 bg-gradient-to-br from-neutral-950 to-neutral-900 p-4 pt-8 shadow-lg shadow-emerald-500/25 transition-transform duration-200 hover:-translate-y-1 hover:shadow-emerald-500/40">
                    <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-neutral-900">
                      {t("subscriptionBadgeBest", locale)}
                    </div>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-300">
                      {t("subscriptionPlanYearly", locale)}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-forum text-3xl text-neutral-50">89 €</span>
                      <span className="text-xs text-neutral-400">
                        {t("pricingPerYearShort", locale)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-emerald-300">
                      {t("subscriptionYearlySaving", locale)}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {t("subscriptionYearlyHint", locale)}
                    </p>
                    <ul className="mt-3 space-y-1.5 text-[11px] text-neutral-300">
                      <li>• {t("subscriptionFeatureUnlimitedMenus", locale)}</li>
                      <li>• {t("subscriptionFeatureQr", locale)}</li>
                      <li>• {t("subscriptionFeatureSupport", locale)}</li>
                    </ul>
                    <Link
                      href={prefixWithLocale("/register", locale)}
                      className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-2 text-xs font-semibold text-neutral-900 shadow-[0_14px_30px_rgba(16,185,129,0.5)] transition hover:-translate-y-0.5 hover:bg-emerald-300 md:mt-auto"
                    >
                      {t("pricingCtaChoosePlan", locale)}
                    </Link>
                  </article>
                </div>
              </div>

              {/* Colonne visuel pub (produit + marque) */}
              <div className="relative flex items-center justify-center">
                <div className="pointer-events-none absolute -inset-10 rounded-[2.5rem] bg-gradient-to-br from-amber-400/35 via-fuchsia-500/15 to-emerald-400/25 blur-2xl" />
                <div className="relative flex w-full max-w-[360px] flex-col gap-3 rounded-[2.2rem] border border-neutral-700/70 bg-neutral-950/95 p-4 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
                        DigiKarte
                      </p>
                      <p className="mt-1 text-xs text-neutral-500">
                        {t("landingBrandTagline", locale)}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                      {t("subscriptionPlanSemiannual", locale)}
                    </span>
                  </div>

                  <div className="mt-2 space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/90 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-forum text-lg text-neutral-50">
                          {t("heroCardItem1Title", locale)}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">
                          {t("heroCardItem1Text", locale)}
                        </p>
                      </div>
                      <p className="font-forum text-xl text-amber-300 whitespace-nowrap">
                        9,99 €
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-forum text-lg text-neutral-50">
                          {t("heroCardItem2Title", locale)}
                        </p>
                        <p className="mt-1 text-[11px] text-neutral-400">
                          {t("heroCardItem2Text", locale)}
                        </p>
                      </div>
                      <p className="font-forum text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300 whitespace-nowrap">
                        {t("subscriptionPlanSemiannual", locale)} / {t("subscriptionPlanYearly", locale)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[1.2fr_minmax(0,1fr)]">
                    <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-[11px] text-emerald-100">
                      <p className="font-semibold uppercase tracking-[0.24em]">
                        3 Tage Test
                      </p>
                      <p className="mt-1 text-xs">
                        {t("subscriptionSubtitle", locale)}
                      </p>
                    </div>
                    <div className="flex items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-900/90 p-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-300">
                        QR&nbsp;MENÜ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                href={prefixWithLocale("/register", locale)}
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

function ExplainCard({
  locale,
  step,
  title,
  text,
  variant,
}: {
  locale: Locale;
  step: number;
  title: string;
  text: string;
  variant: "org" | "menu" | "qr";
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 p-5 shadow-lg transition hover:border-amber-500/30 dark:hover:border-amber-500/30 hover:shadow-xl">
      <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 bg-gradient-to-bl from-amber-400/10 to-transparent dark:from-amber-400/5" />
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-200">
        {step}
      </span>
      <div className="mt-4 flex min-h-[100px] items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 p-3">
        {variant === "org" && <ExplainVisualOrg />}
        {variant === "menu" && <ExplainVisualMenu locale={locale} />}
        {variant === "qr" && <ExplainVisualQr locale={locale} />}
      </div>
      <h3 className="mt-4 font-forum text-lg text-neutral-900 dark:text-neutral-50">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{text}</p>
    </div>
  );
}

function ExplainVisualOrg() {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white shadow-sm">
        <Image
          src="/digikarte-logo.png"
          alt=""
          fill
          sizes="48px"
          className="object-contain p-1.5"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">Mon Restaurant</p>
        <p className="text-[10px] text-neutral-500 dark:text-neutral-400">1 menu · QR actif</p>
      </div>
    </div>
  );
}

function ExplainVisualMenu({ locale }: { locale: Locale }) {
  return (
    <div className="w-full space-y-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-2">
      <div className="flex justify-between gap-2">
        <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300">{t("heroCardItem1Title", locale)}</span>
        <span className="text-[10px] font-forum text-amber-600 dark:text-amber-400">4,90 €</span>
      </div>
      <div className="flex justify-between gap-2">
        <span className="text-[10px] font-medium text-neutral-700 dark:text-neutral-300">{t("heroCardItem2Title", locale)}</span>
        <span className="text-[10px] font-forum text-emerald-600 dark:text-emerald-400">9,50 €</span>
      </div>
    </div>
  );
}

function ExplainVisualQr({ locale }: { locale: Locale }) {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://digi-karte.com";
  const url = `${origin}${prefixWithLocale("/menu/demo", locale)}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(url)}`;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white p-1 shadow-sm">
        <img src={qrSrc} alt="" loading="lazy" decoding="async" className="h-14 w-14 rounded-md" />
      </div>
      <span className="text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">QR</span>
    </div>
  );
}

function HeroQrCard({ locale }: { locale: Locale }) {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : "https://digi-karte.com";

  const demoUrl = `${origin}${prefixWithLocale("/menu/demo", locale)}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(demoUrl)}`;

  const scanText =
    locale === "de"
      ? "Scannen für das Demo-Menü"
      : locale === "fr"
        ? "Scannez pour le menu démo"
        : "Scan to view the demo menu";

  return (
    <Link
      href={prefixWithLocale("/menu/demo", locale)}
      className="group relative block rounded-[2rem] border border-neutral-300/30 bg-white/85 p-4 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-amber-500/40 dark:bg-neutral-950/60 dark:border-neutral-800/70 md:p-5"
      aria-label={scanText}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-700 dark:text-neutral-200">
          QR MENU
        </p>
        <span className="inline-flex items-center rounded-full bg-amber-400/15 px-3 py-1 text-[10px] font-semibold text-amber-800 dark:text-amber-300">
          {t("heroBadge1Title", locale)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-center">
        <div className="h-28 w-28 rounded-2xl border border-neutral-200/70 bg-white p-2 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-950/70 sm:h-32 sm:w-32">
          <img
            src={qrSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-xl object-contain"
          />
        </div>
      </div>

      <p className="mt-3 text-center text-xs font-medium text-neutral-900 dark:text-neutral-100">
        {scanText}
      </p>
      <p className="mt-1 text-center text-[10px] text-neutral-500 dark:text-neutral-400">
        {t("heroSecondaryCta", locale)}
      </p>
    </Link>
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
