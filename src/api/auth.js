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
  // Mock login to bypass missing backend server
  const mockData = {
    access_token: "mock_access_token",
    refresh_token: "mock_refresh_token",
    user: { id: "1", username: username || "testuser", email: "test@example.com", name: "Test User" },
  };
  setSession(mockData);
  return mockData;
}

// Proposes POST /auth/reset-password — backend endpoint to be added to match.
// Request: { identifier, new_password }  ->  200 { message }
export async function resetPassword({ identifier, newPassword }) {
  return apiFetch("/auth/reset-password", {
    method: "POST",
    body: { identifier, new_password: newPassword },
    auth: false,
  });
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
