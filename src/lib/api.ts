import type { Locale } from "@/lib/i18n";

/**
 * URL absolue du backend Java (Route Handlers, pas de proxy).
 * Même priorité que next.config.js (rewrites /api).
 */
function serverBackendBase(): string {
  const fromEnv = process.env.API_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return "http://127.0.0.1:8080";
  return "https://digicarte-043d88a805be.herokuapp.com";
}

/**
 * Base pour les requêtes API.
 * - Navigateur : '' → chemins relatifs `/api/...` proxifiés par Next vers le backend (recommandé sur digi-karte.com).
 * - Serveur : URL absolue (ex. redirection OAuth dans `app/api/.../route.ts`).
 */
export const API_BASE = typeof window === "undefined" ? serverBackendBase() : "";

/** Même clé que `language-context` / middleware : langue courante pour les URLs QR côté API. */
const CLIENT_LANG_STORAGE_KEY = "digikarte-lang";
/** Aligné sur `MenuController.LOCALE_HEADER` (backend). */
export const DIGIKARTE_LOCALE_HEADER = "X-DigiKarte-Locale";

const VALID_API_LOCALES: Locale[] = ["de", "fr", "en"];

function isApiLocale(value: unknown): value is Locale {
  return typeof value === "string" && VALID_API_LOCALES.includes(value as Locale);
}

function readLangCookie(): string | null {
  if (typeof document === "undefined") return null;
  const all = document.cookie;
  if (!all) return null;
  for (const part of all.split(";").map((p) => p.trim())) {
    const [k, ...rest] = part.split("=");
    if (k === CLIENT_LANG_STORAGE_KEY) return rest.join("=");
  }
  return null;
}

/**
 * Locale « route » pour les appels API (QR, etc.) : localStorage puis cookie.
 * Sur le serveur → `null` (le backend utilisera `APP_ROUTE_LOCALE_FALLBACK`).
 */
export function getClientRouteLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CLIENT_LANG_STORAGE_KEY);
    if (isApiLocale(stored)) return stored;
  } catch {
    // ignore
  }
  const c = readLangCookie();
  if (isApiLocale(c)) return c;
  return null;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const routeLoc = getClientRouteLocale();
  if (routeLoc && headers[DIGIKARTE_LOCALE_HEADER] === undefined) {
    headers[DIGIKARTE_LOCALE_HEADER] = routeLoc;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let parsedBody: any = null;
  let rawText: string | null = null;

  if (!res.ok) {
    try {
      rawText = await res.text();
      parsedBody = rawText ? JSON.parse(rawText) : null;
    } catch {
      // ignore JSON parse errors
    }

    // In case of unauthorized/forbidden from protected endpoints, clear token
    // and user, then send the visitor back to the public home page.
    if ((res.status === 401 || res.status === 403) && typeof window !== "undefined") {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {
        // ignore storage errors
      }
      // Redirection globale vers la page d'accueil publique
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    const code = parsedBody?.code as string | undefined;
    const message =
      (parsedBody?.message as string | undefined) ||
      rawText ||
      `HTTP ${res.status}`;

    throw new ApiError(message, res.status, code);
  }

  // Utilisation réelle du compte (API authentifiée) = réinitialise le timer d'inactivité côté client.
  if (typeof window !== "undefined" && token) {
    try {
      window.dispatchEvent(new CustomEvent("digikarte-activity"));
    } catch {
      // ignore
    }
  }

  if (res.status === 204) return undefined as T;
  // Certains endpoints (ex: DELETE "void") renvoient un body vide mais pas forcément en 204.
  // Dans ce cas, `res.json()` déclenche "Unexpected end of JSON input".
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

// Auth
export interface AuthResponse {
  token: string;
  email: string;
  nom: string;
  prenom: string;
  userId: number;
  subscriptionBypass?: boolean;
  admin?: boolean;
  superAdmin?: boolean;
}

export function authRegister(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
}) {
  return api<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function authLogin(data: { email: string; password: string }) {
  return api<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function authDeleteMe() {
  return api<void>("/api/auth/me", { method: "DELETE" });
}

export interface ProfileDto {
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  profilePhotoBase64: string | null;
  subscriptionBypass: boolean;
  admin?: boolean;
  superAdmin?: boolean;
}

export function authGetProfile() {
  return api<ProfileDto>("/api/auth/me");
}

export function authUpdateProfile(data: {
  prenom?: string;
  nom?: string;
  telephone?: string;
}) {
  return api<ProfileDto>("/api/auth/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function authUpdateProfilePhoto(file: File): Promise<void> {
  const token = getToken();
  if (!token) return Promise.reject(new Error("Not authenticated"));
  // Petit garde-fou côté client: ignorer les fichiers vides
  if (file.size === 0) {
    return Promise.reject(new ApiError("Empty file", 400, "EMPTY_FILE"));
  }
  const formData = new FormData();
  formData.append("file", file);
  return fetch(`${API_BASE}/api/auth/me/photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      let body: { code?: string; message?: string } | null = null;
      try {
        body = await res.json();
      } catch {
        // ignore
      }
      throw new ApiError(
        body?.message ?? res.statusText,
        res.status,
        body?.code
      );
    }
  }) as Promise<void>;
}

// Organizations
export interface OrganizationDto {
  id: number;
  name: string;
  description?: string;
  /** Slogan du restaurant (affiché sur le menu public). */
  slogan?: string | null;
  addressLine1?: string | null;
  addressPostalCode?: string | null;
  addressCity?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
  /** Logo encodé en Base64 (JPEG), pour affichage et menu public. */
  organizationLogoBase64?: string | null;
}

export function orgList() {
  return api<OrganizationDto[]>("/api/organizations");
}

export function orgCreate(data: {
  name: string;
  slogan?: string;
  addressLine1?: string;
  addressPostalCode?: string;
  addressCity?: string;
  country?: string;
  phone?: string;
  email?: string;
}) {
  return api<OrganizationDto>("/api/organizations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function orgGet(id: number) {
  return api<OrganizationDto>(`/api/organizations/${id}`);
}

export function orgUpdate(
  id: number,
  data: {
    name?: string;
    slogan?: string;
    addressLine1?: string;
    addressPostalCode?: string;
    addressCity?: string;
    country?: string;
    phone?: string;
    email?: string;
  }
) {
  return api<OrganizationDto>(`/api/organizations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/** Taille max côté backend (15 MB). */
export const ORG_PHOTO_MAX_BYTES = 15 * 1024 * 1024;

export function orgUpdatePhoto(id: number, file: File): Promise<void> {
  const token = getToken();
  if (!token) return Promise.reject(new Error("Not authenticated"));
  const formData = new FormData();
  formData.append("file", file);
  return fetch(`${API_BASE}/api/organizations/${id}/photo`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  }).then(async (res) => {
    if (!res.ok) {
      let body: { code?: string; message?: string } | null = null;
      try {
        body = await res.json();
      } catch {
        // ignore
      }
      throw new ApiError(
        body?.message ?? res.statusText,
        res.status,
        body?.code
      );
    }
  }) as Promise<void>;
}

export function orgDelete(id: number) {
  return api<void>(`/api/organizations/${id}`, { method: "DELETE" });
}

// Menus
export interface MenuItemDto {
  id: number;
  name: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  section?: string;
  sortOrder?: number;
  /** Sous-produit rattaché à ce plat parent */
  parentItemId?: number | null;
}

export interface MenuDto {
  id: number;
  title: string;
  description?: string;
  slug: string;
  organizationId: number;
  /** Template d'affichage: classic, cafe, bistro, minimal, cards, elegant */
  displayTemplate?: string | null;
  /**
   * Thème de couleur du modèle (optionnel).
   * "default" = couleurs par défaut du template.
   * Sinon, une clé courte (amber, emerald, bordeaux, etc.).
   */
  colorTheme?: string | null;
  /** Unité des prix (devise) : EUR, USD, TND, GBP, CHF, etc. Défaut EUR. */
  priceCurrency?: string | null;
  items: MenuItemDto[];
}

export function menuList(organizationId: number) {
  return api<MenuDto[]>(`/api/menus?organizationId=${organizationId}`);
}

/**
 * Version allégée pour le dashboard (sans items, juste les infos principales).
 */
export function menuListSummary(organizationId: number) {
  return api<MenuDto[]>(`/api/menus/summary?organizationId=${organizationId}`);
}

export function menuCreate(data: {
  organizationId: number;
  title?: string;
  description?: string;
  /** Unité des prix (obligatoire). Ex: EUR, USD, TND. Défaut recommandé: EUR. */
  priceCurrency: string;
}) {
  return api<MenuDto>("/api/menus", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function menuGet(id: number) {
  return api<MenuDto>(`/api/menus/${id}`);
}

export function menuUpdate(id: number, data: { title?: string; description?: string; displayTemplate?: string | null; priceCurrency?: string | null; colorTheme?: string | null }) {
  return api<MenuDto>(`/api/menus/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function menuDelete(id: number) {
  return api<void>(`/api/menus/${id}`, { method: "DELETE" });
}

export function menuAddItem(
  menuId: number,
  data: {
    name: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    section?: string;
    sortOrder?: number;
    parentItemId?: number;
  }
) {
  return api<MenuDto>(`/api/menus/${menuId}/items`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function menuUpdateItem(
  menuId: number,
  itemId: number,
  data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
     section?: string;
    sortOrder?: number;
  }
) {
  return api<MenuDto>(`/api/menus/${menuId}/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function menuRemoveItem(menuId: number, itemId: number) {
  return api<MenuDto>(`/api/menus/${menuId}/items/${itemId}`, {
    method: "DELETE",
  });
}

export function menuQrUrl(menuId: number, locale?: Locale) {
  const loc = locale ?? getClientRouteLocale();
  const q = loc ? `?locale=${encodeURIComponent(loc)}` : "";
  return api<{ url: string; slug: string }>(`/api/menus/${menuId}/qr-url${q}`);
}

/** URL de l'image QR générée par le backend (pour téléchargement). */
export function menuQrImageUrl(menuId: number, size = 256, mode?: string, locale?: Locale) {
  const token = getToken();
  const params = new URLSearchParams({ size: String(size) });
  if (mode) params.set("mode", mode);
  const loc = locale ?? getClientRouteLocale();
  if (loc) params.set("locale", loc);
  return `${API_BASE}/api/menus/${menuId}/qr?${params}` + (token ? `&_t=${token}` : "");
}

// Public (sans auth)
export interface MenuPublicDto {
  title: string;
  description?: string;
  organizationName: string;
  /** Slogan du restaurant (affiché sous le nom). */
  organizationSlogan?: string | null;
  /** Logo de l'organisation en Base64 pour affichage en tête du menu. */
  organizationLogoBase64?: string | null;
  /** Adresse formatée pour footer (café/resto, Allemagne). */
  organizationAddress?: string | null;
  organizationPhone?: string | null;
  organizationEmail?: string | null;
  /** Template d'affichage: classic, cafe, bistro, minimal, cards, elegant */
  displayTemplate?: string | null;
  /**
   * Thème de couleur du modèle (optionnel, même clé que MenuDto.colorTheme).
   * Si absent → couleurs par défaut du template.
   */
  colorTheme?: string | null;
  /** Unité des prix (devise) : EUR, USD, TND, etc. Défaut EUR. */
  priceCurrency?: string | null;
  items: MenuItemDto[];

  available?: boolean;
  unavailableReason?: "NO_SUBSCRIPTION" | "SUBSCRIPTION_INACTIVE" | "ERROR" | string | null;
}

export function menuPublicBySlug(slug: string) {
  return fetch(`${API_BASE}/api/public/menu/${slug}`).then((r) => {
    if (!r.ok) throw new Error("Menu non trouvé");
    return r.json() as Promise<MenuPublicDto>;
  });
}

// Billing / Subscription
export type SubscriptionPlan = "MONTHLY" | "SEMIANNUAL" | "YEARLY";

export type SubscriptionStatus = "TRIALING" | "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface SubscriptionDto {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  /** Date de fin d'essai (ISO) si TRIALING. */
  trialEnd?: string | null;
  /** Début de la période de facturation courante (ISO). */
  currentPeriodStart?: string | null;
  /** Fin de la période de facturation courante (ISO). */
  currentPeriodEnd?: string | null;
  /** Prochaine tentative de paiement automatique (ISO). */
  nextPaymentAt?: string | null;
  /** Renouvellement automatique activé ? */
  autoRenew: boolean;
  /** Devise (ex: EUR). */
  currency: string;
  /** Montant de la période (ex: 9.99). */
  amount: number;
}

let subscriptionMeCache:
  | { value: SubscriptionDto | null; expiresAt: number }
  | null = null;
const SUBSCRIPTION_ME_TTL_MS = 10_000;

export interface InvoiceDto {
  id: string;
  amount: number;
  currency: string;
  status: "PAID" | "PENDING" | "FAILED";
  createdAt: string;
  paidAt?: string | null;
  invoiceUrl?: string | null;
}

/** Vide le cache abonnement (logout / session expirée). */
export function clearSubscriptionMeCache() {
  subscriptionMeCache = null;
}

/** Récupère l'abonnement courant de l'utilisateur connecté. */
export function subscriptionGetMe() {
  const now = Date.now();
  if (subscriptionMeCache && subscriptionMeCache.expiresAt > now) {
    return Promise.resolve(subscriptionMeCache.value);
  }
  return api<SubscriptionDto | null>("/api/billing/me/subscription").then((value) => {
    subscriptionMeCache = {
      value,
      expiresAt: Date.now() + SUBSCRIPTION_ME_TTL_MS,
    };
    return value;
  });
}

/** Récupère les dernières factures de l'utilisateur connecté. */
export function subscriptionListInvoices() {
  return api<InvoiceDto[]>("/api/billing/me/invoices");
}

/**
 * Crée une session de paiement (ex: Stripe Checkout) pour un plan donné.
 * Le backend doit renvoyer une URL de redirection.
 */
export function subscriptionCreateCheckoutSession(plan: SubscriptionPlan, locale: Locale) {
  return api<{ checkoutUrl: string }>("/api/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ plan, locale }),
  });
}

export function subscriptionConfirmCheckout(sessionId: string) {
  return api<{ stripeCustomerId: string | null; stripeSubscriptionId: string | null }>(
    "/api/billing/checkout/confirm",
    {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    }
  );
}

/** Annule l'abonnement courant (utilisé pour arrêter un essai ou un abonnement). */
export function subscriptionCancel() {
  subscriptionMeCache = null;
  return api<void>("/api/billing/me/subscription/cancel", {
    method: "POST",
  });
}

/** Termine l'essai immédiatement et active le plan payant. */
export function subscriptionSkipTrial() {
  subscriptionMeCache = null;
  return api<SubscriptionDto>("/api/billing/me/subscription/skip-trial", {
    method: "POST",
  });
}

/** Demande l'annulation à la fin de la période en cours (cancel_at_period_end=true). */
export function subscriptionCancelAtPeriodEnd() {
  subscriptionMeCache = null;
  return api<SubscriptionDto>("/api/billing/me/subscription/cancel-at-period-end", {
    method: "POST",
  });
}

/** Réactive le renouvellement automatique d'un abonnement encore actif. */
export function subscriptionReactivate() {
  subscriptionMeCache = null;
  return api<SubscriptionDto>("/api/billing/me/subscription/reactivate", {
    method: "POST",
  });
}

/** Ouvre le portail de facturation Stripe (gestion de carte / paiement). */
export function subscriptionOpenPaymentPortal(locale: Locale) {
  return api<{ url: string }>("/api/billing/me/payment-portal", {
    method: "POST",
    body: JSON.stringify({ locale }),
  });
}

// Admin
export interface AdminUserDto {
  userId: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profilePhotoBase64: string | null;
  country: string | null;
  organizationsCount: number;
  menusCount: number;
  subscriptionStatus: string;
  subscriptionPlan: string | null;
  subscriptionBypass: boolean;
  admin?: boolean;
  superAdmin?: boolean;
}

export interface AdminCountryMetricsDto {
  country: string;
  usersCount: number;
  menusCount: number;
  activeSubscriptions: number;
  trialingSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
  subscriptionRate: number;
}

export interface AdminMetricsDto {
  totalUsers: number;
  activeSubscriptions: number;
  trialingSubscriptions: number;
  expiredSubscriptions: number;
  cancelledSubscriptions: number;
  subscriptionActiveRate: number;
  revenuePaid: number;
  revenueCurrency: string;
  byCountry: AdminCountryMetricsDto[];
}

export function adminGetMetrics(days = 30) {
  return api<AdminMetricsDto>(`/api/admin/metrics?days=${days}`);
}

export function adminListUsers(q?: string) {
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return api<AdminUserDto[]>(`/api/admin/users${qs}`);
}

export function adminCreateUser(data: {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  password: string;
  subscriptionBypass?: boolean;
  admin?: boolean;
}) {
  return api<AdminUserDto>("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function adminUpdateUser(id: number, data: { nom?: string; prenom?: string; telephone?: string; subscriptionBypass?: boolean; admin?: boolean }) {
  return api<AdminUserDto>(`/api/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function adminResetPassword(id: number, password: string) {
  return api<void>(`/api/admin/users/${id}/password`, {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function adminDeleteUser(id: number) {
  return api<void>(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
}
