"use client";

import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { getAccessToken, getSessionId, getCurrentUser, getTokenExpiration, refreshAccessToken, SESSION_EXPIRED_EVENT, TOKENS_UPDATED_EVENT, login as loginApi, logout as logoutApi } from "@/services/auth";
import { User } from "@/types/user";
import { AuthContextType } from "@/types";
import { queryClient } from "./query-provider";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const userRequest = useRef(0);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    const session = getSessionId();
    const request = ++userRequest.current;

    try {
      const data = await getCurrentUser();
      if (request === userRequest.current && session === getSessionId()) setUser(data);
    } catch {
      // Keep an existing user and tokens when the server or network is unavailable.
    } finally {
      if (request === userRequest.current) setLoading(false);
    }
  }, []);

  async function login(email: string, password: string) {
    await loginApi(email, password);
    queryClient.clear();
    setUser(null);
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
    let session = getSessionId();
    const handleSessionExpired = () => {
      session = getSessionId();
      userRequest.current += 1;
      setUser(null);
      setLoading(false);
      queryClient.clear();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== "access_token" && event.key !== null) return;
      const nextSession = getSessionId();
      if (nextSession === session) return;
      session = nextSession;
      handleSessionExpired();
      if (nextSession) void refreshUser();
    };
    const trackLocalSession = () => { session = getSessionId(); };
    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    window.addEventListener("storage", handleStorage);
    window.addEventListener(TOKENS_UPDATED_EVENT, trackLocalSession);
    void refreshUser();
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(TOKENS_UPDATED_EVENT, trackLocalSession);
    };
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    let checking = false;

    const checkExpiration = async () => {
      if (stopped || checking) return;
      checking = true;
      clearTimeout(timer);
      try {
        const remaining = (getTokenExpiration() ?? 0) - Date.now();
        if (remaining <= 30_000) await refreshAccessToken(getAccessToken() ?? undefined);
        if (!stopped) {
          const nextCheck = (getTokenExpiration() ?? Date.now()) - Date.now() - 30_000;
          timer = setTimeout(() => void checkExpiration(), Math.min(Math.max(1000, nextCheck), 2_147_483_647));
        }
      } catch {
        // Invalid refresh tokens clear the session; temporary failures can be retried.
        if (!stopped && getSessionId()) timer = setTimeout(() => void checkExpiration(), 30_000);
      } finally {
        checking = false;
      }
    };
    const scheduleCheck = () => { void checkExpiration(); };
    // Recheck when returning to a tab whose timers may have been suspended.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") scheduleCheck();
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "access_token" || event.key === null) scheduleCheck();
    };

    scheduleCheck();
    window.addEventListener("focus", scheduleCheck);
    window.addEventListener(TOKENS_UPDATED_EVENT, scheduleCheck);
    window.addEventListener("storage", handleStorage);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stopped = true;
      clearTimeout(timer);
      window.removeEventListener("focus", scheduleCheck);
      window.removeEventListener(TOKENS_UPDATED_EVENT, scheduleCheck);
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

