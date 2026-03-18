"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
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
  type AdminUserDto,
  isApiError,
} from "@/lib/api";

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
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
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
            aria-label="Close"
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

  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  type UsersView = "bypass" | "normal" | "all";
  const [view, setView] = useState<UsersView>("bypass");

  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("userId");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

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

  async function reload() {
    setLoading(true);
    setError("");
    try {
      const data = await adminListUsers();
      setUsers(data);
    } catch (e) {
      if (isApiError(e) && (e.status === 401 || e.status === 403)) {
        router.replace("/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Erreur chargement users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredSorted = useMemo(() => {
    const query = q.trim().toLowerCase();
    const viewFiltered =
      view === "all"
        ? users
        : view === "bypass"
          ? users.filter((u) => u.subscriptionBypass)
          : users.filter((u) => !u.subscriptionBypass);

    const base = query
      ? viewFiltered.filter((u) => {
          const hay =
            `${u.userId} ${u.nom} ${u.prenom} ${u.email} ${u.telephone} ${u.country ?? ""}`.toLowerCase();
          return hay.includes(query);
        })
      : viewFiltered;

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
  }, [q, sortDir, sortKey, users, view]);

  async function handleToggleBypass(user: AdminUserDto) {
    setError("");
    try {
      const nextBypass = !user.subscriptionBypass;
      await adminUpdateUser(user.userId, { subscriptionBypass: nextBypass });

      // Si on passe de "Accès direct" -> "Exige abonnement",
      // on bascule la vue vers la table "users normal".
      if (user.subscriptionBypass && !nextBypass) setView("normal");
      // Et inversement.
      if (!user.subscriptionBypass && nextBypass) setView("bypass");

      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur toggle");
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

      // Si l'admin désactive "accès direct" à la création, afficher la table
      // des users normal.
      if (shouldBypass) setView("bypass");
      else setView("normal");

      await reload();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Erreur create");
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
      setEditError(e instanceof Error ? e.message : "Erreur update");
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
      setResetError(e instanceof Error ? e.message : "Erreur reset");
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
      setDeleteError(e instanceof Error ? e.message : "Erreur delete");
    } finally {
      setDeleteSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Admin</p>
          <h1 className="mt-2 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">Gestion des utilisateurs</h1>
          <p className="mt-2 text-sm text-neutral-400">Ajout, modification, recherche, tri et statut abonnement.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setView("bypass")}
            className={`inline-flex items-center rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
              view === "bypass"
                ? "border-amber-500/50 bg-amber-500/15 text-amber-200"
                : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:bg-neutral-900/60"
            }`}
            disabled={loading}
          >
            Accès direct
          </button>
          <button
            type="button"
            onClick={() => setView("normal")}
            className={`inline-flex items-center rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
              view === "normal"
                ? "border-amber-500/50 bg-amber-500/15 text-amber-200"
                : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:bg-neutral-900/60"
            }`}
            disabled={loading}
          >
            Users normal
          </button>
          <button
            type="button"
            onClick={() => setView("all")}
            className={`inline-flex items-center rounded-2xl border px-3 py-2 text-sm font-semibold transition ${
              view === "all"
                ? "border-amber-500/50 bg-amber-500/15 text-amber-200"
                : "border-neutral-800 bg-neutral-950/40 text-neutral-200 hover:bg-neutral-900/60"
            }`}
            disabled={loading}
          >
            Tous
          </button>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400 disabled:opacity-60"
            disabled={loading}
          >
            <IconPlus className="h-4 w-4" />
            Ajouter user
          </button>
          <button
            type="button"
            onClick={() => void reload()}
            className="inline-flex items-center rounded-2xl border border-neutral-800 bg-neutral-950/40 px-4 py-2.5 text-sm font-semibold text-neutral-200 hover:bg-neutral-900"
            disabled={loading}
          >
            Rafraîchir
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Recherche</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Email, nom, pays, téléphone…"
              className="mt-2 w-full rounded-xl border border-neutral-800 bg-neutral-950/50 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Tri</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-xl border border-neutral-800 bg-neutral-950/50 px-3 py-2.5 text-sm text-neutral-200 outline-none"
            >
              <option value="userId">ID</option>
              <option value="prenom">Prénom</option>
              <option value="nom">Nom</option>
              <option value="email">Email</option>
              <option value="telephone">Téléphone</option>
              <option value="country">Pays</option>
              <option value="organizationsCount">Organisations</option>
              <option value="menusCount">Menus</option>
              <option value="subscriptionStatus">Statut abonnement</option>
              <option value="subscriptionBypass">Accès direct</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="rounded-xl border border-neutral-800 bg-neutral-950/50 px-3 py-2.5 text-sm font-semibold text-neutral-200 hover:bg-neutral-900"
            >
              {sortDir.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-6 text-sm text-neutral-400">Loading users…</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-950/70">
          <table className="w-full min-w-[1040px] text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              <tr className="border-b border-neutral-800">
                <th className="py-3 text-left font-medium">ID</th>
                <th className="py-3 text-left font-medium">Prénom</th>
                <th className="py-3 text-left font-medium">Nom</th>
                <th className="py-3 text-left font-medium">Email</th>
                <th className="py-3 text-left font-medium">Téléphone</th>
                <th className="py-3 text-left font-medium">Pays</th>
                <th className="py-3 text-left font-medium">Org</th>
                <th className="py-3 text-left font-medium">Menus</th>
                <th className="py-3 text-left font-medium">Abonnement</th>
                <th className="py-3 text-left font-medium">Accès</th>
                <th className="py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60">
              {filteredSorted.map((u) => {
                const active = isActiveSubscription(u.subscriptionStatus);
                return (
                  <tr key={u.userId} className="hover:bg-neutral-900/40">
                    <td className="py-3 text-neutral-200 tabular-nums">{u.userId}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {u.profilePhotoBase64 ? (
                          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-amber-500/40 bg-neutral-800">
                            <img
                              src={`data:image/jpeg;base64,${u.profilePhotoBase64}`}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-amber-300">
                            {(u.prenom?.[0] ?? u.nom?.[0] ?? "?").toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-neutral-100">{u.prenom}</span>
                      </div>
                    </td>
                    <td className="py-3 text-neutral-200">{u.nom}</td>
                    <td className="py-3 text-neutral-300">{u.email}</td>
                    <td className="py-3 text-neutral-300">{u.telephone}</td>
                    <td className="py-3 text-neutral-300">{u.country ?? "—"}</td>
                    <td className="py-3 text-neutral-300 tabular-nums">{u.organizationsCount}</td>
                    <td className="py-3 text-neutral-300 tabular-nums">{u.menusCount}</td>
                    <td className="py-3">
                      <div className="flex flex-col">
                        <span
                          className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusBadge(
                            u.subscriptionStatus
                          )}`}
                        >
                          {u.subscriptionStatus}
                        </span>
                        <span className="mt-1 text-[11px] text-neutral-500">
                          {u.subscriptionPlan ? `${u.subscriptionPlan}` : active ? "Plan inconnu" : "—"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          u.subscriptionBypass
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-200 border-amber-500/30"
                        }`}
                      >
                        {u.subscriptionBypass ? "Accès direct" : "Exige abonnement"}
                      </span>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={() => void handleToggleBypass(u)}
                          className="rounded-lg border border-neutral-800 bg-neutral-950/30 px-2.5 py-1 text-[11px] font-semibold text-neutral-200 hover:bg-neutral-900"
                        >
                          {u.subscriptionBypass ? "Exiger abonnement" : "Autoriser accès direct"}
                        </button>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="rounded-xl bg-orange-500/90 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-400"
                          aria-label="Edit"
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
                          className="rounded-xl bg-sky-600/90 px-3 py-2 text-xs font-semibold text-white hover:bg-sky-500"
                          aria-label="Reset password"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteUser(u);
                            setDeleteError("");
                          }}
                          className="rounded-xl bg-red-500/90 px-3 py-2 text-xs font-semibold text-white hover:bg-red-400"
                          aria-label="Delete"
                        >
                          <IconTrash className="inline-block h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredSorted.length === 0 && (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-neutral-500">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create modal */}
      {createOpen && (
        <ModalShell
          title="Ajouter un utilisateur"
          onClose={() => {
            setCreateOpen(false);
            setCreateError("");
          }}
        >
          <div className="space-y-4">
            {createError && <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{createError}</div>}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Prénom</span>
                <input
                  value={createForm.prenom}
                  onChange={(e) => setCreateForm((s) => ({ ...s, prenom: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Nom</span>
                <input
                  value={createForm.nom}
                  onChange={(e) => setCreateForm((s) => ({ ...s, nom: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Email (username)</span>
              <input
                value={createForm.email}
                onChange={(e) => setCreateForm((s) => ({ ...s, email: e.target.value }))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Téléphone</span>
              <input
                value={createForm.telephone}
                onChange={(e) => setCreateForm((s) => ({ ...s, telephone: e.target.value }))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Mot de passe</span>
              <input
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm((s) => ({ ...s, password: e.target.value }))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
              />
            </label>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950/30 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-neutral-200">Accès direct sans abonnement</p>
                <p className="text-xs text-neutral-500 mt-1">Si activé : pas de paywall, sinon redirection vers la page abonnement.</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  type="checkbox"
                  checked={createForm.subscriptionBypass}
                  onChange={(e) => setCreateForm((s) => ({ ...s, subscriptionBypass: e.target.checked }))}
                />
                Oui
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
                disabled={createSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleCreate()}
                className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-amber-400 disabled:opacity-60"
                disabled={createSubmitting}
              >
                {createSubmitting ? "Création…" : "Créer"}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Edit modal */}
      {editUser && (
        <ModalShell
          title={`Modifier user #${editUser.userId}`}
          onClose={() => {
            setEditUser(null);
            setEditError("");
          }}
        >
          <div className="space-y-4">
            {editError && <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{editError}</div>}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Prénom</span>
                <input
                  value={editForm.prenom}
                  onChange={(e) => setEditForm((s) => ({ ...s, prenom: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Nom</span>
                <input
                  value={editForm.nom}
                  onChange={(e) => setEditForm((s) => ({ ...s, nom: e.target.value }))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Téléphone</span>
              <input
                value={editForm.telephone}
                onChange={(e) => setEditForm((s) => ({ ...s, telephone: e.target.value }))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-sm text-neutral-100 outline-none focus:border-amber-500"
              />
            </label>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-950/30 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-neutral-200">Accès direct sans abonnement</p>
                <p className="text-xs text-neutral-500 mt-1">Bascule le paywall côté dashboard.</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-neutral-200">
                <input
                  type="checkbox"
                  checked={editForm.subscriptionBypass}
                  onChange={(e) => setEditForm((s) => ({ ...s, subscriptionBypass: e.target.checked }))}
                />
                Oui
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
                disabled={editSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleEditSave()}
                className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-amber-400 disabled:opacity-60"
                disabled={editSubmitting}
              >
                {editSubmitting ? "Sauvegarde…" : "Enregistrer"}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Reset password modal */}
      {resetUser && (
        <ModalShell
          title={`Reset mot de passe #${resetUser.userId}`}
          onClose={() => {
            setResetUser(null);
            setResetError("");
          }}
        >
          <div className="space-y-4">
            {resetError && <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{resetError}</div>}

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-neutral-200">
              Le mot de passe est stocké chiffré côté backend. Tu ne peux donc pas l’afficher en clair.
              Utilise “Reset” pour créer un nouveau mot de passe.
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Nouveau mot de passe</span>
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
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleResetPassword()}
                className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-60"
                disabled={resetSubmitting}
              >
                {resetSubmitting ? "Reset…" : "Reset"}
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      {/* Delete modal */}
      {deleteUser && (
        <ModalShell
          title={`Supprimer user #${deleteUser.userId}`}
          onClose={() => {
            setDeleteUser(null);
            setDeleteError("");
          }}
        >
          <div className="space-y-4">
            {deleteError && <div className="rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">{deleteError}</div>}
            <p className="text-sm text-neutral-300">
              Confirmer la suppression de <span className="font-semibold text-neutral-100">{deleteUser.email}</span>.
            </p>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              Cette action est irréversible.
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteUser(null)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-600"
                disabled={deleteSubmitting}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteUser()}
                className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
                disabled={deleteSubmitting}
              >
                {deleteSubmitting ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

