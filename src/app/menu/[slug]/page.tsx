"use client";

import { menuPublicBySlug, type MenuPublicDto } from "@/lib/api";
import { useLanguage } from "@/lib/language-context";
import { t } from "@/lib/i18n";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MenuTemplateRenderer } from "@/components/menu-templates";

const menuBg = {
  backgroundColor: "var(--eerie-black)",
  backgroundImage: "url(/bg-menu-dark.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
};

export default function PublicMenuPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { locale } = useLanguage();
  const [menu, setMenu] = useState<MenuPublicDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    menuPublicBySlug(slug)
      .then(setMenu)
      .catch(() => setError("notFound"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center font-dm"
        style={{ ...menuBg, color: "var(--gold)" }}
      >
        <p className="text-lg tracking-widest uppercase">
          {t("loading", locale)}
        </p>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 font-dm"
        style={menuBg}
      >
        <p className="text-red-400">
          {error === "notFound" ? t("notFound", locale) : error}
        </p>
      </div>
    );
  }

  return <MenuTemplateRenderer menu={menu} locale={locale} />;
}
