"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IconEdit, IconPlus, IconTrash } from "@/components/icons";
import {
  adminCreateUser,
  adminDeleteUser,
  adminListUsers,
  adminResetPassword,
  adminUpdateUser,
  type AdminUserDto,
  isApiError,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { prefixWithLocale } from "@/lib/locale-path";

function isActiveSubscription(status: string) {
  const s = (status ?? "").toUpperCase();
  return s === "ACTIVE" || s === "TRIALING";
}

function ModalShell({
  title,
  children,
  onClose,
  closeLabel,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  closeLabel: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-forum text-xl text-neutral-50">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-neutral-800 bg-neutral-900/70 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-900"
            aria-label={closeLabel}
          >
            ×
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default function AdminAdminsPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const { user } = useAuth();
  const isSuperAdmin = Boolean((user as any)?.superAdmin);

  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createForm, setCreateForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    subscriptionBypass: true,
  });

  const [editUser, setEditUser] = useState<AdminUserDto | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    subscriptionBypass: true,
  });

  const [viewUser, setViewUser] = useState<AdminUserDto | null>(null);

  const [resetUser, setResetUser] = useState<AdminUserDto | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState("");

  const [revokeUser, setRevokeUser] = useState<AdminUserDto | null>(null);
  const [revokeSubmitting, setRevokeSubmitting] = useState(false);
  const [revokeError, setRevokeError] = useState("");

  const [deleteUser, setDeleteUser] = useState<AdminUserDto | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  async function reload() {
    setLoading(true);
    setError("");
    try {
      const data = await adminListUsers();
      setUsers(data);
    } catch (e) {
      if (isApiError(e) && (e.status === 401 || e.status === 403)) {
        router.replace(prefixWithLocale("/login", locale));
        return;
      }
      setError(e instanceof Error ? e.message : t("adminAdminsLoadErrorFallback", locale));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAdmins = useMemo(() => {
    const query = q.trim().toLowerCase();
    const admins = users.filter((u) => Boolean(u.admin));
    if (!query) return admins;
    return admins.filter((u) => {
      const hay = `${u.nom} ${u.prenom} ${u.email} ${u.telephone}`.toLowerCase();
      return hay.includes(query);
    });
  }, [users, q]);

  function openEdit(u: AdminUserDto) {
    setEditUser(u);
    setEditError("");
    setEditForm({
      nom: u.nom,
      prenom: u.prenom,
      telephone: u.telephone,
      subscriptionBypass: u.subscriptionBypass,
    });
  }

  async function handleCreate() {
    setCreateSubmitting(true);
    setCreateError("");
    try {
      await adminCreateUser({ ...createForm, admin: true });
      setCreateOpen(false);
      setCreateForm({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        password: "",
        subscriptionBypass: true,
      });
      await reload();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : t("adminAdminsCreateErrorFallback", locale));
    } finally {
      setCreateSubmitting(false);
    }
  }

  async function handleEditSave() {
    if (!editUser) return;
    setEditSubmitting(true);
    setEditError("");
    try {
      await adminUpdateUser(editUser.userId, editForm);
      setEditUser(null);
      await reload();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : t("adminAdminsEditErrorFallback", locale));
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleResetPassword() {
    if (!resetUser) return;
    setResetSubmitting(true);
    setResetError("");
    try {
      await adminResetPassword(resetUser.userId, resetPassword);
      setResetUser(null);
      setResetPassword("");
      await reload();
    } catch (e) {
      setResetError(e instanceof Error ? e.message : t("adminAdminsResetErrorFallback", locale));
    } finally {
      setResetSubmitting(false);
    }
  }

  async function handleRevokeAdmin() {
    if (!revokeUser) return;
    setRevokeSubmitting(true);
    setRevokeError("");
    try {
      await adminUpdateUser(revokeUser.userId, { admin: false });
      setRevokeUser(null);
      await reload();
    } catch (e) {
      setRevokeError(e instanceof Error ? e.message : t("adminAdminsRevokeErrorFallback", locale));
    } finally {
      setRevokeSubmitting(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteUser) return;
    setDeleteSubmitting(true);
    setDeleteError("");
    try {
      await adminDeleteUser(deleteUser.userId);
      setDeleteUser(null);
      await reload();
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : t("adminAdminsDeleteErrorFallback", locale));
    } finally {
      setDeleteSubmitting(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">{t("adminAdminsKicker", locale)}</p>
          <h1 className="mt-2 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">
            {t("adminAdminsTitle", locale)}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">{t("adminAdminsSubtitle", locale)}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400 disabled:opacity-60"
            disabled={loading}
          >
            <IconPlus className="h-4 w-4" />
            {t("adminAdminsAddAdmin", locale)}
          </button>

          <button
            type="button"
            onClick={() => void reload()}
            className="inline-flex items-center rounded-2xl border border-neutral-800 bg-neutral-950/40 px-4 py-2.5 text-sm font-semibold text-neutral-200 hover:bg-neutral-900"
            disabled={loading}
          >
            {t("adminRefresh", locale)}
          </button>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-3xl border border-neutral-600/90 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.45)] ring-1 ring-white/5 sm:p-5">
        <div className="min-w-0">
          <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">{t("adminUsersSearchLabel", locale)}</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("adminUsersSearchPlaceholder", locale)}
            className="mt-2 w-full min-w-0 rounded-2xl border border-neutral-600 bg-neutral-900/95 px-3.5 py-3 text-sm text-neutral-100 shadow-inner outline-none transition placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">{error}</div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 text-sm text-neutral-400">
          {t("adminUsersLoading", locale)}
        </div>
      ) : (
        <>
        <p className="text-xs text-neutral-400 md:hidden">{t("adminUsersOrgsMenusScrollHint", locale)}</p>
        <div className="relative z-0 -mx-1 w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain px-1 pb-1 max-lg:touch-pan-x max-lg:[scrollbar-width:thin] max-lg:[-webkit-overflow-scrolling:touch] lg:mx-0 lg:overflow-x-visible lg:px-0 lg:pb-0">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70">
            <table className="w-max min-w-full text-sm lg:w-full lg:min-w-0">
            <thead className="text-xs uppercase tracking-[0.14em] text-neutral-500">
              <tr className="border-b border-neutral-800">
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap first:pl-4">{t("profileFirstName", locale)}</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap">{t("profileLastName", locale)}</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap">{t("profileEmail", locale)}</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap">{t("profilePhone", locale)}</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap">{t("adminCountryLabel", locale)}</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap">{t("adminUsersOrganizationsLabel", locale)}</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap">{t("adminUsersMenusLabel", locale)}</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap">{t("adminUsersSubscriptionLabel", locale)}</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap">{t("adminUsersAccessLabel", locale)}</th>
                <th className="px-3 py-3 text-left font-medium whitespace-nowrap last:pr-4">{t("adminUsersActionsLabel", locale)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60">
              {filteredAdmins.map((u) => {
                const active = isActiveSubscription(u.subscriptionStatus);
                return (
                  <tr key={u.userId} className="hover:bg-neutral-900/40">
                    <td className="px-3 py-3 first:pl-4">
                      <span className="font-medium text-neutral-100 whitespace-nowrap">{u.prenom}</span>
                    </td>
                    <td className="px-3 py-3 text-neutral-200 whitespace-nowrap">{u.nom}</td>
                    <td className="px-3 py-3 text-neutral-300">
                      <span className="block max-w-[260px] truncate">{u.email}</span>
                    </td>
                    <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">{u.telephone}</td>
                    <td className="px-3 py-3 text-neutral-300 whitespace-nowrap">{u.country ?? "—"}</td>
                    <td className="px-3 py-3 text-neutral-300 tabular-nums whitespace-nowrap">{u.organizationsCount}</td>
                    <td className="px-3 py-3 text-neutral-300 tabular-nums whitespace-nowrap">{u.menusCount}</td>
                    <td className="px-3 py-3 min-w-[320px]">
                      <div className="flex flex-col gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                            active
                              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              : "bg-red-500/10 text-red-300 border-red-500/30"
                          }`}
                        >
                          {active ? t("adminSubscriptionActive", locale) : t("adminSubscriptionInactive", locale)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                          u.subscriptionBypass
                            ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                            : "border-neutral-700 bg-neutral-900/60 text-neutral-400"
                        }`}
                      >
                        {u.subscriptionBypass ? t("dashboardAdminVipShort", locale) : t("dashboardAdminNormalShort", locale)}
                      </span>
                    </td>
                    <td className="px-3 py-3 min-w-[520px] last:pr-4">
                      <div className="flex flex-nowrap items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewUser(u)}
                          className="rounded-lg bg-neutral-900/40 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-200 hover:bg-neutral-900 whitespace-nowrap"
                          aria-label={t("adminUsersViewAction", locale)}
                        >
                          {t("adminUsersViewAction", locale)}
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/90 text-white hover:bg-orange-400"
                          aria-label={t("adminUsersEditAction", locale)}
                        >
                          <IconEdit className="inline-block h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setRevokeUser(u);
                            setRevokeError("");
                          }}
                          className="rounded-lg bg-neutral-950/60 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-200 hover:bg-neutral-900 whitespace-nowrap"
                        >
                          {t("adminAdminsRemoveAdminAction", locale)}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setResetUser(u);
                            setResetPassword("");
                            setResetError("");
                          }}
                          className="rounded-lg bg-sky-600/90 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-500 whitespace-nowrap"
                          aria-label={t("adminUsersResetPasswordAction", locale)}
                        >
                          {t("adminUsersResetPasswordAction", locale)}
                        </button>

                        {isSuperAdmin && (
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteUser(u);
                              setDeleteError("");
                            }}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/90 text-white hover:bg-red-400"
                            aria-label={t("adminUsersDeleteAction", locale)}
                          >
                            <IconTrash className="inline-block h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredAdmins.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-neutral-500">
                    {t("adminUsersNoResult", locale)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
        </>
      )}

      {/* Create admin modal */}
      {createOpen && (
        <ModalShell
          title={t("adminAdminsAddAdminModalTitle", locale)}
          onClose={() => {
            setCreateOpen(false);
            setCreateError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            {createError && (
              <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{createError}</div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                  {t("profileFirstName", locale)}
                </span>
                <input
                  value={createForm.prenom}
                  onChange={(e) => setCreateForm((s) => ({ ...s, prenom: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                  {t("profileLastName", locale)}
                </span>
                <input
                  value={createForm.nom}
                  onChange={(e) => setCreateForm((s) => ({ ...s, nom: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("profileEmail", locale)}</span>
              <input
                value={createForm.email}
                onChange={(e) => setCreateForm((s) => ({ ...s, email: e.target.value }))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("profilePhone", locale)}</span>
              <input
                value={createForm.telephone}
                onChange={(e) => setCreateForm((s) => ({ ...s, telephone: e.target.value }))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("adminUsersPasswordLabel", locale)}</span>
              <input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm((s) => ({ ...s, password: e.target.value }))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
              />
            </label>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950/30 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-neutral-200">{t("adminUsersDirectAccessLabel", locale)}</p>
                <p className="text-xs text-neutral-500 mt-1">{t("adminUsersDirectAccessHint", locale)}</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  type="checkbox"
                  checked={createForm.subscriptionBypass}
                  onChange={(e) => setCreateForm((s) => ({ ...s, subscriptionBypass: e.target.checked }))}
                  className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-amber-500 focus:ring-amber-400/70"
                />
                {t("yes", locale)}
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
                disabled={createSubmitting}
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={() => void handleCreate()}
                className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-amber-400 disabled:opacity-60"
                disabled={createSubmitting}
              >
                {createSubmitting ? t("adminCreating", locale) : t("adminCreate", locale)}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Edit admin modal */}
      {editUser && (
        <ModalShell
          title={`${t("adminAdminsEditModalTitle", locale)} #${editUser.userId}`}
          onClose={() => {
            setEditUser(null);
            setEditError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            {editError && (
              <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{editError}</div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("profileFirstName", locale)}</span>
                <input
                  value={editForm.prenom}
                  onChange={(e) => setEditForm((s) => ({ ...s, prenom: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("profileLastName", locale)}</span>
                <input
                  value={editForm.nom}
                  onChange={(e) => setEditForm((s) => ({ ...s, nom: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("profilePhone", locale)}</span>
              <input
                value={editForm.telephone}
                onChange={(e) => setEditForm((s) => ({ ...s, telephone: e.target.value }))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
              />
            </label>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950/30 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-neutral-200">{t("adminUsersDirectAccessLabel", locale)}</p>
                <p className="text-xs text-neutral-500 mt-1">{t("adminAdminsDirectAccessHint", locale)}</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  type="checkbox"
                  checked={editForm.subscriptionBypass}
                  onChange={(e) => setEditForm((s) => ({ ...s, subscriptionBypass: e.target.checked }))}
                  className="h-4 w-4 rounded border-neutral-600 bg-neutral-900 text-amber-500 focus:ring-amber-400/70"
                />
                {t("yes", locale)}
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
                disabled={editSubmitting}
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={() => void handleEditSave()}
                className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-amber-400 disabled:opacity-60"
                disabled={editSubmitting}
              >
                {editSubmitting ? t("adminSaving", locale) : t("profileSave", locale)}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* View admin modal */}
      {viewUser && (
        <ModalShell
          title={t("adminAdminsViewModalTitle", locale)}
          onClose={() => setViewUser(null)}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {viewUser.profilePhotoBase64 ? (
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-amber-500/40 bg-neutral-800">
                  <img
                    src={`data:image/jpeg;base64,${viewUser.profilePhotoBase64}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-amber-300">
                  {(viewUser.prenom?.[0] ?? viewUser.nom?.[0] ?? "?").toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-forum text-lg text-neutral-50">
                  {viewUser.prenom} {viewUser.nom}
                </p>
                <p className="mt-1 text-xs text-neutral-400">{viewUser.email}</p>
                <p className="mt-1 text-xs text-neutral-500">{viewUser.telephone}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                  {t("adminCountryLabel", locale)}
                </p>
                <p className="mt-1 text-sm text-neutral-200">{viewUser.country ?? "—"}</p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                  {t("adminUsersSubscriptionLabel", locale)}
                </p>
                <p className="mt-1 text-sm text-neutral-200">{viewUser.subscriptionStatus}</p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                  {t("adminUsersOrganizationsLabel", locale)}
                </p>
                <p className="mt-1 text-sm text-neutral-200 tabular-nums">{viewUser.organizationsCount}</p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                  {t("adminUsersMenusLabel", locale)}
                </p>
                <p className="mt-1 text-sm text-neutral-200 tabular-nums">{viewUser.menusCount}</p>
              </div>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950/40 px-3 py-2 sm:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
                  {t("adminUsersAccessLabel", locale)}
                </p>
                <p className="mt-1 text-sm text-neutral-200">
                  {viewUser.subscriptionBypass ? t("dashboardAdminVipShort", locale) : t("dashboardAdminNormalShort", locale)}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-neutral-200">
              {t("adminUsersPasswordEncryptedHint", locale)}
            </div>
          </div>
        </ModalShell>
      )}

      {/* Reset password modal */}
      {resetUser && (
        <ModalShell
          title={`${t("adminUsersResetPasswordTitle", locale)} #${resetUser.userId}`}
          onClose={() => {
            setResetUser(null);
            setResetError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            {resetError && (
              <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{resetError}</div>
            )}

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-neutral-200">
              {t("adminUsersPasswordEncryptedHint", locale)}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                {t("adminUsersNewPasswordLabel", locale)}
              </span>
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
              />
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetUser(null)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
                disabled={resetSubmitting}
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={() => void handleResetPassword()}
                className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60"
                disabled={resetSubmitting}
              >
                {resetSubmitting ? t("adminSaving", locale) : t("adminUsersResetPasswordAction", locale)}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Revoke admin modal */}
      {revokeUser && (
        <ModalShell
          title={t("adminAdminsRevokeModalTitle", locale)}
          onClose={() => {
            setRevokeUser(null);
            setRevokeError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            {revokeError && (
              <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{revokeError}</div>
            )}
            <p className="text-sm text-neutral-300">
              {t("adminAdminsRevokeConfirmText", locale).replace("{email}", revokeUser.email)}
            </p>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/30 px-4 py-3 text-sm text-neutral-200">
              {t("adminAdminsRevokeNote", locale)}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRevokeUser(null);
                  setRevokeError("");
                }}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
                disabled={revokeSubmitting}
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={() => void handleRevokeAdmin()}
                className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60"
                disabled={revokeSubmitting}
              >
                {revokeSubmitting ? t("adminProcessing", locale) : t("adminAdminsRevokeAction", locale)}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Delete modal */}
      {deleteUser && (
        <ModalShell
          title={`${t("adminUsersDeleteModalTitle", locale)} #${deleteUser.userId}`}
          onClose={() => {
            setDeleteUser(null);
            setDeleteError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            {deleteError && (
              <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{deleteError}</div>
            )}
            <p className="text-sm text-neutral-300">
              {t("adminUsersDeleteConfirmText", locale).replace("{email}", deleteUser.email)}
            </p>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {t("adminUsersDeleteIrreversibleNote", locale)}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteUser(null)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
                disabled={deleteSubmitting}
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteUser()}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? t("adminProcessing", locale) : t("adminUsersDeleteAction", locale)}
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

