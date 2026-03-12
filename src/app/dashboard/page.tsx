"use client";

import { IconEdit, IconTrash } from "@/components/icons";
import {
  orgCreate,
  orgList,
  orgUpdate,
  orgDelete,
  type OrganizationDto,
  isApiError,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function DashboardPage() {
  const { locale } = useLanguage();
  const [orgs, setOrgs] = useState<OrganizationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingOrg, setEditingOrg] = useState<OrganizationDto | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [deletingOrg, setDeletingOrg] = useState<OrganizationDto | null>(null);
  const [currentOrgId, setCurrentOrgId] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

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
      await orgCreate({ name, description });
      setName("");
      setDescription("");
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
    setEditDescription(org.description ?? "");
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingOrg) return;
    setError("");
    setSubmitting(true);
    try {
      await orgUpdate(editingOrg.id, { name: editName, description: editDescription || undefined });
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
      {/* Header + CTA */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            {t("dashboardNavDashboard", locale)}
          </p>
          <h1 className="mt-2 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">
            {t("dashboardPageTitle", locale)}
          </h1>
          <p className="mt-2 text-sm text-neutral-400 max-w-xl">
            {t("dashboardPageSubtitle", locale)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="cursor-pointer rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400"
          >
            {showForm ? t("dashboardCancel", locale) : t("dashboardNewOrg", locale)}
          </button>
        </div>
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

      {/* Organisation courante : accès rapide aux menus */}
      {!loading && orgs.length > 0 && currentOrgId && (() => {
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

      {/* Stats overview */}
      {!loading && (
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
              --
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
              --
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              {t("dashboardStatQrDesc", locale)}
            </p>
          </div>
        </div>
      )}

      {/* Creation form */}
      {showForm && (
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
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("dashboardOrgDescLabel", locale)}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500 focus:bg-neutral-900 focus:shadow-[0_0_0_1px_rgba(245,158,11,0.45)]"
                  placeholder={t("dashboardOrgDescPlaceholder", locale)}
                />
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/60 p-4 text-xs text-neutral-400">
              <div>
                <p className="font-semibold text-neutral-100">
                  {t("dashboardNamingBestPractices", locale)}
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>{t("dashboardNaming1", locale)}</li>
                  <li>{t("dashboardNaming2", locale)}</li>
                  <li>{t("dashboardNaming3", locale)}</li>
                </ul>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? t("dashboardCreating", locale) : t("dashboardCreateOrgButton", locale)}
              </button>
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
            <div className="mt-4 space-y-4">
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
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("dashboardOrgDescLabel", locale)}
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 focus:border-amber-500"
                  placeholder={t("dashboardOrgDescPlaceholder", locale)}
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

      {/* Organisations list */}
      {!loading && (
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
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {orgs.map((org) => (
                  <div
                    key={org.id}
                    className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-950/95 to-neutral-900/90 p-5 shadow-sm shadow-black/40 transition hover:border-amber-500/50 hover:shadow-[0_18px_45px_rgba(0,0,0,0.65)]"
                  >
                    <div className="absolute right-3 top-3 z-10 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          openEdit(org);
                        }}
                        className="cursor-pointer rounded-lg bg-orange-500 p-1.5 text-white shadow hover:bg-orange-400"
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
                        className="cursor-pointer rounded-lg bg-red-500 p-1.5 text-white shadow hover:bg-red-400"
                        title={t("dashboardDeleteOrg", locale)}
                        aria-label={t("dashboardDeleteOrg", locale)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </button>
                    </div>
                    <Link href={`/dashboard/organisations/${org.id}`} className="block">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                        <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-amber-500/15 blur-3xl" />
                      </div>
                      <div className="relative pr-24">
                        <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                          {t("dashboardOrgLabel", locale)}
                        </p>
                        <h3 className="mt-1 font-forum text-lg text-neutral-50">
                          {org.name}
                        </h3>
                        {org.description && (
                          <p className="mt-2 line-clamp-3 text-xs text-neutral-400">
                            {org.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                          <span className="rounded-full border border-neutral-800 px-2 py-0.5 text-[11px] uppercase tracking-[0.18em]">
                            {t("dashboardMenusQr", locale)}
                          </span>
                          <span className="flex cursor-pointer items-center gap-1 rounded-lg bg-blue-500 px-2 py-1 text-[11px] font-medium text-white hover:bg-blue-400">
                            {t("dashboardViewMenus", locale)}
                            <span aria-hidden>↗</span>
                          </span>
                        </div>
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
