/**
 * Lecture du claim `exp` du JWT (sans vérifier la signature — uniquement pour l’UX / déconnexion locale).
 */

export function getJwtExpiresAtMs(token: string): number | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const json = atob(padded);
    const payload = JSON.parse(json) as { exp?: number };
    if (typeof payload.exp !== "number") return null;
    return payload.exp * 1000;
  } catch {
    return null;
  }
}

/** Considère le token expiré s’il n’a pas d’`exp` ou si l’heure actuelle dépasse `exp` (moins une marge). */
export function isJwtExpired(token: string, skewMs = 30_000): boolean {
  const exp = getJwtExpiresAtMs(token);
  if (exp == null) return true;
  return Date.now() >= exp - skewMs;
}
