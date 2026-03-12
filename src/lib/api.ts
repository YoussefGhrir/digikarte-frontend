const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
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
  if (res.status === 401) {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
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

// Organizations
export interface OrganizationDto {
  id: number;
  name: string;
  description?: string;
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
  items: MenuItemDto[];
}

export function menuPublicBySlug(slug: string) {
  return fetch(`${API_BASE}/api/public/menu/${slug}`).then((r) => {
    if (!r.ok) throw new Error("Menu non trouvé");
    return r.json() as Promise<MenuPublicDto>;
  });
}
