"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { prefixWithLocale } from "@/lib/locale-path";

type FooterProps = {
  /** Intégré dans le scroll dashboard : pas de double bordure, liens plus grands. */
  variant?: "default" | "dashboard";
};

export default function Footer({ variant = "default" }: FooterProps) {
  const { locale } = useLanguage();
  const isDash = variant === "dashboard";

  return (
    <footer
      className={
        isDash
          ? "bg-black/40"
          : "border-t border-neutral-800/70 bg-black/60"
      }
    >
      <div
        className={`mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 text-neutral-400 md:flex-row md:items-center md:justify-between md:gap-6 ${
          isDash ? "py-6 sm:py-8" : "px-6 py-5 md:py-6"
        }`}
      >
        <p className={`text-neutral-500 ${isDash ? "text-xs sm:text-sm" : "text-xs"}`}>
          © {new Date().getFullYear()} DigiKarte. Alle Rechte vorbehalten.
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 sm:gap-x-3">
          <Link
            href={prefixWithLocale("/impressum", locale)}
            className={`inline-flex min-h-[44px] items-center rounded-lg text-amber-200/90 transition-colors hover:bg-neutral-800/80 hover:text-amber-300 ${
              isDash ? "px-3 py-2 text-sm font-medium sm:text-base" : "px-2 py-1.5 text-sm"
            }`}
          >
            Impressum
          </Link>
          <span className="hidden h-4 w-px bg-neutral-700 sm:inline" />
          <Link
            href={prefixWithLocale("/datenschutz", locale)}
            className={`inline-flex min-h-[44px] items-center rounded-lg text-amber-200/90 transition-colors hover:bg-neutral-800/80 hover:text-amber-300 ${
              isDash ? "px-3 py-2 text-sm font-medium sm:text-base" : "px-2 py-1.5 text-sm"
            }`}
          >
            Datenschutzerklärung
          </Link>
          <span className="hidden h-4 w-px bg-neutral-700 sm:inline" />
          <Link
            href={prefixWithLocale("/agb", locale)}
            className={`inline-flex min-h-[44px] items-center rounded-lg text-amber-200/90 transition-colors hover:bg-neutral-800/80 hover:text-amber-300 ${
              isDash ? "px-3 py-2 text-sm font-medium sm:text-base" : "px-2 py-1.5 text-sm"
            }`}
          >
            AGB
          </Link>
          <span className="hidden h-4 w-px bg-neutral-700 sm:inline" />
          <span
            className={`w-full text-neutral-500 sm:w-auto ${isDash ? "text-[11px] leading-snug sm:text-xs" : "text-[11px]"}`}
          >
            Digitale Speisekarte – ausgelegt für deutsches Recht*
          </span>
        </div>
      </div>
    </footer>
  );
}
