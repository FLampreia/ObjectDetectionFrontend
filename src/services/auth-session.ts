import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "@/types/index";
import config from "@/config/api";

export const SESSION_EXPIRED_EVENT = "auth:session-expired";
export const TOKENS_UPDATED_EVENT = "auth:tokens-updated";
export class SessionExpiredError extends Error {
  constructor() { super("Your session has expired. Please sign in again."); }
}
export class SessionChangedError extends Error {
  constructor() { super("The active session changed during this request."); }
}

let generation = 0;
let loginAttempt = 0;
let refreshPromise: Promise<string> | null = null;
let refreshingSession: string | null = null;

export function getAccessToken() {
  return typeof window === "undefined" ? null : localStorage.getItem("access_token");
}
export function getRefreshToken() {
  return typeof window === "undefined" ? null : localStorage.getItem("refresh_token");
}
function payload(token: string | null): TokenPayload | null {
  try { return token ? jwtDecode<TokenPayload>(token) : null; }
  catch { return null; }
}
export function getSessionId(): string | null {
  return payload(getAccessToken())?.session_id ?? payload(getRefreshToken())?.session_id ?? null;
}
export function setTokens(access: string, refresh?: string) {
  if (refresh) localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("access_token", access);
  window.dispatchEvent(new Event(TOKENS_UPDATED_EVENT));
}
export function clearSession() {
  if (typeof window === "undefined") return;
  generation += 1;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}
export function beginLogin() {
  const attempt = ++loginAttempt;
  const expectedGeneration = generation;
  const previousSession = getSessionId();
  return () => {
    if (attempt !== loginAttempt || generation !== expectedGeneration || getSessionId() !== previousSession) {
      throw new SessionChangedError();
    }
  };
}
export function getTokenExpiration(): number | null {
  const exp = payload(getAccessToken())?.exp;
  return typeof exp === "number" && Number.isFinite(exp) ? exp * 1000 : null;
}
export function isTokenExpired(): boolean {
  const expiration = getTokenExpiration();
  return expiration === null || expiration <= Date.now();
}
export function getLogoutToken() {
  const refresh = getRefreshToken();
  return (payload(refresh)?.exp ?? 0) * 1000 > Date.now() ? refresh : getAccessToken();
}
function expireSession(expectedSession: string): never {
  if (getSessionId() === expectedSession) clearSession();
  throw new SessionExpiredError();
}

async function withRefreshLock<T>(operation: () => Promise<T>): Promise<T> {
  if (navigator.locks) return navigator.locks.request("object-detection-auth-refresh", operation);
  // Cooperative storage lease for browsers without Web Locks, including plain HTTP.
  const key = "auth:refresh-lock";
  const owner = `${Date.now()}-${Math.random()}`;
  const deadline = Date.now() + 30_000;
  const wait = () => new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 80));
  const readLease = (): { owner: string; expires: number } | null => {
    try { return JSON.parse(localStorage.getItem(key) ?? "null"); }
    catch { return null; }
  };
  while (Date.now() < deadline) {
    const lease = readLease();
    if (!lease || lease.expires <= Date.now()) {
      localStorage.setItem(key, JSON.stringify({ owner, expires: Date.now() + 120_000 }));
      await wait();
      if (readLease()?.owner === owner) {
        const heartbeat = setInterval(() => {
          if (readLease()?.owner === owner) {
            localStorage.setItem(key, JSON.stringify({ owner, expires: Date.now() + 120_000 }));
          }
        }, 10_000);
        try { return await operation(); }
        finally {
          clearInterval(heartbeat);
          if (readLease()?.owner === owner) localStorage.removeItem(key);
        }
      }
    }
    await wait();
  }
  throw new Error("Session renewal is busy. Please try again.");
}

export async function refreshAccessToken(rejectedToken?: string): Promise<string> {
  const expectedSession = getSessionId();
  if (!expectedSession) {
    clearSession();
    throw new SessionExpiredError();
  }
  if (refreshPromise && refreshingSession === expectedSession) return refreshPromise;
  const expectedGeneration = generation;
  const renewal = withRefreshLock(async () => {
    if (getSessionId() !== expectedSession || generation !== expectedGeneration) throw new SessionChangedError();
    const access = getAccessToken();
    // A previous request or another tab may already have replaced this token.
    if (access && !isTokenExpired() && (!rejectedToken || access !== rejectedToken)) return access;
    const refresh = getRefreshToken();
    const refreshData = payload(refresh);
    if (!refresh || !refreshData || refreshData.type !== "refresh"
      || !Number.isFinite(refreshData.exp) || refreshData.exp * 1000 <= Date.now()) {
      return expireSession(expectedSession);
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    let response: Response;
    try {
      response = await fetch(`${config.API_URL}/refresh`, {
        method: "POST", headers: { Authorization: `Bearer ${refresh}` }, signal: controller.signal,
      });
    } finally { clearTimeout(timeout); }
    if (getSessionId() !== expectedSession || generation !== expectedGeneration) throw new SessionChangedError();
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) return expireSession(expectedSession);
      throw new Error("Unable to renew your session. Please try again.");
    }
    const data = await response.json();
    const newAccess = payload(data.access_token);
    const newRefresh = payload(data.refresh_token);
    if (typeof data.access_token !== "string" || typeof data.refresh_token !== "string"
      || newAccess?.session_id !== expectedSession || newRefresh?.session_id !== expectedSession
      || newAccess.type !== "access" || newRefresh.type !== "refresh"
      || !Number.isFinite(newAccess.exp) || newAccess.exp * 1000 <= Date.now()
      || !Number.isFinite(newRefresh.exp) || newRefresh.exp * 1000 <= Date.now()) {
      throw new Error("Invalid session renewal response.");
    }
    if (getSessionId() !== expectedSession || generation !== expectedGeneration || getRefreshToken() !== refresh) {
      throw new SessionChangedError();
    }
    setTokens(data.access_token, data.refresh_token);
    return data.access_token as string;
  });
  refreshPromise = renewal;
  refreshingSession = expectedSession;
  try { return await renewal; }
  finally {
    if (refreshPromise === renewal) { refreshPromise = null; refreshingSession = null; }
  }
}

export async function authFetch(input: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const authorization = headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return fetch(input, init);
  const expectedSession = payload(authorization.slice(7))?.session_id ?? getSessionId();
  if (!expectedSession) return fetch(input, init);
  if (getSessionId() !== expectedSession) throw new SessionChangedError();
  let token = isTokenExpired() ? await refreshAccessToken() : getAccessToken();
  if (getSessionId() !== expectedSession) throw new SessionChangedError();
  headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(input, { ...init, headers });
  if (getSessionId() !== expectedSession) throw new SessionChangedError();
  if (response.status !== 401) return response;
  token = await refreshAccessToken(token ?? undefined);
  if (getSessionId() !== expectedSession) throw new SessionChangedError();
  headers.set("Authorization", `Bearer ${token}`);
  const retry = await fetch(input, { ...init, headers });
  if (getSessionId() !== expectedSession) throw new SessionChangedError();
  // Retry once; a delayed response must not clear a newer login or rotated token.
  if (retry.status === 401 && getSessionId() === expectedSession && getAccessToken() === token) clearSession();
  return retry;
}
