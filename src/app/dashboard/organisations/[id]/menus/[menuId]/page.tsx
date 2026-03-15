"use client";

import { IconEdit, IconTrash, IconPlus, IconReorderTiles } from "@/components/icons";
import { QrDisplay } from "@/components/QrDisplay";
import { QR_THEME_IDS, normalizeQrThemeId, type QrThemeId } from "@/components/qr-display/constants";
import { MenuTemplateRenderer } from "@/components/menu-templates";
import {
  menuAddItem,
  menuGet,
  menuRemoveItem,
  menuUpdateItem,
  menuUpdate,
  orgGet,
  orgUpdate,
  type MenuDto,
  type MenuItemDto,
  type MenuPublicDto,
  type OrganizationDto,
} from "@/lib/api";
import {
  MENU_TEMPLATE_IDS,
  normalizeTemplateId,
  formatPriceSymbol,
  type MenuTemplateId,
} from "@/components/menu-templates";
import { t } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

const MENU_TEMPLATE_LABELS: Record<
  MenuTemplateId,
  "menuTemplateClassic" | "menuTemplateCafe" | "menuTemplateBistro" | "menuTemplateMinimal" | "menuTemplateCards" | "menuTemplateElegant" | "menuTemplateRestaurant" | "menuTemplateTerrasse"
> = {
  classic: "menuTemplateClassic",
  cafe: "menuTemplateCafe",
  bistro: "menuTemplateBistro",
  minimal: "menuTemplateMinimal",
  cards: "menuTemplateCards",
  elegant: "menuTemplateElegant",
  restaurant: "menuTemplateRestaurant",
  terrasse: "menuTemplateTerrasse",
};

function formatOrgAddress(org: OrganizationDto): string | null {
  const parts: string[] = [];
  if (org.addressLine1?.trim()) parts.push(org.addressLine1.trim());
  const hasPostalCity =
    (org.addressPostalCode?.trim() ?? "") !== "" ||
    (org.addressCity?.trim() ?? "") !== "";
  if (hasPostalCity) {
    const postalCity = [org.addressPostalCode?.trim(), org.addressCity?.trim()]
      .filter(Boolean)
      .join(" ");
    if (postalCity) parts.push(postalCity);
  }
  if (org.country?.trim()) parts.push(org.country.trim());
  return parts.length > 0 ? parts.join(", ") : null;
}

function buildPreviewMenu(menu: MenuDto, org: OrganizationDto | null): MenuPublicDto | null {
  if (!org) return null;
  return {
    title: menu.title,
    description: menu.description ?? undefined,
    organizationName: org.name,
    organizationSlogan: org.slogan ?? null,
    organizationLogoBase64: org.organizationLogoBase64 ?? null,
    organizationAddress: formatOrgAddress(org),
    organizationPhone: org.phone ?? null,
    organizationEmail: org.email ?? null,
    displayTemplate: menu.displayTemplate ?? undefined,
    priceCurrency: menu.priceCurrency ?? "EUR",
    items: menu.items ?? [],
  };
}

export default function MenuDetailPage() {
  const params = useParams();
  const { locale } = useLanguage();
  const orgId = params.id;
  const menuId = Number(params.menuId);
  const [menu, setMenu] = useState<MenuDto | null>(null);
  const [org, setOrg] = useState<OrganizationDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalItem, setEditModalItem] = useState<MenuItemDto | null>(null);
  const [editModalSaving, setEditModalSaving] = useState(false);
  /** Nouveau bloc sans produit encore : carte avec ajout inline (pas de redirection). */
  const [pendingNewSection, setPendingNewSection] = useState<string | null>(null);
  const [quickAdd, setQuickAdd] = useState<Record<string, { name: string; desc: string; price: string }>>({});
  const [inlineSubmittingKey, setInlineSubmittingKey] = useState<string | null>(null);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [customSectionTemp, setCustomSectionTemp] = useState("");
  const [deletingItem, setDeletingItem] = useState<MenuItemDto | null>(null);
  const [deleteItemSubmitting, setDeleteItemSubmitting] = useState(false);
  const [templateSaving, setTemplateSaving] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrTheme, setQrTheme] = useState<QrThemeId>("amber");
  const [orgSlogan, setOrgSlogan] = useState("");
  const [sloganSaving, setSloganSaving] = useState(false);
  const [reorderSubmitting, setReorderSubmitting] = useState(false);
  const [reorderModal, setReorderModal] = useState<null | "sections" | { type: "products"; sectionKey: string }>(null);
  const [sectionDraft, setSectionDraft] = useState<[string, MenuItemDto[]][]>([]);
  const [productDraft, setProductDraft] = useState<MenuItemDto[]>([]);
  const [modalDragSection, setModalDragSection] = useState<string | null>(null);
  const [modalOverSection, setModalOverSection] = useState<string | null>(null);
  const [modalDragProductId, setModalDragProductId] = useState<number | null>(null);
  const [modalOverProductId, setModalOverProductId] = useState<number | null>(null);
  const [addExpandedKey, setAddExpandedKey] = useState<string | null>(null);
  /** Largeur du panneau Menüinhalt (px) ; la flèche entre les deux permet de redimensionner. */
  const [asideWidth, setAsideWidth] = useState(420);
  const [resizing, setResizing] = useState(false);
  /** Sélection multiple : sections (clés) et produits (ids) pour suppression en masse. */
  const [selectedSectionKeys, setSelectedSectionKeys] = useState<Set<string>>(new Set());
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());
  const [bulkDeleteSubmitting, setBulkDeleteSubmitting] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<string | null>(null);
  const [deleteSectionSubmitting, setDeleteSectionSubmitting] = useState(false);

  /** Liste des items déjà triée par le backend (sortOrder ASC). */
  const sortedItems = useMemo(() => menu?.items ?? [], [menu?.items]);

  const childItemsOf = useCallback((parentId: number, all: MenuItemDto[]) => {
    const pid = Number(parentId);
    return all
      .filter((i) => i.parentItemId != null && Number(i.parentItemId) === pid)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, []);

  const flattenRootsWithChildren = useCallback(
    (roots: MenuItemDto[], allItems: MenuItemDto[]) => {
      const out: MenuItemDto[] = [];
      for (const r of roots) {
        out.push(r);
        out.push(...childItemsOf(r.id, allItems));
      }
      return out;
    },
    [childItemsOf]
  );

  /** Sections : uniquement plats racine ; les sous-produits s’affichent sous le parent. */
  const itemsBySection = useMemo(() => {
    const groups: Record<string, MenuItemDto[]> = {};
    (menu?.items ?? [])
      .filter((item) => item.parentItemId == null)
      .forEach((item) => {
        const key = (item.section || "").trim() || "_no_section";
        if (!groups[key]) groups[key] = [];
        groups[key].push(item);
      });
    Object.keys(groups).forEach((k) => {
      groups[k].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    });
    return Object.entries(groups).sort(([, itemsA], [, itemsB]) => {
      const minA = Math.min(...itemsA.map((i) => i.sortOrder ?? 999));
      const minB = Math.min(...itemsB.map((i) => i.sortOrder ?? 999));
      return minA - minB;
    });
  }, [menu]);

  /** Liste affichée : blocs + éventuel nouveau bloc vide en attente du 1er produit. */
  const displaySections = useMemo(() => {
    const list: [string, MenuItemDto[]][] = itemsBySection.map(([k, v]) => [k, v]);
    if (pendingNewSection && !list.some(([k]) => k === pendingNewSection)) {
      list.push([pendingNewSection, []]);
    }
    return list;
  }, [itemsBySection, pendingNewSection]);

  function getQuick(sectionKey: string) {
    return quickAdd[sectionKey] ?? { name: "", desc: "", price: "" };
  }
  function setQuick(sectionKey: string, patch: Partial<{ name: string; desc: string; price: string }>) {
    setQuickAdd((prev) => ({
      ...prev,
      [sectionKey]: { ...getQuick(sectionKey), ...patch },
    }));
  }

  const previewMenu = useMemo(
    () => (menu && org ? buildPreviewMenu(menu, org) : null),
    [menu, org]
  );

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

  useEffect(() => {
    if (!menu?.organizationId) return;
    orgGet(menu.organizationId)
      .then((o) => {
        setOrg(o);
        setOrgSlogan(o.slogan ?? "");
      })
      .catch(() => setOrg(null));
  }, [menu?.organizationId]);


  //’ouverture du modal pour aperçu live

  useEffect(() => {
    if (!resizing) return;
    const minAside = 280;
    const maxAside = typeof window !== "undefined" ? Math.min(800, window.innerWidth * 0.7) : 700;
    function onMove(e: MouseEvent) {
      const x = e.clientX;
      if (x >= minAside && x <= maxAside) setAsideWidth(x);
    }
    function onUp() {
      setResizing(false);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [resizing]);

  async function handleSaveSlogan() {
    if (!org) return;
    setError("");
    setSloganSaving(true);
    try {
      const updated = await orgUpdate(org.id, { slogan: orgSlogan || undefined });
      setOrg(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSloganSaving(false);
    }
  }

  /** Ajout produit sur la carte du bloc : sous les produits, ordre conservé. */
  async function handleInlineAdd(sectionKey: string) {
    if (!menu) return;
    const q = getQuick(sectionKey);
    if (!q.name.trim()) return;
    setError("");
    setInlineSubmittingKey(sectionKey);
    const sectionValue = sectionKey === "_no_section" ? undefined : sectionKey;
    const before = [...sortedItems];
    try {
      // Utiliser la réponse de l'API immédiatement pour mettre à jour la live preview
      let updated = await menuAddItem(menu.id, {
        name: q.name.trim(),
        description: q.desc.trim() || undefined,
        price: q.price ? parseFloat(q.price) : undefined,
        section: sectionValue,
      });
      setMenu(updated);
      setQuick(sectionKey, { name: "", desc: "", price: "" });
      if (pendingNewSection === sectionKey) setPendingNewSection(null);

      const newItem = updated.items?.find((i) => !before.some((b) => b.id === i.id));
      if (newItem && before.length > 0 && updated.items) {
        const inSection = before.filter((it) => getSectionKey(it) === sectionKey);
        let insertAt = 0;
        if (inSection.length > 0) {
          let lastIdx = -1;
          for (let i = 0; i < before.length; i++) {
            if (getSectionKey(before[i]) === sectionKey) lastIdx = i;
          }
          insertAt = lastIdx + 1;
        } else {
          const secList = displaySections.map(([k]) => k);
          const si = secList.indexOf(sectionKey);
          if (si <= 0) insertAt = 0;
          else {
            const prevKey = secList[si - 1];
            let lastPrev = -1;
            for (let i = 0; i < before.length; i++) {
              if (getSectionKey(before[i]) === prevKey) lastPrev = i;
            }
            insertAt = lastPrev + 1;
          }
        }
        const withoutNew = updated.items.filter((i) => i.id !== newItem.id);
        const newOrder = [...withoutNew.slice(0, insertAt), newItem, ...withoutNew.slice(insertAt)];
        for (let i = 0; i < newOrder.length; i++) {
          updated = await menuUpdateItem(menu.id, newOrder[i].id, { sortOrder: i });
          setMenu(updated);
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setInlineSubmittingKey(null);
    }
  }

  async function applySectionOrderDraft() {
    if (!menu || sectionDraft.length === 0) return;
    const flat = sectionDraft.flatMap(([, secItems]) => secItems);
    setError("");
    setReorderSubmitting(true);
    try {
      let updated: MenuDto = menu;
      for (let i = 0; i < flat.length; i++) {
        updated = await menuUpdateItem(menu.id, flat[i].id, { sortOrder: i });
        setMenu(updated);
      }
      setReorderModal(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      await load();
    } finally {
      setReorderSubmitting(false);
    }
  }

  async function applyProductOrderDraft(sectionKey: string) {
    if (!menu) return;
    const sectionItems = sortedItems.filter((i) => getSectionKey(i) === sectionKey);
    const sectionSortOrders = [...sectionItems].map((i) => i.sortOrder ?? 0).sort((a, b) => a - b);
    const flat = flattenRootsWithChildren(productDraft, sectionItems);
    if (flat.length !== sectionSortOrders.length) {
      setError("Ordre des plats : incohérence (recharger la page).");
      setReorderSubmitting(false);
      return;
    }
    setError("");
    setReorderSubmitting(true);
    try {
      let updated: MenuDto = menu;
      for (let i = 0; i < flat.length; i++) {
        updated = await menuUpdateItem(menu.id, flat[i].id, { sortOrder: sectionSortOrders[i] });
        setMenu(updated);
      }
      setReorderModal(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
      await load();
    } finally {
      setReorderSubmitting(false);
    }
  }

  function reorderSectionDraft(fromKey: string, toKey: string) {
    if (fromKey === toKey) return;
    setSectionDraft((prev) => {
      const i = prev.findIndex(([k]) => k === fromKey);
      const j = prev.findIndex(([k]) => k === toKey);
      if (i < 0 || j < 0) return prev;
      const next = [...prev];
      const [row] = next.splice(i, 1);
      next.splice(j, 0, row);
      return next;
    });
  }

  function reorderProductDraft(fromId: number, toId: number) {
    if (fromId === toId) return;
    setProductDraft((prev) => {
      const i = prev.findIndex((p) => p.id === fromId);
      const j = prev.findIndex((p) => p.id === toId);
      if (i < 0 || j < 0) return prev;
      const next = [...prev];
      const [row] = next.splice(i, 1);
      next.splice(j, 0, row);
      return next;
    });
  }

  async function handleUpdateItemTitleDesc(itemId: number, name: string, description: string) {
    if (!menu) return;
    setError("");
    setEditModalSaving(true);
    try {
      const updated = await menuUpdateItem(menu.id, itemId, {
        name: name.trim(),
        description: description.trim(),
      });
      setMenu(updated);
      setEditModalItem(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setEditModalSaving(false);
    }
  }

  async function handleConfirmRemoveItem() {
    if (!menu || !deletingItem) return;
    setError("");
    setDeleteItemSubmitting(true);
    try {
      const updated = await menuRemoveItem(menu.id, deletingItem.id);
      setDeletingItem(null);
      setSelectedItemIds((prev) => {
        const next = new Set(prev);
        next.delete(deletingItem.id);
        return next;
      });
      if (updated) setMenu(updated);
      else await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setDeleteItemSubmitting(false);
    }
  }

  /** Supprimer un bloc : tous les plats de la section passent en « sans bloc ». */
  async function handleDeleteSection(sectionKey: string) {
    if (!menu) return;
    const itemsInSection = sortedItems.filter((it) => getSectionKey(it) === sectionKey && it.parentItemId == null);
    if (itemsInSection.length === 0) return;
    setError("");
    setDeleteSectionSubmitting(true);
    try {
      let updated: MenuDto = menu;
      for (const item of itemsInSection) {
        updated = await menuUpdateItem(menu.id, item.id, { section: undefined });
        setMenu(updated);
      }
      setSelectedSectionKeys((prev) => {
        const next = new Set(prev);
        next.delete(sectionKey);
        return next;
      });
      if (pendingNewSection === sectionKey) setPendingNewSection(null);
      setSectionToDelete(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setDeleteSectionSubmitting(false);
    }
  }

  /** Suppression en masse : sections (dissoudre) + produits (supprimer). On ne supprime que les produits racine (le backend supprime les sous-produits). */
  async function handleBulkDelete() {
    if (!menu) return;
    const sectionsToDelete = [...selectedSectionKeys];
    const rootIds = new Set((menu.items ?? []).filter((i) => i.parentItemId == null).map((i) => i.id));
    const itemIdsToDelete = [...selectedItemIds].filter((id) => rootIds.has(id));
    if (sectionsToDelete.length === 0 && itemIdsToDelete.length === 0) return;
    setError("");
    setBulkDeleteSubmitting(true);
    try {
      let updated: MenuDto = menu;
      for (const sectionKey of sectionsToDelete) {
        const itemsInSection = sortedItems.filter((it) => getSectionKey(it) === sectionKey && it.parentItemId == null);
        for (const item of itemsInSection) {
          updated = await menuUpdateItem(menu.id, item.id, { section: undefined });
          setMenu(updated);
        }
      }
      for (const id of itemIdsToDelete) {
        const next = await menuRemoveItem(menu.id, id);
        if (next) {
          updated = next;
          setMenu(updated);
        } else {
          await load();
        }
      }
      setSelectedSectionKeys(new Set());
      setSelectedItemIds(new Set());
      if (pendingNewSection && sectionsToDelete.includes(pendingNewSection)) setPendingNewSection(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setBulkDeleteSubmitting(false);
    }
  }

  function getSectionKey(item: MenuItemDto): string {
    return (item.section || "").trim() || "_no_section";
  }

  if (loading) return <p className="text-stone-500 p-4">{t("orgLoading", locale)}</p>;
  if (!menu) {
    return (
      <div className="rounded-2xl border border-red-500/40 bg-red-950/40 p-6 text-sm text-red-200 m-4">
        {t("menuNotFound", locale)}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] min-h-[560px] w-full min-w-0 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-xl">
      <aside
        className="flex shrink-0 flex-col border-r border-neutral-800 bg-neutral-900/80"
        style={{ width: asideWidth }}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            {t("menuContentTab", locale)}
          </h2>
          <Link
            href={`/dashboard/organisations/${orgId}`}
            className="text-xs text-neutral-500 hover:text-neutral-300"
          >
            ← {t("dashboardBack", locale)}
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}

          {/* Slogan du restaurant */}
          {org && (
            <section className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {t("menuSloganLabel", locale)}
              </label>
              <input
                value={orgSlogan}
                onChange={(e) => setOrgSlogan(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
                placeholder={t("menuSloganPlaceholder", locale)}
              />
              <button
                type="button"
                onClick={handleSaveSlogan}
                disabled={sloganSaving}
                className="cursor-pointer rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-amber-400 disabled:opacity-60"
              >
                {sloganSaving ? t("dashboardSaving", locale) : t("menuSave", locale)}
              </button>
            </section>
          )}

          {/* Modèle d'affichage */}
          <section className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-400">
              {t("menuDisplayTemplate", locale)}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {MENU_TEMPLATE_IDS.map((id) => {
                const isActive = normalizeTemplateId(menu.displayTemplate) === id;
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={templateSaving}
                    onClick={async () => {
                      setTemplateSaving(true);
                      setError("");
                      try {
                        const updated = await menuUpdate(menu.id, { displayTemplate: id });
                        setMenu(updated);
                      } catch (e) {
                        setError(e instanceof Error ? e.message : "Erreur");
                      } finally {
                        setTemplateSaving(false);
                      }
                    }}
                    className={`cursor-pointer rounded-lg border px-2 py-1.5 text-left text-xs font-medium transition ${
                      isActive
                        ? "border-amber-500 bg-amber-500/20 text-amber-200"
                        : "border-neutral-700 bg-neutral-800 text-neutral-400 hover:border-amber-500/50"
                    } disabled:opacity-60`}
                  >
                    {t(MENU_TEMPLATE_LABELS[id], locale)}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Blocs (catégories) et plats */}
          <section className="space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
                  {t("menuItemsTitle", locale)}
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {itemsBySection.filter(([, it]) => it.length > 0).length >= 2 && (
                    <button
                      type="button"
                      disabled={reorderSubmitting}
                      onClick={() => {
                        setSectionDraft(
                          itemsBySection
                            .filter(([, roots]) => roots.length > 0)
                            .map(([k, roots]) => [k, flattenRootsWithChildren(roots, sortedItems)] as [string, MenuItemDto[]])
                        );
                        setReorderModal("sections");
                      }}
                      className="flex cursor-pointer items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-950/40 px-4 py-2.5 text-sm font-semibold text-amber-200 hover:bg-amber-900/50 disabled:opacity-50"
                    >
                      <IconReorderTiles className="h-4 w-4" />
                      {t("menuReorderBlocks", locale)}
                    </button>
                  )}
                  {(selectedSectionKeys.size > 0 || selectedItemIds.size > 0) && (
                    <button
                      type="button"
                      disabled={bulkDeleteSubmitting}
                      onClick={() => handleBulkDelete()}
                      className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-red-500 disabled:opacity-50"
                    >
                      <IconTrash className="h-4 w-4" />
                      {t("menuBulkDeleteSelection", locale)}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSectionModalOpen(true);
                      setCustomSectionTemp("");
                    }}
                    className="flex cursor-pointer items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-400"
                  >
                    <IconPlus className="h-4 w-4" />
                    {t("menuAddSectionButton", locale)}
                  </button>
                </div>
              </div>
              <p className="rounded-lg border-l-4 border-amber-500/60 bg-amber-950/30 px-4 py-2.5 text-sm font-bold leading-snug text-amber-200">
                {t("menuItemsHelp", locale)}
              </p>
            </div>

            <div className="space-y-4">
              {displaySections.map(([sectionKey, items], sectionIndex) => (
                <div key={sectionKey} className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-1 items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSectionKeys.has(sectionKey)}
                        onChange={() => {
                          setSelectedSectionKeys((prev) => {
                            const next = new Set(prev);
                            if (next.has(sectionKey)) next.delete(sectionKey);
                            else next.add(sectionKey);
                            return next;
                          });
                        }}
                        title={t("menuSelectForDelete", locale)}
                        className="h-4 w-4 shrink-0 rounded-md border border-neutral-500/80 bg-neutral-800/80 text-amber-500 transition focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-0"
                      />
                      <span
                        className="flex h-8 min-w-[2rem] shrink-0 items-center justify-center rounded-lg bg-amber-500/25 px-2 text-sm font-bold text-amber-200 ring-1 ring-amber-500/30"
                        title={`${t("menuSectionOrderLabel", locale)} ${sectionIndex + 1}`}
                      >
                        {sectionIndex + 1}
                      </span>
                      <span className="truncate text-sm font-medium text-amber-300">
                        {sectionKey === "_no_section" ? t("dashboardNone", locale) : sectionKey}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {sectionKey !== "_no_section" && items.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSectionToDelete(sectionKey)}
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-red-500/50 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-200 hover:bg-red-900/50"
                          title={t("menuDeleteSection", locale)}
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                          {t("menuDeleteSection", locale)}
                        </button>
                      )}
                      {items.length >= 2 && (
                        <button
                          type="button"
                          disabled={reorderSubmitting}
                          onClick={() => {
                            setProductDraft([...items]);
                            setReorderModal({ type: "products", sectionKey });
                          }}
                          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-200 hover:border-amber-500/50 hover:text-amber-200"
                        >
                          <IconReorderTiles className="h-4 w-4" />
                          {t("menuReorderProducts", locale)}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setAddExpandedKey((k) => (k === sectionKey ? null : sectionKey))}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-sky-600 text-white shadow-md hover:bg-sky-500"
                        title={t("menuAddWithPlus", locale)}
                        aria-label={t("menuAddWithPlus", locale)}
                      >
                        <IconPlus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {items.map((item) => {
                      const subs = childItemsOf(item.id, sortedItems);
                      return (
                        <li
                          key={item.id}
                          className="rounded-xl border-2 border-neutral-700 bg-neutral-900/90 overflow-hidden shadow-inner"
                        >
                          {/* Produit principal (taille grande) */}
                          <div className="flex items-start justify-between gap-2 p-3 border-b border-neutral-800/80">
                            <input
                              type="checkbox"
                              checked={selectedItemIds.has(item.id)}
                              onChange={() => {
                                setSelectedItemIds((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(item.id)) next.delete(item.id);
                                  else next.add(item.id);
                                  return next;
                                });
                              }}
                              title={t("menuSelectForDelete", locale)}
                              className="mt-1 h-4 w-4 shrink-0 rounded-md border border-neutral-500/80 bg-neutral-800/80 text-amber-500 transition focus:ring-2 focus:ring-amber-500/40 focus:ring-offset-0"
                            />
                            {item.imageUrl && (
                              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
                                <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-base font-semibold text-neutral-100">{item.name}</p>
                              {item.description && (
                                <p className="text-sm text-neutral-500 line-clamp-2 mt-0.5">{item.description}</p>
                              )}
                              {item.price != null && (
                                <p className="text-sm font-medium text-amber-300 mt-0.5">
                                  {Number(item.price).toFixed(2)} {formatPriceSymbol(menu?.priceCurrency)}
                                </p>
                              )}
                            </div>
                            <div className="flex shrink-0 flex-wrap items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => setEditModalItem(item)}
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
                          </div>
                          {/* Sous-produits (affichés sous le produit, taille décroissante) */}
                          {subs.length > 0 && (
                            <ul className="bg-neutral-950/50 py-2 px-3 space-y-1.5">
                              {subs.map((sub) => (
                                <li
                                  key={sub.id}
                                  className="flex items-start justify-between gap-2 py-1.5 pl-4 border-l-2 border-violet-500/40"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-neutral-300">↳ {sub.name}</p>
                                    {sub.description && (
                                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">{sub.description}</p>
                                    )}
                                    {sub.price != null && (
                                      <p className="text-[11px] text-amber-300/90 mt-0.5">
                                        {Number(sub.price).toFixed(2)} {formatPriceSymbol(menu?.priceCurrency)}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex shrink-0 gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setEditModalItem(sub)}
                                      className="cursor-pointer rounded bg-orange-500/90 p-1.5 text-white hover:bg-orange-400"
                                      aria-label={t("menuEditButton", locale)}
                                    >
                                      <IconEdit className="h-3 w-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setDeletingItem(sub)}
                                      className="cursor-pointer rounded bg-red-500/90 p-1.5 text-white hover:bg-red-400"
                                      aria-label={t("menuDeleteButton", locale)}
                                    >
                                      <IconTrash className="h-3 w-3" />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                          </li>
                      );
                    })}
                  </ul>
                  {addExpandedKey === sectionKey && (
                    <div className="mt-4 border-t border-sky-500/30 bg-sky-950/15 p-4 space-y-3 rounded-lg">
                      <p className="text-xs font-semibold uppercase tracking-wider text-sky-400/90">
                        {t("menuInlineAddTitle", locale)}
                      </p>
                      <div className="flex flex-col gap-3">
                        <input
                          value={getQuick(sectionKey).name}
                          onChange={(e) => setQuick(sectionKey, { name: e.target.value })}
                          placeholder={t("menuItemName", locale)}
                          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={getQuick(sectionKey).price}
                            onChange={(e) => setQuick(sectionKey, { price: e.target.value })}
                            placeholder={t("menuItemPrice", locale)}
                            className="w-28 shrink-0 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
                          />
                          <input
                            value={getQuick(sectionKey).desc}
                            onChange={(e) => setQuick(sectionKey, { desc: e.target.value })}
                            placeholder={t("description", locale)}
                            className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={inlineSubmittingKey === sectionKey || !getQuick(sectionKey).name.trim()}
                            onClick={async () => {
                              await handleInlineAdd(sectionKey);
                              setAddExpandedKey(null);
                            }}
                            className="flex-1 cursor-pointer rounded-lg bg-sky-600 py-2.5 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50"
                          >
                            {inlineSubmittingKey === sectionKey ? t("dashboardSaving", locale) : t("menuInlineAddSubmit", locale)}
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddExpandedKey(null)}
                            className="rounded-lg bg-neutral-600 px-4 py-2.5 text-sm text-white hover:bg-neutral-500"
                          >
                            {t("dashboardCancel", locale)}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Liens & QR */}
          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-800">
            <a
              href={`/menu/${menu.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-500/20"
            >
              {t("menuViewButton", locale)} →
            </a>
            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="cursor-pointer rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-neutral-700 w-full"
            >
              {t("menuQrTab", locale)}
            </button>
          </div>
        </div>
      </aside>

      {/* Poignée redimensionnable entre Menüinhalt et Live-Vorschau */}
      <div
        role="separator"
        aria-label="Redimensionner"
        title="Redimensionner : glisser pour agrandir Menüinhalt ou Live-Vorschau"
        onMouseDown={() => setResizing(true)}
        className={`flex shrink-0 w-2 cursor-col-resize select-none flex-col items-center justify-center border-l border-r border-neutral-700 bg-neutral-800/80 hover:bg-amber-500/20 transition-colors ${resizing ? "bg-amber-500/30" : ""}`}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-neutral-500 text-xs select-none">◀</span>
          <span className="text-neutral-500 text-xs select-none">▶</span>
        </div>
      </div>

      <main className="flex min-w-0 flex-1 flex-col border-l border-neutral-800/80 bg-neutral-950">
        <div className="border-b border-neutral-800 px-4 py-2 flex items-center justify-between shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {t("menuPreviewLive", locale)}
          </span>
          {previewMenu && (
            <span className="text-[10px] text-neutral-600">
              {t(MENU_TEMPLATE_LABELS[normalizeTemplateId(menu.displayTemplate)], locale)}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-auto overflow-x-hidden">
          {previewMenu ? (
            <div className="min-h-full w-full bg-neutral-900">
              <MenuTemplateRenderer menu={previewMenu} locale={locale} />
            </div>
          ) : (
            <div className="flex h-full min-h-[300px] items-center justify-center text-neutral-500 text-sm">
              {org ? t("loading", locale) : "Chargement de l'organisation…"}
            </div>
          )}
        </div>
      </main>

      {/* Popup ordre des blocs (cartes puzzle) */}
      {reorderModal === "sections" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => !reorderSubmitting && setReorderModal(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-amber-200">{t("menuReorderModalBlocksTitle", locale)}</h2>
            <p className="mt-2 text-sm text-neutral-400">{t("menuReorderModalHint", locale)}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {sectionDraft.map(([key, secItems], idx) => (
                <div
                  key={key}
                  draggable={!reorderSubmitting}
                  onDragStart={(e) => {
                    setModalDragSection(key);
                    e.dataTransfer.setData("sectionKey", key);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setModalOverSection(key);
                  }}
                  onDragLeave={() => setModalOverSection(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = e.dataTransfer.getData("sectionKey");
                    if (from) reorderSectionDraft(from, key);
                    setModalDragSection(null);
                    setModalOverSection(null);
                  }}
                  onDragEnd={() => {
                    setModalDragSection(null);
                    setModalOverSection(null);
                  }}
                  className={`cursor-grab rounded-2xl border-2 bg-gradient-to-br from-neutral-900 to-neutral-950 p-4 shadow-xl transition-all active:cursor-grabbing ${
                    modalOverSection === key && modalDragSection && modalDragSection !== key
                      ? "border-amber-400 ring-2 ring-amber-400/40 scale-[1.02]"
                      : "border-neutral-600 hover:border-neutral-500"
                  } ${modalDragSection === key ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-sm font-bold text-amber-300">
                      {idx + 1}
                    </span>
                    <IconReorderTiles className="h-5 w-5 text-neutral-500" />
                  </div>
                  <p className="mt-3 font-semibold text-neutral-100">
                    {key === "_no_section" ? t("dashboardNone", locale) : key}
                  </p>
                  <p className="text-xs text-neutral-500">{secItems.length}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={reorderSubmitting}
                onClick={() => setReorderModal(null)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm text-white hover:bg-neutral-600"
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                disabled={reorderSubmitting}
                onClick={() => applySectionOrderDraft()}
                className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-amber-400 disabled:opacity-50"
              >
                {reorderSubmitting ? t("dashboardSaving", locale) : t("menuReorderApply", locale)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup ordre des plats dans un bloc */}
      {reorderModal && typeof reorderModal === "object" && reorderModal.type === "products" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => !reorderSubmitting && setReorderModal(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-amber-200">{t("menuReorderModalProductsTitle", locale)}</h2>
            <p className="mt-1 text-sm text-amber-300/80">
              {reorderModal.sectionKey === "_no_section"
                ? t("dashboardNone", locale)
                : reorderModal.sectionKey}
            </p>
            <p className="mt-2 text-sm text-neutral-400">{t("menuReorderModalHint", locale)}</p>
            <div className="mt-6 space-y-3">
              {productDraft.map((p, idx) => (
                <div
                  key={p.id}
                  draggable={!reorderSubmitting}
                  onDragStart={(e) => {
                    setModalDragProductId(p.id);
                    e.dataTransfer.setData("productId", String(p.id));
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setModalOverProductId(p.id);
                  }}
                  onDragLeave={() => setModalOverProductId(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = Number(e.dataTransfer.getData("productId"));
                    if (from) reorderProductDraft(from, p.id);
                    setModalDragProductId(null);
                    setModalOverProductId(null);
                  }}
                  onDragEnd={() => {
                    setModalDragProductId(null);
                    setModalOverProductId(null);
                  }}
                  className={`flex cursor-grab items-center gap-3 rounded-xl border-2 bg-neutral-900/90 p-3 shadow-lg transition-all active:cursor-grabbing ${
                    modalOverProductId === p.id && modalDragProductId && modalDragProductId !== p.id
                      ? "border-emerald-400 ring-2 ring-emerald-400/30"
                      : "border-neutral-600"
                  } ${modalDragProductId === p.id ? "opacity-50" : ""}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-800 text-xs font-bold text-amber-400">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-neutral-100 truncate">{p.name}</p>
                    {p.price != null && (
                      <p className="text-xs text-amber-300">
                        {Number(p.price).toFixed(2)} {formatPriceSymbol(menu?.priceCurrency)}
                      </p>
                    )}
                  </div>
                  <IconReorderTiles className="h-4 w-4 shrink-0 text-neutral-500" />
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={reorderSubmitting}
                onClick={() => setReorderModal(null)}
                className="rounded-xl bg-neutral-700 px-4 py-2.5 text-sm text-white hover:bg-neutral-600"
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                disabled={reorderSubmitting}
                onClick={() => applyProductOrderDraft(reorderModal.sectionKey)}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                {reorderSubmitting ? t("dashboardSaving", locale) : t("menuReorderApply", locale)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal choix de section */}
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
                    const exists = itemsBySection.some(([k]) => k === label);
                    if (!exists) setPendingNewSection(label);
                    setIsSectionModalOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-3 text-left text-sm text-neutral-100 hover:border-amber-400 hover:bg-neutral-900"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950 text-base">
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
                    const name = customSectionTemp.trim();
                    const exists = itemsBySection.some(([k]) => k === name);
                    if (!exists) setPendingNewSection(name);
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

      {/* Modal confirmation suppression bloc */}
      {sectionToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => !deleteSectionSubmitting && setSectionToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-neutral-50">
              {t("menuDeleteSection", locale)}: {sectionToDelete === "_no_section" ? t("dashboardNone", locale) : sectionToDelete}
            </h2>
            <p className="mt-3 text-sm text-neutral-400">
              {t("menuDeleteSectionConfirm", locale)}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleteSectionSubmitting}
                onClick={() => setSectionToDelete(null)}
                className="cursor-pointer rounded-xl bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-500 disabled:opacity-50"
              >
                {t("dashboardCancel", locale)}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSection(sectionToDelete)}
                disabled={deleteSectionSubmitting}
                className="cursor-pointer rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
              >
                {deleteSectionSubmitting ? t("dashboardSaving", locale) : t("menuDeleteSection", locale)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmation suppression produit */}
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

      {editModalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={() => !editModalSaving && setEditModalItem(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-950 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-forum text-xl text-amber-200">{t("menuEditItemModalTitle", locale)}</h2>
            <p className="mt-1 text-xs text-neutral-500">{t("menuEditItemModalHint", locale)}</p>
            <form
              key={editModalItem.id}
              className="mt-4 space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                const name = (fd.get("edit-name") as string) || "";
                const desc = (fd.get("edit-desc") as string) || "";
                void handleUpdateItemTitleDesc(editModalItem.id, name, desc);
              }}
            >
              <div>
                <label className="block text-xs font-semibold text-neutral-400">{t("menuItemName", locale)}</label>
                <input
                  name="edit-name"
                  defaultValue={editModalItem.name}
                  required
                  className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400">{t("description", locale)}</label>
                <textarea
                  name="edit-desc"
                  defaultValue={editModalItem.description ?? ""}
                  rows={4}
                  className="mt-1 w-full resize-y rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
                />
              </div>
              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <button
                  type="button"
                  disabled={editModalSaving}
                  onClick={() => setEditModalItem(null)}
                  className="rounded-xl bg-neutral-600 px-4 py-2 text-sm text-white hover:bg-neutral-500 disabled:opacity-50"
                >
                  {t("dashboardCancel", locale)}
                </button>
                <button
                  type="submit"
                  disabled={editModalSaving}
                  className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-amber-400 disabled:opacity-50"
                >
                  {editModalSaving ? t("dashboardSaving", locale) : t("menuSave", locale)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showQrModal && menu && org && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-auto"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-forum text-xl text-neutral-50">{t("menuQrTitle", locale)}</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500">
                  {t("menuQrTheme", locale)}
                </span>
                <div className="flex gap-1">
                  {QR_THEME_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setQrTheme(id)}
                      title={t(`qrTheme${id.charAt(0).toUpperCase() + id.slice(1)}` as "qrThemeAmber", locale)}
                      className={`h-6 w-6 rounded-full border-2 transition ${
                        normalizeQrThemeId(qrTheme) === id
                          ? "border-amber-400 ring-2 ring-amber-400/50"
                          : "border-neutral-600 hover:border-neutral-500"
                      } ${
                        id === "amber" ? "bg-amber-500" :
                        id === "slate" ? "bg-slate-500" :
                        id === "emerald" ? "bg-emerald-500" :
                        id === "violet" ? "bg-violet-500" :
                        id === "rose" ? "bg-rose-500" :
                        "bg-stone-500"
                      }`}
                      aria-label={t(`qrTheme${id.charAt(0).toUpperCase() + id.slice(1)}` as "qrThemeAmber", locale)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="cursor-pointer rounded-lg bg-neutral-700 px-3 py-1.5 text-sm text-white hover:bg-neutral-600 ml-2"
                >
                  {t("dashboardCancel", locale)}
                </button>
              </div>
            </div>
            <QrDisplay
              menuId={menu.id}
              menuSlug={menu.slug}
              qrSize={220}
              organizationLogoBase64={org.organizationLogoBase64 ?? undefined}
              organizationName={org.name}
              theme={qrTheme}
            />
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <Link
                href={`/dashboard/organisations/${orgId}/menus/${menuId}/qr`}
                className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-500/20"
              >
                {t("menuQrGoToManagement", locale)} →
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
