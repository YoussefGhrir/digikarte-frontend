import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { isSeoLocale } from "@/lib/seo";

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  if (!isSeoLocale(params.locale)) {
    notFound();
  }
  return children;
}
