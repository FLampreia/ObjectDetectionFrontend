import type { User } from "@/types/index";
import config from "@/config/api";
import { authFetch, beginLogin, clearSession, getAccessToken, getLogoutToken, getRefreshToken, setTokens } from "./auth-session";
export { authFetch, clearSession, getAccessToken, getSessionId, getTokenExpiration, isTokenExpired,
  refreshAccessToken, setTokens, SESSION_EXPIRED_EVENT, TOKENS_UPDATED_EVENT } from "./auth-session";

export async function login(email: string, password: string) {
  const assertCurrentLogin = beginLogin();
  const response = await fetch(`${config.API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  assertCurrentLogin();
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function signup(username: string, email: string, password: string, full_name: string) {
  const response = await fetch(`${config.API_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, full_name }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Signup failed");
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getAccessToken();
  if (!token && !getRefreshToken()) return null;
  const response = await authFetch(`${config.API_URL}/me`, {
    method: "GET", headers: { Authorization: `Bearer ${token}` },
  });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Unable to load your session. Please try again.");
  return response.json();
}

export async function logout() {
  const token = getLogoutToken();
  clearSession();
  if (!token) return;
  const response = await fetch(`${config.API_URL}/logout`, {
    method: "POST", headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok && response.status !== 401) throw new Error("Logout failed");
}
