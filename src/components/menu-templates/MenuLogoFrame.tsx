"use client";

import { useId } from "react";

/**
 * Cadre décoratif type gravure autour du logo d’organisation (double cercles + motifs).
 * Utilisé par tous les templates de menu pour un rendu moderne et chic.
 */
export function MenuLogoFrame({
  accentColor,
  accentOpacity = 0.9,
  sizeRem = 11,
  innerBgClassName = "bg-neutral-900/80",
  children,
  className = "",
}: {
  accentColor: string;
  accentOpacity?: number;
  sizeRem?: number;
  innerBgClassName?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const id = useId();
  const r = 44;
  const dots = 12;
  const dotR = 2.2;

  return (
    <div
      className={`relative flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: `${sizeRem}rem`, height: `${sizeRem}rem` }}
    >
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <defs>
          <filter id={`logo-frame-shadow-${id.replace(/:/g, "")}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>
        {/* Double cercle gravure */}
        <circle cx="50" cy="50"
          r={r + 2}
          stroke={accentColor}
          strokeOpacity={accentOpacity * 0.5}
          strokeWidth="1.2"
          fill="none"
          filter={`url(#logo-frame-shadow-${id.replace(/:/g, "")})`}
        />
        <circle cx="50" cy="50" r={r}
          stroke={accentColor}
          strokeOpacity={accentOpacity}
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="50" cy="50" r={r - 3}
          stroke={accentColor}
          strokeOpacity={accentOpacity * 0.35}
          strokeWidth="0.6"
          fill="none"
        />
        {/* Motifs décoratifs (points type gravure) */}
        {Array.from({ length: dots }).map((_, i) => {
          const angle = (i / dots) * 2 * Math.PI - Math.PI / 2;
          const cx = 50 + (r - 1) * Math.cos(angle);
          const cy = 50 + (r - 1) * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={dotR}
              fill={accentColor}
              fillOpacity={accentOpacity * 0.85}
            />
          );
        })}
        {/* Losanges / gravure entre les points (haut, bas, gauche, droite) */}
        <path d="M50 8 L53 14 L50 20 L47 14 Z" stroke={accentColor} strokeOpacity={accentOpacity * 0.6} strokeWidth="0.6" fill="none" />
        <path d="M50 80 L53 86 L50 92 L47 86 Z" stroke={accentColor} strokeOpacity={accentOpacity * 0.6} strokeWidth="0.6" fill="none" />
        <path d="M8 50 L14 53 L20 50 L14 47 Z" stroke={accentColor} strokeOpacity={accentOpacity * 0.6} strokeWidth="0.6" fill="none" />
        <path d="M80 50 L86 53 L92 50 L86 47 Z" stroke={accentColor} strokeOpacity={accentOpacity * 0.6} strokeWidth="0.6" fill="none" />
      </svg>
      {/* Zone logo : marge par rapport aux contours, bordure nette pour éviter la fusion avec le cadre */}
      <div
        className={`relative z-10 rounded-xl overflow-hidden flex items-center justify-center ring-1 ring-inset ring-black/10 ${innerBgClassName}`}
        style={{
          width: `${sizeRem - 2.4}rem`,
          height: `${sizeRem - 2.4}rem`,
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
        }}
      >
        <div className="w-full h-full p-1.5 flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center [contain:layout_paint]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
