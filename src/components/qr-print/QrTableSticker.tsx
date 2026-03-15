"use client";

import { QRCodeSVG } from "qrcode.react";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";

export type QrTableStickerBackground = "light" | "cream" | "dark" | "gradient";

export interface QrTableStickerProps {
  /** URL du menu (ex: https://digikarte.de/menu/abc123) */
  qrValue: string;
  restaurantName: string;
  /** Logo: URL ou data URL (base64) */
  logoUrl?: string | null;
  /** Couleur d'accent (ex: #b45309, #10b981, #ec4899) */
  accentColor?: string;
  background?: QrTableStickerBackground;
  /** Texte sous le QR (défaut: i18n menuQrStickerCta) */
  scanCta?: string;
  /** Taille du QR en px — 250–300 idéal pour impression */
  qrSize?: number;
  /** Pour export print / PDF : désactive les ombres */
  forPrint?: boolean;
  /** Police du nom et du CTA (CSS font-family) */
  fontFamily?: string;
  /** Couleur du texte CTA (sous le QR) */
  textColor?: string;
  /** Couleur de fond de la carte (hex) — optionnel, sinon selon background */
  backgroundColor?: string;
}

const ACCENT_DEFAULT = "#b45309";

function normalizeLogoSrc(raw: string | null | undefined): string | null {
  if (!raw || !String(raw).trim()) return null;
  const s = String(raw).trim();
  if (s.startsWith("data:image/") || s.startsWith("http")) return s;
  return `data:image/jpeg;base64,${s}`;
}

export function QrTableSticker({
  qrValue,
  restaurantName,
  logoUrl,
  accentColor = ACCENT_DEFAULT,
  background = "light",
  scanCta,
  qrSize = 180,
  forPrint = false,
  fontFamily = "var(--font-geist-sans), system-ui, sans-serif",
  textColor,
  backgroundColor: backgroundColorProp,
}: QrTableStickerProps) {
  const { locale } = useLanguage();
  const logoSrc = normalizeLogoSrc(logoUrl ?? null);
  const cta = (scanCta ?? t("menuQrStickerCta", locale)) || t("menuQrStickerCta", locale);

  const rootBg =
    backgroundColorProp
      ? backgroundColorProp
      : background === "dark"
        ? "#171717"
        : background === "gradient"
          ? "linear-gradient(to bottom right, #451a03 0%, #171717 50%, #0a0a0a 100%)"
          : background === "cream"
            ? "#faf8f5"
            : "#ffffff";
  const rootColor = background === "dark" || background === "gradient" ? "#ffffff" : "#171717";
  const qrWrapperBg = background === "light" || background === "cream" ? "#ffffff" : "rgba(255,255,255,0.95)";

  /** Avec fond coloré personnalisé : marges et padding explicites (comme affiche porte) pour bien séparer les blocs. */
  const hasCustomBg = Boolean(backgroundColorProp);
  const rootPadding = hasCustomBg ? 16 : 14;
  const nameBlockMargin = hasCustomBg ? 16 : 8;
  const qrBlockMargin = hasCustomBg ? 20 : 12;
  const nameBoxPadding = hasCustomBg ? { paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 } : { paddingTop: 6, paddingBottom: 6, paddingLeft: 12, paddingRight: 12 };
  const qrBoxPadding = hasCustomBg ? 14 : 12;
  const ctaBoxPadding = hasCustomBg ? { paddingTop: 14, paddingBottom: 14, paddingLeft: 16, paddingRight: 16 } : { paddingTop: 8, paddingBottom: 8, paddingLeft: 12, paddingRight: 12 };

  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl overflow-hidden"
      style={{
        width: 280,
        minHeight: 340,
        padding: rootPadding,
        backgroundColor: typeof rootBg === "string" && !rootBg.startsWith("linear") ? rootBg : undefined,
        backgroundImage: typeof rootBg === "string" && rootBg.startsWith("linear") ? rootBg : undefined,
        color: rootColor,
        border: "1px solid #e5e5e5",
        boxShadow: forPrint ? undefined : "0 25px 50px -12px rgba(0,0,0,0.15)",
      }}
    >
      {/* Nom du resto uniquement s’il n’y a pas de logo (le nom est souvent déjà sur le logo) */}
      {!logoSrc && restaurantName && (
        <div
          className="rounded-xl w-full max-w-full box-border flex-shrink-0"
          style={{
            marginBottom: nameBlockMargin,
            backgroundColor: "rgba(255,255,255,0.95)",
            color: "#1a1a1a",
            ...nameBoxPadding,
          }}
        >
          <h2
            className="text-xl font-bold tracking-tight text-center max-w-full truncate"
            style={{ fontFamily }}
          >
            {restaurantName}
          </h2>
        </div>
      )}

      {/* QR — espacement net sous le nom et au-dessus du CTA */}
      <div
        className="rounded-xl flex-shrink-0"
        style={{
          marginBottom: qrBlockMargin,
          padding: qrBoxPadding,
          borderRadius: 10,
          backgroundColor: qrWrapperBg,
          border: `4px solid ${accentColor}`,
        }}
      >
        <QRCodeSVG
          value={qrValue}
          size={qrSize}
          fgColor="#0a0a0a"
          bgColor="#ffffff"
          level="Q"
          imageSettings={
            logoSrc
              ? {
                  src: logoSrc,
                  excavate: true,
                  height: 36,
                  width: 36,
                }
              : undefined
          }
        />
      </div>

      {/* CTA sous le QR — avec fond coloré : padding explicite pour bien ordonner */}
      <div
        className="rounded-xl w-full min-h-[2.5rem] flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor: "rgba(255,255,255,0.95)",
          color: "#1a1a1a",
          ...ctaBoxPadding,
        }}
      >
        <p
          className="text-sm font-bold tracking-wide text-center leading-tight"
          style={{ fontFamily }}
        >
          {cta || t("menuQrStickerCta", locale)}
        </p>
      </div>

      {/* Logo + nom DigiKarte en bas au milieu — en blanc si fond coloré pour lisibilité */}
      <div className="flex-shrink-0 w-full flex justify-center items-center" style={{ paddingTop: 8, paddingBottom: 2 }}>
        <div
          className="flex items-center gap-1.5"
          style={{
            color: hasCustomBg || rootColor === "#ffffff" ? "#ffffff" : "#6b7280",
          }}
        >
          <div
            className="overflow-hidden rounded-2xl border-2 bg-white flex-shrink-0"
            style={{
              width: 24,
              height: 24,
              borderColor: hasCustomBg || rootColor === "#ffffff" ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.12)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
            }}
          >
            <img
              src="/digikarte-logo.png"
              alt=""
              width={24}
              height={24}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", padding: 3 }}
            />
          </div>
          <span className="text-[10px] font-semibold tracking-wider" style={{ fontFamily }}>
            DigiKarte
          </span>
        </div>
      </div>
    </div>
  );
}
