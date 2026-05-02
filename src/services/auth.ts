import { jwtDecode } from "jwt-decode";
import type { User, TokenPayload } from "@/types/index"
import API_URL from "@/config/api";

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

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// TODO fazer refresh token

/* =========================
   AUTH STATUS
========================= */

export function isTokenExpired(): boolean {
  const token = getAccessToken();
  if (!token) return true;

  try {
    const decoded = jwtDecode<TokenPayload>(token);

    if (!decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

/* =========================
   AUTH API
========================= */

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
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
  const response = await fetch(`${API_URL}/signin`, {
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

  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/me`, {
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

// TODO verifica se é possivel colocar as informações em cache para nao estar constantemente a fazer /me, tavez fazer um (React Query / TanStack Query)