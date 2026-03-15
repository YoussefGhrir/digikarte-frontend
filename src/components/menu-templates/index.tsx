"use client";

import type { MenuPublicDto } from "@/lib/api";
import type { Locale } from "@/lib/i18n";
import {
  normalizeTemplateId,
  getDefaultTemplateId,
  getDemoMenuPublicDto,
  formatPriceSymbol,
  PRICE_CURRENCY_CODES,
  type MenuTemplateId,
  MENU_TEMPLATE_IDS,
} from "./utils";
import { MenuTemplateClassic } from "./MenuTemplateClassic";
import { MenuTemplateCafe } from "./MenuTemplateCafe";
import { MenuTemplateBistro } from "./MenuTemplateBistro";
import { MenuTemplateMinimal } from "./MenuTemplateMinimal";
import { MenuTemplateCards } from "./MenuTemplateCards";
import { MenuTemplateElegant } from "./MenuTemplateElegant";
import { MenuTemplateRestaurant } from "./MenuTemplateRestaurant";
import { MenuTemplateTerrasse } from "./MenuTemplateTerrasse";

export { MENU_TEMPLATE_IDS, normalizeTemplateId, getDefaultTemplateId, getDemoMenuPublicDto, formatPriceSymbol, PRICE_CURRENCY_CODES };
export type { MenuTemplateId };
export { TemplateDemoModal } from "./TemplateDemoModal";

/** Props communes à tous les modèles d'affichage : mêmes données menu (MenuPublicDto), seul le rendu change. */
export type MenuTemplateProps = {
  menu: MenuPublicDto;
  locale: Locale;
};

const TEMPLATES: Record<MenuTemplateId, (props: MenuTemplateProps) => JSX.Element> = {
  classic: MenuTemplateClassic,
  cafe: MenuTemplateCafe,
  bistro: MenuTemplateBistro,
  minimal: MenuTemplateMinimal,
  cards: MenuTemplateCards,
  elegant: MenuTemplateElegant,
  restaurant: MenuTemplateRestaurant,
  terrasse: MenuTemplateTerrasse,
};

/**
 * Affiche le menu avec le modèle choisi par l'utilisateur.
 * Les données (articles, sections, titre, logo) viennent toujours du même menu (MenuPublicDto).
 * Seul le template (classic, cafe, bistro, etc.) change l'apparence.
 */
export function MenuTemplateRenderer({ menu, locale }: MenuTemplateProps) {
  const id = normalizeTemplateId(menu.displayTemplate);
  const Template = TEMPLATES[id];
  return <Template menu={menu} locale={locale} />;
}
