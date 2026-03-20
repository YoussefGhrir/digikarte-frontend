"use client";

import { menuListSummary, orgGet, type MenuDto, type OrganizationDto } from "@/lib/api";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { prefixWithLocale } from "@/lib/locale-path";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrganisationQrPage() {
  const params = useParams();
  const { locale } = useLanguage();
  const orgId = params.id;
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [org, setOrg] = useState<OrganizationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(orgId);
    if (!id || isNaN(id)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    Promise.all([menuListSummary(id), orgGet(id)])
      .then(([menuListData, orgData]) => {
        setMenus(menuListData);
        setOrg(orgData);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur"))
      .finally(() => setLoading(false));
  }, [orgId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 text-center">
        <p className="text-neutral-500">{t("orgLoading", locale)}</p>
      </div>
    );
  }

  const orgPath = prefixWithLocale(`/dashboard/organisations/${orgId}`, locale);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-forum text-2xl text-neutral-50">{t("menuQrTab", locale)}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {org ? t("menuQrPreviewHint", locale) : ""}
          </p>
        </div>
        <Link
          href={orgPath}
          className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-neutral-600 bg-neutral-800 px-4 py-2.5 text-sm font-medium text-neutral-200 hover:bg-neutral-700"
        >
          {t("dashboardBack", locale)}
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}

      {!org ? (
        <p className="text-neutral-500">{t("menuNotFound", locale)}</p>
      ) : menus.length === 0 ? (
        <div className="mx-auto w-full max-w-lg rounded-2xl border border-dashed border-amber-500/35 bg-neutral-900/60 px-6 py-10 text-center shadow-inner shadow-black/20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/90">
            {t("dashboardQrEmptyTitle", locale)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-300">
            {t("dashboardQrEmptyBody", locale)}
          </p>
          <Link
            href={orgPath}
            className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-amber-900/20 transition hover:bg-amber-400"
          >
            {t("dashboardQrEmptyCta", locale)}
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => {
            return (
              <Link
                key={menu.id}
                href={prefixWithLocale(`/dashboard/organisations/${orgId}/menus/${menu.id}/qr`, locale)}
                className="flex cursor-pointer flex-col rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden transition hover:border-amber-500/40 hover:bg-neutral-900/80 shadow-lg shadow-black/20"
              >
                <div className="flex h-[200px] w-full items-center justify-center rounded-t-2xl border-b border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 px-4">
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber-300">QR</p>
                    <p className="mt-1 text-sm font-medium text-neutral-200">{menu.title}</p>
                  </div>
                </div>
                <div className="p-4 flex flex-col items-center">
                  <span className="text-lg font-semibold text-neutral-50 text-center">{menu.title}</span>
                  <span className="mt-2 text-sm font-medium text-amber-400">
                    {t("menuQrPreviewPdf", locale)} → {t("menuQrPrint", locale)} / {t("menuQrDownload", locale)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
