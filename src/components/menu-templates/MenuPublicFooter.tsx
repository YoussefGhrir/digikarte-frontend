"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

/**
 * Footer du menu public : adresse, tél, email.
 * Light variant : texte en gras, couleurs foncées pour contraste sur fond clair,
 * police artistique (écriture main) comme Bistro et Minimal.
 */
export function MenuPublicFooter({
  menu,
  locale,
  variant = "dark",
}: {
  menu: MenuPublicDto;
  locale: Locale;
  /** "light" pour fond clair (Bistro, Minimal) : texte sombre gras, lisible */
  variant?: "dark" | "light";
}) {
  const hasAny =
    menu.organizationName ||
    menu.organizationAddress ||
    menu.organizationPhone ||
    menu.organizationEmail;
  if (!hasAny) return null;
  const isLight = variant === "light";

  if (isLight) {
    return (
      <footer className="mx-auto max-w-4xl border-t border-[#5c4033]/30 px-3 pb-8 pt-6 mt-8">
        <p className="font-menu-script text-center text-xl font-semibold tracking-wide text-[#1a1512] mb-4">
          {t("menuFooterContact", locale)}
        </p>
        <div className="flex flex-col items-center gap-2 text-center">
          {menu.organizationName && (
            <p className="font-menu-script text-lg font-bold text-[#1a1512]">
              {menu.organizationName}
            </p>
          )}
          {menu.organizationAddress && (
            <p className="text-sm font-bold text-[#2c2420]">
              {menu.organizationAddress}
            </p>
          )}
          {menu.organizationPhone && (
            <p className="text-sm font-bold text-[#2c2420]">
              {t("menuFooterPhone", locale)}{" "}
              <a
                href={`tel:${menu.organizationPhone.replace(/\s/g, "")}`}
                className="text-[#1a1512] underline decoration-[#5c4033]/60 hover:decoration-[#5c4033]"
              >
                {menu.organizationPhone}
              </a>
            </p>
          )}
          {menu.organizationEmail && (
            <p className="text-sm font-bold text-[#2c2420]">
              <a
                href={`mailto:${menu.organizationEmail}`}
                className="text-[#1a1512] underline decoration-[#5c4033]/60 hover:decoration-[#5c4033]"
              >
                {menu.organizationEmail}
              </a>
            </p>
          )}
        </div>
      </footer>
    );
  }

  return (
    <footer
      className="mx-auto max-w-4xl px-3 pb-8 pt-6 mt-8 border-t border-[var(--white-alpha-20)]/50"
    >
      <p
        className="text-xs font-semibold uppercase tracking-[0.25em] text-center mb-4"
        style={{ color: "var(--gold)" }}
      >
        {t("menuFooterContact", locale)}
      </p>
      <div
        className="flex flex-col items-center gap-2 text-sm text-center font-medium"
        style={{ color: "var(--quick-silver)" }}
      >
        {menu.organizationName && (
          <p className="font-bold text-white/95">
            {menu.organizationName}
          </p>
        )}
        {menu.organizationAddress && <p>{menu.organizationAddress}</p>}
        {menu.organizationPhone && (
          <p>
            {t("menuFooterPhone", locale)}{" "}
            <a
              href={`tel:${menu.organizationPhone.replace(/\s/g, "")}`}
              className="hover:underline"
              style={{ color: "var(--gold)" }}
            >
              {menu.organizationPhone}
            </a>
          </p>
        )}
        {menu.organizationEmail && (
          <p>
            <a
              href={`mailto:${menu.organizationEmail}`}
              className="hover:underline"
              style={{ color: "var(--gold)" }}
            >
              {menu.organizationEmail}
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
