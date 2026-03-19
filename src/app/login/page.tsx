"use client";

import { useAuth } from "@/lib/auth-context";
import { localeLabels, t, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { API_BASE, isApiError } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
export default function LoginPage() {
  const { login, token } = useAuth();
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const GOOGLE_LOGIN_URL = `${API_BASE}/api/auth/google/login-url`;

  useEffect(() => {
    if (token) {
      router.replace("/dashboard");
      return;
    }

    const googleError = searchParams.get("googleError");
    if (googleError === "OAUTH_FAILED") {
      setError(t("authErrorGeneric", locale));
    }

    const googleToken = searchParams.get("googleToken");
    const emailParam = searchParams.get("email");
    const justRegistered = searchParams.get("justRegistered") === "1";

    if (googleToken) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", googleToken);

        if (emailParam) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              userId: 0,
              email: emailParam,
              nom: "",
              prenom: "",
              subscriptionBypass: false,
              admin: false,
              superAdmin: false,
            })
          );
        }
      }

      router.replace(justRegistered ? "/dashboard/subscription" : "/dashboard");
    }
  }, [token, router, searchParams, locale]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      if (isApiError(err) && err.code === "INVALID_CREDENTIALS") {
        setError(t("authErrorInvalidCredentials", locale));
      } else {
        setError(t("authErrorGeneric", locale));
      }
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-950 to-neutral-900 text-neutral-50">
      {/* Retour accueil */}
      <div className="absolute left-4 top-4 z-30 md:left-6 md:top-5">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/60 px-3 py-1.5 text-[11px] font-medium text-emerald-200 shadow-lg backdrop-blur transition hover:border-emerald-400 hover:bg-emerald-900/40 hover:text-emerald-100"
        >
          <span aria-hidden>←</span>
          {t("authBackToHome", locale)}
        </Link>
      </div>
      {/* Sélecteur de langue global, toujours visible en haut à droite */}
      <div className="pointer-events-none absolute right-4 top-4 z-30 flex justify-end md:right-6 md:top-5">
        <div className="pointer-events-auto flex items-center gap-2">
          <div
            ref={langRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-black/75 px-3 py-1.5 text-[11px] text-neutral-200 shadow-lg shadow-black/40 backdrop-blur transition hover:border-emerald-400/70 hover:text-neutral-50"
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
              <div className="absolute right-0 z-40 mt-1 w-40 rounded-2xl border border-neutral-800 bg-neutral-950/95 p-1 text-[11px] shadow-xl shadow-black/60">
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
                        ? "bg-emerald-500/15 text-emerald-200"
                        : "text-neutral-300 hover:bg-neutral-900 hover:text-neutral-50"
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
      </div>

      <div className="grid min-h-screen grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        {/* Bandeau visuel gauche */}
        <div className="relative hidden overflow-hidden border-b border-neutral-900 bg-black/90 md:block md:border-b-0 md:border-r">
          <Image
            src="/bg-menu-dark.png"
            alt="Fond DigiKarte"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-emerald-900/30" />
          <div className="relative flex h-full flex-col justify-between px-8 pt-24 pb-10 md:px-10 md:pt-28 lg:px-14 lg:pt-32">
            <div className="space-y-10 md:space-y-12">
              <div className="flex items-center gap-6 md:gap-8">
                <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-[2.4rem] border-2 border-emerald-400/80 bg-white shadow-lg shadow-emerald-900/30">
                  <Image
                    src="/digikarte-logo.png"
                    alt="Logo DigiKarte"
                    fill
                    sizes="96px"
                    className="object-contain p-2.5 md:p-3"
                  />
                </div>
                <div className="leading-tight min-w-0">
                  <p className="font-forum text-3xl md:text-4xl tracking-[0.22em] text-emerald-400">
                    DIGIKARTE
                  </p>
                  <p className="mt-3 text-[11px] md:text-xs font-medium italic tracking-wide text-cyan-200/95">
                    {t("authSlogan", locale)}
                  </p>
                </div>
              </div>
              <div className="max-w-md space-y-3">
                <p className="font-forum text-2xl md:text-[2rem] text-emerald-50/95">
                  {t("heroSubtitle", locale)}
                </p>
                <p className="text-sm text-emerald-200/70">
                  {t("feature3Text", locale)}
                </p>
              </div>
            </div>
            <div className="mt-6 text-[10px] md:text-xs text-neutral-500">
              <p>© {new Date().getFullYear()} DigiKarte. Tous droits réservés.</p>
            </div>
          </div>
        </div>

        {/* Formulaire droite */}
        <div className="flex items-center justify-center px-4 pt-20 pb-10 md:px-8 md:pt-10 lg:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-4 md:hidden">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-3xl border-2 border-emerald-400/80 bg-white shadow-md">
                <Image
                  src="/digikarte-logo.png"
                  alt="DigiKarte"
                  fill
                  sizes="48px"
                  className="object-contain p-2"
                />
              </div>
              <div className="min-w-0">
                <p className="font-forum text-2xl tracking-[0.24em] text-emerald-400">
                  DIGIKARTE
                </p>
                <p className="mt-1.5 text-[11px] font-medium italic tracking-wide text-cyan-200/90">
                  {t("authSlogan", locale)}
                </p>
              </div>
            </div>

            <div className="mb-8 space-y-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-200">
                <span className="inline-block h-1 w-1 rounded-full bg-emerald-400" />
                {t("authLoginKicker", locale)}
              </p>
              <h1 className="font-forum text-3xl text-neutral-50">
                {t("authLoginTitle", locale)}
              </h1>
              <p className="text-sm text-neutral-400">
                {t("authLoginSubtitle", locale)}
              </p>
            </div>

            {/* Bouton \"Continuer avec Google\" */}
            <div className="mb-5">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `${GOOGLE_LOGIN_URL}?lang=${locale}&source=login`
                    );
                    const data = (await res.json()) as { url?: string };
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      setError(t("authErrorGeneric", locale));
                    }
                  } catch {
                    setError(t("authErrorGeneric", locale));
                  }
                }}
                className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-neutral-700 bg-white px-4 py-2.75 text-sm font-semibold text-neutral-900 shadow-[0_12px_40px_rgba(0,0,0,0.85)] transition hover:-translate-y-0.5 hover:border-neutral-500 hover:bg-neutral-50"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                    <path fill="#EA4335" d="M12 11.3v3.6h5.1c-.2 1.1-.8 2.1-1.8 2.7l2.9 2.2c1.7-1.6 2.8-3.9 2.8-6.6 0-.6-.1-1.2-.2-1.8H12z" />
                    <path fill="#34A853" d="M6.6 13.8l-.9.7-2.3 1.8C4.7 19.7 8.1 22 12 22c2.4 0 4.5-.8 6-2.2l-2.9-2.2c-.8.5-1.8.8-3.1.8-2.4 0-4.5-1.6-5.2-3.8z" />
                    <path fill="#4A90E2" d="M3.4 8.7C2.8 10 2.8 11.5 3.4 12.8c.7 2.2 2.8 3.8 5.2 3.8 1.3 0 2.4-.3 3.1-.8v-3.9H6.6z" />
                    <path fill="#FBBC05" d="M6.6 8.2 9.1 10c.7-.4 1.6-.7 2.9-.7 1.7 0 3.3.6 4.4 1.7l2.6-2.6C17.9 6.9 15.6 6 12 6 8.1 6 4.7 8.3 3.4 11l3.2-2.8z" />
                  </svg>
                </span>
                <span>{t("authGoogleButton", locale)}</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-900/70 bg-red-950/70 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-[26px] border border-neutral-900/80 bg-neutral-950/90 p-6 shadow-[0_18px_55px_rgba(0,0,0,0.9)] backdrop-blur-sm md:p-7"
            >
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-amber-300"
                  >
                    {t("authEmailLabel", locale)}
                  </label>
                  <input
                    id="email"
                    // L'admin peut se connecter avec "gharghour" (sans "@"),
                    // donc on évite la validation HTML native "type=email".
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-neutral-800/80 bg-neutral-900/70 px-3.5 py-2.75 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 transition focus:border-emerald-400 focus:bg-neutral-900 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.65)] focus:outline-none"
                    placeholder={t("authBusinessEmailPlaceholder", locale)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.2em] text-amber-300"
                  >
                    {t("authPasswordLabel", locale)}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-neutral-800/80 bg-neutral-900/70 px-3.5 py-2.75 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 transition focus:border-emerald-400 focus:bg-neutral-900 focus:shadow-[0_0_0_1px_rgba(52,211,153,0.65)] focus:outline-none"
                    placeholder={t("authPasswordPlaceholder", locale)}
                  />
                  <p className="mt-1 text-[11px] text-neutral-500">
                    {t("authPasswordHint", locale)}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1.5 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-400/95 px-4 py-2.75 text-sm font-semibold text-neutral-900 shadow-[0_16px_40px_rgba(16,185,129,0.45)] transition hover:-translate-y-0.5 hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-60"
              >
                {loading
                  ? `${t("authLoginButton", locale)}…`
                  : t("authLoginButton", locale)}
              </button>

              <p className="pt-3 text-center text-xs text-neutral-500">
                {t("authNoAccount", locale)}{" "}
                <Link
                  href="/register"
                  className="font-medium text-emerald-300 hover:text-emerald-200"
                >
                  {t("authGoRegister", locale)}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
