/**
 * Génération PDF à partir du DOM (html2canvas) — le PDF reflète exactement
 * le rendu HTML des composants Sticker et Affiche (couleurs, police, phrase).
 * Les couleurs oklab/oklch sont converties en RGB pour éviter l'erreur
 * "Attempting to parse an unsupported color function" (html2canvas ne gère pas oklab).
 */

import type jsPDF from "jspdf";

const A4_W_MM = 210;
const A4_H_MM = 297;

/** Convertit une chaîne oklab(...) ou oklch(...) en rgb(r,g,b). Sinon retourne la chaîne telle quelle. */
function cssColorToRgb(cssValue: string): string {
  if (!cssValue || typeof cssValue !== "string") return cssValue;
  const s = cssValue.trim();
  if (!s.includes("oklab") && !s.includes("oklch")) return s;

  const oklabMatch = s.match(/oklab\s*\(\s*([\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s*\)/i);
  if (oklabMatch) {
    const L = Math.max(0, Math.min(1, parseFloat(oklabMatch[1])));
    const a = parseFloat(oklabMatch[2]);
    const b = parseFloat(oklabMatch[3]);
    const { r, g, b: bb } = oklabToSrgb(L, a, b);
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(bb)})`;
  }

  const oklchMatch = s.match(/oklch\s*\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*[\d.]+)?\s*\)/i);
  if (oklchMatch) {
    const L = Math.max(0, Math.min(1, parseFloat(oklchMatch[1])));
    const C = Math.max(0, parseFloat(oklchMatch[2]));
    const H = parseFloat(oklchMatch[3]);
    const a = C * Math.cos((H * Math.PI) / 180);
    const b = C * Math.sin((H * Math.PI) / 180);
    const { r, g, b: bb } = oklabToSrgb(L, a, b);
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(bb)})`;
  }

  return s;
}

/** Remplace toutes les occurrences de oklab(...) et oklch(...) dans une chaîne CSS par rgb(...). */
function replaceAllOklabInString(cssString: string): string {
  if (!cssString || !cssString.includes("oklab") && !cssString.includes("oklch")) return cssString;
  return cssString
    .replace(/oklab\s*\([^)]*\)/gi, (m) => cssColorToRgb(m))
    .replace(/oklch\s*\([^)]*\)/gi, (m) => cssColorToRgb(m));
}

/** Linear sRGB -> sRGB (gamma). */
function linearToSrgb(c: number): number {
  if (c <= 0.0031308) return 12.92 * c;
  return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/** OKLAB -> sRGB (formule standard W3C), composantes clampées 0–255. */
function oklabToSrgb(L: number, a: number, b: number): { r: number; g: number; b: number } {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const rL = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gL = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bL = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const clamp = (x: number) => Math.max(0, Math.min(255, Math.round(255 * x)));
  return {
    r: clamp(linearToSrgb(rL)),
    g: clamp(linearToSrgb(gL)),
    b: clamp(linearToSrgb(bL)),
  };
}

const COLOR_PROPS = ["color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "fill", "stroke", "outlineColor"] as const;

/** Applique des styles inline rgb pour remplacer oklab/oklch sur un élément (et ses enfants). Retourne une liste de sauvegardes pour restore(). */
function sanitizeElementOklab(root: HTMLElement, win: Window): { el: HTMLElement; saved: string }[] {
  const backups: { el: HTMLElement; saved: string }[] = [];
  const all = root.querySelectorAll("*");
  const elements = [root, ...Array.from(all)];
  elements.forEach((el) => {
    if (el.nodeType !== 1) return;
    const htmlEl = el as HTMLElement;
    const style = win.getComputedStyle(htmlEl);
    const set: string[] = [];
    COLOR_PROPS.forEach((prop) => {
      const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
      const value = style.getPropertyValue(cssProp);
      if (value && (value.includes("oklab") || value.includes("oklch"))) {
        const rgb = cssColorToRgb(value);
        set.push(`${cssProp}: ${rgb} !important`);
      }
    });
    if (set.length) {
      const prev = htmlEl.getAttribute("style") || "";
      backups.push({ el: htmlEl, saved: prev });
      htmlEl.setAttribute("style", prev + (prev ? "; " : "") + set.join("; "));
    }
  });
  return backups;
}

function restoreElementStyles(backups: { el: HTMLElement; saved: string }[]): void {
  backups.forEach(({ el, saved }) => {
    if (saved) el.setAttribute("style", saved);
    else el.removeAttribute("style");
  });
}

/**
 * Sanitize le clone : force toutes les couleurs en RGB en inline.
 * html2canvas parse les feuilles de style (Tailwind utilise oklab/oklch) et lance
 * "Attempting to parse an unsupported color function" — en mettant les couleurs
 * en inline (converties en rgb), il ne lit plus les règles CSS contenant oklab.
 */
function sanitizeCloneOklab(clonedDocument: Document, clonedElement: HTMLElement): void {
  const win = clonedDocument.defaultView;
  if (!win) return;
  const all = clonedElement.querySelectorAll("*");
  const elements = [clonedElement, ...Array.from(all)];
  elements.forEach((el) => {
    if (el.nodeType !== 1) return;
    const htmlEl = el as HTMLElement;
    const style = win.getComputedStyle(htmlEl);
    const set: string[] = [];
    COLOR_PROPS.forEach((prop) => {
      const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
      const value = style.getPropertyValue(cssProp);
      if (!value || value === "none" || value === "transparent") return;
      const rgb = value.includes("oklab") || value.includes("oklch") ? cssColorToRgb(value) : value;
      set.push(`${cssProp}: ${rgb} !important`);
    });
    const prev = htmlEl.getAttribute("style") || "";
    if (set.length) htmlEl.setAttribute("style", prev + (prev ? "; " : "") + set.join("; "));
  });
  stripOklabFromCloneStylesheets(clonedDocument);
}

/** Parcourt récursivement les règles CSS et remplace oklab/oklch par rgb (y compris @media). */
function stripOklabFromRuleList(rules: CSSRuleList | undefined): void {
  if (!rules) return;
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    if (rule instanceof CSSStyleRule && rule.style) {
      const style = rule.style;
      for (let j = 0; j < style.length; j++) {
        const prop = style.item(j);
        const value = style.getPropertyValue(prop);
        if (value && (value.includes("oklab") || value.includes("oklch"))) {
          try {
            const replaced = replaceAllOklabInString(value);
            if (replaced !== value) style.setProperty(prop, replaced, "important");
          } catch {
            // ignore invalid value
          }
        }
      }
    } else if (rule instanceof CSSMediaRule && rule.cssRules) {
      stripOklabFromRuleList(rule.cssRules);
    } else if (rule instanceof CSSSupportsRule && rule.cssRules) {
      stripOklabFromRuleList(rule.cssRules);
    }
  }
}

/**
 * Parcourt les feuilles de style du clone et remplace oklab/oklch par rgb dans les règles.
 * Inclut @media et les propriétés comme background-image (dégradés).
 */
function stripOklabFromCloneStylesheets(clonedDocument: Document): void {
  try {
    const sheets = Array.from(clonedDocument.styleSheets);
    for (const sheet of sheets) {
      try {
        stripOklabFromRuleList(sheet.cssRules);
      } catch {
        // CORS ou feuille inaccessible
      }
    }
  } catch {
    // styleSheets inaccessible
  }
}

/**
 * Capture un élément DOM en image PNG (pour téléchargement).
 * Utilise la même sanitisation oklab que le PDF.
 * Pour un "screenshot" de l’aperçu affiché, passer l’élément visible et scale: 4.
 */
export async function captureElementAsPng(
  element: HTMLElement,
  options?: { backgroundColor?: string | null; scale?: number }
): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default;
  const win = element.ownerDocument?.defaultView ?? (typeof window !== "undefined" ? window : null);
  const backups = win ? sanitizeElementOklab(element, win) : [];
  const scale = options?.scale ?? 2;

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: options?.backgroundColor ?? "#ffffff",
      logging: false,
      onclone(clonedDocument, clonedElement) {
        sanitizeCloneOklab(clonedDocument, clonedElement);
      },
    });

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Erreur création image"))),
        "image/png",
        1.0
      );
    });
  } finally {
    restoreElementStyles(backups);
  }
}

/** Génère le PDF Stickers (grille 2×3) à partir d'un élément DOM (un sticker). */
export async function generateStickerPdfFromDom(
  element: HTMLElement,
  filename: string,
  options?: { scale?: number }
): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default;
  const { default: jsPDF } = await import("jspdf");

  const win = element.ownerDocument?.defaultView ?? (typeof window !== "undefined" ? window : null);
  const backups = win ? sanitizeElementOklab(element, win) : [];
  const scale = options?.scale ?? 2;

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      onclone(clonedDocument, clonedElement) {
        sanitizeCloneOklab(clonedDocument, clonedElement);
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const cols = 2;
    const rows = 3;
    const margin = 10;
    const gap = 6;
    const cellW = (A4_W_MM - margin * 2 - gap * (cols - 1)) / cols;
    const cellH = (A4_H_MM - margin * 2 - gap * (rows - 1)) / rows;

    const imgW = canvas.width;
    const imgH = canvas.height;
    const scaleFit = Math.min(cellW / (imgW * 0.26458), cellH / (imgH * 0.26458));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = margin + col * (cellW + gap);
        const y = margin + row * (cellH + gap);
        const w = imgW * 0.26458 * scaleFit;
        const h = imgH * 0.26458 * scaleFit;
        const xCentered = x + (cellW - w) / 2;
        const yCentered = y + (cellH - h) / 2;
        doc.addImage(imgData, "PNG", xCentered, yCentered, w, h);
      }
    }

    return doc.output("blob");
  } finally {
    restoreElementStyles(backups);
  }
}

/** Génère le PDF Affiche (1 page) à partir d'un élément DOM (poster). */
export async function generatePosterPdfFromDom(
  element: HTMLElement,
  filename: string,
  options?: { scale?: number }
): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default;
  const { default: jsPDF } = await import("jspdf");

  const win = element.ownerDocument?.defaultView ?? (typeof window !== "undefined" ? window : null);
  const backups = win ? sanitizeElementOklab(element, win) : [];
  const scale = options?.scale ?? 2;

  try {
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      onclone(clonedDocument, clonedElement) {
        sanitizeCloneOklab(clonedDocument, clonedElement);
      },
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const margin = 12;
    const contentW = A4_W_MM - margin * 2;
    const contentH = A4_H_MM - margin * 2;

    const imgW = canvas.width;
    const imgH = canvas.height;
    const scaleFit = Math.min(contentW / (imgW * 0.26458), contentH / (imgH * 0.26458));
    const w = imgW * 0.26458 * scaleFit;
    const h = imgH * 0.26458 * scaleFit;
    const x = margin + (contentW - w) / 2;
    const y = margin + (contentH - h) / 2;

    doc.addImage(imgData, "PNG", x, y, w, h);
    return doc.output("blob");
  } finally {
    restoreElementStyles(backups);
  }
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .slice(0, 40) || "menu";
}
