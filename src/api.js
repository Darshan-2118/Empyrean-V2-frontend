/**
 * Empyrean backend client.
 *
 * Builds every request off VITE_API_BASE_URL (never a hardcoded host) and
 * implements the auth contract from docs/frontend-integration.md:
 *   - tokens live in the client's memory (never localStorage)
 *   - every protected request sends  Authorization: Bearer <access_token>
 *   - a 401 triggers a single silent POST /auth/refresh, then retries once
 *   - if refresh fails, the session is cleared (the App reacts as "logged out")
 *
 * Login/register/logout expose plain functions; the rest of the app reads the
 * current session via subscribeToAuth / getSession.
 */

// Allow overriding the base URL in tests; default to the Vite env var.
const API_BASE =
  typeof window !== "undefined"
    ? (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1").replace(/\/$/, "")
    : "";

// ---- In-memory session (module scope = survives the SPA session, gone next load) ----
let accessToken = null;
let refreshToken = null;
let sessionUser = null; // { id, username, email, role }

const authListeners = new Set();

export function getSession() {
  return { token: accessToken, user: sessionUser, isLoggedIn: !!accessToken };
}

export function subscribeToAuth(fn) {
  authListeners.add(fn);
  return () => authListeners.delete(fn);
}

function emitAuth() {
  const session = getSession();
  authListeners.forEach((fn) => {
    try {
      fn(session);
    } catch {
      /* listener errors must not break auth teardown */
    }
  });
}

function setSession({ access, refresh, user }) {
  accessToken = access;
  refreshToken = refresh;
  sessionUser = user || null;
  emitAuth();
}

export function clearSession() {
  accessToken = null;
  refreshToken = null;
  sessionUser = null;
  emitAuth();
}

// ---- Error type: carries the RFC 7807 problem object + HTTP status ----
export class ApiError extends Error {
  constructor(detail, status) {
    const message =
      (detail && (detail.detail || detail.message)) ||
      defaultStatusMessage(status);
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.problem = detail || null;
  }
}

function defaultStatusMessage(status) {
  switch (status) {
    case 400: return "Bad request";
    case 401: return "Invalid username or password";
    case 403: return "You don't have permission to do that";
    case 404: return "Not found";
    case 409: return "That username or email is already taken";
    case 413: return "Request is too large";
    case 422: return "Please check your input and try again";
    case 429: return "Too many requests — try again in a minute";
    case 500: return "Something went wrong on the server";
    default: return "Request failed";
  }
}

async function readJson(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function rawRequest(path, { method = "GET", body, auth = true, headers = {} } = {}) {
  const outHeaders = { ...headers };
  if (body !== undefined) outHeaders["Content-Type"] = "application/json";
  if (auth && accessToken) outHeaders.Authorization = `Bearer ${accessToken}`;

  return fetch(`${API_BASE}${path}`, {
    method,
    headers: outHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

// Single-flight so N concurrent 401s cause exactly one refresh call.
let refreshInFlight = null;

export async function refreshSession() {
  if (!refreshToken) return false;
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      try {
        const res = await rawRequest("/auth/refresh", {
          method: "POST",
          auth: false,
          body: { refresh_token: refreshToken },
        });
        const data = await readJson(res);
        if (res.ok && data && data.access_token) {
          setSession({
            access: data.access_token,
            refresh: data.refresh_token || refreshToken,
            user: data.user || sessionUser,
          });
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();
  }
  return refreshInFlight;
}

/**
 * Core fetch for authenticated endpoints.
 * On a 401 with a stored refresh token, refreshes once and retries the request
 * a single time. If refresh fails, clears the session and surfaces the 401.
 */
export async function apiFetch(path, options = {}) {
  let res = await rawRequest(path, options);
  let data = await readJson(res);

  if (res.status === 401 && refreshToken) {
    const refreshed = await refreshSession();
    if (refreshed) {
      res = await rawRequest(path, options);
      data = await readJson(res);
    } else {
      clearSession();
    }
  }

  if (!res.ok) throw new ApiError(data, res.status);
  return data;
}

// ---- Health (root, unauthenticated) ----
export async function checkHealth() {
  const res = await fetch("/health", { method: "GET" });
  const data = await readJson(res);
  return { ok: res.ok, status: res.status, data };
}

// ---- Auth ----
export async function login(credentials) {
  const res = await rawRequest("/auth/login", {
    method: "POST",
    auth: false,
    body: credentials,
  });
  const data = await readJson(res);
  if (!res.ok) throw new ApiError(data, res.status);
  setSession({ access: data.access_token, refresh: data.refresh_token, user: data.user });
  return data;
}

/**
 * Register auto-logs-in (returns tokens + user) — we adopt that session.
 * Only username/email/password are accepted by the backend.
 */
export async function register({ username, email, password }) {
  const res = await rawRequest("/auth/register", {
    method: "POST",
    auth: false,
    body: { username, email, password },
  });
  const data = await readJson(res);
  if (!res.ok) throw new ApiError(data, res.status);
  setSession({ access: data.access_token, refresh: data.refresh_token, user: data.user });
  return data;
}

// Best-effort revoke; always clears the local session even if the call fails.
export async function logout() {
  const token = refreshToken;
  clearSession();
  if (!token) return;
  try {
    await rawRequest("/auth/logout", { method: "POST", auth: false, body: { refresh_token: token } });
  } catch {
    /* session is already cleared locally — nothing to recover */
  }
}

// ---- Readings & Forecast ----
export function getLatestReadings() {
  return apiFetch("/readings/latest");
}

export function getHistory({ from, to, node_id, bucket } = {}) {
  const params = new URLSearchParams();
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (node_id) params.set("node_id", node_id);
  if (bucket) params.set("bucket", bucket);
  const qs = params.toString();
  return apiFetch(`/readings/history${qs ? `?${qs}` : ""}`);
}

export function getForecast(node_id) {
  const params = new URLSearchParams();
  if (node_id) params.set("node_id", node_id);
  return apiFetch(`/forecast?${params.toString()}`);
}

// ---- Profile ----
export function getProfile() {
  return apiFetch("/profile");
}

export function updateProfile(patch) {
  return apiFetch("/profile", { method: "PATCH", body: patch });
}

export function changePassword({ current_password, new_password }) {
  return apiFetch("/profile/change-password", {
    method: "POST",
    body: { current_password, new_password },
  });
}

export default {
  checkHealth,
  login,
  register,
  logout,
  refreshSession,
  clearSession,
  getSession,
  subscribeToAuth,
  getLatestReadings,
  getHistory,
  getForecast,
  getProfile,
  updateProfile,
  changePassword,
};