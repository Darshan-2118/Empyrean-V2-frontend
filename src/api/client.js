const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

const STATUS_MESSAGES = {
  400: "Bad request — please check your input",
  401: "Invalid or expired session — please sign in again",
  403: "You don't have permission to perform this action",
  404: "The requested resource was not found",
  409: "That username or email is already taken",
  413: "The request is too large",
  422: "Some of the provided information is invalid",
  429: "Too many requests — please slow down",
  500: "Server error — please try again in a moment",
  502: "Server unavailable — please try again in a moment",
  503: "Server is temporarily unavailable — please try again later",
  504: "Server took too long to respond — please try again",
};

export class ApiError extends Error {
  constructor({ status, title, detail, data, rateLimitReset }) {
    super(detail || title || `Request failed with ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.title = title;
    this.detail = detail;
    this.data = data;
    this.rateLimitReset = rateLimitReset;
  }
}

let accessToken = null;
let refreshToken = null;
let currentUser = null;

const listeners = new Set();

export function getAuthState() {
  return {
    accessToken,
    refreshToken,
    user: currentUser,
    isAuthenticated: Boolean(accessToken),
  };
}

export function subscribeAuth(listener) {
  listeners.add(listener);
  listener(getAuthState());
  return () => listeners.delete(listener);
}

function emitAuthChange() {
  const state = getAuthState();
  for (const listener of listeners) listener(state);
}

export function setSession({ access_token, refresh_token, user, role }) {
  accessToken = access_token ?? null;
  if (refresh_token) refreshToken = refresh_token;
  if (user) currentUser = { ...user, role: user.role ?? role ?? "user" };
  else if (role && currentUser) currentUser = { ...currentUser, role };
  emitAuthChange();
}

export function clearSession() {
  accessToken = null;
  refreshToken = null;
  currentUser = null;
  emitAuthChange();
}

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

async function toApiError(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  const resetHeader = res.headers.get("X-RateLimit-Reset");
  let detail;
  if (data && typeof data === "object" && data.detail) {
    detail = String(data.detail);
  } else if (!data && res.status >= 500) {
    detail = "Cannot reach the backend server — is it running?";
  } else {
    detail = STATUS_MESSAGES[res.status] || `Request failed with ${res.status}`;
  }
  return new ApiError({
    status: res.status,
    title: data?.title,
    detail,
    data,
    rateLimitReset: resetHeader ? Number(resetHeader) : null,
  });
}

export function getErrorMessage(err, fallback = "Something went wrong — please try again") {
  if (err instanceof ApiError) {
    if (err.status === 429) {
      if (err.rateLimitReset) {
        const secs = Math.max(1, Math.ceil((err.rateLimitReset * 1000 - Date.now()) / 1000));
        return `Too many attempts — try again in ${secs}s`;
      }
      return "Too many attempts — please wait a moment";
    }
    return err.message;
  }
  if (err instanceof TypeError) {
    return "Cannot reach the backend server — is it running?";
  }
  return err?.message || fallback;
}

let refreshPromise = null;

export async function refreshSession() {
  if (!refreshToken) {
    clearSession();
    throw new ApiError({ status: 401, title: "Unauthorized", detail: "No refresh token" });
  }
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) clearSession();
          throw await toApiError(res);
        }
        const data = await res.json();
        setSession(data);
        return data;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function apiFetch(path, options = {}) {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
    retry = true,
    raw = false,
  } = options;

  const doFetch = () => {
    const finalHeaders = { ...headers };
    if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
    if (auth && accessToken) finalHeaders.Authorization = `Bearer ${accessToken}`;
    return fetch(`${API_BASE}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  let res = await doFetch();

  if (res.status === 401 && auth && retry && refreshToken) {
    try {
      await refreshSession();
    } catch (refreshError) {
      throw refreshError instanceof ApiError ? refreshError : await toApiError(res);
    }
    res = await doFetch();
  }

  if (raw) {
    if (!res.ok) throw await toApiError(res);
    return res;
  }

  if (res.status === 204) return null;
  if (!res.ok) throw await toApiError(res);

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export function buildQuery(params) {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}
