"use client";

import RegisterPage from "../../register/page";
import type { Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { useEffect } from "react";

export default function RegisterByLocale({
  params,
}: {
  params: { lng: Locale };
}) {
  const { setLocale } = useLanguage();

  useEffect(() => {
    setLocale(params.lng);
  }, [params.lng, setLocale]);

  return <RegisterPage />;
}

