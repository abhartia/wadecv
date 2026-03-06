"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "./api";

interface User {
  id: string;
  email: string;
  email_verified: boolean;
  credits: number;
  has_profile: boolean;
  has_password: boolean;
  base_cv_content: string | null;
  additional_info: string | null;
  cv_page_limit?: number;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password?: string) => Promise<void>;
  loginWithMagicLink: (magicToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = (access: string, refresh: string) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setToken(access);
  };

  const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    const t = token || localStorage.getItem("access_token");
    if (!t) return;
    try {
      const u = await api.getMe(t);
      setUser(u);
    } catch {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    const init = async () => {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");

      if (accessToken) {
        setToken(accessToken);
        try {
          const u = await api.getMe(accessToken);
          setUser(u);
        } catch {
          if (refreshToken) {
            try {
              const tokens = await api.refreshToken(refreshToken);
              saveTokens(tokens.access_token, tokens.refresh_token);
              const u = await api.getMe(tokens.access_token);
              setUser(u);
            } catch {
              clearTokens();
            }
          } else {
            clearTokens();
          }
        }
      } else if (refreshToken) {
        try {
          const tokens = await api.refreshToken(refreshToken);
          saveTokens(tokens.access_token, tokens.refresh_token);
          const u = await api.getMe(tokens.access_token);
          setUser(u);
        } catch {
          clearTokens();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return;

      try {
        const tokens = await api.refreshToken(refreshToken);
        saveTokens(tokens.access_token, tokens.refresh_token);
        const u = await api.getMe(tokens.access_token);
        setUser(u);
      } catch {
        clearTokens();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const onTokensRefreshed = async (e: CustomEvent<{ access_token: string; refresh_token: string }>) => {
      const { access_token, refresh_token } = e.detail;
      saveTokens(access_token, refresh_token);
      try {
        const u = await api.getMe(access_token);
        setUser(u);
      } catch {
        // ignore
      }
    };
    window.addEventListener("tokensRefreshed", onTokensRefreshed as unknown as EventListener);
    return () => window.removeEventListener("tokensRefreshed", onTokensRefreshed as unknown as EventListener);
  }, []);

  const login = async (email: string, password: string) => {
    const tokens = await api.login(email, password);
    saveTokens(tokens.access_token, tokens.refresh_token);
    const u = await api.getMe(tokens.access_token);
    setUser(u);
  };

  const register = async (email: string, password?: string) => {
    const tokens = await api.register(email, password);
    saveTokens(tokens.access_token, tokens.refresh_token);
    const u = await api.getMe(tokens.access_token);
    setUser(u);
  };

  const loginWithMagicLink = async (magicToken: string) => {
    const tokens = await api.verifyMagicLink(magicToken);
    saveTokens(tokens.access_token, tokens.refresh_token);
    const u = await api.getMe(tokens.access_token);
    setUser(u);
  };

  const logout = () => {
    api.logout().catch(() => {});
    clearTokens();
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithMagicLink, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
