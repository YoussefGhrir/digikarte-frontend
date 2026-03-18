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
      <footer className="mx-auto mt-10 max-w-4xl rounded-3xl border border-black/5 bg-white/70 px-4 pb-6 pt-5 shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col items-center gap-2 text-center">
          {menu.organizationName && (
            <p className="font-forum text-lg font-semibold tracking-wide text-neutral-900">
              {menu.organizationName}
            </p>
          )}
          {menu.organizationAddress && (
            <p className="text-xs text-neutral-700">
              {menu.organizationAddress}
            </p>
          )}
          {(menu.organizationPhone || menu.organizationEmail) && (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-neutral-800">
              {menu.organizationPhone && (
                <span>
                  {t("menuFooterPhone", locale)}{" "}
                  <a
                    href={`tel:${menu.organizationPhone.replace(/\s/g, "")}`}
                    className="font-semibold text-neutral-900 underline decoration-neutral-400/70 underline-offset-2 hover:decoration-neutral-700"
                  >
                    {menu.organizationPhone}
                  </a>
                </span>
              )}
              {menu.organizationEmail && (
                <span>
                  <a
                    href={`mailto:${menu.organizationEmail}`}
                    className="font-semibold text-neutral-900 underline decoration-neutral-400/70 underline-offset-2 hover:decoration-neutral-700"
                  >
                    {menu.organizationEmail}
                  </a>
                </span>
              )}
            </div>
          )}
          {menu.organizationLogoBase64 && (
            <div className="mt-4 flex w-full justify-end">
              <img
                src={`data:image/jpeg;base64,${menu.organizationLogoBase64}`}
                alt={menu.organizationName ?? ""}
                className="h-10 max-w-[140px] object-contain"
              />
            </div>
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
        className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.25em]"
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
        {menu.organizationLogoBase64 && (
          <div className="mt-4 flex w-full justify-end">
            <img
              src={`data:image/jpeg;base64,${menu.organizationLogoBase64}`}
              alt={menu.organizationName ?? ""}
              className="h-10 max-w-[140px] object-contain"
            />
          </div>
        )}
      </div>
    </footer>
  );
}
