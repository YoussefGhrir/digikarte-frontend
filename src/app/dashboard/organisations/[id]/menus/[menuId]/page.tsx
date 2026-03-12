"use client";

import { IconEdit, IconTrash } from "@/components/icons";
import { QrDisplay } from "@/components/QrDisplay";
import {
  menuAddItem,
  menuGet,
  menuRemoveItem,
  menuUpdateItem,
  type MenuDto,
  type MenuItemDto,
} from "@/lib/api";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function MenuDetailPage() {
  const params = useParams();
  const { locale } = useLanguage();
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
  // Section globale sélectionnée avant d'ajouter des produits
  const [currentSection, setCurrentSection] = useState("");
  const [currentSectionCustom, setCurrentSectionCustom] = useState("");
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [customSectionTemp, setCustomSectionTemp] = useState("");
  const [tab, setTab] = useState<"content" | "qr">("content");
  const [deletingItem, setDeletingItem] = useState<MenuItemDto | null>(null);
  const [deleteItemSubmitting, setDeleteItemSubmitting] = useState(false);

  const itemsBySection = useMemo(() => {
    const groups: Record<string, MenuItemDto[]> = {};
    (menu?.items ?? []).forEach((item) => {
      const key = (item.section || "").trim() || "_no_section";
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [menu]);

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

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!menu) return;
    setError("");
    try {
      const sectionValue =
        currentSection === "custom"
          ? currentSectionCustom.trim()
          : currentSection.trim() || undefined;

      const updated = await menuAddItem(menu.id, {
        name: itemName,
        description: itemDesc || undefined,
        price: itemPrice ? parseFloat(itemPrice) : undefined,
        section: sectionValue,
      });
      setMenu(updated);
      setItemName("");
      setItemDesc("");
      setItemPrice("");
      setShowItemForm(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    }
  }

  async function handleUpdateItem(
    itemId: number,
    data: { name: string; description?: string; price?: number; section?: string }
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

  async function handleConfirmRemoveItem() {
    if (!menu || !deletingItem) return;
    setError("");
    setDeleteItemSubmitting(true);
    try {
      const updated = await menuRemoveItem(menu.id, deletingItem.id);
      setDeletingItem(null);
      if (updated) setMenu(updated);
      else await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setDeleteItemSubmitting(false);
    }
  }

  if (loading) return <p className="text-stone-500">{t("orgLoading", locale)}</p>;
  if (!menu) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-sm text-red-200">
        {t("menuNotFound", locale)}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-neutral-900/70 via-neutral-900/40 to-neutral-900/70 p-6 shadow-lg shadow-black/40">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              {t("menuSectionTitle", locale)}
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
          className={`cursor-pointer border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "content"
              ? "border-amber-500 text-amber-300"
              : "border-transparent text-neutral-500 hover:text-neutral-200"
          }`}
        >
          {t("menuContentTab", locale)}
        </button>
        <button
          type="button"
          onClick={() => setTab("qr")}
          className={`cursor-pointer border-b-2 px-4 py-2 text-sm font-medium ${
            tab === "qr"
              ? "border-amber-500 text-amber-300"
              : "border-transparent text-neutral-500 hover:text-neutral-200"
          }`}
        >
          {t("menuQrTab", locale)}
        </button>
      </div>

      {tab === "content" && (
        <>
          <div className="mb-4 space-y-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h2 className="font-forum text-xl text-neutral-50">
                {t("menuItemsTitle", locale)}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsSectionModalOpen(true);
                  setCustomSectionTemp("");
                }}
                className="cursor-pointer rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-amber-400"
              >
                {t("menuAddSectionButton", locale)}
              </button>
            </div>
          </div>

          {showItemForm && (
            <form
              onSubmit={handleAddItem}
              className="mb-8 rounded-2xl border border-neutral-700 bg-neutral-900/70 p-6 shadow"
            >
              {(currentSection || currentSectionCustom) && (
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                    {t("menuSectionLabel", locale)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-2 rounded-full border border-amber-500/60 bg-neutral-950 px-3 py-1 text-xs text-neutral-100">
                    {(currentSection === "custom" ? currentSectionCustom : currentSection) ||
                      t("dashboardNone", locale)}
                  </p>
                </div>
              )}
              <div className="mb-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    {t("menuItemName", locale)}
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
                    {t("menuItemPrice", locale)}
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
                  {t("description", locale)}
                </label>
                <textarea
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-100"
                />
              </div>
              <button
                type="submit"
                className="mt-2 cursor-pointer rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-emerald-400"
              >
                {t("menuAdd", locale)}
              </button>
            </form>
          )}

          <div className="space-y-4">
            {Object.keys(itemsBySection).length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-700 bg-neutral-950/40 p-8 text-center text-sm text-neutral-400">
                {t("menuNoItems", locale)}
              </div>
            ) : (
              Object.entries(itemsBySection).map(([sectionKey, items]) => (
                <section
                  key={sectionKey}
                  className="rounded-3xl border border-neutral-800 bg-neutral-950/70 p-4 shadow-sm shadow-black/30"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-amber-300">
                        {sectionKey === "_no_section"
                          ? t("dashboardNone", locale)
                          : t("menuSectionLabel", locale)}
                      </p>
                      {sectionKey !== "_no_section" && (
                        <h3 className="mt-1 font-forum text-lg text-neutral-50">
                          {sectionKey}
                        </h3>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (sectionKey === "_no_section") {
                          setCurrentSection("");
                          setCurrentSectionCustom("");
                        } else {
                          setCurrentSection(sectionKey);
                          setCurrentSectionCustom("");
                        }
                        setShowItemForm(true);
                      }}
                      className="cursor-pointer rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-emerald-400"
                    >
                      {t("menuAddItemButton", locale)}
                    </button>
                  </div>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-950/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex-1">
                          {editingItem === item.id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                const form = e.currentTarget;
                                const name = (
                                  form.querySelector(
                                    '[name="edit-name"]'
                                  ) as HTMLInputElement
                                ).value;
                                const description = (
                                  form.querySelector(
                                    '[name="edit-desc"]'
                                  ) as HTMLInputElement
                                ).value;
                                const priceStr = (
                                  form.querySelector(
                                    '[name="edit-price"]'
                                  ) as HTMLInputElement
                                ).value;
                                const section = (
                                  form.querySelector(
                                    '[name="edit-section"]'
                                  ) as HTMLInputElement
                                )?.value;
                                handleUpdateItem(item.id, {
                                  name,
                                  description: description || undefined,
                                  price: priceStr ? parseFloat(priceStr) : undefined,
                                  section: section?.trim() || undefined,
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
                                placeholder={t("menuItemDescPlaceholder", locale)}
                              />
                              <input
                                name="edit-price"
                                type="number"
                                step="0.01"
                                defaultValue={item.price ?? ""}
                                className="w-24 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-100"
                              />
                              <input
                                name="edit-section"
                                defaultValue={item.section ?? ""}
                                className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm text-neutral-100"
                                placeholder={t("menuSectionLabel", locale)}
                              />
                              <button
                                type="submit"
                                className="cursor-pointer rounded bg-orange-500 px-2 py-1 text-xs font-semibold text-white hover:bg-orange-400"
                              >
                                {t("menuOk", locale)}
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingItem(null)}
                                className="cursor-pointer rounded bg-neutral-600 px-2 py-1 text-xs text-white hover:bg-neutral-500"
                              >
                                {t("dashboardCancel", locale)}
                              </button>
                            </form>
                          ) : (
                            <>
                              <p className="font-medium text-neutral-50">
                                {item.name}
                              </p>
                              {item.description && (
                                <p className="text-sm text-neutral-400">
                                  {item.description}
                                </p>
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
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingItem(item.id)}
                              className="cursor-pointer rounded-lg bg-orange-500 p-2 text-white hover:bg-orange-400"
                              title={t("menuEditButton", locale)}
                              aria-label={t("menuEditButton", locale)}
                            >
                              <IconEdit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingItem(item)}
                              className="cursor-pointer rounded-lg bg-red-500 p-2 text-white hover:bg-red-400"
                              title={t("menuDeleteButton", locale)}
                              aria-label={t("menuDeleteButton", locale)}
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        </>
      )}

      {tab === "qr" && <QrDisplay menuId={menu.id} menuSlug={menu.slug} />}

      {/* Modal choix de section (catégorie) */}
      {isSectionModalOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setIsSectionModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
                {t("menuChooseSectionKicker", locale)}
              </p>
              <h2 className="mt-1 font-forum text-2xl text-neutral-50">
                {t("menuChooseSectionTitle", locale)}
              </h2>
              <p className="mt-2 text-sm font-medium text-neutral-200">
                {t("menuChooseSectionSubtitle", locale)}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { key: "hot", label: t("menuSectionHotDrinks", locale), glyph: "☕" },
                { key: "cold", label: t("menuSectionColdDrinks", locale), glyph: "🥤" },
                { key: "coffee", label: t("menuSectionCoffees", locale), glyph: "🍮" },
                { key: "tea", label: t("menuSectionTeas", locale), glyph: "🍵" },
                { key: "sandwich", label: t("menuSectionSandwiches", locale), glyph: "🥪" },
                { key: "snacks", label: t("menuSectionSavorySnacks", locale), glyph: "🥨" },
                { key: "desserts", label: t("menuSectionDesserts", locale), glyph: "🍰" },
                { key: "breakfast", label: t("menuSectionBreakfast", locale), glyph: "🍳" },
              ].map(({ key, label, glyph }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setCurrentSection(label);
                    setCurrentSectionCustom("");
                    setShowItemForm(true);
                    setIsSectionModalOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-left text-sm text-neutral-100 hover:border-amber-400 hover:bg-neutral-900"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-white text-base">
                    {glyph}
                  </span>
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)]">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  {t("menuSectionCustomLabel", locale)}
                </label>
                <input
                  value={customSectionTemp}
                  onChange={(e) => setCustomSectionTemp(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
                  placeholder={t("menuSectionCustomPlaceholder", locale)}
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl bg-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-600"
                >
                  {t("dashboardCancel", locale)}
                </button>
                <button
                  type="button"
                  disabled={!customSectionTemp.trim()}
                  onClick={() => {
                    if (!customSectionTemp.trim()) return;
                    setCurrentSection("custom");
                    setCurrentSectionCustom(customSectionTemp.trim());
                    setShowItemForm(true);
                    setIsSectionModalOpen(false);
                  }}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-amber-400 disabled:opacity-50"
                >
                  {t("menuAddSectionConfirm", locale)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression article */}
      {deletingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setDeletingItem(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-neutral-50">
              {t("menuDeleteButton", locale)}: {deletingItem.name}
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              {t("menuItemDeleteConfirm", locale)}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="cursor-pointer rounded-xl bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-500"
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={handleConfirmRemoveItem}
                disabled={deleteItemSubmitting}
                className="cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
              >
                {deleteItemSubmitting ? t("dashboardSaving", locale) : t("menuDeleteButton", locale)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
