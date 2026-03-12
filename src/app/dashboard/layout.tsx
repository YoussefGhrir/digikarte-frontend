"use client";

import { useAuth } from "@/lib/auth-context";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: "🏠" },
  { href: "/dashboard", label: "Organisations", icon: "🏢" },
  // Plus tard : menus favoris, paramètres, etc.
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, token, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !token) router.replace("/login");
  }, [loading, token, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <p className="text-sm tracking-[0.3em] text-neutral-400 uppercase">
          Chargement…
        </p>
      </div>
    );
  }

  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar gauche */}
      <aside className="hidden w-72 flex-col border-r border-neutral-800 bg-neutral-950/95 px-5 py-6 shadow-xl/40 backdrop-blur lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-amber-500/60 bg-neutral-900">
            <Image
              src="/digikarte-logo.png"
              alt="DigiKarte"
              fill
              className="object-contain p-1.5"
            />
          </div>
          <div className="leading-tight">
            <p className="font-forum text-xl tracking-wide text-amber-400">
              DigiKarte
            </p>
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Menu digital admin
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 text-sm font-medium">
          {navItems.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname?.startsWith("/dashboard")
                : pathname === item.href;
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                  active
                    ? "bg-amber-500/15 text-amber-300"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
          {user && (
            <p className="mb-2">
              Connecté en tant que{" "}
              <span className="font-semibold text-neutral-200">
                {user.prenom} {user.nom}
              </span>
            </p>
          )}
          <button
            onClick={logout}
            className="mt-1 inline-flex items-center gap-2 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-red-500/70 hover:bg-red-500/10 hover:text-red-300"
          >
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex min-h-screen flex-1 flex-col lg:ml-0">
        {/* Topbar compacte pour mobile / desktop */}
        <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-4 py-3 backdrop-blur lg:pl-8">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-amber-500/60 bg-neutral-900">
              <Image
                src="/digikarte-logo.png"
                alt="DigiKarte"
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="font-forum text-lg tracking-wide text-amber-400">
              DigiKarte
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3 text-xs text-neutral-400">
            {user && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-amber-300">
                  {user.prenom?.[0]}
                  {user.nom?.[0]}
                </div>
                <div className="hidden flex-col leading-tight sm:flex">
                  <span className="text-neutral-200 text-sm">
                    {user.prenom} {user.nom}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                    Admin
                  </span>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="rounded-lg border border-neutral-700 px-3 py-1 text-[11px] font-medium text-neutral-200 hover:border-red-500/70 hover:bg-red-500/10 hover:text-red-300"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-neutral-950/95 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
