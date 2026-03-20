"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import { stripLocaleFromPathname } from "@/lib/locale-path";

/** Le dashboard affiche le footer dans son propre layout (scroll au-dessus de la barre mobile). */
export default function ConditionalFooter() {
  const pathname = usePathname() ?? "/";
  const path = stripLocaleFromPathname(pathname);
  if (path.startsWith("/dashboard")) return null;
  return <Footer />;
}
