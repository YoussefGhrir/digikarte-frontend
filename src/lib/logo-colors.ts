/**
 * Extrait des couleurs dominantes du logo (inspiration palette).
 * Retourne des variantes adoucies (muted) pour une palette utilisable.
 */

export type RGB = [number, number, number];

function hexToRgb(hex: string): RGB | null {
  const m = hex.replace(/^#/, "").match(/^(..)(..)(..)$/);
  if (!m) return null;
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("");
}

/** Assombrit une couleur (pour variante sombre) */
export function darkenRgb(rgb: RGB, factor: number): RGB {
  return rgb.map((c) => Math.max(0, c * (1 - factor))) as RGB;
}

/** Éclaircit et désature (effet "blur"/muted) */
export function muteRgb(rgb: RGB, mixWhite = 0.4, satReduce = 0.5): RGB {
  const [r, g, b] = rgb;
  const gray = 0.299 * r + 0.587 * g + 0.114 * b;
  const mix = 1 - satReduce;
  const nr = r * mix + gray * (1 - mix);
  const ng = g * mix + gray * (1 - mix);
  const nb = b * mix + gray * (1 - mix);
  return [
    nr + (255 - nr) * mixWhite,
    ng + (255 - ng) * mixWhite,
    nb + (255 - nb) * mixWhite,
  ] as RGB;
}

/**
 * Extrait jusqu'à 3 couleurs dominantes d'une image (data URL).
 * Retourne des hex, avec variantes muted pour la palette.
 */
export async function getDominantColorsFromImage(
  imageDataUrl: string,
  count = 3
): Promise<string[]> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve([]);
          return;
        }
        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;
        const colorCount: Record<string, number> = {};
        const bucket = 32;
        for (let i = 0; i < data.length; i += 4) {
          const r = Math.floor(data[i] / bucket) * bucket;
          const g = Math.floor(data[i + 1] / bucket) * bucket;
          const b = Math.floor(data[i + 2] / bucket) * bucket;
          const a = data[i + 3];
          if (a < 128) continue;
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (lum < 20 || lum > 235) continue;
          const key = `${r},${g},${b}`;
          colorCount[key] = (colorCount[key] || 0) + 1;
        }
        const sorted = Object.entries(colorCount)
          .sort((a, b) => b[1] - a[1])
          .slice(0, count)
          .map(([key]) => {
            const [r, g, b] = key.split(",").map(Number);
            return rgbToHex(r, g, b);
          });
        resolve(sorted);
      } catch {
        resolve([]);
      }
    };
    img.onerror = () => resolve([]);
    img.src = imageDataUrl;
  });
}

/**
 * À partir de couleurs brutes du logo, retourne une palette d'accent (couleurs adoucies).
 * Premier élément = accent principal (légèrement muted), puis variantes plus douces.
 */
export function buildPaletteFromLogoColors(hexColors: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const hex of hexColors.slice(0, 4)) {
    const rgb = hexToRgb(hex);
    if (!rgb) continue;
    const muted = muteRgb(rgb, 0.15, 0.2);
    const hexMuted = rgbToHex(muted[0], muted[1], muted[2]);
    if (!seen.has(hexMuted)) {
      seen.add(hexMuted);
      out.push(hexMuted);
    }
    const lighter = muteRgb(rgb, 0.45, 0.3);
    const hexLight = rgbToHex(lighter[0], lighter[1], lighter[2]);
    if (!seen.has(hexLight)) {
      seen.add(hexLight);
      out.push(hexLight);
    }
  }
  return out.slice(0, 6);
}
