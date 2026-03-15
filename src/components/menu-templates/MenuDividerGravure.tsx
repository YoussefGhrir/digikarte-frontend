"use client";

/**
 * Motif gravure moderne : losanges reliés + lignes + points (séparateur / bordure décorative).
 * Couleur contrôlée par la prop color (ex: or, brun).
 */
export function MenuDividerGravure({
  color = "currentColor",
  className = "",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center py-3 ${className}`} aria-hidden>
      <svg
        width="120"
        height="12"
        viewBox="0 0 120 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Ligne gauche + point */}
        <line x1="0" y1="6" x2="35" y2="6" stroke={color} strokeWidth="0.8" strokeOpacity="0.9" />
        <circle cx="0" cy="6" r="1.2" fill={color} fillOpacity="0.95" />
        {/* Losanges reliés (W/M) */}
        <path
          d="M35 6 L42 2 L49 6 L42 10 Z M49 6 L56 2 L63 6 L56 10 Z M63 6 L70 2 L77 6 L70 10 Z"
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.9"
          fill="none"
        />
        {/* Ligne droite + point */}
        <line x1="77" y1="6" x2="120" y2="6" stroke={color} strokeWidth="0.8" strokeOpacity="0.9" />
        <circle cx="120" cy="6" r="1.2" fill={color} fillOpacity="0.95" />
      </svg>
    </div>
  );
}
