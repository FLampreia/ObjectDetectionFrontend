"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { clearSession, getAccessToken, getCurrentUser, getTokenExpiration, SESSION_EXPIRED_EVENT, login as loginApi, logout as logoutApi } from "@/services/auth";
import { User } from "@/types/user";
import { AuthContextType } from "@/types";
import { queryClient } from "./query-provider";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const token = getAccessToken();

    try {
      const data = await getCurrentUser();
      if (token === getAccessToken()) setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  async function login(email: string, password: string) {
    await loginApi(email, password);
    await refreshUser();
  }

  function logout() {
    void logoutApi().catch(() => {
      // The local session is already cleared, even if the API is unavailable.
    });
    setUser(null);
    queryClient.clear();
  }

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setLoading(false);
      queryClient.clear();
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    void refreshUser();
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;
    let timer: ReturnType<typeof setTimeout>;

    const checkExpiration = () => {
      clearTimeout(timer);
      const expiration = getTokenExpiration();
      const remaining = expiration === null ? 0 : expiration - Date.now();
      if (remaining <= 0) {
        clearSession();
      } else {
        timer = setTimeout(checkExpiration, Math.min(remaining, 2_147_483_647));
      }
    };
    // Recheck when returning to a tab whose timers may have been suspended.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkExpiration();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "access_token" || event.key === null) checkExpiration();
    };

    checkExpiration();
    window.addEventListener("focus", checkExpiration);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", checkExpiration);
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

