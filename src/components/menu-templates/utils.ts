import type { MenuItemDto, MenuPublicDto } from "@/lib/api";

/**
 * Modèle commun : les données du menu (items, sections, titre…) viennent du même MenuPublicDto.
 * Seul le template d'affichage change (l'utilisateur choisit parmi les 8 modèles).
 */
export type SectionEntry = [string, MenuItemDto[]];

/** Bloc affichage : plat principal + sous-produits éventuels. */
export type SectionBlock = { root: MenuItemDto; children: MenuItemDto[] };

export function groupItemsBySection(items: MenuItemDto[]): SectionEntry[] {
  const grouped = (items ?? []).reduce<Record<string, MenuItemDto[]>>(
    (acc, item) => {
      const key = (item.section || "").trim() || "_no_section";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {}
  );
  return Object.entries(grouped);
}

/** Racines + enfants triés (pour affichage menu public). */
export function groupSectionBlocks(items: MenuItemDto[]): [string, SectionBlock[]][] {
  const grouped = groupItemsBySection(items);
  return grouped.map(([key, list]) => {
    const sorted = [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const roots = sorted.filter((i) => i.parentItemId == null);
    const blocks: SectionBlock[] = roots.map((root) => {
      const rootId = root.id;
      const children = sorted
        .filter((i) => i.parentItemId != null && Number(i.parentItemId) === Number(rootId))
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
      return { root, children };
    });
    return [key, blocks] as [string, SectionBlock[]];
  });
}

/** Liste plate racines puis enfants (même ordre que groupSectionBlocks). */
export function flattenSectionBlocks(blocks: SectionBlock[]): MenuItemDto[] {
  const out: MenuItemDto[] = [];
  for (const b of blocks) {
    out.push(b.root);
    out.push(...b.children);
  }
  return out;
}

export const MENU_TEMPLATE_IDS = [
  "classic",
  "cafe",
  "bistro",
  "minimal",
  "cards",
  "elegant",
  "restaurant",
  "terrasse",
  "lounge",
  "loungeOriental",
  "cafeResto",
  "steakhouseCoffee",
] as const;

export type MenuTemplateId = (typeof MENU_TEMPLATE_IDS)[number];

/** Thèmes de couleur globaux applicables aux modèles (fond + accents). */
export const MENU_COLOR_THEME_IDS = [
  "default",
  "amber",
  "emerald",
  "bordeaux",
  "slate",
] as const;

export type MenuColorThemeId = (typeof MENU_COLOR_THEME_IDS)[number];

export function getDefaultTemplateId(): MenuTemplateId {
  return "classic";
}

export function normalizeTemplateId(
  value: string | null | undefined
): MenuTemplateId {
  if (value && MENU_TEMPLATE_IDS.includes(value as MenuTemplateId))
    return value as MenuTemplateId;
  return "classic";
}

/** Symbole ou code pour l'affichage des prix selon la devise du menu (app mondiale). */
export function formatPriceSymbol(currencyCode: string | null | undefined): string {
  const code = (currencyCode ?? "EUR").toUpperCase();
  const symbols: Record<string, string> = {
    EUR: "€", USD: "$", GBP: "£", CHF: "CHF", JPY: "¥", CNY: "¥", INR: "₹", BRL: "R$", MXN: "$", CAD: "$", AUD: "$",
    TND: "DT", MAD: "DH", DZD: "DA", EGP: "£", ZAR: "R", NGN: "₦", TRY: "₺", RUB: "₽", KRW: "₩", SGD: "$",
    AED: "AED", SAR: "﷼", ILS: "₪", THB: "฿", MYR: "RM", IDR: "Rp", PHP: "₱", VND: "₫", PKR: "₨", BDT: "৳",
    PLN: "zł", CZK: "Kč", SEK: "kr", NOK: "kr", DKK: "kr", HUF: "Ft", RON: "lei", BGN: "лв", UAH: "₴",
    ARS: "$", CLP: "$", COP: "$", PEN: "S/", NZD: "$", LKR: "Rs",
  };
  return symbols[code] ?? code;
}

/** Liste des codes devise supportés (ordre: Euro en premier, puis alphabétique). */
export const PRICE_CURRENCY_CODES = [
  "EUR", "USD", "GBP", "CHF", "JPY", "CNY", "INR", "BRL", "MXN", "CAD", "AUD", "NZD",
  "TND", "MAD", "DZD", "EGP", "ZAR", "NGN", "TRY", "RUB", "KRW", "SGD", "AED", "SAR",
  "ILS", "THB", "MYR", "IDR", "PHP", "VND", "PKR", "BDT", "LKR",
  "PLN", "CZK", "SEK", "NOK", "DKK", "HUF", "RON", "BGN", "UAH",
  "ARS", "CLP", "COP", "PEN",
] as const;
export type PriceCurrencyCode = (typeof PRICE_CURRENCY_CODES)[number];

/** Données de démo pour prévisualiser un modèle de menu (Rome, France, Allemagne). */
export function getDemoMenuPublicDto(displayTemplate: MenuTemplateId): MenuPublicDto {
  const demoItems: MenuItemDto[] = [
    { id: 1, name: "Caffè Espresso", description: "Arabica, torréfaction maison", price: 2.8, section: "Boissons chaudes", sortOrder: 0 },
    { id: 2, name: "Cappuccino", description: "Espresso, lait crémeux", price: 3.5, section: "Boissons chaudes", sortOrder: 1 },
    { id: 3, name: "Thé vert", description: "Jasmin ou menthe", price: 3.2, section: "Boissons chaudes", sortOrder: 2 },
    { id: 4, name: "Croissant", description: "Beurre, maison", price: 2.9, section: "Viennoiseries", sortOrder: 0 },
    { id: 5, name: "Tarte au citron", description: "Meringue italienne", price: 4.5, section: "Pâtisseries", sortOrder: 0 },
    { id: 6, name: "Salade César", description: "Poulet, parmesan, croûtons", price: 12.5, section: "Plats", sortOrder: 0 },
  ];
  return {
    title: "Carte du jour",
    description: "Nos suggestions et spécialités",
    organizationName: "Demo Café",
    displayTemplate,
    priceCurrency: "EUR",
    items: demoItems,
  };
}
