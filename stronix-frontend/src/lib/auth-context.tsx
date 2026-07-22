"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, getAuthToken, setAuthToken, clearAuthToken, api } from "./api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; role?: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJwtPayload(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUserStr = typeof window !== "undefined" ? localStorage.getItem("stronix_user") : null;

    if (storedToken && storedUserStr) {
      try {
        setTokenState(storedToken);
        setUser(JSON.parse(storedUserStr));
      } catch {
        clearAuthToken();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    if (!res.token) {
      throw new Error("No token returned from server");
    }

    setAuthToken(res.token);

    let userData: User;
    if (res.user) {
      userData = res.user;
    } else {
      const decoded = parseJwtPayload(res.token);
      userData = {
        _id: decoded?.id || "user-" + Date.now(),
        name: email.split("@")[0].replace(/_/g, " ").toUpperCase(),
        email,
        role: decoded?.role || "ADMIN",
      };
    }

    localStorage.setItem("stronix_user", JSON.stringify(userData));
    setTokenState(res.token);
    setUser(userData);
    router.push("/dashboard");
  };

  const register = async (payload: { name: string; email: string; password: string; role?: string }) => {
    await api.register(payload);
    // Log in immediately after successful registration
    await login(payload.email, payload.password);
  };

  const logout = () => {
    clearAuthToken();
    setUser(null);
    setTokenState(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
