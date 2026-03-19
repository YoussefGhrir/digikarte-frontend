"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { t, type Locale } from "@/lib/i18n";
import {
  subscriptionGetMe,
  subscriptionCreateCheckoutSession,
  subscriptionConfirmCheckout,
  subscriptionListInvoices,
  subscriptionCancel,
  subscriptionSkipTrial,
  subscriptionCancelAtPeriodEnd,
  subscriptionReactivate,
  subscriptionOpenPaymentPortal,
  type SubscriptionDto,
  type InvoiceDto,
  type SubscriptionPlan,
  isApiError,
} from "@/lib/api";

function formatDateTime(value: string | null | undefined, locale: Locale) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(locale === "fr" ? "fr-FR" : locale === "de" ? "de-DE" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number, currency: string, locale: Locale) {
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

function planLabel(plan: SubscriptionPlan, locale: Locale) {
  if (plan === "MONTHLY") return t("subscriptionPlanMonthly", locale);
  if (plan === "SEMIANNUAL") return t("subscriptionPlanSemiannual", locale);
  return t("subscriptionPlanYearly", locale);
}

export default function SubscriptionPage() {
  const { locale } = useLanguage();
  const router = useRouter();
  const [sub, setSub] = useState<SubscriptionDto | null>(null);
  const [invoices, setInvoices] = useState<InvoiceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState<SubscriptionPlan | null>(null);
  const [actionLoading, setActionLoading] = useState<"cancel" | "skip" | "cancelAtEnd" | "reactivate" | "billingPortal" | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        // Si retour Stripe success avec session_id, persister immédiatement les IDs côté backend
        if (typeof window !== "undefined") {
          const params = new URLSearchParams(window.location.search);
          const success = params.get("success");
          const sessionId = params.get("session_id");
          if (success === "1" && sessionId) {
            try {
              await subscriptionConfirmCheckout(sessionId);
            } catch {
              // best-effort: on continue quand même le refresh
            }
          }
        }

        const [s, inv] = await Promise.all([subscriptionGetMe(), subscriptionListInvoices()]);
        if (!cancelled) {
          setSub(s);
          setInvoices(inv ?? []);
        }
      } catch (e) {
        if (cancelled) return;
        if (isApiError(e) && (e.status === 401 || e.status === 403)) {
          router.replace("/login");
          return;
        }
        setError(e instanceof Error ? e.message : "Erreur abonnement");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const isTrial = sub?.status === "TRIALING";
  const isActive = sub?.status === "ACTIVE";
  const isExpired = sub?.status === "EXPIRED";
  const isCancelled = sub?.status === "CANCELLED";

  const trialRemaining = useMemo(() => {
    if (!sub?.trialEnd || !isTrial) return null;
    const end = new Date(sub.trialEnd);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return t("subscriptionTrialEnded", locale);
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return t("subscriptionTrialRemaining", locale).replace("{days}", String(diffDays));
  }, [sub, isTrial, locale]);

  const activeRemaining = useMemo(() => {
    if (!sub?.currentPeriodEnd || !isActive) return null;
    const end = new Date(sub.currentPeriodEnd);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return null;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [sub, isActive]);

  async function handleChoosePlan(plan: SubscriptionPlan) {
    setError("");
    setCheckoutLoading(plan);
    try {
      const { checkoutUrl } = await subscriptionCreateCheckoutSession(plan, locale);
      window.location.href = checkoutUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur paiement");
      setCheckoutLoading(null);
    }
  }

  function handleStopTrial() {
    void (async () => {
      setError("");
      setActionLoading("cancel");
      try {
        await subscriptionCancel();
        // Recharge l'état abonnement après annulation
        const [s, inv] = await Promise.all([subscriptionGetMe(), subscriptionListInvoices()]);
        setSub(s);
        setInvoices(inv ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur annulation essai");
      } finally {
        setActionLoading(null);
      }
    })();
  }

  async function handleSkipTrial() {
    setError("");
    setActionLoading("skip");
    try {
      const newSub = await subscriptionSkipTrial();
      setSub(newSub);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur activation abonnement");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancelAtPeriodEnd() {
    setError("");
    setActionLoading("cancelAtEnd");
    try {
      const updated = await subscriptionCancelAtPeriodEnd();
      setSub(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur annulation abonnement");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReactivate() {
    setError("");
    setActionLoading("reactivate");
    try {
      const updated = await subscriptionReactivate();
      setSub(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réactivation abonnement");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleOpenBillingPortal() {
    setError("");
    setActionLoading("billingPortal");
    try {
      const { url } = await subscriptionOpenPaymentPortal(locale);
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur portail de paiement");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="relative space-y-8 text-neutral-100">
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/70">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-emerald-400/10 border-t-emerald-400" />
            <p className="text-xs font-medium tracking-[0.24em] text-neutral-300 uppercase">
              {t("subscriptionLoading", locale)}
            </p>
          </div>
        </div>
      )}
      {/* Bandeau récap très visible (uniquement essai ou actif) */}
      {sub && (isTrial || isActive) && (
        <div
          className={`rounded-3xl border px-4 py-3 text-xs md:text-sm ${
            isTrial
              ? "border-amber-400/60 bg-amber-500/10 text-amber-100"
              : isActive
                ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100"
                : "border-red-500/50 bg-red-950/70 text-red-100"
          }`}
        >
          {isTrial && (
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <p className="font-semibold uppercase tracking-[0.18em]">
                {t("subscriptionStatusTrial", locale)}
              </p>
              <p>
                {trialRemaining} ·{" "}
                {t("subscriptionBannerTrialContinue", locale)}{" "}
                <span className="font-semibold">
                  {planLabel(sub.plan, locale)}{" "}
                  {formatAmount(sub.amount, sub.currency, locale)}
                </span>
                .
              </p>
            </div>
          )}
          {isActive && (
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
              <p className="font-semibold uppercase tracking-[0.18em]">
                {t("subscriptionStatusActive", locale)}
              </p>
              <p>
                {t("subscriptionBannerActiveUntil", locale)}{" "}
                <span className="font-semibold">
                  {formatDateTime(sub.currentPeriodEnd ?? null, locale)}
                </span>
                {activeRemaining != null && (
                  <>
                    {" "}
                    ·{" "}
                    <span className="font-semibold">
                      {activeRemaining}{" "}
                      {activeRemaining > 1
                        ? t("subscriptionDaysRemaining", locale)
                        : t("subscriptionDayRemaining", locale)}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            {t("subscriptionKicker", locale)}
          </p>
          <h1 className="mt-2 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">
            {t("subscriptionTitle", locale)}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-neutral-400">
            {t("subscriptionSubtitle", locale)}
          </p>
          {isTrial && trialRemaining && (
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-amber-200">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-300" />
              {trialRemaining}
            </p>
          )}
        </div>
        {isActive && sub && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-100 max-w-xs">
            <p className="font-semibold uppercase tracking-[0.2em]">
              {t("subscriptionStatusActive", locale)}
            </p>
            <p className="mt-1">
              {planLabel(sub.plan, locale)} ·{" "}
              {formatAmount(sub.amount, sub.currency, locale)}
            </p>
            <p className="mt-1 text-[11px] text-emerald-200/80">
              {t("subscriptionNextPayment", locale)}{" "}
              {formatDateTime(sub.nextPaymentAt ?? sub.currentPeriodEnd ?? null, locale)}
            </p>
            {activeRemaining != null && (
              <p className="mt-1 text-[11px] text-emerald-200/80">
                {activeRemaining}{" "}
                {activeRemaining > 1
                  ? t("subscriptionDaysRemaining", locale)
                  : t("subscriptionDayRemaining", locale)}
              </p>
            )}
          </div>
        )}
      </div>

      {error && !loading && (
        <div className="rounded-2xl border border-red-900/60 bg-red-950/70 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Plans : affichés seulement si aucun abonnement actif/essai, une fois le chargement terminé */}
      {!loading && (!sub || isCancelled || isExpired) && (
      <section className="grid gap-5 md:grid-cols-3">
        {/* Mensuel */}
        <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-600/70 bg-gradient-to-br from-neutral-950 via-neutral-925 to-neutral-900 p-5 shadow-xl shadow-emerald-500/15">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
            {t("subscriptionPlanMonthly", locale)}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-forum text-3xl text-neutral-50">
              {formatAmount(9.99, sub?.currency ?? "EUR", locale)}
            </span>
            <span className="text-xs text-neutral-500">
              {t("subscriptionPerMonth", locale)}
            </span>
          </div>
          <p className="mt-2 text-xs text-neutral-400">
            {t("subscriptionMonthlyHint", locale)}
          </p>
          <ul className="mt-4 space-y-1.5 text-xs text-neutral-300">
            <li>• {t("subscriptionFeatureUnlimitedMenus", locale)}</li>
            <li>• {t("subscriptionFeatureQr", locale)}</li>
            <li>• {t("subscriptionFeatureSupport", locale)}</li>
          </ul>
          <button
            type="button"
            onClick={() => handleChoosePlan("MONTHLY")}
            disabled={checkoutLoading !== null}
            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-[0_14px_30px_rgba(16,185,129,0.55)] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60 md:mt-auto"
          >
            {checkoutLoading === "MONTHLY"
              ? t("subscriptionProcessing", locale)
              : sub && sub.plan === "MONTHLY"
                ? t("subscriptionChoosePlan", locale)
                : t("subscriptionChoosePlan", locale)}
          </button>
        </article>

        {/* Semestriel */}
        <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-amber-500/60 bg-neutral-950/90 p-5 shadow-xl shadow-amber-500/10">
          <div className="absolute right-3 top-3 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-900">
            {t("subscriptionBadgePopular", locale)}
          </div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
            {t("subscriptionPlanSemiannual", locale)}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-forum text-3xl text-neutral-50">
              {formatAmount(49, sub?.currency ?? "EUR", locale)}
            </span>
            <span className="text-xs text-neutral-400">
              {t("subscriptionPer6Months", locale)}
            </span>
          </div>
          <p className="mt-1 text-xs text-emerald-300">
            {t("subscriptionSemiannualSaving", locale)}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            {t("subscriptionSemiannualHint", locale)}
          </p>
          <ul className="mt-4 space-y-1.5 text-xs text-neutral-300">
            <li>• {t("subscriptionFeatureUnlimitedMenus", locale)}</li>
            <li>• {t("subscriptionFeatureQr", locale)}</li>
            <li>• {t("subscriptionFeatureSupport", locale)}</li>
          </ul>
          <button
            type="button"
            onClick={() => handleChoosePlan("SEMIANNUAL")}
            disabled={checkoutLoading !== null}
            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-[0_14px_30px_rgba(251,191,36,0.5)] transition hover:-translate-y-0.5 hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60 md:mt-auto"
          >
            {checkoutLoading === "SEMIANNUAL"
              ? t("subscriptionProcessing", locale)
              : sub && sub.plan === "SEMIANNUAL"
                ? t("subscriptionChoosePlan", locale)
                : t("subscriptionChoosePlan", locale)}
          </button>
        </article>

        {/* Annuel */}
        <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-emerald-500/70 bg-gradient-to-br from-neutral-950 to-neutral-900 p-5 shadow-lg shadow-emerald-500/15">
          <div className="absolute right-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-900">
            {t("subscriptionBadgeBest", locale)}
          </div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
            {t("subscriptionPlanYearly", locale)}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-forum text-3xl text-neutral-50">
              {formatAmount(89, sub?.currency ?? "EUR", locale)}
            </span>
            <span className="text-xs text-neutral-400">
              {t("subscriptionPerYear", locale)}
            </span>
          </div>
          <p className="mt-1 text-xs text-emerald-300">
            {t("subscriptionYearlySaving", locale)}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            {t("subscriptionYearlyHint", locale)}
          </p>
          <ul className="mt-4 space-y-1.5 text-xs text-neutral-300">
            <li>• {t("subscriptionFeatureUnlimitedMenus", locale)}</li>
            <li>• {t("subscriptionFeatureQr", locale)}</li>
            <li>• {t("subscriptionFeatureSupport", locale)}</li>
          </ul>
          <button
            type="button"
            onClick={() => handleChoosePlan("YEARLY")}
            disabled={checkoutLoading !== null}
            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center rounded-2xl bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-[0_14px_30px_rgba(16,185,129,0.5)] transition hover:-translate-y-0.5 hover:bg-emerald-300 disabled:cursor-wait disabled:opacity-60 md:mt-auto"
          >
            {checkoutLoading === "YEARLY"
              ? t("subscriptionProcessing", locale)
              : sub && sub.plan === "YEARLY"
                ? t("subscriptionChoosePlan", locale)
                : t("subscriptionChoosePlan", locale)}
          </button>
        </article>
      </section>
      )}

      {/* Détails abonnement + factures */}
      <section
        className={
          sub
            ? "grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
            : "grid gap-5 md:grid-cols-1"
        }
      >
        {sub && (
          <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-5">
            <h2 className="font-forum text-xl text-neutral-50">
              {t("subscriptionCurrentPlanTitle", locale)}
            </h2>
            <p className="mt-1 text-xs text-neutral-500">
              {t("subscriptionCurrentPlanSubtitle", locale)}
            </p>

            {isCancelled || isExpired ? (
              <div className="mt-4 space-y-3 text-sm text-neutral-200">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    {t("subscriptionStatusLabel", locale)}
                  </p>
                  <p className="mt-1 font-medium text-red-300">
                    {isCancelled
                      ? t("subscriptionStatusCancelled", locale)
                      : t("subscriptionStatusExpired", locale)}
                  </p>
                </div>
                <p className="text-xs text-neutral-400">
                  {t("subscriptionBannerInactive", locale)}
                </p>
              </div>
            ) : (
              <>
                <div className="mt-4 grid gap-4 text-sm text-neutral-200 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      {t("subscriptionStatusLabel", locale)}
                    </p>
                    <p className="mt-1 font-medium">
                      {sub.status === "TRIALING" && t("subscriptionStatusTrial", locale)}
                      {sub.status === "ACTIVE" && t("subscriptionStatusActive", locale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      {t("subscriptionPlanLabel", locale)}
                    </p>
                    <p className="mt-1 font-medium">
                      {planLabel(sub.plan, locale)} ·{" "}
                      {formatAmount(sub.amount, sub.currency, locale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      {t("subscriptionCurrentPeriodEnd", locale)}
                    </p>
                    <p className="mt-1 font-medium">
                      {formatDateTime(sub.currentPeriodEnd ?? sub.trialEnd ?? null, locale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      {t("subscriptionNextPaymentLabel", locale)}
                    </p>
                    <p className="mt-1 font-medium">
                      {formatDateTime(sub.nextPaymentAt ?? sub.currentPeriodEnd ?? null, locale)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                      {t("subscriptionAutoRenewLabel", locale)}
                    </p>
                    <p className="mt-1 font-medium">
                      {sub.autoRenew
                        ? t("subscriptionAutoRenewOn", locale)
                        : t("subscriptionAutoRenewOff", locale)}
                    </p>
                  </div>
                </div>

                {isTrial && (
                  <div className="mt-5 flex flex-col gap-2 border-t border-neutral-800 pt-4 text-xs">
                    <p className="text-neutral-400">
                      {t("subscriptionTrialActionsHint", locale)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleSkipTrial}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
                      >
                        {actionLoading === "skip"
                          ? t("subscriptionSkipTrialProcessing", locale)
                          : t("subscriptionSkipTrialCta", locale)}
                      </button>
                      <button
                        type="button"
                        onClick={handleStopTrial}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center rounded-full border border-red-500/60 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/10 disabled:cursor-wait disabled:opacity-60"
                      >
                        {actionLoading === "cancel"
                          ? t("subscriptionCancelTrialProcessing", locale)
                          : t("subscriptionCancelTrialCta", locale)}
                      </button>
                    </div>
                  </div>
                )}

                {isActive && (
                  <div className="mt-5 flex flex-col gap-2 border-t border-neutral-800 pt-4 text-xs">
                    <p className="text-neutral-400">
                      {sub.autoRenew
                        ? t("subscriptionAutoRenewOn", locale)
                        : t("subscriptionAutoRenewOff", locale)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {sub.autoRenew ? (
                        <button
                          type="button"
                          onClick={handleCancelAtPeriodEnd}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center rounded-full border border-amber-400/70 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/10 disabled:cursor-wait disabled:opacity-60"
                        >
                          {actionLoading === "cancelAtEnd"
                            ? t("subscriptionCancelAtEndProcessing", locale)
                            : t("subscriptionCancelAtEndCta", locale)}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleReactivate}
                          disabled={actionLoading !== null}
                          className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-neutral-900 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
                        >
                          {actionLoading === "reactivate"
                            ? t("subscriptionReactivateProcessing", locale)
                            : t("subscriptionReactivateCta", locale)}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleOpenBillingPortal}
                        disabled={actionLoading !== null}
                        className="inline-flex items-center rounded-full border border-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-100 hover:border-emerald-400 hover:text-emerald-200 disabled:cursor-wait disabled:opacity-60"
                      >
                        {t("subscriptionManagePaymentMethod" as any, locale)}
                      </button>
                    </div>
                    {!sub.autoRenew && (
                      <p className="mt-2 text-[11px] font-medium text-amber-300">
                        {t("subscriptionCancelScheduledNote" as any, locale)}
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-5">
          <h2 className="font-forum text-xl text-neutral-50">
            {t("subscriptionInvoicesTitle", locale)}
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            {t("subscriptionInvoicesSubtitle", locale)}
          </p>
          {invoices.length === 0 ? (
            <p className="mt-4 text-xs text-neutral-500">
              {t("subscriptionNoInvoices", locale)}
            </p>
          ) : (
            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto pr-1 text-xs text-neutral-200">
              {invoices.map((inv) => (
                <li
                  key={inv.id}
                  className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/70 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">
                      {formatAmount(inv.amount, inv.currency, locale)}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {formatDateTime(inv.paidAt ?? inv.createdAt, locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                        inv.status === "PAID"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40"
                          : inv.status === "PENDING"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/40"
                            : "bg-red-500/10 text-red-300 border border-red-500/40"
                      }`}
                    >
                      {inv.status === "PAID" &&
                        t("subscriptionInvoiceStatusPaid", locale)}
                      {inv.status === "PENDING" &&
                        t("subscriptionInvoiceStatusPending", locale)}
                      {inv.status === "FAILED" &&
                        t("subscriptionInvoiceStatusFailed", locale)}
                    </span>
                    {inv.invoiceUrl && (
                      <a
                        href={inv.invoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex cursor-pointer items-center rounded-full border border-neutral-700 px-2.5 py-1 text-[11px] text-neutral-200 hover:border-emerald-400 hover:text-emerald-200"
                      >
                        {t("subscriptionInvoiceDownload", locale)}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </div>
          )}
        </div>
      </section>

      <p className="text-[11px] text-neutral-500">
        {t("subscriptionLegalNote", locale)}
      </p>
    </div>
  );
}

