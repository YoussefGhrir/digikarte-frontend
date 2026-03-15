"use client";

/**
 * Affichage professionnel du nom de l'organisation quand il n'y a pas de logo.
 * Style artistique, lisible, adapté au cadre logo.
 */
export function MenuLogoFallback({
  organizationName,
  accentColor,
  className = "",
}: {
  organizationName: string;
  accentColor: string;
  className?: string;
}) {
  const name = (organizationName || "").trim() || "Menu";
  const words = name.split(/\s+/);
  const line1 = words.length > 1 ? words.slice(0, Math.ceil(words.length / 2)).join(" ") : name;
  const line2 = words.length > 1 ? words.slice(Math.ceil(words.length / 2)).join(" ") : null;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-1 ${className}`}
      style={{ color: accentColor }}
    >
      <span className="font-menu-script text-xl sm:text-2xl font-semibold leading-tight block">
        {line1}
      </span>
      {line2 && (
        <span className="font-menu-script text-lg sm:text-xl font-semibold leading-tight block mt-0.5">
          {line2}
        </span>
      )}
    </div>
  );
}
