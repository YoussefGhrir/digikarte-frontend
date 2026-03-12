"use client";

import { menuQrUrl } from "@/lib/api";
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";

type QrModel = "classic" | "compact" | "high" | "rounded";

const MODELS: { id: QrModel; label: string; size: number; level: "L" | "M" | "Q" | "H" }[] = [
  { id: "classic", label: "Classique", size: 256, level: "M" },
  { id: "compact", label: "Compact", size: 180, level: "L" },
  { id: "high", label: "Haute redondance", size: 256, level: "H" },
  { id: "rounded", label: "Grand format", size: 320, level: "M" },
];

interface QrDisplayProps {
  menuId: number;
  menuSlug?: string;
}

export function QrDisplay({ menuId, menuSlug }: QrDisplayProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    menuQrUrl(menuId)
      .then((res) => setUrl(res.url))
      .catch(() => setError("Impossible de charger l'URL du QR"));
  }, [menuId]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!url) return <p className="text-stone-500">Chargement…</p>;

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-stone-800">Modèles de QR</h3>
      <p className="text-sm text-stone-500">
        Les clients scannent le QR pour afficher le menu. Choisissez un modèle à imprimer ou partager.
      </p>
      <div className="grid gap-6 sm:grid-cols-2">
        {MODELS.map((model) => (
          <QrCard key={model.id} url={url} model={model} />
        ))}
      </div>
    </div>
  );
}

function QrCard({
  url,
  model,
}: {
  url: string;
  model: (typeof MODELS)[0];
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    const opts = {
      width: model.size,
      margin: 1,
      errorCorrectionLevel: model.level,
      color: { dark: "#171717", light: "#ffffff" },
    };
    QRCode.toDataURL(url, opts).then(setDataUrl);
  }, [url, model.size, model.level]);

  if (!dataUrl) return <div className="aspect-square animate-pulse rounded-xl bg-stone-200" />;

  const isRounded = model.id === "rounded";

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-stone-600">{model.label}</p>
      <div
        className={`mx-auto flex aspect-square max-w-[280px] items-center justify-center bg-white ${
          isRounded ? "rounded-3xl p-4" : "p-2"
        }`}
      >
        <img
          src={dataUrl}
          alt={`QR ${model.label}`}
          className="h-full w-full object-contain"
        />
      </div>
      <p className="mt-2 break-all text-xs text-stone-400">{url}</p>
    </div>
  );
}
