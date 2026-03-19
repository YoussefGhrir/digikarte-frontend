"use client";

import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import {
  normalizeQrThemeId,
  QR_THEMES,
  type QrDisplayTemplateId,
  type QrThemeId,
} from "@/components/qr-display/constants";

function normalizeLogoDataUrl(raw: string | null | undefined): string | null {
  if (!raw || !String(raw).trim()) return null;
  const s = String(raw).trim();
  if (s.startsWith("data:image/")) return s;
  return `data:image/jpeg;base64,${s}`;
}

export type QrDisplayProps = {
  menuId?: number;
  menuSlug: string;
  qrSize?: number;
  /** Afficher uniquement si présent (jamais de placeholder moche). */
  organizationLogoBase64?: string | null;
  organizationName?: string | null;
  template?: QrDisplayTemplateId;
  theme?: QrThemeId;
};

export function QrDisplay({
  menuSlug,
  qrSize = 220,
  organizationLogoBase64,
  organizationName,
  template = "classic",
  theme: themeId = "amber",
}: QrDisplayProps) {
  const { locale } = useLanguage();
  const size = Math.min(Math.max(qrSize, 120), 400);
  const theme = QR_THEMES[normalizeQrThemeId(themeId)];
  const logoDataUrl = normalizeLogoDataUrl(organizationLogoBase64);
  const showLogo = Boolean(logoDataUrl);

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://digi-karte.com";

  const url = `${origin}/menu/${menuSlug}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;

  const handleOpenNewTab = () => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      className={`rounded-3xl border ${theme.border} bg-gradient-to-r ${theme.bg} p-6 shadow-xl shadow-black/30 backdrop-blur-sm`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          {showLogo && (
            <div className="mb-4 flex justify-start">
              <div className="relative h-14 w-14 overflow-hidden rounded-2xl border-2 border-white/20 bg-white shadow-lg">
                <img
                  src={logoDataUrl!}
                  alt=""
                  className="h-full w-full object-contain p-1"
                />
              </div>
            </div>
          )}
          <h2 className={`font-forum text-2xl tracking-tight ${theme.text}`}>
            {t("menuQrTitle", locale)}
          </h2>
          <p className={`mt-2 max-w-md text-sm leading-relaxed ${theme.textMuted}`}>
            {t("menuQrSubtitle", locale)}
          </p>
          <p className={`mt-1 max-w-md text-xs ${theme.accentMuted}`}>
            {t("menuQrPermanentHint", locale)}
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <div
              className={`rounded-xl ${theme.urlBg} px-3 py-2.5 border ${theme.urlBorder}`}
            >
              <span className={`font-mono text-[11px] break-all ${theme.urlText}`}>
                {url}
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenNewTab}
              className={`inline-flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2.5 text-xs font-semibold transition hover:opacity-90 ${theme.urlBorder} ${theme.urlBg} ${theme.urlText}`}
            >
              {t("menuQrOpenLink", locale)}
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 md:shrink-0 md:pl-6">
          <div
            className={`rounded-2xl ${theme.bgCard} border ${theme.border} p-4 shadow-2xl shadow-black/40`}
          >
            <img
              src={qrSrc}
              alt={t("menuQrTitle", locale)}
              className="rounded-xl bg-white p-2"
              style={{ width: size, height: size, minWidth: size, minHeight: size }}
            />
          </div>
          <p className={`text-center text-xs font-medium tracking-wide ${theme.textMuted}`}>
            {t("menuQrScanHint", locale)}
          </p>
        </div>
      </div>
    </section>
  );
}
