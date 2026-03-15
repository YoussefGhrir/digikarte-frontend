"use client";

import { QRCodeSVG } from "qrcode.react";

export interface QrDoorPosterProps {
  qrValue: string;
  restaurantName: string;
  /** Ligne 1 du titre (ex. "Découvrez notre") */
  discoverOur?: string;
  /** Ligne 2 du titre (ex. "Menu") */
  menuTitle?: string;
  /** Libellé NFC (ex. "Toucher avec le téléphone") */
  tapPhoneLabel?: string;
  /** Libellé scan QR (ex. "Scanner le QR") */
  scanQrLabel?: string;
  /** Mot entre les deux CTA (ex. "ou") */
  orLabel?: string;
  slogan?: string;
  scanHint?: string;
  logoUrl?: string | null;
  photoUrl?: string | null;
  accentColor?: string;
  qrSize?: number;
  forPrint?: boolean;
  fontFamily?: string;
  backgroundColor?: string;
  /** restaurant = fourchette/couteau, cafe = tasse, both = les deux */
  iconType?: "restaurant" | "cafe" | "both";
}

const ACCENT_DEFAULT = "#eab308";

function normalizeImageSrc(raw: string | null | undefined): string | null {
  if (!raw || !String(raw).trim()) return null;
  const s = String(raw).trim();
  if (s.startsWith("data:image/") || s.startsWith("http")) return s;
  return `data:image/jpeg;base64,${s}`;
}

/** Icône couverts (couteau + fourchette) — restaurant */
function IconCutlery({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 4v2a3 3 0 0 0 3 3m0 0V4m0 5v11M8 9a3 3 0 0 0 3-3V4m5 8V4c3 2 3 4 3 8h-3Zm0 0v8" />
    </svg>
  );
}

/** Icône tasse café moderne : tasse avec vapeur + graine de café */
function IconCup({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* Tasse moderne (corps + anse) */}
      <path d="M6 6h8l1 12H5L6 6z" />
      <path d="M14 6h2c.5 0 1 .5 1 1v8c0 .5-.5 1-1 1h-2" />
      {/* Surface café */}
      <path d="M6 6h8" strokeWidth="1.4" />
      {/* Vapeur (volutes) */}
      <path d="M7.5 3.5Q8 2 9 3.5M11.5 2.8Q12 1.5 13 2.8M15.5 3.5Q16 2 17 3.5" strokeWidth="1.2" opacity="0.85" />
      {/* Graine de café (oval + trait central) */}
      <ellipse cx="4.5" cy="15" rx="1.4" ry="2.2" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M3.8 14.2l1.4 1.6" strokeWidth="1" />
    </svg>
  );
}

/** Icône téléphone + ondes NFC */
function IconTapPhone({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="8" y="2" width="16" height="26" rx="2" />
      <path d="M12 6h8M12 26h8" />
      <path d="M24 12c2 1.5 2 4 2 6s0 4.5-2 6M28 10c3 2 3 6 3 8s0 6-3 8" />
    </svg>
  );
}

/** Icône téléphone avec QR */
function IconScanQr({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="6" y="2" width="14" height="20" rx="2" />
      <path d="M10 6h6M10 10h2v2h-2zM14 10h2v2h-2zM10 14h2v2h-2zM14 14h2v2h-2z" />
      <rect x="20" y="8" width="10" height="10" rx="1" />
      <path d="M22 10h2v2h-2zM26 10h2v2h-2zM22 14h2v2h-2zM26 14h2v2h-2z" />
      <path d="M20 22h12M20 26h12" />
    </svg>
  );
}

export function QrDoorPoster({
  qrValue,
  restaurantName: _restaurantName,
  discoverOur = "Discover our",
  menuTitle = "Menu",
  tapPhoneLabel = "Tap phone",
  scanQrLabel = "Scan QR-Code",
  orLabel = "or",
  logoUrl,
  accentColor = ACCENT_DEFAULT,
  qrSize = 260,
  forPrint = false,
  fontFamily = "var(--font-geist-sans), system-ui, sans-serif",
  backgroundColor: backgroundColorProp,
  iconType = "restaurant",
}: QrDoorPosterProps) {
  const logoSrc = normalizeImageSrc(logoUrl ?? null);
  const bgColor = backgroundColorProp ?? "#ffffff";
  const isLightBg = !backgroundColorProp || backgroundColorProp === "#ffffff";
  /** Avec fond coloré : marges et padding explicites pour bien séparer les blocs (bandes de couleur visibles). */
  const blockGap = isLightBg ? 48 : 40;
  const blockGapAfterQr = isLightBg ? 40 : 36;
  const ctaGapTop = isLightBg ? 24 : 32;
  const contentPadding = isLightBg ? { paddingTop: 40, paddingBottom: 24, paddingLeft: 40, paddingRight: 40 } : { paddingTop: 32, paddingBottom: 28, paddingLeft: 36, paddingRight: 36 };
  const titleBoxPadding = isLightBg ? { paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24 } : { paddingTop: 20, paddingBottom: 20, paddingLeft: 28, paddingRight: 28 };
  const ctaBoxPadding = isLightBg ? { paddingTop: 16, paddingBottom: 16, paddingLeft: 24, paddingRight: 24 } : { paddingTop: 20, paddingBottom: 20, paddingLeft: 28, paddingRight: 28 };

  return (
    <div
      className="relative rounded-3xl overflow-hidden flex flex-col items-center flex-shrink-0"
      style={{
        width: 520,
        height: 740,
        minHeight: 740,
        backgroundColor: bgColor,
        color: "#1a1a1a",
        boxShadow: forPrint ? undefined : "0 25px 50px -12px rgba(0,0,0,0.15)",
      }}
    >
      <div className="flex flex-col items-center flex-1 w-full min-h-0 overflow-hidden" style={contentPadding}>
        {/* Icône couverts + titre — marges claires (avec ou sans fond coloré) */}
        <div
          className="flex flex-col items-center rounded-2xl flex-shrink-0"
          style={{
            marginBottom: blockGap,
            backgroundColor: isLightBg ? "transparent" : "rgba(255,255,255,0.96)",
            color: "#1a1a1a",
            ...titleBoxPadding,
          }}
        >
          <div className="mb-3 flex items-center justify-center gap-3" style={{ color: accentColor }}>
            {iconType === "restaurant" && <IconCutlery className="w-14 h-14 shrink-0" color={accentColor} />}
            {iconType === "cafe" && <IconCup className="w-14 h-14 shrink-0" color={accentColor} />}
            {iconType === "both" && (
              <>
                <IconCup className="w-12 h-12 shrink-0" color={accentColor} />
                <IconCutlery className="w-12 h-12 shrink-0" color={accentColor} />
              </>
            )}
          </div>
          <p className="text-base font-normal tracking-wide" style={{ color: "#4b5563", fontFamily }}>
            {discoverOur}
          </p>
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: "#111827", fontFamily, marginTop: 4, marginBottom: 0 }}
          >
            {menuTitle}
          </h1>
        </div>

        {/* QR — marge nette sous le titre et au-dessus des CTA (bande de fond visible si couleur) */}
        <div
          className="rounded-2xl p-4 flex-shrink-0"
          style={{
            marginBottom: blockGapAfterQr,
            border: `8px solid ${accentColor}`,
            borderRadius: 16,
            backgroundColor: "#ffffff",
          }}
        >
          <QRCodeSVG
            value={qrValue}
            size={qrSize}
            fgColor="#111111"
            bgColor="#ffffff"
            level="H"
            imageSettings={
              logoSrc
                ? { src: logoSrc, excavate: true, height: 44, width: 44 }
                : undefined
            }
          />
        </div>

        {/* CTA — espacement net après le QR ; avec fond coloré, padding et marge pour bien ordonner */}
        <div
          className="flex items-center justify-center gap-6 flex-wrap w-full mt-auto rounded-2xl flex-shrink-0"
          style={{
            marginTop: ctaGapTop,
            backgroundColor: isLightBg ? "transparent" : "rgba(255,255,255,0.96)",
            ...ctaBoxPadding,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <div style={{ color: "#374151" }}>
              <IconTapPhone className="w-10 h-10" color="#374151" />
            </div>
            <span className="text-sm font-medium" style={{ color: "#1f2937", fontFamily }}>
              {tapPhoneLabel}
            </span>
          </div>
          <span className="text-sm font-medium" style={{ color: "#6b7280", fontFamily }}>
            {orLabel}
          </span>
          <div className="flex flex-col items-center gap-2">
            <div style={{ color: "#374151" }}>
              <IconScanQr className="w-10 h-10" color="#374151" />
            </div>
            <span className="text-sm font-medium" style={{ color: "#1f2937", fontFamily }}>
              {scanQrLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Logo + nom DigiKarte en bas centré */}
      <div
        className="flex-shrink-0 w-full flex justify-center items-center pb-3"
        style={{ paddingLeft: 16, paddingRight: 16 }}
      >
        <div className="flex items-center gap-2" style={{ color: isLightBg ? "#6b7280" : "rgba(255,255,255,0.9)" }}>
          <div
            className="overflow-hidden rounded-2xl border-2 bg-white flex-shrink-0"
            style={{
              width: 32,
              height: 32,
              borderColor: isLightBg ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.9)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src="/digikarte-logo.png"
              alt=""
              width={32}
              height={32}
              style={{ display: "block", width: "100%", height: "100%", objectFit: "contain", padding: 4 }}
            />
          </div>
          <span className="text-xs font-semibold tracking-wider" style={{ fontFamily }}>
            DigiKarte
          </span>
        </div>
      </div>
    </div>
  );
}
