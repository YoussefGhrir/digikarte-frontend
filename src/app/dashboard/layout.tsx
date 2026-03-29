"use client";

import { IconBuilding, IconHome, IconLogout, IconMenuList, IconQr } from "@/components/icons";
import { useAuth } from "@/lib/auth-context";
import { localeLabels, t, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { orgList, type OrganizationDto, isApiError, subscriptionGetMe, type SubscriptionDto } from "@/lib/api";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { prefixWithLocale, stripLocaleFromPathname, swapLocaleInBrowserPath } from "@/lib/locale-path";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

function navItems(_locale: Locale) {
  return [
    { href: "/dashboard", labelKey: "dashboardNavDashboard" as const, Icon: IconHome, view: null as string | null },
    { href: "/dashboard?view=organisations", labelKey: "dashboardNavOrganisations" as const, Icon: IconBuilding, view: "organisations" },
    { href: "/dashboard/subscription", labelKey: "subscriptionNav", Icon: IconQr, view: null as string | null },
  ];
}

function FlagIcon({ code }: { code: Locale }) {
  if (code === "de") {
    return (
      <span className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] ring-1 ring-neutral-800">
        <span className="h-full w-1/3 bg-black" />
        <span className="h-full w-1/3 bg-red-600" />
        <span className="h-full w-1/3 bg-yellow-400" />
      </span>
    );
  }
  if (code === "fr") {
    return (
      <span className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] ring-1 ring-neutral-800">
        <span className="h-full w-1/3 bg-blue-600" />
        <span className="h-full w-1/3 bg-white" />
        <span className="h-full w-1/3 bg-red-600" />
      </span>
    );
  }
  return (
    <span className="inline-flex h-3.5 w-5 overflow-hidden rounded-[2px] bg-blue-700 ring-1 ring-neutral-800">
      <span className="relative h-full w-full">
        <span className="absolute inset-y-0 left-1/2 w-1 bg-white -translate-x-1/2" />
        <span className="absolute inset-x-0 top-1/2 h-1 bg-white -translate-y-1/2" />
        <span className="absolute inset-y-0 left-1/2 w-0.5 bg-red-600 -translate-x-1/2" />
        <span className="absolute inset-x-0 top-1/2 h-0.5 bg-red-600 -translate-y-1/2" />
      </span>
    </span>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, loading, logout, refreshUser } = useAuth();
  const { locale, setLocale } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  /** Route interne sans préfixe /de|/fr|/en (alignée sur les fichiers app/dashboard/...). */
  const path = stripLocaleFromPathname(pathname ?? "/");
  const searchParams = useSearchParams();
  const dashboardView = path === "/dashboard" ? searchParams.get("view") : null;
  let activeOrgId: number | null = null;
  const orgPathMatch = path.match(/^\/dashboard\/organisations\/(\d+)/);
  if (orgPathMatch) {
    activeOrgId = Number(orgPathMatch[1]);
  }

  const localizePath = useCallback(
    (p: string, lang: Locale = locale) => prefixWithLocale(p, lang),
    [locale],
  );
  const swapLocaleInPath = (lang: Locale) => swapLocaleInBrowserPath(pathname || "/", lang);
  const onAdminArea = Boolean(path.startsWith("/dashboard/admin"));
  /** Abonnement requis sauf page abo + profil (photo, coordonnées sans payer). */
  const paywallExempt =
    path.startsWith("/dashboard/subscription") || path.startsWith("/dashboard/profile");

  const languages: Locale[] = ["de", "fr", "en"];
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const orgRef = useRef<HTMLDivElement | null>(null);
  const orgSidebarRef = useRef<HTMLDivElement | null>(null);
  const [mobileProfileMenuOpen, setMobileProfileMenuOpen] = useState(false);
  const mobileProfileBtnRef = useRef<HTMLButtonElement | null>(null);
  const mobileProfileMenuRef = useRef<HTMLDivElement | null>(null);

  const [orgs, setOrgs] = useState<OrganizationDto[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [orgsError, setOrgsError] = useState("");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState<number | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDto | null>(null);
  const [subscriptionChecked, setSubscriptionChecked] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const isAdmin = Boolean((user as any)?.admin || (user as any)?.superAdmin);
  const isSuperAdmin = Boolean((user as any)?.superAdmin);
  const subscriptionBypass = Boolean((user as any)?.subscriptionBypass);

  useEffect(() => {
    if (!loading && !token) router.replace(localizePath("/"));
  }, [loading, token, router]);

  useEffect(() => {
    setMobileProfileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileProfileMenuOpen) return;

    function onPointerDown(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      const insideMenu = mobileProfileMenuRef.current?.contains(target);
      const insideBtn = mobileProfileBtnRef.current?.contains(target);
      if (!insideMenu && !insideBtn) setMobileProfileMenuOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [mobileProfileMenuOpen]);

  // On rafraîchit le profil (photo, subscriptionBypass, etc.) avant d'appliquer le paywall.
  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!token) return;
      if (onAdminArea || subscriptionBypass) {
        try {
          await refreshUser();
        } finally {
          if (!cancelled) setProfileChecked(true);
        }
        return;
      }
      setProfileChecked(false);
      try {
        await refreshUser();
      } finally {
        if (!cancelled) setProfileChecked(true);
      }
    }
    if (token) run();
    else setProfileChecked(false);
    return () => {
      cancelled = true;
    };
  }, [token, refreshUser, onAdminArea, subscriptionBypass]);

  // Chargement de l'abonnement et redirection si expiré / inexistant
  useEffect(() => {
    let cancelled = false;
    async function loadSubscription() {
      if (!token || !profileChecked) return;
      // Evite de recharger l'abonnement à chaque navigation.
      if (subscriptionChecked) {
        return;
      }
      if (onAdminArea || isAdmin || subscriptionBypass) {
        // Accès direct => ne pas rediriger vers /dashboard/subscription
        setSubscription(null);
        setSubscriptionChecked(true);
        if (subscriptionBypass && path.startsWith("/dashboard/subscription")) {
          router.replace(localizePath("/dashboard"));
        }
        return;
      }
      try {
        setSubscriptionLoading(true);
        const sub = await subscriptionGetMe();
        if (cancelled) return;
        setSubscription(sub);
        // Si pas d'abonnement ou expiré/annulé, forcer la page abonnement
        const status = sub?.status;
        const needsPaywall =
          !sub ||
          status === "EXPIRED" ||
          status === "CANCELLED";
        if (needsPaywall && !paywallExempt) {
          router.replace(localizePath("/dashboard/subscription"));
        }
      } catch (e) {
        if (cancelled) return;
        if (isApiError(e)) {
          if (e.status === 401 || e.status === 403) {
            logout({ redirectTo: localizePath("/") });
            return;
          }
          // Toute autre erreur API (404, 500, etc.) = pas d'abonnement actif
          setSubscription(null);
          if (!paywallExempt) {
            router.replace(localizePath("/dashboard/subscription"));
          }
        } else {
          // Erreur inconnue: se comporter comme aucun abonnement
          setSubscription(null);
          if (!paywallExempt) {
            router.replace(localizePath("/dashboard/subscription"));
          }
        }
      } finally {
        if (!cancelled) {
          setSubscriptionChecked(true);
          setSubscriptionLoading(false);
        }
      }
    }
    loadSubscription();
    return () => {
      cancelled = true;
    };
  }, [token, pathname, path, router, logout, profileChecked, subscriptionBypass, isAdmin, onAdminArea, subscriptionChecked, localizePath, paywallExempt]);

  // Sans abonnement actif, chaque navigation hors page abonnement doit renvoyer vers celle-ci
  // (sinon subscriptionChecked bloque le premier effet et l’utilisateur reste sur une route avec contenu vide).
  useEffect(() => {
    if (!token || !profileChecked || !subscriptionChecked) return;
    if (onAdminArea || isAdmin || subscriptionBypass) return;
    const subStatus = subscription?.status;
    const needsPaywall =
      !subscription ||
      subStatus === "EXPIRED" ||
      subStatus === "CANCELLED";
    if (needsPaywall && !paywallExempt) {
      router.replace(localizePath("/dashboard/subscription"));
    }
  }, [
    token,
    profileChecked,
    subscriptionChecked,
    subscription,
    path,
    isAdmin,
    subscriptionBypass,
    onAdminArea,
    router,
    localizePath,
    paywallExempt,
  ]);

  useEffect(() => {
    if (!path.startsWith("/dashboard/admin")) return;
    if (!isSuperAdmin && !loading) {
      router.replace(localizePath("/dashboard"));
    }
  }, [path, isSuperAdmin, router, loading, localizePath]);

  // Super admin : pas d’espace client (organisations / menus) — uniquement la gestion admin.
  useEffect(() => {
    if (loading || !token || !isSuperAdmin) return;
    const orgListView = path === "/dashboard" && searchParams.get("view") === "organisations";
    if (path.startsWith("/dashboard/organisations") || orgListView) {
      router.replace(localizePath("/dashboard/admin"));
    }
  }, [loading, token, isSuperAdmin, path, searchParams, router, localizePath]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
      const outsideOrg =
        (orgRef.current && !orgRef.current.contains(target)) &&
        (orgSidebarRef.current && !orgSidebarRef.current.contains(target));
      if (outsideOrg) {
        setOrgDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    async function loadOrgs() {
      if (isSuperAdmin) {
        setOrgs([]);
        setCurrentOrgId(null);
        setOrgsError("");
        setOrgsLoading(false);
        return;
      }
      try {
        const list = await orgList();
        setOrgs(list);

        if (list.length === 0) {
          setCurrentOrgId(null);
          return;
        }

        let initialId: number | null = null;

        if (activeOrgId && list.some((o) => o.id === activeOrgId)) {
          initialId = activeOrgId;
        } else if (typeof window !== "undefined") {
          const stored = window.localStorage.getItem("currentOrgId");
          if (stored) {
            const storedId = Number(stored);
            if (list.some((o) => o.id === storedId)) {
              initialId = storedId;
            }
          }
        }

        if (initialId == null) {
          initialId = list[0]?.id ?? null;
        }

        setCurrentOrgId(initialId);

        if (
          initialId &&
          path.startsWith("/dashboard/organisations") &&
          !path.startsWith(`/dashboard/organisations/${initialId}`)
        ) {
          router.replace(localizePath(`/dashboard/organisations/${initialId}`));
        }
      } catch (e) {
        if (isApiError(e) && (e.status === 401 || e.status === 403 || e.status === 404)) {
          logout({ redirectTo: localizePath("/") });
          return;
        }
        setOrgsError(e instanceof Error ? e.message : "Erreur organisations");
      } finally {
        setOrgsLoading(false);
      }
    }

    if (token) {
      loadOrgs();
    }
  }, [token, router, logout, path, activeOrgId, localizePath, isSuperAdmin]);

  function handleSelectOrg(id: number) {
    setCurrentOrgId(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currentOrgId", String(id));
    }
    setOrgDropdownOpen(false);
    if (!path.startsWith(`/dashboard/organisations/${id}`)) {
      router.push(localizePath(`/dashboard/organisations/${id}`));
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="text-sm tracking-[0.3em] text-neutral-400 uppercase">
          {t("dashboardLoading", locale)}
        </p>
      </div>
    );
  }

  if (!token) return null;

  // Tant que nous n'avons pas vérifié l'abonnement (et qu'on n'est pas déjà
  // sur la page d'abonnement), afficher un écran de chargement.
  if (!subscriptionChecked && !paywallExempt && !onAdminArea && !subscriptionBypass) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="text-sm tracking-[0.3em] text-neutral-400 uppercase">
          {t("subscriptionLoading", locale)}
        </p>
      </div>
    );
  }

  const subStatus = subscription?.status;
  const needsPaywall =
    !subscription ||
    subStatus === "EXPIRED" ||
    subStatus === "CANCELLED";
  const showSubscriptionPaywall =
    subscriptionChecked &&
    needsPaywall &&
    !isAdmin &&
    !subscriptionBypass &&
    !onAdminArea &&
    !paywallExempt;

  if (showSubscriptionPaywall) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
        <header className="flex shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-4 py-3 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border-2 border-amber-400/80 bg-white shadow">
              <Image
                src="/digikarte-logo.png"
                alt="DigiKarte"
                fill
                sizes="36px"
                className="object-contain p-1.5"
              />
            </div>
            <span className="font-forum text-lg tracking-wide text-amber-400">DigiKarte</span>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setLocale(lang);
                  router.push(swapLocaleInBrowserPath(pathname || "/", lang));
                }}
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition ${
                  locale === lang
                    ? "bg-amber-500/20 text-amber-200"
                    : "text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center px-5 pb-12 pt-8 sm:px-8">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/70 p-7 shadow-xl shadow-black/40 sm:p-9">
            <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-amber-400/90">
              {t("subscriptionKicker", locale)}
            </p>
            <h1 className="mt-2 font-forum text-xl font-semibold leading-snug text-neutral-50 sm:text-2xl">
              {t("subscriptionPaywallTitle", locale)}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400">
              {t("subscriptionPaywallBody", locale)}
            </p>
            <Link
              href={localizePath("/dashboard/subscription")}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3.5 text-sm font-semibold text-neutral-950 shadow-lg shadow-amber-900/20 transition hover:bg-amber-400"
            >
              <IconQr className="h-5 w-5 shrink-0" aria-hidden />
              {t("subscriptionPaywallCta", locale)}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const currentOrg =
    currentOrgId != null
      ? orgs.find((o) => o.id === currentOrgId) ?? null
      : null;

  const currentOrgIdSafe = currentOrg?.id ?? null;
  /** Évite liens vagues vers /dashboard quand l’org courante n’est pas encore hydratée mais la liste existe. */
  const navOrgId = currentOrgIdSafe ?? orgs[0]?.id ?? null;

  const menusHref = navOrgId ? `/dashboard/organisations/${navOrgId}` : "/dashboard";
  const organisationsHref = "/dashboard?view=organisations";
  const qrHref = navOrgId ? `/dashboard/organisations/${navOrgId}/qr` : organisationsHref;
  const subscriptionHref = "/dashboard/subscription";

  return (
    <div className="flex min-h-screen min-w-0 bg-neutral-950 text-neutral-100">
      {/* Sidebar gauche */}
      <aside className="hidden w-72 flex flex-col border-r border-neutral-800 bg-neutral-950/95 px-5 py-6 shadow-xl/40 backdrop-blur lg:flex">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-amber-400/80 bg-white shadow-lg">
            <Image
              src="/digikarte-logo.png"
              alt="DigiKarte"
              fill
              sizes="56px"
              className="object-contain p-2"
            />
          </div>
          <div className="leading-tight">
            <p className="font-forum text-[1.35rem] font-semibold uppercase tracking-[0.3em] text-amber-300">
              DigiKarte
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.32em] text-neutral-500">
              {t("dashboardMenuDigitalAdmin", locale)}
            </p>
          </div>
        </div>

        {/* Sélecteur d'organisation dans la sidebar (si plusieurs) */}
        {!isAdmin && orgs.length > 0 && (
          <div ref={orgSidebarRef} className="relative mb-6">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500">
              {t("dashboardCurrentOrg", locale)}
            </p>
            {orgs.length === 1 ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-sm text-neutral-200">
                <span className="truncate block">{currentOrg?.name ?? orgs[0]?.name}</span>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setOrgDropdownOpen((o) => !o)}
                  className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-2 text-left text-sm text-neutral-200 hover:border-amber-500/50 hover:bg-neutral-900/80"
                  aria-haspopup="true"
                  aria-expanded={orgDropdownOpen}
                >
                  <span className="truncate">
                    {currentOrg ? currentOrg.name : t("dashboardSelectOrg", locale)}
                  </span>
                  <span className="ml-2 shrink-0 text-[10px]" aria-hidden>
                    {orgDropdownOpen ? "▲" : "▼"}
                  </span>
                </button>
                {orgDropdownOpen && (
                  <div className="absolute left-0 right-0 z-40 mt-1 max-h-48 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950/98 p-1 text-xs shadow-xl shadow-black/60">
                    {orgs.map((org) => (
                      <button
                        key={org.id}
                        type="button"
                        onClick={() => handleSelectOrg(org.id)}
                        className={`flex w-full cursor-pointer flex-col items-start rounded-lg px-3 py-2 text-left transition ${
                          currentOrgId === org.id
                            ? "bg-amber-500/15 text-amber-200"
                            : "text-neutral-300 hover:bg-neutral-900 hover:text-neutral-50"
                        }`}
                      >
                        <span className="truncate w-full font-medium">{org.name}</span>
                        {org.description && (
                          <span className="mt-0.5 line-clamp-2 text-[10px] text-neutral-500">
                            {org.description}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <nav className="flex-1 space-y-1 text-[13px] font-medium">
          {!isAdmin &&
            navItems(locale)
              .filter((item) => !(subscriptionBypass && item.href === "/dashboard/subscription"))
              .map((item) => {
              const isProfile = path === "/dashboard/profile";

              let active = false;
              const isDashboardRoot = path === "/dashboard";
              const isOrganisationsView =
                isDashboardRoot && dashboardView === "organisations";

              if (item.href === "/dashboard") {
                active = isDashboardRoot && !isOrganisationsView;
              } else if (item.href === "/dashboard?view=organisations") {
                active = isOrganisationsView;
              } else if (item.href === "/dashboard/subscription") {
                active = path.startsWith("/dashboard/subscription");
              }

              return (
                <Link
                  key={item.href + (item.view ?? "")}
                  href={localizePath(item.href)}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                    active && !isProfile
                      ? "bg-amber-500/20 text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]"
                      : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 hover:shadow-[0_0_0_1px_rgba(148,163,184,0.45)]"
                  }`}
                >
                  <item.Icon className="h-5 w-5 shrink-0" />
                  <span className="tracking-wide">{t(item.labelKey, locale)}</span>
                </Link>
              );
            })}

          {isSuperAdmin && (
            <>
              <Link
                href={localizePath("/dashboard/admin")}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  path === "/dashboard/admin"
                    ? "bg-amber-500/20 text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 hover:shadow-[0_0_0_1px_rgba(148,163,184,0.45)]"
                }`}
              >
                <IconBuilding className="h-5 w-5 shrink-0" />
                <span className="tracking-wide">{t("dashboardAdmin", locale)}</span>
              </Link>
              <Link
                href={localizePath("/dashboard/admin/admins")}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  path === "/dashboard/admin/admins"
                    ? "bg-amber-500/20 text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 hover:shadow-[0_0_0_1px_rgba(148,163,184,0.45)]"
                }`}
              >
                <IconMenuList className="h-5 w-5 shrink-0" />
                <span className="tracking-wide">{t("dashboardAdminAdmins", locale)}</span>
              </Link>
              <Link
                href={localizePath("/dashboard/admin/users")}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  path === "/dashboard/admin/users"
                    ? "bg-amber-500/20 text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 hover:shadow-[0_0_0_1px_rgba(148,163,184,0.45)]"
                }`}
              >
                <IconMenuList className="h-5 w-5 shrink-0" />
                <span className="tracking-wide">{t("dashboardAdminVipUsers", locale)}</span>
              </Link>
              <Link
                href={localizePath("/dashboard/admin/users/normal")}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  path === "/dashboard/admin/users/normal"
                    ? "bg-amber-500/20 text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 hover:shadow-[0_0_0_1px_rgba(148,163,184,0.45)]"
                }`}
              >
                <IconMenuList className="h-5 w-5 shrink-0" />
                <span className="tracking-wide">{t("dashboardAdminNormalUsers", locale)}</span>
              </Link>
            </>
          )}

          {!isAdmin && currentOrg && (
            <>
              <Link
                href={localizePath(`/dashboard/organisations/${currentOrg.id}`)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  (path === `/dashboard/organisations/${currentOrg.id}` ||
                    (path.startsWith(`/dashboard/organisations/${currentOrg.id}/menus/`) &&
                      !path.endsWith("/qr")))
                    ? "bg-amber-500/20 text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 hover:shadow-[0_0_0_1px_rgba(148,163,184,0.45)]"
                }`}
              >
                <IconMenuList className="h-5 w-5 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  <span className="block truncate">{t("dashboardNavMenusOfOrg", locale)}</span>
                  <span className="block truncate text-[11px] font-normal text-neutral-500">
                    {currentOrg.name}
                  </span>
                </div>
              </Link>
              <Link
                href={localizePath(`/dashboard/organisations/${currentOrg.id}/qr`)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  path === `/dashboard/organisations/${currentOrg.id}/qr` ||
                  (path.startsWith(`/dashboard/organisations/${currentOrg.id}/`) && path.includes("/qr"))
                    ? "bg-amber-500/20 text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.35)]"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50 hover:shadow-[0_0_0_1px_rgba(148,163,184,0.45)]"
                }`}
              >
                <IconQr className="h-5 w-5 shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  <span className="block truncate">{t("menuQrTab", locale)}</span>
                  <span className="block truncate text-[11px] font-normal text-neutral-500">
                    {currentOrg.name}
                  </span>
                </div>
              </Link>
            </>
          )}
        </nav>

        {/* Profil utilisateur et déconnexion en bas du sidebar */}
        <div className="mt-auto border-t border-neutral-800 pt-4 space-y-2">
          {user && (
            <Link
              href={localizePath("/dashboard/profile")}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                path === "/dashboard/profile"
                  ? "bg-amber-500/15 text-amber-300"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
              }`}
            >
              {user.profilePhotoBase64 ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-amber-500/40 bg-neutral-800">
                  <img
                    src={`data:image/jpeg;base64,${user.profilePhotoBase64}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-sm font-semibold text-amber-300">
                  {(user.prenom?.[0] ?? user.nom?.[0] ?? "?").toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1 text-xs">
                <p className="truncate font-medium text-neutral-200">
                  {user.prenom} {user.nom}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-neutral-500">
                  {t("dashboardNavProfile", locale)}
                </p>
              </div>
            </Link>
          )}
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl bg-red-500 px-3 py-2.5 text-left text-sm font-medium text-white shadow hover:bg-red-400"
          >
            <IconLogout className="h-5 w-5 shrink-0" />
            <span>{t("profileLogout", locale)}</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex min-h-screen min-w-0 max-w-full flex-1 flex-col lg:ml-0">
        {/* Topbar: gauche = nom organisation (cliquable), droite = langue + profil */}
        <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-4 py-3 backdrop-blur lg:pl-8">
          {/* Gauche : logo mobile ou nom de l'organisation (lien vers dashboard / org) */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border-2 border-amber-400/80 bg-white shadow">
                <Image
                  src="/digikarte-logo.png"
                  alt="DigiKarte"
                  fill
                  sizes="36px"
                  className="object-contain p-1.5"
                />
              </div>
              <span className="font-forum text-lg tracking-wide text-amber-400">
                DigiKarte
              </span>
            </div>
            {/* Nom de l'organisation à gauche (cliquable → dashboard ou page org) */}
            {!isAdmin && !orgsLoading && orgs.length > 0 && currentOrg && (
              <Link
                href={localizePath("/dashboard")}
                className="hidden truncate rounded-xl px-3 py-1.5 text-left text-sm font-medium text-neutral-200 transition hover:bg-neutral-900/80 hover:text-amber-200 lg:block"
              >
                <span className="block truncate">{currentOrg.name}</span>
                <span className="text-[10px] font-normal uppercase tracking-wider text-neutral-500">
                  {t("dashboardCurrentOrg", locale)}
                </span>
              </Link>
            )}
          {isSuperAdmin && (
              <span className="hidden truncate rounded-xl border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-left text-sm font-semibold text-amber-200 lg:block">
                {t("dashboardSuperAdmin", locale)}
              </span>
            )}
          </div>

          {/* Droite : sélecteur de langue + profil */}
          <div className="ml-auto flex shrink-0 items-center gap-3 text-xs text-neutral-400">
            <div ref={langRef} className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-[11px] text-neutral-200 shadow-lg shadow-black/40 backdrop-blur transition hover:border-emerald-400/70 hover:bg-neutral-700 hover:text-neutral-50"
                aria-haspopup="true"
                aria-expanded={langOpen}
              >
                <FlagIcon code={locale} />
                <span className="sm:hidden uppercase">
                  {locale}
                </span>
                <span className="hidden sm:inline">
                  {localeLabels[locale]}
                </span>
                <span className="text-[9px] sm:text-[10px]" aria-hidden>
                  {langOpen ? "▲" : "▼"}
                </span>
              </button>

              {langOpen && (
                <div className="absolute right-0 z-60 mt-1 w-40 rounded-2xl border border-neutral-800 bg-neutral-950 p-1 text-[11px] text-neutral-50 shadow-xl shadow-black/60">
                  {languages.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setLocale(lang);
                          router.push(swapLocaleInPath(lang));
                          setLangOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-left transition ${
                          locale === lang
                            ? "bg-emerald-500/15 text-emerald-200"
                            : "text-neutral-200 hover:bg-neutral-900"
                        }`}
                      >
                      <FlagIcon code={lang} />
                      <span>{localeLabels[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown organisation (topbar) : gardé pour mobile / multi-org */}
            {!isAdmin && (
              <div ref={orgRef} className="relative flex items-center lg:hidden">
              {orgsLoading ? (
                <span className="text-[11px] text-neutral-500">
                  {t("dashboardLoadingOrgs", locale)}
                </span>
              ) : orgs.length > 1 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOrgDropdownOpen((o) => !o)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-800 px-3 py-1.5 text-[11px] text-neutral-200 hover:border-amber-400 hover:bg-neutral-700 hover:text-amber-200"
                  >
                    <span className="max-w-[120px] truncate">
                      {currentOrg ? currentOrg.name : t("dashboardSelectOrg", locale)}
                    </span>
                    <span className="text-[9px]" aria-hidden>{orgDropdownOpen ? "▲" : "▼"}</span>
                  </button>
                  {orgDropdownOpen && (
                    <div className="absolute right-0 z-40 mt-1 max-h-56 w-[calc(100vw-2rem)] max-w-64 overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-950/95 p-1 text-[11px] shadow-xl shadow-black/60">
                      {orgs.map((org) => (
                        <button
                          key={org.id}
                          type="button"
                          onClick={() => handleSelectOrg(org.id)}
                          className={`flex w-full cursor-pointer flex-col items-start rounded-xl px-3 py-1.5 text-left transition ${
                            currentOrgId === org.id
                              ? "bg-amber-500/15 text-amber-200"
                              : "text-neutral-300 hover:bg-neutral-900 hover:text-neutral-50"
                          }`}
                        >
                          <span className="truncate font-medium">{org.name}</span>
                          {org.description && (
                            <span className="mt-0.5 line-clamp-2 text-[10px] text-neutral-500">
                              {org.description}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              </div>
            )}

            <Link
              href={localizePath("/dashboard/profile")}
              className="hidden items-center gap-2 sm:flex"
            >
              {user?.profilePhotoBase64 ? (
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-amber-500/40 bg-neutral-800">
                  <img
                    src={`data:image/jpeg;base64,${user.profilePhotoBase64}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-amber-300">
                  {(user?.prenom?.[0] ?? user?.nom?.[0] ?? "?").toUpperCase()}
                </div>
              )}
              <span className="text-[11px] text-neutral-400">
                {t("dashboardNavProfile", locale)}
              </span>
            </Link>
            <button
              ref={mobileProfileBtnRef}
              type="button"
              onClick={() => setMobileProfileMenuOpen((v) => !v)}
              aria-expanded={mobileProfileMenuOpen}
              aria-label={t("dashboardNavProfile", locale)}
              className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-2 py-1.5 sm:hidden"
            >
              {user?.profilePhotoBase64 ? (
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-amber-500/40 bg-neutral-800">
                  <img
                    src={`data:image/jpeg;base64,${user.profilePhotoBase64}`}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-amber-300">
                  {(user?.prenom?.[0] ?? user?.nom?.[0] ?? "?").toUpperCase()}
                </div>
              )}
              <span className="text-[11px] text-neutral-300">
                {t("dashboardNavProfile", locale)}
              </span>
            </button>
          </div>
        </header>
        {mobileProfileMenuOpen && (
          <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-16 sm:hidden">
            <div className="absolute inset-0 bg-black/65" />
            <div
              ref={mobileProfileMenuRef}
              className="relative w-full max-w-[420px] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-2xl shadow-black/70"
            >
              <div className="border-b border-neutral-800 px-4 py-3">
                <p className="text-sm font-semibold text-neutral-100">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">
                  {t("dashboardNavProfile", locale)}
                </p>
              </div>
              <div className="p-2">
                {isSuperAdmin ? (
                  <>
                    <Link href={localizePath("/dashboard/admin")} onClick={() => setMobileProfileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-900">
                      <IconBuilding className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{t("dashboardAdmin", locale)}</span>
                    </Link>
                    <Link href={localizePath("/dashboard/admin/users")} onClick={() => setMobileProfileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-900">
                      <IconMenuList className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{t("dashboardAdminVipUsers", locale)}</span>
                    </Link>
                    <Link href={localizePath("/dashboard/admin/users/normal")} onClick={() => setMobileProfileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-900">
                      <IconMenuList className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{t("dashboardAdminNormalUsers", locale)}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    {!subscriptionBypass && (
                      <Link href={localizePath("/dashboard/subscription")} onClick={() => setMobileProfileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-900">
                        <IconQr className="h-4 w-4 shrink-0" aria-hidden />
                        <span>{t("subscriptionNav", locale)}</span>
                      </Link>
                    )}
                    <Link href={localizePath("/dashboard")} onClick={() => setMobileProfileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-900">
                      <IconHome className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{t("dashboardNavDashboard", locale)}</span>
                    </Link>
                    <Link href={localizePath(organisationsHref)} onClick={() => setMobileProfileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-900">
                      <IconBuilding className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{t("dashboardNavOrganisations", locale)}</span>
                    </Link>
                    <Link href={localizePath(qrHref)} onClick={() => setMobileProfileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-900">
                      <IconQr className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{t("menuQrTab", locale)}</span>
                    </Link>
                    <Link href={localizePath(menusHref)} onClick={() => setMobileProfileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-900">
                      <IconMenuList className="h-4 w-4 shrink-0" aria-hidden />
                      <span>{t("dashboardNavMenusOfOrg", locale)}</span>
                    </Link>
                  </>
                )}
                <div className="my-2 border-t border-neutral-800" />
                <Link href={localizePath("/dashboard/profile")} onClick={() => setMobileProfileMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-amber-200 hover:bg-neutral-900">
                  <IconHome className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{t("dashboardNavProfile", locale)}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileProfileMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-red-300 hover:bg-red-950/30 hover:text-red-200"
                >
                  <IconLogout className="h-4 w-4 shrink-0" aria-hidden />
                  <span>{t("profileLogout", locale)}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden bg-neutral-950/95 px-4 py-6 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] scroll-pb-28 sm:px-6 sm:pb-[calc(8rem+env(safe-area-inset-bottom,0px))] lg:overflow-x-visible lg:px-10 lg:py-8 lg:pb-10">
          {path.match(/^\/dashboard\/organisations\/[^/]+\/menus\/[^/]+/) ? (
            <div className="flex min-h-0 w-full min-w-0 max-w-full flex-1 flex-col">{children}</div>
          ) : (
            <div className="mx-auto flex min-h-0 w-full min-w-0 max-w-6xl flex-1 flex-col">{children}</div>
          )}
          <div className="mt-8 w-full shrink-0 border-t border-neutral-800/80 pt-2 lg:mx-auto lg:mt-10 lg:max-w-6xl">
            <Footer variant="dashboard" />
          </div>
        </main>

        {/* Navbar mobile fixe (navigation toujours visible) */}
        <nav className="fixed bottom-0 left-0 right-0 z-[100] border-t border-neutral-800 bg-neutral-950/95 backdrop-blur pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] lg:hidden">
          <div className="flex items-stretch justify-between gap-x-0.5 px-1 py-1.5 sm:px-1.5">
            {isSuperAdmin ? (
              <>
                <Link
                  href={localizePath("/dashboard/admin")}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-[10px] font-semibold ${
                    path === "/dashboard/admin"
                      ? "text-amber-200"
                      : "text-neutral-400 hover:text-neutral-100"
                  }`}
                >
                  <IconBuilding className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="text-center leading-tight">{t("dashboardAdmin", locale)}</span>
                </Link>
                <Link
                  href={localizePath("/dashboard/admin/admins")}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-[10px] font-semibold ${
                    path === "/dashboard/admin/admins"
                      ? "text-amber-200"
                      : "text-neutral-400 hover:text-neutral-100"
                  }`}
                >
                  <IconMenuList className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="text-center leading-tight">{t("dashboardAdminAdminsShort", locale)}</span>
                </Link>
                <Link
                  href={localizePath("/dashboard/admin/users")}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-[10px] font-semibold ${
                    path === "/dashboard/admin/users" ||
                    path === "/dashboard/admin/users/normal"
                      ? "text-amber-200"
                      : "text-neutral-400 hover:text-neutral-100"
                  }`}
                >
                  <IconMenuList className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="text-center leading-tight">{t("dashboardAdminVipShort", locale)}</span>
                </Link>
                <Link
                  href={localizePath("/dashboard/admin/users/normal")}
                  className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-[10px] font-semibold ${
                    path === "/dashboard/admin/users/normal"
                      ? "text-amber-200"
                      : "text-neutral-400 hover:text-neutral-100"
                       }`}
                >
                  <IconMenuList className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="text-center leading-tight">{t("dashboardAdminNormalShort", locale)}</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={localizePath("/dashboard")}
                  className={`flex min-h-[48px] min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-2 text-[10px] font-semibold active:opacity-90 ${
                    path === "/dashboard" && dashboardView !== "organisations"
                      ? "text-amber-200"
                      : "text-neutral-400 hover:text-neutral-100"
                  }`}
                >
                  <IconHome className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="text-center leading-tight">{t("dashboardMobileHomeShort", locale)}</span>
                </Link>
                {!isAdmin &&
                  (subscriptionBypass ? (
                    <div
                      className="flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-0.5 py-2"
                      aria-hidden
                    />
                  ) : (
                    <Link
                      href={localizePath(subscriptionHref)}
                      className={`flex min-h-[48px] min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-2 text-[10px] font-semibold active:opacity-90 ${
                        path.startsWith("/dashboard/subscription")
                          ? "text-amber-200"
                          : "text-neutral-400 hover:text-neutral-100"
                      }`}
                    >
                      <IconMenuList className="h-5 w-5 shrink-0" aria-hidden />
                      <span className="text-center leading-tight">{t("subscriptionNav", locale)}</span>
                    </Link>
                  ))}
                <Link
                  href={localizePath(organisationsHref)}
                  className={`flex min-h-[48px] min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-2 text-[10px] font-semibold active:opacity-90 ${
                    path === "/dashboard" && dashboardView === "organisations"
                      ? "text-amber-200"
                      : "text-neutral-400 hover:text-neutral-100"
                  }`}
                >
                  <IconBuilding className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="text-center leading-tight">{t("dashboardMobileOrgsShort", locale)}</span>
                </Link>
                <Link
                  href={localizePath(qrHref)}
                  className={`relative z-10 flex min-h-[48px] min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-2 text-[10px] font-semibold active:opacity-90 ${
                    navOrgId != null && path.startsWith(`/dashboard/organisations/${navOrgId}/qr`)
                      ? "text-amber-200"
                      : "text-neutral-400 hover:text-neutral-100"
                  }`}
                >
                  <IconQr className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="text-center leading-tight">QR</span>
                </Link>
                <Link
                  href={localizePath(menusHref)}
                  className={`flex min-h-[48px] min-w-0 flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-2 text-[10px] font-semibold active:opacity-90 ${
                    navOrgId != null && path.startsWith(`/dashboard/organisations/${navOrgId}`) && !path.includes("/qr")
                      ? "text-amber-200"
                      : "text-neutral-400 hover:text-neutral-100"
                  }`}
                >
                  <IconMenuList className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="text-center leading-tight">Menus</span>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
