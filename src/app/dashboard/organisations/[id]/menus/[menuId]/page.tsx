"use client";

import { QrDisplay } from "@/components/QrDisplay";
import {
  menuAddItem,
  menuGet,
  menuRemoveItem,
  menuUpdate,
  menuUpdateItem,
  type MenuDto,
  type MenuItemDto,
} from "@/lib/api";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function MenuDetailPage() {
  const params = useParams();
  const orgId = params.id;
  const menuId = Number(params.menuId);
  const [menu, setMenu] = useState<MenuDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState("");
  const [tab, setTab] = useState<"content" | "qr">("content");

  const load = useCallback(async () => {
    if (!menuId || isNaN(menuId)) return;
    try {
      const data = await menuGet(menuId);
      setMenu(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, [menuId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdateMenu(e: React.FormEvent) {
    e.preventDefault();
    if (!menu) return;
    setError("");
    try {
      const updated = await menuUpdate(menu.id, {
        title: menu.title,
        description: menu.description ?? undefined,
      });
      setMenu(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!menu) return;
    setError("");
    try {
      const updated = await menuAddItem(menu.id, {
        name: itemName,
        description: itemDesc || undefined,
        price: itemPrice ? parseFloat(itemPrice) : undefined,
        imageUrl: itemImage || undefined,
      });
      setMenu(updated);
      setItemName("");
      setItemDesc("");
      setItemPrice("");
      setItemImage("");
      setShowItemForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }

  async function handleUpdateItem(
    itemId: number,
    data: { name: string; description?: string; price?: number }
  ) {
    if (!menu) return;
    setError("");
    try {
      const updated = await menuUpdateItem(menu.id, itemId, data);
      setMenu(updated);
      setEditingItem(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }

  async function handleRemoveItem(itemId: number) {
    if (!menu) return;
    if (!confirm("Supprimer cet article ?")) return;
    setError("");
    try {
      const updated = await menuRemoveItem(menu.id, itemId);
      setMenu(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }

  if (loading) return <p className="text-stone-500">Chargement…</p>;
  if (!menu) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-sm text-red-200">
        Menu introuvable.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-lg shadow-black/40">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              Menu
            </p>
            <h1 className="mt-1 font-forum text-3xl tracking-tight text-neutral-50">
              {menu.title}
            </h1>
            {menu.description && (
              <p className="mt-2 max-w-xl text-sm text-neutral-400">
                {menu.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mb-2 flex gap-2 border-b border-neutral-800">
        <button
          type="button"
          onClick={() => setTab("content")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "content"
              ? "border-amber-500 text-amber-300"
              : "border-transparent text-neutral-500 hover:text-neutral-200"
          }`}
        >
          Contenu du menu
        </button>
        <button
          type="button"
          onClick={() => setTab("qr")}
          className={`border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "qr"
              ? "border-amber-500 text-amber-300"
              : "border-transparent text-neutral-500 hover:text-neutral-200"
          }`}
        >
          Codes QR
        </button>
      </div>

      {tab === "content" && (
        <>
          <form
            onSubmit={handleUpdateMenu}
            className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 shadow"
          >
            <h2 className="mb-4 font-forum text-xl text-neutral-50">
              Informations du menu
            </h2>
            <div className="mb-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Titre
              </label>
              <input
                value={menu.title}
                onChange={(e) => setMenu({ ...menu, title: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-100"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                Description
              </label>
              <textarea
                value={menu.description ?? ""}
                onChange={(e) => setMenu({ ...menu, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-100"
              />
            </div>
            <button
              type="submit"
              className="mt-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-emerald-400"
            >
              Enregistrer
            </button>
          </form>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-forum text-xl text-neutral-50">
              Articles du menu
            </h2>
            <button
              type="button"
              onClick={() => setShowItemForm(!showItemForm)}
              className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-amber-400"
            >
              {showItemForm ? "Annuler" : "+ Ajouter un article"}
            </button>
          </div>

          {showItemForm && (
            <form
              onSubmit={handleAddItem}
              className="mb-8 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-6 shadow"
            >
              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Nom
                  </label>
                  <input
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-100"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  Description
                </label>
                <textarea
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-100"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                  URL image (optionnel)
                </label>
                <input
                  value={itemImage}
                  onChange={(e) => setItemImage(e.target.value)}
                  type="url"
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-100"
                />
              </div>
              <button
                type="submit"
                className="mt-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-emerald-400"
              >
                Ajouter
              </button>
            </form>
          )}

          <div className="space-y-3">
            {(menu.items ?? []).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/40 p-8 text-center text-sm text-neutral-400">
                Aucun article. Ajoutez des plats ou boissons.
              </div>
            ) : (
              (menu.items ?? []).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-sm shadow-black/30 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    {editingItem === item.id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const name = (form.querySelector('[name="edit-name"]') as HTMLInputElement).value;
                          const description = (form.querySelector('[name="edit-desc"]') as HTMLInputElement).value;
                          const priceStr = (form.querySelector('[name="edit-price"]') as HTMLInputElement).value;
                          handleUpdateItem(item.id, {
                            name,
                            description: description || undefined,
                            price: priceStr ? parseFloat(priceStr) : undefined,
                          });
                        }}
                        className="flex flex-wrap items-end gap-2"
                      >
                        <input
                          name="edit-name"
                          defaultValue={item.name}
                          className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-100"
                          required
                        />
                        <input
                          name="edit-desc"
                          defaultValue={item.description ?? ""}
                          className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-100"
                          placeholder="Description"
                        />
                        <input
                          name="edit-price"
                          type="number"
                          step="0.01"
                          defaultValue={item.price ?? ""}
                          className="w-24 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-100"
                        />
                        <button
                          type="submit"
                          className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-neutral-900"
                        >
                          OK
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingItem(null)}
                          className="text-xs text-neutral-400"
                        >
                          Annuler
                        </button>
                      </form>
                    ) : (
                      <>
                        <p className="font-medium text-neutral-50">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-neutral-400">{item.description}</p>
                        )}
                        {item.price != null && (
                          <p className="text-sm font-medium text-amber-300">
                            {Number(item.price).toFixed(2)} €
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  {editingItem !== item.id && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingItem(item.id)}
                        className="rounded px-3 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="rounded px-3 py-1 text-xs text-red-400 hover:bg-red-950/40"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === "qr" && <QrDisplay menuId={menu.id} menuSlug={menu.slug} />}
    </div>
  );
}
