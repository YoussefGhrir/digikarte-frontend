"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Locale } from "./i18n";

const STORAGE_KEY = "digikarte-lang";

const validLocales: Locale[] = ["de", "fr", "en"];

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && validLocales.includes(value as Locale);
}

function getCookieValue(name: string): string | null {
  if (typeof window === "undefined") return null;

  const all = window.document.cookie; // e.g. "k=v; other=x"
  if (!all) return null;

  // Simple cookie parsing (no decoding needed for our controlled values).
  const parts = all.split(";").map((p) => p.trim());
  for (const part of parts) {
    const [k, ...rest] = part.split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

function setCookieValue(name: string, value: string) {
  if (typeof window === "undefined") return;

  const maxAgeSeconds = 60 * 60 * 24 * 365 * 2; // 2 years
  const secure = window.location.protocol === "https:";
  const cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/; samesite=lax${
    secure ? "; secure" : ""
  }`;
  window.document.cookie = cookie;
}

const defaultLocale = (): Locale => {
  if (typeof window === "undefined") return "en";

  const stored = localStorage.getItem(STORAGE_KEY);
  if (isLocale(stored)) return stored;

  const cookie = getCookieValue(STORAGE_KEY);
  if (isLocale(cookie)) return cookie;

  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("fr")) return "fr";
  return "en";
};

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? defaultLocale());

  useEffect(() => {
    if (initialLocale === undefined) {
      setLocaleState(defaultLocale());
    }
  }, [initialLocale]);

  const setLocale = useCallback((value: Locale) => {
    setLocaleState(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value);
      setCookieValue(STORAGE_KEY, value);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
