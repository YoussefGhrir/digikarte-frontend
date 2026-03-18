"use client";

import { QrDoorPoster, QrTableSticker } from "@/components/qr-print";
import { QR_THEME_IDS, type QrThemeId } from "@/components/qr-display/constants";
import { menuGet, menuQrUrl, orgGet, type MenuDto, type OrganizationDto } from "@/lib/api";
import {
  captureElementAsPng,
  generatePosterPdfFromDom,
  generateStickerPdfFromDom,
  sanitizeFilename,
} from "@/lib/qr-pdf-from-dom";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/** Couleur d’accent par défaut (or) pour Sticker & Plakat. */
const DEFAULT_ACCENT_GOLD = "#d4af37";

const THEME_ACCENT_HEX: Record<QrThemeId, string> = {
  amber: "#b45309",
  slate: "#475569",
  emerald: "#10b981",
  violet: "#7c3aed",
  rose: "#ec4899",
  stone: "#78716c",
};

/** Couleurs d’accent supplémentaires pour le contour (Sticker & Plakat). */
const EXTRA_ACCENT_COLORS: { hex: string; labelKey: "menuQrAccentSky" | "menuQrAccentTeal" | "menuQrAccentOrange" | "menuQrAccentBlue" }[] = [
  { hex: "#0ea5e9", labelKey: "menuQrAccentSky" },
  { hex: "#14b8a6", labelKey: "menuQrAccentTeal" },
  { hex: "#f97316", labelKey: "menuQrAccentOrange" },
  { hex: "#0284c7", labelKey: "menuQrAccentBlue" },
];

function normalizeHex(hex: string): string {
  const s = String(hex).trim().replace(/^#/, "");
  if (/^[0-9A-Fa-f]{6}$/.test(s)) return `#${s.toLowerCase()}`;
  if (/^[0-9A-Fa-f]{3}$/.test(s)) return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`.toLowerCase();
  return hex;
}

function accentColorForPicker(hex: string): string {
  const n = normalizeHex(hex);
  return n.length === 7 ? n : DEFAULT_ACCENT_GOLD;
}

const IconImage = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const IconPdf = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6zm2-8h8v2H8v-2zm0 4h5v2H8v-2z" />
  </svg>
);
const IconCopy = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const IconLink = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);
const IconQr = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
  </svg>
);

const FONT_OPTIONS: { id: string; labelKey: "menuQrFontSans" | "menuQrFontSerif"; fontFamily: string }[] = [
  { id: "sans", labelKey: "menuQrFontSans", fontFamily: "var(--font-geist-sans), system-ui, sans-serif" },
  { id: "serif", labelKey: "menuQrFontSerif", fontFamily: "var(--font-forum), Georgia, serif" },
];

function normalizeLogoDataUrl(raw: string | null | undefined): string | null {
  if (!raw || !String(raw).trim()) return null;
  const s = String(raw).trim();
  if (s.startsWith("data:image/")) return s;
  return `data:image/jpeg;base64,${s}`;
}

const QR_DESIGN_STORAGE_KEY = "digikarte-qr-design";

interface QrDesignSaved {
  accentColor?: string;
  customStickerCta?: string;
  fontFamily?: string;
  stickerBackgroundColor?: string;
  posterBackgroundColor?: string;
}

function getQrDesignStorageKey(orgId: unknown, menuId: number): string | null {
  if (typeof orgId !== "string" || !orgId || isNaN(menuId)) return null;
  return `${QR_DESIGN_STORAGE_KEY}-${orgId}-${menuId}`;
}

function loadQrDesignFromStorage(orgId: unknown, menuId: number): QrDesignSaved | null {
  if (typeof window === "undefined") return null;
  const key = getQrDesignStorageKey(orgId, menuId);
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as QrDesignSaved;
  } catch {
    return null;
  }
}

function saveQrDesignToStorage(orgId: unknown, menuId: number, design: QrDesignSaved): void {
  if (typeof window === "undefined") return;
  const key = getQrDesignStorageKey(orgId, menuId);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(design));
  } catch {
    // quota or disabled
  }
}

export default function MenuQrPage() {
  const params = useParams();
  const { locale } = useLanguage();
  const orgId = params.id;
  const menuId = Number(params.menuId);
  const [menu, setMenu] = useState<MenuDto | null>(null);
  const [org, setOrg] = useState<OrganizationDto | null>(null);
  const [menuUrl, setMenuUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [accentColor, setAccentColor] = useState<string>(DEFAULT_ACCENT_GOLD);
  const [customStickerCta, setCustomStickerCta] = useState("");
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0].fontFamily);
  const [imageStickerLoading, setImageStickerLoading] = useState(false);
  const [imagePosterLoading, setImagePosterLoading] = useState(false);
  const [pdfStickerLoading, setPdfStickerLoading] = useState(false);
  const [pdfPosterLoading, setPdfPosterLoading] = useState(false);
  /** Fond de la carte sticker (hex) */
  const [stickerBackgroundColor, setStickerBackgroundColor] = useState<string>("");
  /** Fond de l'affiche porte (hex) */
  const [posterBackgroundColor, setPosterBackgroundColor] = useState<string>("");
  /** Icône affiche porte : restaurant (fourchette/couteau), café (tasse), les deux */
  const [posterIconType, setPosterIconType] = useState<"restaurant" | "cafe" | "both">("restaurant");
  const stickerPrintRef = useRef<HTMLDivElement>(null);
  const posterPrintRef = useRef<HTMLDivElement>(null);
  const stickerPrintContainerRef = useRef<HTMLDivElement>(null);
  const posterPrintContainerRef = useRef<HTMLDivElement>(null);
  /** Aperçu visible (fallback si la couche cachée n’est pas capturée par html2canvas) */
  const stickerPreviewRef = useRef<HTMLDivElement>(null);
  const posterPreviewRef = useRef<HTMLDivElement>(null);

  /** Restaurer le design sauvegardé au montage (refresh / reconnexion) */
  const isFirstSaveRef = useRef(true);
  useEffect(() => {
    isFirstSaveRef.current = true;
    const saved = loadQrDesignFromStorage(orgId, menuId);
    if (!saved) return;
    if (saved.accentColor != null) setAccentColor(saved.accentColor);
    if (saved.customStickerCta != null) setCustomStickerCta(saved.customStickerCta);
    if (saved.fontFamily != null) {
      const valid = FONT_OPTIONS.some((o) => o.fontFamily === saved.fontFamily);
      if (valid) setFontFamily(saved.fontFamily as string);
    }
    if (saved.stickerBackgroundColor != null) setStickerBackgroundColor(saved.stickerBackgroundColor);
    if (saved.posterBackgroundColor != null) setPosterBackgroundColor(saved.posterBackgroundColor);
  }, [orgId, menuId]);

  /** Mémoriser le design à chaque modification (ne pas écraser au 1er rendu avec les défauts) */
  useEffect(() => {
    if (isFirstSaveRef.current) {
      isFirstSaveRef.current = false;
      return;
    }
    saveQrDesignToStorage(orgId, menuId, {
      accentColor,
      customStickerCta,
      fontFamily,
      stickerBackgroundColor,
      posterBackgroundColor,
    });
  }, [orgId, menuId, accentColor, customStickerCta, fontFamily, stickerBackgroundColor, posterBackgroundColor]);

  const load = useCallback(async () => {
    if (!menuId || isNaN(menuId)) return;
    try {
      const [data, qr] = await Promise.all([menuGet(menuId), menuQrUrl(menuId)]);
      setMenu(data);
      setMenuUrl(qr.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [menuId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!successMessage) return;
    const timeoutId = setTimeout(() => setSuccessMessage(""), 5000);
    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  useEffect(() => {
    if (!menu?.organizationId) return;
    orgGet(menu.organizationId)
      .then((o) => setOrg(o))
      .catch(() => setOrg(null));
  }, [menu?.organizationId]);

  const effectiveMenuUrl =
    menuUrl ??
    (typeof window !== "undefined"
      ? `${window.location.origin}/menu/${menu?.slug ?? ""}`
      : `https://digikarte.de/menu/${menu?.slug ?? ""}`);

  /** Capture la couche impression (taille réelle) pour éviter recadrage et artefacts. */
  const handleDownloadStickerImage = useCallback(async () => {
    if (!org) return;
    const el = stickerPrintRef.current as HTMLElement | null;
    if (!el) return;
    setImageStickerLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await document.fonts.ready;
      const blob = await captureElementAsPng(el, { backgroundColor: "#ffffff", scale: 4 });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `digikarte-stickers-${sanitizeFilename(org.name)}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccessMessage(t("menuQrImageSuccessStickers", locale));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image konnte nicht erstellt werden.");
    } finally {
      setImageStickerLoading(false);
    }
  }, [org, locale]);

  /** Capture la couche impression (taille réelle) pour PDF propre. */
  const handleDownloadStickerPdf = useCallback(async () => {
    if (!org) return;
    const el = stickerPrintRef.current as HTMLElement | null;
    if (!el) return;
    setPdfStickerLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await document.fonts.ready;
      const blob = await generateStickerPdfFromDom(el, `digikarte-stickers-${sanitizeFilename(org.name)}.pdf`, { scale: 4 });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `digikarte-stickers-${sanitizeFilename(org.name)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccessMessage(t("menuQrPdfSuccessStickers", locale));
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF konnte nicht erstellt werden.");
    } finally {
      setPdfStickerLoading(false);
    }
  }, [org, locale]);

  /** Capture la couche impression (taille réelle 520×740) pour éviter recadrage, chevauchement et erreur PDF. */
  const handleDownloadPosterImage = useCallback(async () => {
    if (!org) return;
    const el = posterPrintRef.current as HTMLElement | null;
    if (!el) return;
    setImagePosterLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await document.fonts.ready;
      const blob = await captureElementAsPng(el, { backgroundColor: null, scale: 4 });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `digikarte-affiche-${sanitizeFilename(org.name)}.png`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccessMessage(t("menuQrImageSuccessPoster", locale));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image konnte nicht erstellt werden.");
    } finally {
      setImagePosterLoading(false);
    }
  }, [org, locale]);

  /** Capture la couche impression (taille réelle) pour PDF propre, sans recadrage. */
  const handleDownloadPosterPdf = useCallback(async () => {
    if (!org) return;
    const el = posterPrintRef.current as HTMLElement | null;
    if (!el) return;
    setPdfPosterLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await document.fonts.ready;
      const blob = await generatePosterPdfFromDom(el, `digikarte-affiche-${sanitizeFilename(org.name)}.pdf`, { scale: 4 });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `digikarte-affiche-${sanitizeFilename(org.name)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setSuccessMessage(t("menuQrPdfSuccessPoster", locale));
    } catch (e) {
      setError(e instanceof Error ? e.message : "PDF konnte nicht erstellt werden.");
    } finally {
      setPdfPosterLoading(false);
    }
  }, [org, locale]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 text-center">
        <p className="text-stone-500">{t("orgLoading", locale)}</p>
      </div>
    );
  }
  if (!menu) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-sm text-red-200">
        {t("menuNotFound", locale)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-forum text-2xl text-neutral-50">{t("menuQrTab", locale)}</h1>
          <p className="mt-1 text-sm text-neutral-500">{t("menuQrPreviewHint", locale)}</p>
        </div>
        <Link
          href={`/dashboard/organisations/${orgId}/qr`}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-neutral-600 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-200 hover:bg-neutral-700"
        >
          {t("dashboardBack", locale)}
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2 text-sm text-emerald-200 flex items-center justify-between gap-3">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="shrink-0 rounded-lg px-2 py-1 text-emerald-300 hover:bg-emerald-800/50 transition"
            aria-label={t("menuQrPdfSuccessDismiss", locale)}
          >
            ×
          </button>
        </div>
      )}

      {!org ? (
        <p className="text-neutral-500">{t("loading", locale)}…</p>
      ) : (
        <>
          {/* Couche pour capture PDF (rendue hors écran, même contenu que l’aperçu) */}
          {menu && org && (
            <>
              <div
                ref={stickerPrintContainerRef}
                className="pointer-events-none fixed top-0 overflow-visible"
                style={{ left: -9999, width: 280, height: 400, visibility: "visible" }}
                aria-hidden
              >
                <div ref={stickerPrintRef}>
                  <QrTableSticker
                  qrValue={effectiveMenuUrl}
                  restaurantName={org.name}
                  logoUrl={org.organizationLogoBase64 ?? undefined}
                  accentColor={accentColor}
                  background="light"
                  scanCta={customStickerCta || undefined}
                  qrSize={180}
                  forPrint
                  fontFamily={fontFamily}
                  backgroundColor={stickerBackgroundColor || undefined}
                />
                </div>
              </div>
              <div
                ref={posterPrintContainerRef}
                className="pointer-events-none fixed top-0 overflow-visible"
                style={{ left: -9999, width: 520, height: 760, visibility: "visible" }}
                aria-hidden
              >
                <div ref={posterPrintRef}>
                  <QrDoorPoster
                    qrValue={effectiveMenuUrl}
                    restaurantName={org.name}
                    discoverOur={t("menuQrPosterDiscoverOur", locale)}
                    menuTitle={t("menuQrPosterMenu", locale)}
                    tapPhoneLabel={t("menuQrPosterTapPhone", locale)}
                    scanQrLabel={t("menuQrPosterScanQr", locale)}
                    orLabel={t("menuQrPosterOr", locale)}
                    logoUrl={org.organizationLogoBase64 ?? undefined}
                    accentColor={accentColor}
                    qrSize={260}
                    forPrint
                    fontFamily={fontFamily}
                    backgroundColor={posterBackgroundColor || undefined}
                    iconType={posterIconType}
                  />
                </div>
              </div>
            </>
          )}

          {/* Paramètres : titre + sous-titre + police (les phrases sont dans chaque bloc ci‑dessous) */}
          <div className="mb-6 rounded-2xl border border-neutral-700/80 bg-neutral-900/50 px-5 py-4 shadow-lg shadow-black/10">
            <h2 className="font-forum text-lg text-amber-200/95 tracking-tight">
              {t("menuQrParametersTitle", locale)}
            </h2>
            <p className="mt-1 text-xs text-neutral-400 max-w-xl">
              {t("menuQrParametersSubtitle", locale)}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-neutral-300">Police :</span>
              {FONT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFontFamily(opt.fontFamily)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    fontFamily === opt.fontFamily
                      ? "border-amber-500/60 bg-amber-500/20 text-amber-200"
                      : "border-neutral-600 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  }`}
                >
                  {t(opt.labelKey, locale)}
                </button>
              ))}
            </div>
          </div>

          {/* Aperçu + téléchargement PDF — paramètres (phrases) intégrés dans chaque bloc */}
          {menu && org && (
            <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="group rounded-2xl border border-neutral-700/80 bg-neutral-900/70 overflow-hidden shadow-xl shadow-black/25 transition hover:border-amber-500/30 hover:shadow-amber-500/5">
                <div className="border-b border-neutral-700/80 px-5 py-4 bg-neutral-950/60">
                    <h2 className="font-forum text-lg text-amber-200/95 tracking-tight">
                      {t("menuQrTemplateTables", locale)}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-1">
                      {t("menuQrPdfCardStickerSubtitle", locale)}
                    </p>
                </div>
                {/* Paramètre : phrase sous le QR (sticker) */}
                <div
                    className="mx-4 mt-4 rounded-xl px-4 py-3 space-y-3 border border-neutral-700/80"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      {t("menuQrPhraseSticker", locale)}
                    </span>
                    <input
                      type="text"
                      value={customStickerCta}
                      onChange={(e) => setCustomStickerCta(e.target.value)}
                      placeholder={t("menuQrStickerCta", locale)}
                      className="w-full rounded-lg border border-neutral-600 bg-neutral-800/90 px-3 py-2.5 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-amber-500/50 focus:outline-none"
                    />
                  </label>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      {t("menuQrStickerBgLabel", locale)}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="color"
                        value={stickerBackgroundColor || "#ffffff"}
                        onChange={(e) => setStickerBackgroundColor(e.target.value)}
                        className="h-9 w-12 cursor-pointer rounded border border-neutral-600 bg-neutral-800"
                        title={t("menuQrStickerBgLabel", locale)}
                      />
                      <input
                        type="text"
                        value={stickerBackgroundColor}
                        onChange={(e) => setStickerBackgroundColor(e.target.value)}
                        placeholder="#ffffff"
                        className="w-24 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-2 text-sm text-neutral-200 placeholder:text-neutral-500"
                      />
                      <button
                        type="button"
                        onClick={() => setStickerBackgroundColor("")}
                        className="rounded-lg border border-neutral-600 bg-neutral-800 px-2.5 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-700"
                      >
                        {t("menuQrDefault", locale)}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Aperçu sticker */}
                <div className="p-4 flex items-center justify-center bg-neutral-950/90 overflow-hidden" style={{ height: 260, minHeight: 260 }}>
                  <div className="flex items-center justify-center w-[220px] h-[240px] shrink-0" aria-hidden>
                    <div ref={stickerPreviewRef} className="flex items-center justify-center origin-center" style={{ transform: "scale(0.62)" }}>
                      <QrTableSticker
                        qrValue={effectiveMenuUrl}
                        restaurantName={org.name}
                        logoUrl={org.organizationLogoBase64 ?? undefined}
                        accentColor={accentColor}
                        background="light"
                        scanCta={customStickerCta || undefined}
                        qrSize={180}
                        fontFamily={fontFamily}
                        backgroundColor={stickerBackgroundColor || undefined}
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t border-neutral-700/80 p-4 bg-neutral-950/50 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={imageStickerLoading}
                    onClick={handleDownloadStickerImage}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/15 px-4 py-2.5 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25 disabled:opacity-50 transition"
                  >
                    <IconImage />
                    {imageStickerLoading ? t("loading", locale) + "…" : t("menuQrDownloadImage", locale)}
                  </button>
                  <button
                    type="button"
                    disabled={pdfStickerLoading}
                    onClick={handleDownloadStickerPdf}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/15 px-4 py-2.5 text-sm font-medium text-red-200 hover:bg-red-500/25 disabled:opacity-50 transition"
                  >
                    <IconPdf />
                    {pdfStickerLoading ? t("loading", locale) + "…" : t("menuQrDownloadPdf", locale)}
                  </button>
                </div>
              </section>
              <section className="group rounded-2xl border border-neutral-700/80 bg-neutral-900/70 overflow-hidden shadow-xl shadow-black/25 transition hover:border-amber-500/30 hover:shadow-amber-500/5">
                <div className="border-b border-neutral-700/80 px-5 py-4 bg-neutral-950/60">
                  <h2 className="font-forum text-lg text-amber-200/95 tracking-tight">
                    {t("menuQrTemplateDoor", locale)}
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    {t("menuQrPdfCardPosterSubtitle", locale)}
                  </p>
                </div>
                {/* Paramètres : fond + type d’icône (affiche porte) */}
                <div
                  className="mx-4 mt-4 rounded-xl px-4 py-3 space-y-3 border border-neutral-700/80"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      {t("menuQrPosterIconType", locale)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(["restaurant", "cafe", "both"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setPosterIconType(type)}
                          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                            posterIconType === type
                              ? "border-amber-500/60 bg-amber-500/20 text-amber-200"
                              : "border-neutral-600 bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                          }`}
                        >
                          {t(`menuQrPosterIcon${type.charAt(0).toUpperCase() + type.slice(1)}` as "menuQrPosterIconRestaurant", locale)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 block mb-1.5">
                      {t("menuQrPosterBgLabel", locale)}
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        type="color"
                        value={posterBackgroundColor || "#171717"}
                        onChange={(e) => setPosterBackgroundColor(e.target.value)}
                        className="h-9 w-12 cursor-pointer rounded border border-neutral-600 bg-neutral-800"
                        title={t("menuQrPosterBgLabel", locale)}
                      />
                      <input
                        type="text"
                        value={posterBackgroundColor}
                        onChange={(e) => setPosterBackgroundColor(e.target.value)}
                        placeholder="#171717"
                        className="w-24 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-2 text-sm text-neutral-200 placeholder:text-neutral-500"
                      />
                      <button
                        type="button"
                        onClick={() => setPosterBackgroundColor("")}
                        className="rounded-lg border border-neutral-600 bg-neutral-800 px-2.5 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-700"
                      >
                        {t("menuQrDefault", locale)}
                      </button>
                    </div>
                  </div>
                </div>
                {/* Aperçu affiche porte — pas de div vide entre carte et boutons */}
                <div className="p-4 flex items-center justify-center bg-neutral-950/90 overflow-hidden" style={{ height: 260, minHeight: 260 }}>
                  <div className="flex items-center justify-center w-[220px] h-[240px] shrink-0" aria-hidden>
                    <div ref={posterPreviewRef} className="flex items-center justify-center origin-center" style={{ transform: "scale(0.324)" }}>
                      <QrDoorPoster
                        qrValue={effectiveMenuUrl}
                        restaurantName={org.name}
                        discoverOur={t("menuQrPosterDiscoverOur", locale)}
                        menuTitle={t("menuQrPosterMenu", locale)}
                        tapPhoneLabel={t("menuQrPosterTapPhone", locale)}
                        scanQrLabel={t("menuQrPosterScanQr", locale)}
                        orLabel={t("menuQrPosterOr", locale)}
                        logoUrl={org.organizationLogoBase64 ?? undefined}
                        accentColor={accentColor}
                        qrSize={260}
                        fontFamily={fontFamily}
                        backgroundColor={posterBackgroundColor || undefined}
                        iconType={posterIconType}
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t border-neutral-700/80 p-4 bg-neutral-950/50 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={imagePosterLoading}
                    onClick={handleDownloadPosterImage}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/15 px-4 py-2.5 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25 disabled:opacity-50 transition"
                  >
                    <IconImage />
                    {imagePosterLoading ? t("loading", locale) + "…" : t("menuQrDownloadImage", locale)}
                  </button>
                  <button
                    type="button"
                    disabled={pdfPosterLoading}
                    onClick={handleDownloadPosterPdf}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/15 px-4 py-2.5 text-sm font-medium text-red-200 hover:bg-red-500/25 disabled:opacity-50 transition"
                  >
                    <IconPdf />
                    {pdfPosterLoading ? t("loading", locale) + "…" : t("menuQrDownloadPdf", locale)}
                  </button>
                </div>
              </section>
            </div>

            {/* Couleur contour / titre (Sticker & Plakat) + personnalisée */}
            <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-neutral-700/80 bg-neutral-900/60 px-4 py-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-3">
                {t("menuQrColorsPrint", locale)}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                <button type="button" onClick={() => setAccentColor(DEFAULT_ACCENT_GOLD)} title="Gold" className={`h-8 w-8 rounded-full border-2 transition ${normalizeHex(accentColor) === normalizeHex(DEFAULT_ACCENT_GOLD) ? "border-amber-400 ring-2 ring-amber-400/50" : "border-neutral-600 hover:border-neutral-500"}`} style={{ backgroundColor: DEFAULT_ACCENT_GOLD }} aria-label="Gold" />
                {QR_THEME_IDS.map((id) => (
                  <button key={id} type="button" onClick={() => setAccentColor(THEME_ACCENT_HEX[id])} title={t(`qrTheme${id.charAt(0).toUpperCase() + id.slice(1)}` as "qrThemeAmber", locale)} className={`h-8 w-8 rounded-full border-2 transition ${normalizeHex(accentColor) === normalizeHex(THEME_ACCENT_HEX[id]) ? "border-amber-400 ring-2 ring-amber-400/50" : "border-neutral-600 hover:border-neutral-500"}`} style={{ backgroundColor: THEME_ACCENT_HEX[id] }} aria-label={t(`qrTheme${id.charAt(0).toUpperCase() + id.slice(1)}` as "qrThemeAmber", locale)} />
                ))}
                {EXTRA_ACCENT_COLORS.map(({ hex, labelKey }) => (
                  <button key={hex} type="button" onClick={() => setAccentColor(hex)} title={t(labelKey, locale)} className={`h-8 w-8 rounded-full border-2 transition ${normalizeHex(accentColor) === normalizeHex(hex) ? "border-amber-400 ring-2 ring-amber-400/50" : "border-neutral-600 hover:border-neutral-500"}`} style={{ backgroundColor: hex }} aria-label={t(labelKey, locale)} />
                ))}
              </div>
              <div className="w-full max-w-xs flex flex-wrap items-center justify-center gap-2 border-t border-neutral-700/80 pt-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 w-full text-center mb-1">
                  {t("menuQrAccentCustom", locale)}
                </span>
                <input
                  type="color"
                  value={accentColorForPicker(accentColor)}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border border-neutral-600 bg-neutral-800"
                  title={t("menuQrAccentCustom", locale)}
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => {
                    const v = e.target.value.trim();
                    if (v === "") setAccentColor(DEFAULT_ACCENT_GOLD);
                    else if (/^#[0-9A-Fa-f]{3,6}$/.test(v) || /^[0-9A-Fa-f]{3,6}$/.test(v)) setAccentColor(v.startsWith("#") ? v : `#${v}`);
                  }}
                  placeholder="#d4af37"
                  className="w-24 rounded-lg border border-neutral-700 bg-neutral-800 px-2.5 py-2 text-sm text-neutral-200 placeholder:text-neutral-500"
                />
                <button
                  type="button"
                  onClick={() => setAccentColor(DEFAULT_ACCENT_GOLD)}
                  className="rounded-lg border border-neutral-600 bg-neutral-800 px-2.5 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-700"
                >
                  {t("menuQrDefault", locale)}
                </button>
              </div>
            </div>
            </>
          )}

          {/* Lien du menu + QR neutre (pour designer ou impression sans design) */}
          {menu && org && (
            <div className="rounded-2xl border border-neutral-700/80 bg-neutral-900/60 px-5 py-4 shadow-xl shadow-black/20">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <IconLink className="w-4 h-4 text-violet-400" />
                    {t("menuQrLinkForDesigner", locale)}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(effectiveMenuUrl);
                        setError("");
                        setSuccessMessage(t("menuQrCopyLinkSuccess", locale));
                      } catch {
                        setError("Copie impossible");
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-violet-500/50 bg-violet-500/15 px-4 py-2.5 text-sm font-medium text-violet-200 hover:bg-violet-500/25 transition"
                  >
                    <IconCopy />
                    {t("menuQrCopyLink", locale)}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <IconQr className="w-4 h-4 text-amber-400" />
                    {t("menuQrNeutralQr", locale)}
                  </span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
                          effectiveMenuUrl
                        )}&format=png`;
                        const res = await fetch(qrApiUrl);
                        const blob = await res.blob();
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `qr-menu-${sanitizeFilename(org.name)}.png`;
                        a.click();
                        URL.revokeObjectURL(url);
                        setError("");
                        setSuccessMessage(t("menuQrNeutralQrSuccess", locale));
                      } catch (e) {
                        setError(e instanceof Error ? e.message : "Téléchargement QR impossible.");
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/15 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-500/25 transition"
                  >
                    <IconImage />
                    {t("menuQrDownloadNeutralQr", locale)}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
