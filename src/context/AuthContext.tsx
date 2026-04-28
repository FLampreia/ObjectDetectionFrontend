"use client";

import { createContext, useEffect, useState } from "react";
import { getCurrentUser, login as loginApi, logout as logoutApi } from "@/services/auth";
import { User } from "@/types/user";
import { AuthContextType } from "@/types";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    setLoading(true);

    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    await loginApi(email, password);
    await refreshUser();
  }

  function logout() {
    logoutApi();
    setUser(null);
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

