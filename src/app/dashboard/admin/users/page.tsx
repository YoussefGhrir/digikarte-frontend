"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconBuilding,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@/components/icons";
import {
  adminCreateUser,
  adminDeleteUser,
  adminListUsers,
  adminResetPassword,
  adminUpdateUser,
  adminUserOrganizations,
  type AdminUserDto,
  type AdminUserOrganizationDto,
  isApiError,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { t, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { prefixWithLocale } from "@/lib/locale-path";

function statusBadge(status: string) {
  const s = (status ?? "").toUpperCase();
  if (s === "ACTIVE") return "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40";
  if (s === "TRIALING") return "bg-amber-500/15 text-amber-300 border border-amber-500/40";
  if (s === "EXPIRED") return "bg-neutral-700 text-neutral-200 border border-neutral-600";
  if (s === "CANCELLED") return "bg-red-500/10 text-red-300 border border-red-500/40";
  if (s === "NO_SUBSCRIPTION") return "bg-neutral-900/70 text-neutral-400 border border-neutral-800";
  return "bg-neutral-900/70 text-neutral-400 border border-neutral-800";
}

function isActiveSubscription(status: string) {
  const s = (status ?? "").toUpperCase();
  return s === "ACTIVE" || s === "TRIALING";
}

function subscriptionPlanLabel(plan: string | null, locale: Locale) {
  const p = (plan ?? "").toUpperCase();
  if (p === "MONTHLY") return t("subscriptionPlanMonthly", locale);
  if (p === "SEMIANNUAL") return t("subscriptionPlanSemiannual", locale);
  if (p === "YEARLY") return t("subscriptionPlanYearly", locale);
  if (!p) return "—";
  return plan;
}

type SortKey =
  | "userId"
  | "prenom"
  | "nom"
  | "email"
  | "telephone"
  | "country"
  | "organizationsCount"
  | "menusCount"
  | "subscriptionStatus"
  | "subscriptionBypass";

type SortDir = "asc" | "desc";

function subscriptionRank(status: string) {
  const s = (status ?? "").toUpperCase();
  // Plus petit = plus haut tri
  switch (s) {
    case "ACTIVE":
      return 0;
    case "TRIALING":
      return 1;
    case "EXPIRED":
      return 2;
    case "CANCELLED":
      return 3;
    case "NO_SUBSCRIPTION":
      return 4;
    default:
      return 5;
  }
}

function ModalShell({
  title,
  children,
  onClose,
  closeLabel,
  wide,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  closeLabel: string;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`w-full rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl ${wide ? "max-w-2xl" : "max-w-lg"}`}
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

export default function AdminUsersPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const { user } = useAuth();
  const pathname = usePathname();
  const isNormalRoute = pathname?.includes("/dashboard/admin/users/normal") ?? false;
  const isSuperAdmin = Boolean((user as any)?.superAdmin);

  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  type UsersView = "bypass" | "normal" | "all";
  const [view, setView] = useState<UsersView>(() => (isNormalRoute ? "normal" : "bypass"));

  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("prenom");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

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

  const [resetUser, setResetUser] = useState<AdminUserDto | null>(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState("");

  const [deleteUser, setDeleteUser] = useState<AdminUserDto | null>(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [viewUser, setViewUser] = useState<AdminUserDto | null>(null);

  const [orgsForUser, setOrgsForUser] = useState<AdminUserDto | null>(null);
  const [orgsDetail, setOrgsDetail] = useState<AdminUserOrganizationDto[] | null>(null);
  const [orgsLoading, setOrgsLoading] = useState(false);
  const [orgsError, setOrgsError] = useState("");

  const [actionUser, setActionUser] = useState<AdminUserDto | null>(null);
  const [actionMode, setActionMode] = useState<"require" | "vip" | null>(null);
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

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
      setError(e instanceof Error ? e.message : t("adminUsersLoadErrorFallback", locale));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function openUserOrgs(u: AdminUserDto) {
    setOrgsForUser(u);
    setOrgsDetail(null);
    setOrgsError("");
    setOrgsLoading(true);
    try {
      const data = await adminUserOrganizations(u.userId);
      setOrgsDetail(data);
    } catch (e) {
      if (isApiError(e) && (e.status === 401 || e.status === 403)) {
        router.replace(prefixWithLocale("/login", locale));
        return;
      }
      setOrgsError(e instanceof Error ? e.message : t("adminUsersOrgsMenusLoadError", locale));
    } finally {
      setOrgsLoading(false);
    }
  }

  useEffect(() => {
    // Les routes sont séparées : VIP = /users, Normal = /users/normal.
    setView(isNormalRoute ? "normal" : "bypass");
  }, [isNormalRoute]);

  const filteredSorted = useMemo(() => {
    const query = q.trim().toLowerCase();
    const nonAdminUsers = users.filter((u) => !Boolean(u.admin) && !Boolean(u.superAdmin));
    const viewFiltered =
      view === "all"
        ? nonAdminUsers
        : view === "bypass"
          ? nonAdminUsers.filter((u) => u.subscriptionBypass)
          : nonAdminUsers.filter((u) => !u.subscriptionBypass);

    const baseByQuery = query
      ? viewFiltered.filter((u) => {
          const hay =
            `${u.nom} ${u.prenom} ${u.email} ${u.telephone} ${u.country ?? ""}`.toLowerCase();
          return hay.includes(query);
        })
      : viewFiltered;
    const base =
      statusFilter === "all"
        ? baseByQuery
        : baseByQuery.filter((u) => {
            const active = isActiveSubscription(u.subscriptionStatus);
            return statusFilter === "active" ? active : !active;
          });

    const dir = sortDir === "asc" ? 1 : -1;
    const sorted = [...base].sort((a, b) => {
      switch (sortKey) {
        case "userId":
          return dir * (a.userId - b.userId);
        case "prenom":
          return dir * a.prenom.localeCompare(b.prenom);
        case "nom":
          return dir * a.nom.localeCompare(b.nom);
        case "email":
          return dir * a.email.localeCompare(b.email);
        case "telephone":
          return dir * a.telephone.localeCompare(b.telephone);
        case "country":
          return dir * (a.country ?? "").localeCompare(b.country ?? "");
        case "organizationsCount":
          return dir * (a.organizationsCount - b.organizationsCount);
        case "menusCount":
          return dir * (a.menusCount - b.menusCount);
        case "subscriptionBypass":
          return dir * (Number(a.subscriptionBypass) - Number(b.subscriptionBypass));
        case "subscriptionStatus":
          return dir * (subscriptionRank(a.subscriptionStatus) - subscriptionRank(b.subscriptionStatus));
      }
    });

    return sorted;
  }, [q, sortDir, sortKey, users, view, statusFilter]);

  function openAccessAction(user: AdminUserDto) {
    setActionError("");
    if (!user.subscriptionBypass) {
      setActionError(t("adminUsersRequireSubscriptionVipOnlyError", locale));
      return;
    }
    setActionUser(user);
    // VIP = subscriptionBypass true => action = Exiger abonnement.
    setActionMode("require");
  }

  async function confirmAccessAction() {
    if (!actionUser || !actionMode) return;
    setActionSubmitting(true);
    setActionError("");
    try {
      const nextBypass = actionMode === "vip";
      await adminUpdateUser(actionUser.userId, { subscriptionBypass: nextBypass });
      setActionUser(null);
      setActionMode(null);
      const nextPath = nextBypass ? "/dashboard/admin/users" : "/dashboard/admin/users/normal";
      router.push(prefixWithLocale(nextPath, locale));
    } catch (e) {
      setActionError(e instanceof Error ? e.message : t("adminUsersActionErrorFallback", locale));
    } finally {
      setActionSubmitting(false);
    }
  }

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
      const shouldBypass = createForm.subscriptionBypass;
      await adminCreateUser(createForm);
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
      setCreateError(e instanceof Error ? e.message : t("adminUsersCreateErrorFallback", locale));
    } finally {
      setCreateSubmitting(false);
    }
  }

  async function handleEditSave() {
    if (!editUser) return;
    setEditSubmitting(true);
    setEditError("");
    try {
      const updated = await adminUpdateUser(editUser.userId, editForm);
      setEditUser(null);

      // Si on change subscriptionBypass, rediriger vers la bonne table.
      if (updated?.subscriptionBypass) {
        router.push(prefixWithLocale("/dashboard/admin/users", locale));
      } else {
        router.push(prefixWithLocale("/dashboard/admin/users/normal", locale));
      }

      // Pas de reload immédiat : la redirection rechargera la bonne table.
    } catch (e) {
      setEditError(e instanceof Error ? e.message : t("adminUsersEditErrorFallback", locale));
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleRequireSubscriptionFromEdit() {
    if (!editUser) return;
    setEditSubmitting(true);
    setEditError("");
    try {
      await adminUpdateUser(editUser.userId, { subscriptionBypass: false });
      setEditUser(null);
      router.push(prefixWithLocale("/dashboard/admin/users/normal", locale));
    } catch (e) {
      setEditError(e instanceof Error ? e.message : t("adminUsersRequireSubscriptionErrorFallback", locale));
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
      setResetError(e instanceof Error ? e.message : t("adminUsersResetErrorFallback", locale));
    } finally {
      setResetSubmitting(false);
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
      setDeleteError(e instanceof Error ? e.message : t("adminUsersDeleteErrorFallback", locale));
    } finally {
      setDeleteSubmitting(false);
    }
  }

  function renderUserActions(u: AdminUserDto) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void openUserOrgs(u)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/15 whitespace-nowrap"
        >
          <IconBuilding className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {t("adminUsersOrgsMenusAction", locale)}
        </button>
        <button
          type="button"
          onClick={() => setViewUser(u)}
          className="rounded-lg bg-neutral-900/40 px-2.5 py-1.5 text-[11px] font-semibold text-neutral-200 hover:bg-neutral-900 whitespace-nowrap"
          aria-label={t("adminUsersViewAction", locale)}
        >
          <span className="inline-flex items-center gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t("adminUsersViewAction", locale)}
          </span>
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
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">{t("adminUsersKicker", locale)}</p>
          <h1 className="mt-2 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">
            {isNormalRoute ? t("adminUsersTitleNormal", locale) : t("adminUsersTitleVip", locale)}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            {isNormalRoute
              ? t("adminUsersSubtitleNormal", locale)
              : t("adminUsersSubtitleVip", locale)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isNormalRoute && (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400 disabled:opacity-60"
              disabled={loading}
            >
              <IconPlus className="h-4 w-4" />
              {t("adminUsersAddUser", locale)}
            </button>
          )}
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

      <div className="box-border w-full min-w-0 max-w-full rounded-3xl border border-neutral-600/90 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/10 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="min-w-0">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              {t("adminUsersSearchLabel", locale)}
            </label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("adminUsersSearchPlaceholder", locale)}
              className="mt-2 w-full min-w-0 rounded-2xl border border-neutral-600 bg-neutral-900/95 px-3.5 py-3 text-sm text-neutral-100 shadow-inner outline-none ring-0 transition placeholder:text-neutral-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/25"
            />
          </div>
          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:flex lg:flex-wrap lg:items-end lg:gap-3">
            <div className="min-w-0 sm:max-lg:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                {t("adminUsersStatusFilterLabel", locale)}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="w-full min-w-0 rounded-xl border border-neutral-600 bg-neutral-900/95 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              >
                <option value="all">{t("adminUsersStatusAllOption", locale)}</option>
                <option value="active">{t("adminUsersStatusActiveOption", locale)}</option>
                <option value="inactive">{t("adminUsersStatusInactiveOption", locale)}</option>
              </select>
            </div>
            <div className="min-w-0 sm:max-lg:col-span-2 lg:flex-1 lg:min-w-[280px]">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                {t("adminUsersSortLabel", locale)}
              </label>
              <div className="flex min-w-0 gap-2">
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value as SortKey)}
                  className="min-w-0 flex-1 rounded-xl border border-neutral-600 bg-neutral-900/95 px-3 py-2.5 text-sm text-neutral-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                >
                  <option value="prenom">{t("profileFirstName", locale)}</option>
                  <option value="nom">{t("profileLastName", locale)}</option>
                  <option value="email">{t("profileEmail", locale)}</option>
                  <option value="telephone">{t("profilePhone", locale)}</option>
                  <option value="country">{t("adminCountryLabel", locale)}</option>
                  <option value="organizationsCount">{t("adminUsersOrganizationsLabel", locale)}</option>
                  <option value="menusCount">{t("adminUsersMenusLabel", locale)}</option>
                  <option value="subscriptionStatus">{t("adminUsersSubscriptionLabel", locale)}</option>
                  <option value="subscriptionBypass">{t("adminUsersAccessLabel", locale)}</option>
                </select>
                <button
                  type="button"
                  onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                  className="shrink-0 rounded-xl border border-neutral-600 bg-neutral-900/95 px-3 py-2.5 text-sm font-semibold text-neutral-100 hover:bg-neutral-800"
                >
                  {sortDir.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 text-sm text-neutral-400">{t("adminUsersLoading", locale)}</div>
      ) : (
        <>
        <div className="space-y-3 lg:hidden">
          {filteredSorted.map((u) => {
            const active = isActiveSubscription(u.subscriptionStatus);
            return (
              <div
                key={u.userId}
                className="box-border w-full max-w-full rounded-2xl border border-neutral-700 bg-neutral-950/80 p-4 shadow-inner"
              >
                <p className="font-forum text-lg text-neutral-50">
                  {u.prenom} {u.nom}
                </p>
                <p className="mt-1 break-words text-sm text-neutral-300">{u.email}</p>
                <p className="mt-2 text-xs text-neutral-500">
                  {u.telephone} · {u.country ?? "—"}
                </p>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-400">
                  <span>
                    {t("adminUsersOrganizationsLabel", locale)}: {u.organizationsCount}
                  </span>
                  <span>
                    {t("adminUsersMenusLabel", locale)}: {u.menusCount}
                  </span>
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusBadge(
                      u.subscriptionStatus
                    )}`}
                  >
                    {u.subscriptionStatus}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                        active
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          : "bg-red-500/10 text-red-300 border-red-500/30"
                      }`}
                    >
                      {active ? t("adminSubscriptionActive", locale) : t("adminSubscriptionInactive", locale)}
                    </span>
                    <span
                      className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        u.subscriptionBypass
                          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                          : "border-neutral-700 bg-neutral-900/60 text-neutral-400"
                      }`}
                    >
                      {u.subscriptionBypass ? t("dashboardAdminVipShort", locale) : t("dashboardAdminNormalShort", locale)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 border-t border-neutral-800 pt-3">{renderUserActions(u)}</div>
              </div>
            );
          })}
          {filteredSorted.length === 0 && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 text-center text-sm text-neutral-500">
              {t("adminUsersNoUsersFound", locale)}
            </div>
          )}
        </div>

        <p className="mb-2 hidden text-xs text-neutral-400 lg:block">{t("adminUsersOrgsMenusScrollHint", locale)}</p>
        <div className="relative z-0 hidden w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-2xl border border-neutral-800 bg-neutral-950/70 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin] lg:block">
          <table className="w-full min-w-[1520px] border-collapse text-sm lg:min-w-0">
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
              {filteredSorted.map((u) => {
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
                      <div className="flex flex-col">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusBadge(
                            u.subscriptionStatus
                          )}`}
                        >
                          {u.subscriptionStatus}
                        </span>
                        {/* Plan (MONTHLY/YEARLY/...) => uniquement dans le modal */}
                      </div>
                    </td>
                    <td className="px-3 py-3">
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
                        <span
                          className={`inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            u.subscriptionBypass
                              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                              : "border-neutral-700 bg-neutral-900/60 text-neutral-400"
                          }`}
                        >
                          {u.subscriptionBypass ? t("dashboardAdminVipShort", locale) : t("dashboardAdminNormalShort", locale)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 min-w-[420px] last:pr-4">{renderUserActions(u)}</td>
                  </tr>
                );
              })}
              {filteredSorted.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-neutral-500">
                    {t("adminUsersNoUsersFound", locale)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </>
      )}

      {orgsForUser && (
        <ModalShell
          wide
          title={`${t("adminUsersOrgsMenusModalTitle", locale)} — ${orgsForUser.prenom} ${orgsForUser.nom}`}
          onClose={() => {
            setOrgsForUser(null);
            setOrgsDetail(null);
            setOrgsError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          {orgsLoading && (
            <p className="text-sm text-neutral-400">{t("adminUsersLoading", locale)}</p>
          )}
          {!orgsLoading && orgsError && (
            <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{orgsError}</div>
          )}
          {!orgsLoading && !orgsError && orgsDetail && orgsDetail.length === 0 && (
            <p className="text-sm text-neutral-400">{t("adminUsersOrgsMenusEmpty", locale)}</p>
          )}
          {!orgsLoading && !orgsError && orgsDetail && orgsDetail.length > 0 && (
            <ul className="max-h-[min(60vh,520px)] space-y-4 overflow-y-auto pr-1">
              {orgsDetail.map((org) => (
                <li key={org.organizationId} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-3">
                  <p className="font-semibold text-neutral-100">{org.name}</p>
                  <p className="mt-0.5 text-[11px] text-neutral-500">#{org.organizationId}</p>
                  {org.menus.length === 0 ? (
                    <p className="mt-2 text-xs text-neutral-500">—</p>
                  ) : (
                    <ul className="mt-2 space-y-2 border-t border-neutral-800/80 pt-2">
                      {org.menus.map((m) => (
                        <li
                          key={m.menuId}
                          className="flex flex-col gap-1.5 text-sm text-neutral-300 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2"
                        >
                          <span className="font-medium text-neutral-200">{m.title ?? `Menu #${m.menuId}`}</span>
                          {m.slug ? (
                            <Link
                              href={prefixWithLocale(`/menu/${m.slug}`, locale)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-fit text-xs font-semibold text-amber-400 hover:text-amber-300 underline-offset-2 hover:underline"
                            >
                              {t("adminUsersOrgsMenusPublicLink", locale)}
                            </Link>
                          ) : (
                            <span className="text-xs text-neutral-600">{t("adminUsersOrgsMenusNoSlug", locale)}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </ModalShell>
      )}

      {/* Create modal */}
      {createOpen && (
        <ModalShell
          title={t("adminUsersAddUserModalTitle", locale)}
          onClose={() => {
            setCreateOpen(false);
            setCreateError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            {createError && <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{createError}</div>}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("profileFirstName", locale)}</span>
                <input
                  value={createForm.prenom}
                  onChange={(e) => setCreateForm((s) => ({ ...s, prenom: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("profileLastName", locale)}</span>
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

      {/* Edit modal */}
      {editUser && (
        <ModalShell
          title={`${t("adminUsersEditUserModalTitle", locale)} #${editUser.userId}`}
          onClose={() => {
            setEditUser(null);
            setEditError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            {editError && <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{editError}</div>}

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
                <p className="text-xs text-neutral-500 mt-1">{t("adminUsersDirectAccessToggleHint", locale)}</p>
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

            {editForm.subscriptionBypass && !isNormalRoute && (
              <button
                type="button"
                onClick={() => void handleRequireSubscriptionFromEdit()}
                className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm font-semibold text-amber-200 hover:bg-amber-500/15 disabled:opacity-60"
                disabled={editSubmitting}
              >
                {t("adminUsersRequireSubscriptionAction", locale)}
              </button>
            )}

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
            {resetError && <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{resetError}</div>}

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-neutral-200">
              {t("adminUsersPasswordEncryptedHint", locale)}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">{t("adminUsersNewPasswordLabel", locale)}</span>
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
                {resetSubmitting ? t("adminProcessing", locale) : t("adminUsersResetPasswordAction", locale)}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* View user modal */}
      {viewUser && (
        <ModalShell
          title={t("adminUsersViewUserModalTitle", locale)}
          onClose={() => {
            setViewUser(null);
          }}
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
                  {t("adminUsersAccessLabel", locale)}
                </p>
                <p className="mt-1 text-sm text-neutral-200">
                  {isActiveSubscription(viewUser.subscriptionStatus)
                    ? t("adminSubscriptionActive", locale)
                    : t("adminSubscriptionInactive", locale)}
                </p>
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
                  {t("adminUsersSubscriptionLabel", locale)}
                </p>
                <div className="mt-1 text-sm text-neutral-200 space-y-1">
                  <p>{viewUser.subscriptionStatus}</p>
                  <p className="text-neutral-300">
                    {t("adminUsersPlanLabel", locale)}: {subscriptionPlanLabel(viewUser.subscriptionPlan, locale)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-neutral-200">
              {t("adminUsersPasswordEncryptedHint", locale)}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setViewUser(null);
                  setResetUser(viewUser);
                  setResetPassword("");
                  setResetError("");
                }}
                className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500"
              >
                {t("adminUsersResetPasswordAction", locale)}
              </button>
              <button
                type="button"
                onClick={() => setViewUser(null)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
              >
                {t("adminUsersCloseButton", locale)}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Action subscription bypass modal */}
      {actionUser && actionMode && (
        <ModalShell
          title={t("adminUsersRequireSubscriptionModalTitle", locale)}
          onClose={() => {
            setActionUser(null);
            setActionMode(null);
            setActionError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            {actionError && (
              <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
                {actionError}
              </div>
            )}

            <p className="text-sm text-neutral-300">
              {t("adminUsersRequireSubscriptionForText", locale).replace("{email}", actionUser.email)}
            </p>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-neutral-200">
              {t("adminUsersRequireSubscriptionNote", locale)}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActionUser(null);
                  setActionMode(null);
                  setActionError("");
                }}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
                disabled={actionSubmitting}
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={() => void confirmAccessAction()}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-60 ${
                  "bg-amber-500"
                }`}
                disabled={actionSubmitting}
              >
                {actionSubmitting
                  ? t("adminProcessing", locale)
                  : t("adminUsersRequireSubscriptionAction", locale)}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Delete modal */}
      {deleteUser && (
        <ModalShell
          title={`${t("adminUsersDeleteUserModalTitle", locale)} #${deleteUser.userId}`}
          onClose={() => {
            setDeleteUser(null);
            setDeleteError("");
          }}
          closeLabel={t("adminModalClose", locale)}
        >
          <div className="space-y-4">
            {deleteError && <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{deleteError}</div>}
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

