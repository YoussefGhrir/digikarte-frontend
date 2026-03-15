"use client";

import { IconEdit, IconTrash, IconBuilding, IconQr, IconMenuList } from "@/components/icons";
import {
  orgCreate,
  orgList,
  orgUpdate,
  orgDelete,
  menuList,
  type OrganizationDto,
  isApiError,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const { locale } = useLanguage();
  const [orgs, setOrgs] = useState<OrganizationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressPostalCode, setAddressPostalCode] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationDto | null>(null);
  const [editName, setEditName] = useState("");
  const [editAddressLine1, setEditAddressLine1] = useState("");
  const [editAddressPostalCode, setEditAddressPostalCode] = useState("");
  const [editAddressCity, setEditAddressCity] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [deletingOrg, setDeletingOrg] = useState<OrganizationDto | null>(null);
  const [currentOrgId, setCurrentOrgId] = useState<number | null>(null);
  const [totalMenus, setTotalMenus] = useState<number>(0);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { logout } = useAuth();

  const view = searchParams.get("view") === "organisations" ? "organisations" : "dashboard";

  useEffect(() => {
    if (typeof window === "undefined" || orgs.length === 0) return;
    const stored = window.localStorage.getItem("currentOrgId");
    if (stored) {
      const id = Number(stored);
      if (orgs.some((o) => o.id === id)) setCurrentOrgId(id);
      else setCurrentOrgId(orgs[0]?.id ?? null);
    } else {
      setCurrentOrgId(orgs[0]?.id ?? null);
    }
  }, [orgs]);

  const load = useCallback(async () => {
    try {
      const list = await orgList();
      setOrgs(list);
      if (list.length > 0) {
        const menusPerOrg = await Promise.all(list.map((o) => menuList(o.id)));
        const total = menusPerOrg.reduce((s, arr) => s + arr.length, 0);
        setTotalMenus(total);
      } else {
        setTotalMenus(0);
      }
    } catch (e) {
      if (isApiError(e) && (e.status === 401 || e.status === 404)) {
        logout({ redirectTo: "/" });
        return;
      }
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await orgCreate({
        name,
        addressLine1: addressLine1 || undefined,
        addressPostalCode: addressPostalCode || undefined,
        addressCity: addressCity || undefined,
        country: country || undefined,
        phone: phone || undefined,
        email: email || undefined,
      });
      setName("");
      setAddressLine1("");
      setAddressPostalCode("");
      setAddressCity("");
      setCountry("");
      setPhone("");
      setEmail("");
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  function openEdit(org: OrganizationDto) {
    setEditingOrg(org);
    setEditName(org.name);
    setEditAddressLine1(org.addressLine1 ?? "");
    setEditAddressPostalCode(org.addressPostalCode ?? "");
    setEditAddressCity(org.addressCity ?? "");
    setEditCountry(org.country ?? "");
    setEditPhone(org.phone ?? "");
    setEditEmail(org.email ?? "");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingOrg) return;
    setError("");
    setSubmitting(true);
    try {
      await orgUpdate(editingOrg.id, {
        name: editName,
        addressLine1: editAddressLine1 || undefined,
        addressPostalCode: editAddressPostalCode || undefined,
        addressCity: editAddressCity || undefined,
        country: editCountry || undefined,
        phone: editPhone || undefined,
        email: editEmail || undefined,
      });
      setEditingOrg(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingOrg) return;
    const deletedId = deletingOrg.id;
    setError("");
    setSubmitting(true);
    try {
      await orgDelete(deletedId);
      if (typeof window !== "undefined") {
        const stored = window.localStorage.getItem("currentOrgId");
        if (stored && Number(stored) === deletedId) {
          window.localStorage.removeItem("currentOrgId");
        }
      }
      setDeletingOrg(null);
      await load();
      if (pathname === `/dashboard/organisations/${deletedId}`) {
        router.push("/dashboard");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
    <div className="space-y-8 text-neutral-100">
      {/* Header + CTA (selon la vue) */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            {view === "dashboard" ? t("dashboardNavDashboard", locale) : t("dashboardNavOrganisations", locale)}
          </p>
          <h1 className="mt-2 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">
            {view === "dashboard" ? t("dashboardPageTitle", locale) : t("dashboardMyOrgs", locale)}
          </h1>
          <p className="mt-2 text-sm text-neutral-400 max-w-xl">
            {view === "dashboard" ? t("dashboardPageSubtitle", locale) : `${orgs.length} ${t("dashboardPlacesConfigured", locale)}`}
          </p>
        </div>
        {view === "organisations" && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="cursor-pointer rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400"
            >
              {showForm ? t("dashboardCancel", locale) : t("dashboardNewOrg", locale)}
            </button>
          </div>
        )}
      </div>

      {/* Loading & error */}
      {loading && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-sm text-neutral-400">
          {t("dashboardLoadingOrgsPage", locale)}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-900/60 bg-red-950/70 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Vue Dashboard : organisation courante + stats */}
      {view === "dashboard" && !loading && orgs.length > 0 && currentOrgId && (() => {
        const currentOrg = orgs.find((o) => o.id === currentOrgId);
        if (!currentOrg) return null;
        return (
          <div className="rounded-2xl border border-amber-500/30 bg-neutral-900/80 p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/90">
                {t("dashboardCurrentOrg", locale)}
              </p>
              <p className="mt-1 truncate font-forum text-lg text-neutral-50">
                {currentOrg.name}
              </p>
              {orgs.length > 1 && (
                <p className="mt-0.5 text-xs text-neutral-500">
                  {t("dashboardSwitchOrgHint", locale)}
                </p>
              )}
            </div>
            <Link
              href={`/dashboard/organisations/${currentOrg.id}`}
              className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-400 sm:mt-0"
            >
              {t("orgMenusTitle", locale)} · {currentOrg.name}
              <span aria-hidden>→</span>
            </Link>
          </div>
        );
      })()}

      {/* Stats overview (vue Dashboard uniquement) */}
      {view === "dashboard" && !loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-sm shadow-black/40">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              {t("dashboardStatOrgs", locale)}
            </p>
            <p className="mt-2 font-forum text-3xl text-amber-300">
              {orgs.length.toString().padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {t("dashboardStatOrgsDesc", locale)}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-sm shadow-black/40">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              {t("dashboardStatMenus", locale)}
            </p>
            <p className="mt-2 font-forum text-3xl text-emerald-300">
              {totalMenus.toString().padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {t("dashboardStatMenusDesc", locale)}
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-sm shadow-black/40">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              {t("dashboardStatQr", locale)}
            </p>
            <p className="mt-2 font-forum text-3xl text-sky-300">
              {totalMenus.toString().padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {t("dashboardStatQrDesc", locale)}
            </p>
          </div>
        </div>
      )}

      {/* Creation form (vue Organisations uniquement) */}
      {view === "organisations" && showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-6 shadow-sm shadow-black/40"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="font-forum text-xl text-neutral-50">
              {t("dashboardCreateOrgTitle", locale)}
            </h2>
            <p className="text-xs text-neutral-500">
              {t("dashboardNaming1", locale)}
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)]">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("dashboardOrgNameLabel", locale)}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500 focus:bg-neutral-900 focus:shadow-[0_0_0_1px_rgba(245,158,11,0.45)]"
                  placeholder={t("dashboardOrgNamePlaceholder", locale)}
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90">
                {t("orgContactSectionTitle", locale)}
              </p>
              <p className="text-[11px] text-neutral-500 -mt-1">
                {t("orgContactSectionHint", locale)}
              </p>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgAddressLine1Label", locale)}
                </label>
                <input
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500"
                  placeholder={t("orgAddressLine1Placeholder", locale)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                    {t("orgAddressPostalCodeLabel", locale)}
                  </label>
                  <input
                    value={addressPostalCode}
                    onChange={(e) => setAddressPostalCode(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                    {t("orgAddressCityLabel", locale)}
                  </label>
                  <input
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgCountryLabel", locale)}
                </label>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500"
                  placeholder={t("orgCountryPlaceholder", locale)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgPhoneLabel", locale)}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500"
                  placeholder={t("orgPhonePlaceholder", locale)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgEmailLabel", locale)}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-neutral-700/80 bg-gradient-to-br from-neutral-900/90 to-neutral-950 shadow-lg shadow-black/30 overflow-hidden">
              {/* En-tête chic avec accent */}
              <div className="border-l-4 border-amber-500/90 bg-neutral-900/50 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400/95">
                  {t("dashboardNamingTipLabel", locale)}
                </p>
                <h3 className="mt-1 font-forum text-xl sm:text-2xl text-neutral-50">
                  {t("dashboardNamingBestPractices", locale)}
                </h3>
              </div>
              <div className="flex-1 px-5 py-5">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-semibold">1</span>
                    <span>{t("dashboardNaming1", locale)}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-semibold">2</span>
                    <span>{t("dashboardNaming2", locale)}</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-neutral-300">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-semibold">3</span>
                    <span>{t("dashboardNaming3", locale)}</span>
                  </li>
                </ul>
              </div>
              <div className="border-t border-neutral-800 px-5 py-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex cursor-pointer items-center justify-center rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-neutral-900 shadow-md hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-neutral-950 disabled:cursor-wait disabled:opacity-60 transition-colors"
                >
                  {submitting ? t("dashboardCreating", locale) : t("dashboardCreateOrgButton", locale)}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Edit organisation modal */}
      {editingOrg && (
        <form
          onSubmit={handleUpdate}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditingOrg(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-neutral-50">
              {t("dashboardEditOrgTitle", locale)}
            </h2>
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("dashboardOrgNameLabel", locale)}
                </label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 focus:border-amber-500"
                  placeholder={t("dashboardOrgNamePlaceholder", locale)}
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400/90 pt-2">
                {t("orgContactSectionTitle", locale)}
              </p>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgAddressLine1Label", locale)}
                </label>
                <input
                  value={editAddressLine1}
                  onChange={(e) => setEditAddressLine1(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 focus:border-amber-500"
                  placeholder={t("orgAddressLine1Placeholder", locale)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                    {t("orgAddressPostalCodeLabel", locale)}
                  </label>
                  <input
                    value={editAddressPostalCode}
                    onChange={(e) => setEditAddressPostalCode(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                    {t("orgAddressCityLabel", locale)}
                  </label>
                  <input
                    value={editAddressCity}
                    onChange={(e) => setEditAddressCity(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgCountryLabel", locale)}
                </label>
                <input
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 focus:border-amber-500"
                  placeholder={t("orgCountryPlaceholder", locale)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgPhoneLabel", locale)}
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 focus:border-amber-500"
                  placeholder={t("orgPhonePlaceholder", locale)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgEmailLabel", locale)}
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingOrg(null)}
                className="cursor-pointer rounded-xl bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-500"
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400 disabled:opacity-60"
              >
                {submitting ? t("dashboardSaving", locale) : t("profileSave", locale)}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Delete confirmation */}
      {deletingOrg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setDeletingOrg(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-neutral-50">
              {t("dashboardDeleteOrg", locale)}: {deletingOrg.name}
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              {t("dashboardDeleteOrgConfirm", locale)}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingOrg(null)}
                className="cursor-pointer rounded-xl bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-500"
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
              >
                {submitting ? t("dashboardSaving", locale) : t("dashboardDeleteOrg", locale)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Organisations list (vue Organisations uniquement) */}
      {view === "organisations" && !loading && (
        <>
          {orgs.length === 0 && !showForm ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-800 bg-neutral-950/70 px-6 py-14 text-center">
              <p className="font-forum text-xl text-neutral-50">
                {t("dashboardNoOrgYet", locale)}
              </p>
              <p className="mt-2 max-w-md text-sm text-neutral-500">
                {t("dashboardNoOrgSubtitle", locale)}
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-6 cursor-pointer rounded-2xl bg-amber-500 px-5 py-2 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400"
              >
                {t("dashboardFirstOrgButton", locale)}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-forum text-xl text-neutral-50">
                  {t("dashboardMyOrgs", locale)}
                </h2>
                <p className="text-xs text-neutral-500">
                  {orgs.length} {t("dashboardPlacesConfigured", locale)}
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {orgs.map((org) => (
                  <div
                    key={org.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-lg shadow-black/20 transition hover:border-amber-500/40 hover:bg-neutral-900/80 hover:shadow-xl hover:shadow-amber-500/5"
                  >
                    {/* Bandeau / zone avatar type PDP (Instagram/FB) */}
                    <div className="relative flex h-[140px] items-center justify-center border-b border-neutral-800 bg-gradient-to-br from-neutral-800/90 to-neutral-900">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(245,158,11,0.12),transparent)] opacity-0 transition group-hover:opacity-100" />
                      {org.organizationLogoBase64 ? (
                        <img
                          src={`data:image/jpeg;base64,${org.organizationLogoBase64}`}
                          alt=""
                          className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-neutral-700/80 ring-offset-2 ring-offset-neutral-900 shadow-xl"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/20 ring-2 ring-neutral-700/80 ring-offset-2 ring-offset-neutral-900 shadow-xl">
                          <IconBuilding className="h-9 w-9 text-amber-400/90" />
                        </div>
                      )}
                      {/* Actions au survol */}
                      <div className="absolute right-2 top-2 z-10 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            openEdit(org);
                          }}
                          className="cursor-pointer rounded-lg bg-white/95 p-1.5 text-neutral-800 shadow-md hover:bg-white"
                          title={t("dashboardEditOrg", locale)}
                          aria-label={t("dashboardEditOrg", locale)}
                        >
                          <IconEdit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setDeletingOrg(org);
                          }}
                          className="cursor-pointer rounded-lg bg-red-500 p-1.5 text-white shadow-md hover:bg-red-400"
                          title={t("dashboardDeleteOrg", locale)}
                          aria-label={t("dashboardDeleteOrg", locale)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {/* Contenu carte */}
                    <Link href={`/dashboard/organisations/${org.id}`} className="flex flex-1 flex-col p-4">
                      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-amber-400/90">
                        {t("dashboardOrgLabel", locale)}
                      </p>
                      <h3 className="mt-1 font-forum text-lg text-neutral-50">
                        {org.name}
                      </h3>
                      {(org.addressCity || org.country) && (
                        <p className="mt-1 truncate text-xs text-neutral-500">
                          {[org.addressCity, org.country].filter(Boolean).join(", ")}
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-800/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
                          <IconMenuList className="h-3.5 w-3.5 text-amber-400/80" />
                          {t("dashboardMenusQr", locale)}
                        </span>
                        <span className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-400">
                          <IconQr className="h-3.5 w-3.5" />
                          {t("dashboardViewMenus", locale)}
                          <span aria-hidden>→</span>
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
    </>
  );
}
