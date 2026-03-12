"use client";

import {
  orgCreate,
  orgList,
  type OrganizationDto,
} from "@/lib/api";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function DashboardPage() {
  const [orgs, setOrgs] = useState<OrganizationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      const list = await orgList();
      setOrgs(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

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

  return (
    <div className="space-y-8 text-neutral-100">
      {/* Header + CTA */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
            Tableau de bord
          </p>
          <h1 className="mt-2 font-forum text-3xl tracking-tight text-neutral-50 md:text-4xl">
            Vos organisations
          </h1>
          <p className="mt-2 text-sm text-neutral-400 max-w-xl">
            Créez et gérez plusieurs lieux (restaurant, café, bar) depuis une
            interface unique, pensée pour le service.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="rounded-2xl border border-amber-500/40 bg-neutral-950/60 px-4 py-2 text-sm font-medium text-amber-200 shadow-sm hover:border-amber-400 hover:bg-amber-500/10"
          >
            {showForm ? "Annuler" : "Nouvelle organisation"}
          </button>
        </div>
      </div>

      {/* Loading & error */}
      {loading && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 px-4 py-3 text-sm text-neutral-400">
          Chargement des organisations…
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-900/60 bg-red-950/70 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Stats overview */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-sm shadow-black/40">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Organisations
            </p>
            <p className="mt-2 font-forum text-3xl text-amber-300">
              {orgs.length.toString().padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Lieux actuellement configurés dans DigiKarte.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-sm shadow-black/40">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Menus digitaux
            </p>
            <p className="mt-2 font-forum text-3xl text-emerald-300">
              --
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Renseignez vos cartes pour suivre leurs performances.
            </p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 shadow-sm shadow-black/40">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              QR actifs
            </p>
            <p className="mt-2 font-forum text-3xl text-sky-300">
              --
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Chaque QR est automatiquement à jour après modification.
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
              Créer une nouvelle organisation
            </h2>
            <p className="text-xs text-neutral-500">
              Donnez un nom clair (ex. « Café des Arts – Centre-ville »).
            </p>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)]">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  Nom de l&apos;organisation
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500 focus:bg-neutral-900 focus:shadow-[0_0_0_1px_rgba(245,158,11,0.45)]"
                  placeholder="Ex. Graine de Café – Lausanne"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
                  Description (optionnel)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-500 focus:border-amber-500 focus:bg-neutral-900 focus:shadow-[0_0_0_1px_rgba(245,158,11,0.45)]"
                  placeholder="Ex. Coffee shop de spécialité, torréfaction artisanale, petite restauration gourmande."
                />
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/60 p-4 text-xs text-neutral-400">
              <div>
                <p className="font-semibold text-neutral-100">
                  Bonnes pratiques de nommage
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Inclure la ville ou le quartier.</li>
                  <li>Différencier les lieux si vous avez plusieurs cafés.</li>
                  <li>Rester court et lisible sur mobile.</li>
                </ul>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 shadow-lg shadow-amber-500/30 hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? "Création…" : "Créer l’organisation"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Organisations list */}
      {!loading && (
        <>
          {orgs.length === 0 && !showForm ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-800 bg-neutral-950/70 px-6 py-14 text-center">
              <p className="font-forum text-xl text-neutral-50">
                Aucune organisation pour l’instant.
              </p>
              <p className="mt-2 max-w-md text-sm text-neutral-500">
                Créez votre première organisation pour commencer à générer vos
                menus digitaux, QR codes et cartes multi-langues.
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-6 rounded-2xl bg-amber-500 px-5 py-2 text-sm font-semibold text-neutral-900 shadow-lg shadow-amber-500/30 hover:bg-amber-400"
              >
                Créer ma première organisation
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-forum text-xl text-neutral-50">
                  Mes organisations
                </h2>
                <p className="text-xs text-neutral-500">
                  {orgs.length} lieu{orgs.length > 1 ? "x" : ""} configuré
                  {orgs.length > 1 ? "s" : ""}.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {orgs.map((org) => (
                  <Link
                    key={org.id}
                    href={`/dashboard/organisations/${org.id}`}
                    className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-950 via-neutral-950/95 to-neutral-900/90 p-5 shadow-sm shadow-black/40 transition hover:border-amber-500/50 hover:shadow-[0_18px_45px_rgba(0,0,0,0.65)]"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none">
                      <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-amber-500/15 blur-3xl" />
                    </div>
                    <div className="relative">
                      <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                        Organisation
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
                          Menus & QR
                        </span>
                        <span className="flex items-center gap-1 text-amber-300">
                          Voir les menus
                          <span aria-hidden>↗</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
