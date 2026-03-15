"use client";

import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { normalizeTemplateId, type MenuTemplateId } from "./utils";

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

export function TemplateDemoModal({
  templateId,
  locale,
  onChoose,
  onClose,
  children,
}: {
  templateId: MenuTemplateId;
  locale: Locale;
  onChoose: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const labelKey = MENU_TEMPLATE_LABELS[normalizeTemplateId(templateId)];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-4xl flex-col rounded-3xl border border-neutral-700 bg-neutral-950 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-800 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              {t("menuTemplateDemoKicker", locale)}
            </p>
            <h2 className="mt-1 font-forum text-xl text-neutral-50">
              {t(labelKey, locale)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            aria-label={t("dashboardCancel", locale)}
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <div className="scale-[0.65] origin-top sm:scale-75 md:scale-90">
            <div className="h-[600px] w-full min-w-[320px] overflow-auto rounded-xl border border-neutral-700/50 bg-neutral-900 shadow-inner">
              {children}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-neutral-800 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-neutral-700 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-600"
          >
            {t("dashboardCancel", locale)}
          </button>
          <button
            type="button"
            onClick={onChoose}
            className="cursor-pointer rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-amber-400"
          >
            {t("menuTemplateChoose", locale)}
          </button>
        </div>
      </div>
    </div>
  );
}
