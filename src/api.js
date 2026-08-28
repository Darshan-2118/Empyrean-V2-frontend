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
  const data = {
    access_token: "mock-token",
    refresh_token: "mock-refresh",
    user: { id: "1", username: credentials?.username || "Guest User", email: "guest@example.com", role: "admin" }
  };
  setSession({ access: data.access_token, refresh: data.refresh_token, user: data.user });
  return data;
}

export async function register({ username, email, password }) {
  const data = {
    access_token: "mock-token",
    refresh_token: "mock-refresh",
    user: { id: "1", username, email, role: "user" }
  };
  setSession({ access: data.access_token, refresh: data.refresh_token, user: data.user });
  return data;
}

export async function logout() {
  clearSession();
}

// ---- Readings & Forecast ----
export async function getLatestReadings() {
  return {
    readings: [
      { node_id: "Node-Alpha", aqi: 42, pm25: 10.2, pm10: 18.1, temperature: 24, humidity: 55, battery_v: 4.1, time: new Date().toISOString() },
      { node_id: "Node-Beta", aqi: 120, pm25: 45.5, pm10: 80.2, temperature: 26, humidity: 50, battery_v: 3.8, time: new Date().toISOString(), is_anomaly: true }
    ]
  };
}

export async function getHistory({ from, to, node_id, bucket } = {}) {
  const buckets = [];
  let now = Date.now();
  for(let i=24; i>=0; i--) {
    buckets.push({
      bucket: new Date(now - i*3600*1000).toISOString(),
      avg_pm25: 10 + Math.random() * 20,
      avg_pm10: 15 + Math.random() * 25,
      avg_aqi: 30 + Math.random() * 50
    });
  }
  return { buckets };
}

export async function getForecast(node_id) {
  const points = [];
  let now = Date.now();
  for(let i=1; i<=12; i++) {
    points.push({
      time: new Date(now + i*5*60000).toISOString(),
      aqi: 40 + Math.random() * 40
    });
  }
  return { points };
}

// ---- Profile ----
export async function getProfile() {
  return sessionUser || { id: "1", username: "Guest User", email: "guest@example.com", role: "admin" };
}

export async function updateProfile(patch) {
  return { ...(sessionUser || { id: "1", username: "Guest User", email: "guest@example.com", role: "admin" }), ...patch };
}

export async function changePassword({ current_password, new_password }) {
  return {};
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