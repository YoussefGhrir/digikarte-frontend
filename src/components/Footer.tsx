"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";
import { prefixWithLocale } from "@/lib/locale-path";

export default function Footer() {
  const { locale } = useLanguage();
  return (
    <footer className="border-t border-neutral-800/70 bg-black/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-4 text-[11px] text-neutral-400 md:flex-row md:items-center md:justify-between">
        <p className="text-[10px] text-neutral-500">
          © {new Date().getFullYear()} DigiKarte. Alle Rechte vorbehalten.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={prefixWithLocale("/impressum", locale)}
            className="transition-colors hover:text-amber-300"
          >
            Impressum
          </Link>
          <span className="h-3 w-px bg-neutral-700" />
          <Link
            href={prefixWithLocale("/datenschutz", locale)}
            className="transition-colors hover:text-amber-300"
          >
            Datenschutzerklärung
          </Link>
          <span className="h-3 w-px bg-neutral-700" />
          <Link href={prefixWithLocale("/agb", locale)} className="transition-colors hover:text-amber-300">
            AGB
          </Link>
          <span className="h-3 w-px bg-neutral-700" />
          <span className="text-[10px] text-neutral-500">
            Digitale Speisekarte – ausgelegt für deutsches Recht*
          </span>
        </div>
      </div>
    </footer>
  );
}
