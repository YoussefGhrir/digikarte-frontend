"use client";

/**
 * Titre de section de menu : motif décoratif (lignes), utilisé par tous les modèles.
 * variant "script" = écriture artistique ; "modern" = font-forum épuré (Japandi, etc.).
 */
export function MenuSectionTitle({
  children,
  accentColor,
  className = "",
  centered = true,
  variant = "script",
}: {
  children: React.ReactNode;
  accentColor: string;
  className?: string;
  centered?: boolean;
  variant?: "script" | "modern";
}) {
  /* Style Graine de café : lignes fines, couleur d’accent du template (opacité réduite) */
  const lineStyle = {
    backgroundColor: accentColor,
    opacity: variant === "modern" ? 0.45 : 0.55,
    height: "0.5px",
    minHeight: "1px",
  };
  const titleClass =
    variant === "modern"
      ? "font-forum text-lg font-semibold tracking-tight sm:text-xl shrink-0"
      : "font-menu-script text-xl font-semibold uppercase tracking-[0.2em] sm:text-2xl shrink-0";
  return (
    <div
      className={`menu-section-title flex items-center gap-3 sm:gap-4 ${centered ? "justify-center text-center" : "justify-center sm:justify-start text-center sm:text-left"} ${className}`}
      style={{ ["--menu-section-accent" as string]: accentColor }}
    >
      <div className="flex-1 min-w-[2rem] sm:min-w-[3rem]" style={lineStyle} aria-hidden />
      <h2 className={titleClass} style={{ color: accentColor }}>
        {children}
      </h2>
      <div className="flex-1 min-w-[2rem] sm:min-w-[3rem]" style={lineStyle} aria-hidden />
    </div>
  );
}
