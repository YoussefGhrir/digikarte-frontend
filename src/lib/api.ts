const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

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
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;

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

    // In case of unauthorized from protected endpoints, clear token
    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
    }

    const code = parsedBody?.code as string | undefined;
    const message =
      (parsedBody?.message as string | undefined) ||
      rawText ||
      `HTTP ${res.status}`;

    throw new ApiError(message, res.status, code);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// Auth
export interface AuthResponse {
  token: string;
  email: string;
  nom: string;
  prenom: string;
  userId: number;
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
  /** Logo encodé en Base64 (JPEG), pour affichage et menu public. */
  organizationLogoBase64?: string | null;
}

export function orgList() {
  return api<OrganizationDto[]>("/api/organizations");
}

export function orgCreate(data: { name: string; description?: string }) {
  return api<OrganizationDto>("/api/organizations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function orgGet(id: number) {
  return api<OrganizationDto>(`/api/organizations/${id}`);
}

export function orgUpdate(id: number, data: { name?: string; description?: string }) {
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
}

export interface MenuDto {
  id: number;
  title: string;
  description?: string;
  slug: string;
  organizationId: number;
  items: MenuItemDto[];
}

export function menuList(organizationId: number) {
  return api<MenuDto[]>(`/api/menus?organizationId=${organizationId}`);
}

export function menuCreate(data: {
  organizationId: number;
  title: string;
  description?: string;
}) {
  return api<MenuDto>("/api/menus", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function menuGet(id: number) {
  return api<MenuDto>(`/api/menus/${id}`);
}

export function menuUpdate(id: number, data: { title?: string; description?: string }) {
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

export function menuQrUrl(menuId: number) {
  return api<{ url: string; slug: string }>(`/api/menus/${menuId}/qr-url`);
}

/** URL de l'image QR générée par le backend (pour téléchargement). */
export function menuQrImageUrl(menuId: number, size = 256, mode?: string) {
  const token = getToken();
  const params = new URLSearchParams({ size: String(size) });
  if (mode) params.set("mode", mode);
  return `${API_BASE}/api/menus/${menuId}/qr?${params}` + (token ? `&_t=${token}` : "");
}

// Public (sans auth)
export interface MenuPublicDto {
  title: string;
  description?: string;
  organizationName: string;
  /** Logo de l'organisation en Base64 pour affichage en tête du menu. */
  organizationLogoBase64?: string | null;
  items: MenuItemDto[];
}

export function menuPublicBySlug(slug: string) {
  return fetch(`${API_BASE}/api/public/menu/${slug}`).then((r) => {
    if (!r.ok) throw new Error("Menu non trouvé");
    return r.json() as Promise<MenuPublicDto>;
  });
}
