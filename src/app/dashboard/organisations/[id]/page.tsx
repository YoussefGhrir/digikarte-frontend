"use client";

import { IconEdit, IconTrash } from "@/components/icons";
import Link from "next/link";
import {
  menuCreate,
  menuDelete,
  menuList,
  menuUpdate,
  orgGet,
  orgUpdatePhoto,
  type MenuDto,
  type OrganizationDto,
  isApiError,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { t, locales, localeLabels, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function OrganisationPage() {
  const params = useParams();
  const { locale, setLocale } = useLanguage();
  const id = Number(params.id);
  const [org, setOrg] = useState<OrganizationDto | null>(null);
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingMenu, setEditingMenu] = useState<MenuDto | null>(null);
  const [editMenuTitle, setEditMenuTitle] = useState("");
  const [editMenuDescription, setEditMenuDescription] = useState("");
  const [deletingMenu, setDeletingMenu] = useState<MenuDto | null>(null);
  const [deleteMenuSubmitting, setDeleteMenuSubmitting] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const { logout } = useAuth();
  const [menuLocale, setMenuLocale] = useState<Locale>(locale);

  const load = useCallback(async () => {
    if (!id || isNaN(id)) return;
    try {
      const [orgData, menusData] = await Promise.all([
        orgGet(id),
        menuList(id),
      ]);
      setOrg(orgData);
      setMenus(menusData);
    } catch (e) {
      if (isApiError(e) && e.status === 401) {
        logout({ redirectTo: "/" });
        return;
      }
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [id, logout]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreateMenu(e: React.FormEvent) {
    e.preventDefault();
    if (!org) return;
    setError("");
    setSubmitting(true);
    try {
      await menuCreate({ organizationId: org.id, title, description });
      // Fixer la langue de travail du menu sur celle choisie à la création
      setLocale(menuLocale);
      setTitle("");
      setDescription("");
      setShowForm(false);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  function openEditMenu(menu: MenuDto) {
    setEditingMenu(menu);
    setEditMenuTitle(menu.title);
    setEditMenuDescription(menu.description ?? "");
  }

  async function handleUpdateMenu(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMenu) return;
    setError("");
    setSubmitting(true);
    try {
      await menuUpdate(editingMenu.id, { title: editMenuTitle, description: editMenuDescription || undefined });
      setEditingMenu(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteMenu() {
    if (!deletingMenu) return;
    const menuId = deletingMenu.id;
    setError("");
    setDeleteMenuSubmitting(true);
    try {
      await menuDelete(menuId);
      setDeletingMenu(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setDeleteMenuSubmitting(false);
    }
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !org) return;
    setLogoError("");
    setLogoUploading(true);
    try {
      await orgUpdatePhoto(org.id, file);
      await load();
    } catch (e) {
      setLogoError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  }

  if (loading) {
    return <p className="text-stone-500">{t("orgLoading", locale)}</p>;
  }

  if (!org) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-sm text-red-200">
        {t("orgNotFound", locale)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-400 hover:text-amber-300"
      >
        <span aria-hidden>←</span>
        {t("dashboardNavOrganisations", locale)}
      </Link>
      <section className="rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900/80 via-neutral-950/80 to-neutral-900/80 p-5 sm:p-6 shadow-lg shadow-black/40">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              {t("orgSectionTitle", locale)}
            </p>
            <h1 className="mt-1 font-forum text-3xl sm:text-4xl tracking-tight text-neutral-50">
              {org.name}
            </h1>
            {org.description && (
              <p className="mt-2 max-w-xl text-sm text-neutral-400 mx-auto md:mx-0">
                {org.description}
              </p>
            )}
          </div>
          <div className="shrink-0 flex flex-col items-center md:items-end gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {t("orgLogo", locale)}
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-full border-[3px] border-amber-400/80 bg-neutral-950 shadow-xl shadow-black/60">
                {org.organizationLogoBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${org.organizationLogoBase64}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-forum text-amber-300">
                    {org.name.charAt(0)}
                  </div>
                )}
              </div>
              <label className="cursor-pointer mt-2 sm:mt-0">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="sr-only"
                  onChange={handleLogoChange}
                  disabled={logoUploading}
                  aria-label={t("orgLogoChange", locale)}
                />
                <span className="inline-block rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400 disabled:opacity-50">
                  {logoUploading ? t("dashboardLoading", locale) : t("orgLogoChange", locale)}
                </span>
              </label>
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">{t("orgLogoHint", locale)}</p>
            {logoError && <p className="mt-1 text-xs text-red-400">{logoError}</p>}
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-inner shadow-black/40">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-forum text-2xl text-neutral-50">{t("orgMenusTitle", locale)}</h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="cursor-pointer rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400"
        >
          {showForm ? t("dashboardCancel", locale) : t("orgNewMenu", locale)}
        </button>
        </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {showForm && (
          <form
            onSubmit={handleCreateMenu}
            className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 shadow"
          >
          <div className="mb-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              {t("orgMenuTitleLabel", locale)}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-stone-300 px-4 py-2"
            />
            <p className="mt-1 text-xs text-neutral-500">
              {t("orgMenuTitleOptionalInfo", locale)}
            </p>
          </div>
          <div className="mb-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              {t("orgMenuDescLabel", locale)}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-stone-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              {t("menuLanguageLabel", locale)}
            </label>
            <select
              value={menuLocale}
              onChange={(e) => setMenuLocale(e.target.value as Locale)}
              required
              className="w-full rounded-full border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-100"
            >
              {locales.map((lng) => (
                <option key={lng} value={lng}>
                  {localeLabels[lng]}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-neutral-500">
              {t("menuLanguageHint", locale)}
            </p>
          </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 cursor-pointer rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-emerald-400 disabled:opacity-50"
            >
              {submitting ? t("orgCreatingMenu", locale) : t("orgCreateMenuButton", locale)}
            </button>
          </form>
      )}

      {menus.length === 0 && !showForm ? (
          <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/40 p-10 text-center text-sm text-neutral-400">
          {t("orgNoMenus", locale)}
        </div>
      ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <div
              key={menu.id}
              className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 shadow-sm shadow-black/30 transition hover:border-amber-400/70 hover:bg-neutral-900"
            >
              <div className="absolute right-3 top-3 z-10 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    openEditMenu(menu);
                  }}
                  className="cursor-pointer rounded-lg bg-orange-500 p-1.5 text-white shadow hover:bg-orange-400"
                  title={t("menuEditButton", locale)}
                  aria-label={t("menuEditButton", locale)}
                >
                  <IconEdit className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setDeletingMenu(menu);
                  }}
                  className="cursor-pointer rounded-lg bg-red-500 p-1.5 text-white shadow hover:bg-red-400"
                  title={t("menuDeleteButton", locale)}
                  aria-label={t("menuDeleteButton", locale)}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
              <div className="block pr-24">
                <h3 className="font-forum text-xl text-neutral-50">
                  {menu.title}
                </h3>
                {menu.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                    {menu.description}
                  </p>
                )}
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                  {menu.items?.length ?? 0} {t("orgItemsCount", locale)}
                </p>
                <Link
                  href={`/dashboard/organisations/${id}/menus/${menu.id}`}
                  className="mt-3 inline-block cursor-pointer rounded-lg bg-blue-500 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow hover:bg-blue-400"
                >
                  {t("menuViewButton", locale)}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal édition menu */}
      {editingMenu && (
        <form
          onSubmit={handleUpdateMenu}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setEditingMenu(null)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-neutral-50">
              {t("menuEditTitle", locale)}
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgMenuTitleLabel", locale)}
                </label>
                <input
                  value={editMenuTitle}
                  onChange={(e) => setEditMenuTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 focus:border-amber-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  {t("orgMenuDescLabel", locale)}
                </label>
                <textarea
                  value={editMenuDescription}
                  onChange={(e) => setEditMenuDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 focus:border-amber-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingMenu(null)}
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

      {/* Modal confirmation suppression menu */}
      {deletingMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setDeletingMenu(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-neutral-50">
              {t("dashboardDeleteOrg", locale)}: {deletingMenu.title}
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              {t("menuDeleteConfirm", locale)}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingMenu(null)}
                className="cursor-pointer rounded-xl bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-500"
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={handleDeleteMenu}
                disabled={deleteMenuSubmitting}
                className="cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
              >
                {deleteMenuSubmitting ? t("dashboardSaving", locale) : t("dashboardDeleteOrg", locale)}
              </button>
            </div>
          </div>
        </div>
      )}
      </section>
    </div>
  );
}
