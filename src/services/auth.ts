import { jwtDecode } from "jwt-decode";
import type { User, TokenPayload } from "@/types/index"
import config from "@/config/api";

/* =========================
   TOKEN HANDLING
========================= */

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function setTokens(access: string, refresh?: string) {
  localStorage.setItem("access_token", access);

  if (refresh) {
    localStorage.setItem("refresh_token", refresh);
  }
}

export const SESSION_EXPIRED_EVENT = "auth:session-expired";

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export function getTokenExpiration(): number | null {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const { exp } = jwtDecode<TokenPayload>(token);
    return typeof exp === "number" && Number.isFinite(exp) ? exp * 1000 : null;
  } catch {
    return null;
  }
}

export async function authFetch(input: string, init?: RequestInit) {
  const authorization = new Headers(init?.headers).get("Authorization");
  const response = await fetch(input, init);
  // A delayed response from a previous session must not log out a new login.
  const token = getAccessToken();
  if (response.status === 401 && token && authorization === `Bearer ${token}`) {
    clearSession();
  }
  return response;
}



// TODO fazer refresh token

/* =========================
   AUTH STATUS
========================= */

export function isTokenExpired(): boolean {
  const expiration = getTokenExpiration();
  return expiration === null || expiration <= Date.now();
}

/* =========================
   AUTH API
========================= */

export async function login(email: string, password: string) {
  const response = await fetch(`${config.API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  setTokens(data.access_token, data.refresh_token);

  return data;
}

export async function signup(
  username: string,
  email: string,
  password: string,
  full_name: string
) {
  const response = await fetch(`${config.API_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      full_name,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
}

/* =========================
   CURRENT USER (SOURCE OF TRUTH)
========================= */

export async function getCurrentUser(): Promise<User | null> {
  const token = getAccessToken();

  if (!token || isTokenExpired()) {
    clearSession();
    return null;
  }

  try {
    const response = await authFetch(`${config.API_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
}

export async function logout() {
  const token = getAccessToken();
  clearSession();

  if (!token) return;

  const response = await fetch(`${config.API_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok && response.status !== 401) {
    throw new Error("Logout failed");
  }

}

// TODO verifica se é possivel colocar as informações em cache para nao estar constantemente a fazer /me, tavez fazer um (React Query / TanStack Query)
