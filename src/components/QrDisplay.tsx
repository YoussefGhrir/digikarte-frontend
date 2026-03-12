"use client";

import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";

type QrDisplayProps = {
  menuId: number;
  menuSlug: string;
};

export function QrDisplay({ menuSlug }: QrDisplayProps) {
  const { locale } = useLanguage();

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://digikarte.de";

  const url = `${origin}/menu/${menuSlug}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    url
  )}`;

  const handleOpenNewTab = () => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section className="rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900/80 via-neutral-950/90 to-neutral-900/80 p-6 shadow-inner shadow-black/50">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-forum text-2xl text-neutral-50">
            {t("menuQrTitle", locale)}
          </h2>
          <p className="mt-2 max-w-md text-sm text-neutral-300">
            {t("menuQrSubtitle", locale)}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="rounded-2xl bg-neutral-950/70 px-3 py-2 text-xs text-emerald-200 border border-emerald-500/40">
              <span className="font-mono text-[11px] break-all">{url}</span>
            </div>
            <button
              type="button"
              onClick={handleOpenNewTab}
              className="inline-flex cursor-pointer items-center justify-center rounded-full border border-amber-500/80 bg-amber-500/10 px-4 py-1.5 text-[11px] font-semibold text-amber-200 hover:bg-amber-500 hover:text-neutral-950 transition"
            >
              {t("menuQrOpenLink", locale)}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-3 md:mt-0">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.8)]">
            <img
              src={qrSrc}
              alt={t("menuQrTitle", locale)}
              className="h-56 w-56 rounded-xl bg-white p-2"
            />
          </div>
          <p className="text-xs text-neutral-500">
            {t("menuQrScanHint", locale)}
          </p>
        </div>
      </div>
    </section>
  );
}

