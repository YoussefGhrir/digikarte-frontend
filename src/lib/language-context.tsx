"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Locale } from "./i18n";

const STORAGE_KEY = "digikarte-lang";

const defaultLocale = (): Locale => {
  if (typeof window === "undefined") return "fr";
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && ["de", "fr", "en"].includes(stored)) return stored;
  return "fr";
};

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    setLocaleState(defaultLocale());
  }, []);

  const setLocale = useCallback((value: Locale) => {
    setLocaleState(value);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, value);
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
