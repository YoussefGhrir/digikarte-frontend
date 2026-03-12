"use client";

import {
  menuCreate,
  menuList,
  orgGet,
  type MenuDto,
  type OrganizationDto,
} from "@/lib/api";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function OrganisationPage() {
  const params = useParams();
  const id = Number(params.id);
  const [org, setOrg] = useState<OrganizationDto | null>(null);
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  if (loading) {
    return <p className="text-stone-500">Chargement…</p>;
  }

  if (!org) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-sm text-red-200">
        Organisation introuvable.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-lg shadow-black/40">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Organisation
            </p>
            <h1 className="mt-1 font-forum text-3xl tracking-tight text-neutral-50">
              {org.name}
            </h1>
            {org.description && (
              <p className="mt-2 max-w-xl text-sm text-neutral-400">
                {org.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 shadow-inner shadow-black/40">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-forum text-2xl text-neutral-50">Menus</h2>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
            className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 shadow hover:bg-amber-400"
        >
          {showForm ? "Annuler" : "+ Nouveau menu"}
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
              Titre du menu
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-lg border border-stone-300 px-4 py-2"
            />
          </div>
          <div className="mb-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
              Description (optionnel)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-stone-300 px-4 py-2"
            />
          </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-emerald-400 disabled:opacity-50"
            >
              {submitting ? "Création…" : "Créer le menu"}
            </button>
          </form>
      )}

      {menus.length === 0 && !showForm ? (
          <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/40 p-10 text-center text-sm text-neutral-400">
          Aucun menu. Créez un menu pour ajouter des plats et générer un QR.
        </div>
      ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <Link
              key={menu.id}
              href={`/dashboard/organisations/${id}/menus/${menu.id}`}
                className="group block rounded-2xl border border-neutral-800 bg-neutral-950/40 p-5 shadow-sm shadow-black/30 transition hover:border-amber-400/70 hover:bg-neutral-900"
            >
                <h3 className="font-forum text-xl text-neutral-50">
                {menu.title}
              </h3>
              {menu.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-400">
                  {menu.description}
                </p>
              )}
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                {menu.items?.length ?? 0} article(s)
              </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
                Gérer le menu
              </p>
            </Link>
          ))}
        </div>
      )}
      </section>
    </div>
  );
}
