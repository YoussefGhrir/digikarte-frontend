"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { adminGetMetrics, type AdminMetricsDto, isApiError } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import { prefixWithLocale } from "@/lib/locale-path";
import { t } from "@/lib/i18n";

function formatCurrency(amount: number, currency: string, locale: string) {
  try {
    return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : locale === "de" ? "de-DE" : "en-GB", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function badgeForStatus(status: string) {
  const s = status.toUpperCase();
  if (s === "ACTIVE") return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40";
  if (s === "TRIALING") return "bg-amber-500/15 text-amber-300 border border-amber-500/40";
  if (s === "CANCELLED") return "bg-red-500/10 text-red-300 border border-red-500/40";
  if (s === "EXPIRED") return "bg-neutral-700 text-neutral-200 border border-neutral-600";
  if (s === "NO_SUBSCRIPTION") return "bg-neutral-900/70 text-neutral-400 border border-neutral-800";
  return "bg-neutral-900/70 text-neutral-400 border border-neutral-800";
}

export default function AdminDashboardPage() {
  const { locale } = useLanguage();
  const router = useRouter();

  const [metrics, setMetrics] = useState<AdminMetricsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await adminGetMetrics(30);
        if (!cancelled) setMetrics(data);
      } catch (e) {
        if (cancelled) return;
        if (isApiError(e) && (e.status === 401 || e.status === 403)) {
          router.replace(prefixWithLocale("/login", locale));
          return;
        }
        setError(e instanceof Error ? e.message : t("adminMetricsLoadErrorFallback", locale));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [router, locale]);

  const revenue = useMemo(() => {
    if (!metrics) return null;
    return formatCurrency(metrics.revenuePaid ?? 0, metrics.revenueCurrency || "EUR", locale);
  }, [metrics, locale]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 text-sm text-neutral-400">
        {t("adminMetricsLoading", locale)}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-sm text-red-200">
        {error}
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">{t("adminDashboardTitle", locale)}</p>
        <h1 className="mt-2 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">{t("adminDashboardOverview", locale)}</h1>
        <p className="mt-2 text-sm text-neutral-400">{t("adminDashboardSubtitle", locale)}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("adminUsersLabel", locale)}</p>
          <p className="mt-2 font-forum text-3xl text-amber-300 tabular-nums">{metrics.totalUsers.toString().padStart(2, "0")}</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("adminActiveLabel", locale)}</p>
          <p className="mt-2 font-forum text-3xl text-emerald-300 tabular-nums">
            {(metrics.activeSubscriptions + metrics.trialingSubscriptions).toString().padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            {t("adminActiveLabel", locale)} + {t("adminStatusTrialingLabel", locale)}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("adminCancelledLabel", locale)}</p>
          <p className="mt-2 font-forum text-3xl text-red-300 tabular-nums">{metrics.cancelledSubscriptions.toString().padStart(2, "0")}</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("adminRevenueApprox", locale)}</p>
          <p className="mt-2 font-forum text-3xl text-sky-300 tabular-nums">{revenue}</p>
          <p className="mt-1 text-xs text-neutral-500">{t("adminPaidInvoices30Days", locale)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("adminSubscriptionRate", locale)}</p>
            <p className="mt-2 font-forum text-3xl text-emerald-300 tabular-nums">
              {(metrics.subscriptionActiveRate * 100).toFixed(1)}%
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              ({metrics.activeSubscriptions} {t("adminActiveLabel", locale)} + {metrics.trialingSubscriptions}{" "}
              {t("adminStatusTrialingLabel", locale)}) / total
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${badgeForStatus("ACTIVE")}`}>
              {t("adminActiveLabel", locale).toUpperCase()}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${badgeForStatus("TRIALING")}`}>
              {t("adminStatusTrialingLabel", locale).toUpperCase()}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${badgeForStatus("EXPIRED")}`}>
              {t("subscriptionStatusExpired", locale).toUpperCase()}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${badgeForStatus("CANCELLED")}`}>
              {t("adminCancelledLabel", locale).toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full min-w-0 rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-forum text-lg text-neutral-50">{t("adminCountryDistribution", locale)}</h2>
          <p className="text-xs text-neutral-500">{t("adminTopCountriesHint", locale)}</p>
        </div>
        <div className="mt-4 w-full max-w-full overflow-x-auto [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr className="border-b border-neutral-800">
                <th className="px-3 py-3 text-left font-medium first:pl-4">{t("adminCountryLabel", locale)}</th>
                <th className="px-3 py-3 text-left font-medium">{t("adminUsersLabel", locale)}</th>
                <th className="px-3 py-3 text-left font-medium">{t("adminMenusLabel", locale)}</th>
                <th className="px-3 py-3 text-left font-medium">{t("adminActiveTrialHeader", locale)}</th>
                <th className="px-3 py-3 text-left font-medium">{t("subscriptionStatusExpired", locale)}</th>
                <th className="px-3 py-3 text-left font-medium">{t("adminCancelledLabel", locale)}</th>
                <th className="px-3 py-3 text-left font-medium last:pr-4">{t("adminRateLabel", locale)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60">
              {metrics.byCountry.map((c) => (
                <tr key={c.country} className="hover:bg-neutral-900/40">
                  <td className="px-3 py-3 font-medium first:pl-4">{c.country}</td>
                  <td className="px-3 py-3 text-neutral-300 tabular-nums">{c.usersCount}</td>
                  <td className="px-3 py-3 text-neutral-300 tabular-nums">{c.menusCount}</td>
                  <td className="px-3 py-3 text-neutral-200 tabular-nums">
                    {c.activeSubscriptions}/{c.trialingSubscriptions}
                  </td>
                  <td className="px-3 py-3 tabular-nums">{c.expiredSubscriptions}</td>
                  <td className="px-3 py-3 tabular-nums">{c.cancelledSubscriptions}</td>
                  <td className="px-3 py-3 tabular-nums last:pr-4">{(c.subscriptionRate * 100).toFixed(1)}%</td>
                </tr>
              ))}
              {metrics.byCountry.length === 0 && (
                <tr>
                  <td className="py-6 text-neutral-500" colSpan={7}>
                    {t("adminNoCountryYet", locale)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

