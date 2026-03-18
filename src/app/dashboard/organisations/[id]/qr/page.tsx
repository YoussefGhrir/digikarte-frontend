"use client";

import { menuListSummary, orgGet, type MenuDto, type OrganizationDto } from "@/lib/api";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-forum text-2xl text-neutral-50">{t("menuQrTab", locale)}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {org ? t("menuQrPreviewHint", locale) : ""}
          </p>
        </div>
        <Link
          href={`/dashboard/organisations/${orgId}`}
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
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center">
          <p className="text-neutral-400">{t("menuNoItems", locale)}</p>
          <Link
            href={`/dashboard/organisations/${orgId}`}
            className="mt-4 inline-block text-sm text-amber-400 hover:text-amber-300"
          >
            {t("dashboardNavMenusOfOrg", locale)} →
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => {
            const menuPreviewUrl =
              typeof window !== "undefined"
                ? `${window.location.origin}/menu/${menu.slug}`
                : `https://digikarte.de/menu/${menu.slug}`;
            return (
              <Link
                key={menu.id}
                href={`/dashboard/organisations/${orgId}/menus/${menu.id}/qr`}
                className="flex cursor-pointer flex-col rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden transition hover:border-amber-500/40 hover:bg-neutral-900/80 shadow-lg shadow-black/20"
              >
                <div className="w-full h-[200px] rounded-t-2xl overflow-hidden border-b border-neutral-800 bg-neutral-200 relative">
                  <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                      width: "500%",
                      height: 1000,
                      transform: "scale(0.2)",
                    }}
                  >
                    <iframe
                      src={menuPreviewUrl}
                      title={menu.title}
                      className="w-full border-0 pointer-events-none"
                      style={{ width: "100%", height: 1000 }}
                    />
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
