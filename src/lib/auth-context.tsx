"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authLogin, authRegister, AuthResponse } from "./api";

interface User {
  userId: number;
  email: string;
  nom: string;
  prenom: string;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "token";
const USER_KEY = "user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    const u = typeof window !== "undefined" ? localStorage.getItem(USER_KEY) : null;
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const persist = useCallback((res: AuthResponse) => {
    localStorage.setItem(STORAGE_KEY, res.token);
    const u: User = {
      userId: res.userId,
      email: res.email,
      nom: res.nom,
      prenom: res.prenom,
    };
    setUser(u);
    setToken(res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authLogin({ email, password });
      persist(res);
      router.push("/dashboard");
    },
    [persist, router]
  );

  const register = useCallback(
    async (data: {
      nom: string;
      prenom: string;
      email: string;
      telephone: string;
      password: string;
    }) => {
      const res = await authRegister(data);
      persist(res);
      router.push("/dashboard");
    },
    [persist, router]
  );

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
