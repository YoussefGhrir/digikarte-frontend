"use client";

import { IconBuilding, IconHome, IconLogout, IconMenuList } from "@/components/icons";
import { useAuth } from "@/lib/auth-context";
import { localeLabels, t, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { orgList, type OrganizationDto, isApiError } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function navItems(_locale: Locale) {
  return [
    { href: "/dashboard", labelKey: "dashboardNavDashboard" as const, Icon: IconHome },
    { href: "/dashboard", labelKey: "dashboardNavOrganisations" as const, Icon: IconBuilding },
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

  const languages: Locale[] = ["de", "fr", "en"];
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);
  const orgRef = useRef<HTMLDivElement | null>(null);
  const orgSidebarRef = useRef<HTMLDivElement | null>(null);

  const [orgs, setOrgs] = useState<OrganizationDto[]>([]);
  const [orgsLoading, setOrgsLoading] = useState(true);
  const [orgsError, setOrgsError] = useState("");
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [currentOrgId, setCurrentOrgId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !token) router.replace("/");
  }, [loading, token, router]);

  useEffect(() => {
    if (token && user) refreshUser();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const path = pathname ?? "";
  let activeOrgId: number | null = null;
  const match = path.match(/^\/dashboard\/organisations\/(\d+)/);
  if (match) {
    activeOrgId = Number(match[1]);
  }

  useEffect(() => {
    async function loadOrgs() {
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
          router.replace(`/dashboard/organisations/${initialId}`);
        }
      } catch (e) {
        if (isApiError(e) && (e.status === 401 || e.status === 404)) {
          logout({ redirectTo: "/" });
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
  }, [token, path, activeOrgId, router, logout]);

  function handleSelectOrg(id: number) {
    setCurrentOrgId(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("currentOrgId", String(id));
    }
    setOrgDropdownOpen(false);
    if (!pathname?.startsWith(`/dashboard/organisations/${id}`)) {
      router.push(`/dashboard/organisations/${id}`);
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

  const currentOrg =
    currentOrgId != null
      ? orgs.find((o) => o.id === currentOrgId) ?? null
      : null;

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
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
            <p className="font-forum text-xl tracking-wide text-amber-400">
              DigiKarte
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              {t("dashboardMenuDigitalAdmin", locale)}
            </p>
          </div>
        </div>

        {/* Sélecteur d'organisation dans la sidebar (si plusieurs) */}
        {orgs.length > 0 && (
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

        <nav className="flex-1 space-y-1 text-sm font-medium">
          {navItems(locale).map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard" && !pathname?.startsWith("/dashboard/organisations/")
                : pathname === item.href;
            const isProfile = pathname === "/dashboard/profile";
            return (
              <Link
                key={item.href + item.labelKey}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  active && !isProfile
                    ? "bg-amber-500/15 text-amber-300"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
                }`}
              >
                <item.Icon className="h-5 w-5 shrink-0" />
                <span>{t(item.labelKey, locale)}</span>
              </Link>
            );
          })}
          {currentOrg && (
            <Link
              href={`/dashboard/organisations/${currentOrg.id}`}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                pathname === `/dashboard/organisations/${currentOrg.id}` ||
                pathname?.startsWith(`/dashboard/organisations/${currentOrg.id}/`)
                  ? "bg-amber-500/15 text-amber-300"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
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
          )}
        </nav>

        {/* Profil utilisateur et déconnexion en bas du sidebar */}
        <div className="mt-auto border-t border-neutral-800 pt-4 space-y-2">
          {user && (
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left transition ${
                pathname === "/dashboard/profile"
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
      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
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
            {!orgsLoading && orgs.length > 0 && currentOrg && (
              <Link
                href="/dashboard"
                className="hidden truncate rounded-xl px-3 py-1.5 text-left text-sm font-medium text-neutral-200 transition hover:bg-neutral-900/80 hover:text-amber-200 lg:block"
              >
                <span className="block truncate">{currentOrg.name}</span>
                <span className="text-[10px] font-normal uppercase tracking-wider text-neutral-500">
                  {t("dashboardCurrentOrg", locale)}
                </span>
              </Link>
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
                <span className="hidden sm:inline">
                  {localeLabels[locale]}
                </span>
                <span className="text-[9px] sm:text-[10px]" aria-hidden>
                  {langOpen ? "▲" : "▼"}
                </span>
              </button>

              {langOpen && (
                <div className="absolute right-0 z-40 mt-1 w-40 rounded-2xl border border-neutral-800 bg-neutral-950/95 p-1 text-[11px] shadow-xl shadow-black/60">
                  {languages.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setLocale(lang);
                          setLangOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-left transition ${
                          locale === lang
                            ? "bg-emerald-500/15 text-emerald-200"
                            : "text-neutral-300 hover:bg-neutral-900 hover:text-neutral-50"
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
                    <div className="absolute right-0 z-40 mt-1 max-h-56 w-64 overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-950/95 p-1 text-[11px] shadow-xl shadow-black/60">
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

            <Link
              href="/dashboard/profile"
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
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-neutral-950/95 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
