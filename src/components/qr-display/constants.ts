/**
 * Modèles d'affichage du bloc QR (comme les 6 templates menu).
 * L'utilisateur peut choisir un style et personnaliser les couleurs.
 */
export const QR_DISPLAY_TEMPLATE_IDS = [
  "classic",
  "minimal",
  "elegant",
  "cafe",
  "bistro",
  "cards",
] as const;

export type QrDisplayTemplateId = (typeof QR_DISPLAY_TEMPLATE_IDS)[number];

export function normalizeQrTemplateId(
  value: string | null | undefined
): QrDisplayTemplateId {
  if (
    value &&
    QR_DISPLAY_TEMPLATE_IDS.includes(value as QrDisplayTemplateId)
  ) {
    return value as QrDisplayTemplateId;
  }
  return "classic";
}

/** Thèmes de couleurs personnalisables (bg + accent). */
export const QR_THEME_IDS = ["amber", "slate", "emerald", "violet", "rose", "stone"] as const;

export type QrThemeId = (typeof QR_THEME_IDS)[number];

export function normalizeQrThemeId(value: string | null | undefined): QrThemeId {
  if (value && QR_THEME_IDS.includes(value as QrThemeId)) return value as QrThemeId;
  return "amber";
}

export type QrTheme = {
  bg: string;
  bgCard: string;
  accent: string;
  accentMuted: string;
  text: string;
  textMuted: string;
  border: string;
  urlBg: string;
  urlBorder: string;
  urlText: string;
};

export const QR_THEMES: Record<QrThemeId, QrTheme> = {
  amber: {
    bg: "from-amber-950/40 via-neutral-950 to-amber-950/30",
    bgCard: "bg-neutral-900/80",
    accent: "text-amber-300",
    accentMuted: "text-amber-400/90",
    text: "text-neutral-50",
    textMuted: "text-neutral-400",
    border: "border-amber-500/30",
    urlBg: "bg-amber-950/50",
    urlBorder: "border-amber-500/40",
    urlText: "text-amber-200",
  },
  slate: {
    bg: "from-slate-900/60 via-neutral-950 to-slate-900/50",
    bgCard: "bg-slate-900/70",
    accent: "text-slate-200",
    accentMuted: "text-slate-400",
    text: "text-neutral-50",
    textMuted: "text-neutral-400",
    border: "border-slate-600",
    urlBg: "bg-slate-800/80",
    urlBorder: "border-slate-500/50",
    urlText: "text-slate-200",
  },
  emerald: {
    bg: "from-emerald-950/30 via-neutral-950 to-emerald-950/20",
    bgCard: "bg-neutral-900/80",
    accent: "text-emerald-300",
    accentMuted: "text-emerald-400/90",
    text: "text-neutral-50",
    textMuted: "text-neutral-400",
    border: "border-emerald-500/30",
    urlBg: "bg-emerald-950/50",
    urlBorder: "border-emerald-500/40",
    urlText: "text-emerald-200",
  },
  violet: {
    bg: "from-violet-950/30 via-neutral-950 to-violet-950/20",
    bgCard: "bg-neutral-900/80",
    accent: "text-violet-300",
    accentMuted: "text-violet-400/90",
    text: "text-neutral-50",
    textMuted: "text-neutral-400",
    border: "border-violet-500/30",
    urlBg: "bg-violet-950/50",
    urlBorder: "border-violet-500/40",
    urlText: "text-violet-200",
  },
  rose: {
    bg: "from-rose-950/20 via-neutral-950 to-rose-950/10",
    bgCard: "bg-neutral-900/80",
    accent: "text-rose-300",
    accentMuted: "text-rose-400/90",
    text: "text-neutral-50",
    textMuted: "text-neutral-400",
    border: "border-rose-500/30",
    urlBg: "bg-rose-950/40",
    urlBorder: "border-rose-500/40",
    urlText: "text-rose-200",
  },
  stone: {
    bg: "from-stone-900/50 via-neutral-950 to-stone-900/40",
    bgCard: "bg-stone-900/70",
    accent: "text-stone-200",
    accentMuted: "text-stone-400",
    text: "text-neutral-50",
    textMuted: "text-neutral-400",
    border: "border-stone-600",
    urlBg: "bg-stone-800/80",
    urlBorder: "border-stone-500/50",
    urlText: "text-stone-200",
  },
};
