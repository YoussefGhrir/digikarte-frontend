/**
 * PDF prêts à imprimer — design 2026 : minimal, éditorial, moderne.
 * Stickers (tables) + Affiche (porte). Structure refaite de zéro.
 * Couleurs personnalisables via le thème (FARBEN).
 */

import type jsPDF from "jspdf";
import QRCode from "qrcode";

const A4_W = 210;
const A4_H = 297;

export type QrPdfThemeId =
  | "amber"
  | "slate"
  | "emerald"
  | "violet"
  | "rose"
  | "stone";

const PDF_THEME_COLORS: Record<
  QrPdfThemeId,
  {
    primary: readonly [number, number, number];
    dark: readonly [number, number, number];
    muted: readonly [number, number, number];
  }
> = {
  amber: { primary: [245, 158, 11], dark: [180, 83, 9], muted: [253, 230, 138] },
  slate: { primary: [71, 85, 105], dark: [30, 41, 59], muted: [203, 213, 225] },
  emerald: { primary: [16, 185, 129], dark: [5, 150, 105], muted: [167, 243, 208] },
  violet: { primary: [139, 92, 246], dark: [91, 33, 182], muted: [221, 214, 254] },
  rose: { primary: [244, 63, 94], dark: [190, 18, 60], muted: [254, 205, 211] },
  stone: { primary: [120, 113, 108], dark: [68, 64, 60], muted: [231, 229, 228] },
};

function getPdfTheme(theme: QrPdfThemeId | null | undefined) {
  const id = theme && PDF_THEME_COLORS[theme as QrPdfThemeId] ? theme : "amber";
  return PDF_THEME_COLORS[id as QrPdfThemeId];
}

const COL = {
  ink: [23, 23, 23] as const,
  inkMuted: [82, 82, 91] as const,
  white: [255, 255, 255] as const,
  offWhite: [250, 250, 250] as const,
};

export type QrPdfOptions = {
  menuUrl: string;
  organizationName: string;
  organizationLogoBase64?: string | null;
  menuTitle?: string;
  pdfTheme?: QrPdfThemeId | null;
};

export type QrPdfLabels = {
  topLabel: string;
  scanLabel: string;
  scanHint: string;
};

function normalizeLogoDataUrl(raw: string | null | undefined): string | null {
  if (!raw || !raw.trim()) return null;
  const s = raw.trim();
  if (s.startsWith("data:image/")) return s;
  return `data:image/jpeg;base64,${s}`;
}

async function getQrDataUrl(url: string, sizePx: number): Promise<string> {
  return QRCode.toDataURL(url, {
    width: sizePx,
    margin: 1,
    color: { dark: "#171717", light: "#ffffff" },
  });
}

type PdfTheme = ReturnType<typeof getPdfTheme>;

// ——— STICKER (TABLES) ——— Design 2025–2026 : centré, QR très grand, fond clair, accent unique.

function drawStickerCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  theme: PdfTheme,
  opts: {
    title: string;
    qrDataUrl: string;
    qrSizeMm: number;
    scanHint: string;
    logoDataUrl: string | null;
  }
) {
  const padding = 6;
  const qrPad = 3;
  const qrSize = opts.qrSizeMm;
  const qrTotal = qrSize + qrPad * 2;

  // Fond blanc, espace généreux
  doc.setFillColor(...COL.white);
  doc.rect(x, y, w, h, "F");

  // Contour fin + ombre douce (cadre discret)
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.2);
  doc.rect(x, y, w, h);

  let cy = y + padding;

  // Logo optionnel (centré)
  if (opts.logoDataUrl) {
    const logoSize = 14;
    const logoX = x + (w - logoSize) / 2;
    try {
      doc.addImage(opts.logoDataUrl, "JPEG", logoX, cy, logoSize, logoSize);
    } catch {
      try {
        doc.addImage(opts.logoDataUrl, "PNG", logoX, cy, logoSize, logoSize);
      } catch {}
    }
    cy += logoSize + 4;
  }

  // Nom resto — typo grande, bold, accent (1 seul élément couleur)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...theme.primary);
  const title = opts.title.slice(0, 24);
  doc.text(title, x + w / 2, cy, { align: "center" });
  cy += 7;

  // QR très grand, centré, fond blanc, cadre fin accent
  const qrX = x + (w - qrTotal) / 2;
  doc.setDrawColor(...theme.primary);
  doc.setLineWidth(0.3);
  doc.rect(qrX, cy, qrTotal, qrTotal);
  doc.setFillColor(...COL.white);
  doc.rect(qrX + 0.3, cy + 0.3, qrTotal - 0.6, qrTotal - 0.6, "F");
  doc.addImage(opts.qrDataUrl, "PNG", qrX + qrPad, cy + qrPad, qrSize, qrSize);
  cy += qrTotal + 5;

  // Texte court CTA
  doc.setFont("helvetica", "normal");
  doc.setFontSize(3.8);
  doc.setTextColor(...COL.inkMuted);
  doc.text(opts.scanHint, x + w / 2, cy, { align: "center" });
}

async function buildStickerPdfDoc(
  options: QrPdfOptions,
  labels: QrPdfLabels
): Promise<InstanceType<typeof import("jspdf")>> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const cols = 2;
  const rows = 3;
  const margin = 10;
  const gap = 6;
  const cardW = (A4_W - margin * 2 - gap * (cols - 1)) / cols;
  const cardH = (A4_H - margin * 2 - gap * (rows - 1)) / rows;

  // QR 32mm (~250px équivalent impression) pour bon scan
  const qrSizeMm = 32;
  const qrSizePx = 220;
  const qrDataUrl = await getQrDataUrl(options.menuUrl, qrSizePx);
  const logoDataUrl = normalizeLogoDataUrl(options.organizationLogoBase64);
  const theme = getPdfTheme(options.pdfTheme);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = margin + col * (cardW + gap);
      const y = margin + row * (cardH + gap);
      drawStickerCard(doc, x, y, cardW, cardH, theme, {
        title: options.organizationName,
        qrDataUrl,
        qrSizeMm,
        scanHint: labels.scanHint,
        logoDataUrl,
      });
    }
  }

  return doc;
}

export async function generateStickerPdf(
  options: QrPdfOptions,
  labels: QrPdfLabels
): Promise<void> {
  const doc = await buildStickerPdfDoc(options, labels);
  doc.save(`digikarte-stickers-${sanitizeFilename(options.organizationName)}.pdf`);
}

export async function generateStickerPdfBlob(
  options: QrPdfOptions,
  labels: QrPdfLabels
): Promise<Blob> {
  const doc = await buildStickerPdfDoc(options, labels);
  return doc.output("blob");
}

// ——— AFFICHE (PORTE) ——— Design 2025–2026 : hero, QR 250–300px équiv., fond contrasté, accent sur le titre.

async function buildPosterPdfDoc(
  options: QrPdfOptions,
  posterTitle: string,
  labels: QrPdfLabels
): Promise<InstanceType<typeof import("jspdf")>> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const margin = 16;
  const contentW = A4_W - margin * 2;
  const x = margin;
  const theme = getPdfTheme(options.pdfTheme);

  // Fond dégradé discret (bande supérieure)
  const bandH = 18;
  doc.setFillColor(...theme.primary);
  doc.rect(0, 0, A4_W, bandH, "F");
  doc.setTextColor(...COL.white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("MENÜ · SCAN", A4_W / 2, bandH / 2 + 1, { align: "center" });

  let cy = margin + 14;
  const logoDataUrl = normalizeLogoDataUrl(options.organizationLogoBase64);
  const logoSize = 26;

  if (logoDataUrl) {
    const logoX = x + (contentW - logoSize) / 2;
    try {
      doc.addImage(logoDataUrl, "JPEG", logoX, cy, logoSize, logoSize);
    } catch {
      try {
        doc.addImage(logoDataUrl, "PNG", logoX, cy, logoSize, logoSize);
      } catch {}
    }
    cy += logoSize + 6;
  }

  // Nom établissement — typo hero, accent (1 élément couleur)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...theme.primary);
  doc.text(options.organizationName, x + contentW / 2, cy, { align: "center" });
  cy += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...COL.inkMuted);
  doc.text(posterTitle, x + contentW / 2, cy, { align: "center" });
  cy += 16;

  // QR central très grand (idéal 250–300px équiv. impression)
  const qrSizeMm = 62;
  const qrSizePx = 340;
  const qrDataUrl = await getQrDataUrl(options.menuUrl, qrSizePx);
  const qrPad = 4;
  const qrTotal = qrSizeMm + qrPad * 2;
  const qrX = x + (contentW - qrTotal) / 2;

  doc.setDrawColor(...theme.primary);
  doc.setLineWidth(0.35);
  doc.rect(qrX, cy, qrTotal, qrTotal);
  doc.setFillColor(...COL.white);
  doc.rect(qrX + 0.4, cy + 0.4, qrTotal - 0.8, qrTotal - 0.8, "F");
  doc.addImage(qrDataUrl, "PNG", qrX + qrPad, cy + qrPad, qrSizeMm, qrSizeMm);

  cy += qrTotal + 14;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COL.ink);
  doc.text(labels.scanLabel, x + contentW / 2, cy, { align: "center" });
  cy += 6;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...COL.inkMuted);
  doc.text(labels.scanHint, x + contentW / 2, cy, { align: "center" });

  // Bandeau bas discret
  const bottomBandH = 10;
  doc.setFillColor(...theme.muted);
  doc.rect(0, A4_H - bottomBandH, A4_W, bottomBandH, "F");
  doc.setFontSize(7);
  doc.setTextColor(...theme.dark);
  doc.text(options.organizationName, A4_W / 2, A4_H - bottomBandH / 2 + 0.8, { align: "center" });

  return doc;
}

export async function generatePosterPdf(
  options: QrPdfOptions,
  posterTitle: string,
  labels: QrPdfLabels
): Promise<void> {
  const doc = await buildPosterPdfDoc(options, posterTitle, labels);
  doc.save(`digikarte-affiche-${sanitizeFilename(options.organizationName)}.pdf`);
}

export async function generatePosterPdfBlob(
  options: QrPdfOptions,
  posterTitle: string,
  labels: QrPdfLabels
): Promise<Blob> {
  const doc = await buildPosterPdfDoc(options, posterTitle, labels);
  return doc.output("blob");
}

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .slice(0, 40) || "menu";
}
