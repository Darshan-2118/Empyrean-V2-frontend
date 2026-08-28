import {
  apiFetch,
  setSession,
  clearSession,
  getAccessToken,
  getRefreshToken,
  refreshSession,
} from "./client";

export async function register({ username, email, password }) {
  const data = await apiFetch("/auth/register", {
    method: "POST",
    body: { username, email, password },
    auth: false,
  });
  setSession(data);
  return data;
}

export async function login({ username, password }) {
  const data = await apiFetch("/auth/login", {
    method: "POST",
    body: { username, password },
    auth: false,
  });
  setSession(data);
  return data;
}

export async function refresh() {
  return refreshSession();
}

export async function logout() {
  const refresh_token = getRefreshToken();
  try {
    if (refresh_token) {
      const headers = {};
      const access = getAccessToken();
      if (access) headers.Authorization = `Bearer ${access}`;
      await apiFetch("/auth/logout", {
        method: "POST",
        body: { refresh_token },
        headers,
        auth: false,
        retry: false,
      });
    }
  } catch {
    // best-effort: local session is cleared regardless
  } finally {
    clearSession();
  }
}
