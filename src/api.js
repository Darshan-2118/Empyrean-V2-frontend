const HEALTH_TIMEOUT = 5000; // 5s
const HEALTH_RETRIES = 2;
const HEALTH_RETRY_DELAY = 1000; // 1s

/**
 * Check if the backend server is reachable via the Vite proxy.
 * Includes timeout and retry logic for resilience.
 * @returns {Promise<{ok: boolean, data?: any, error?: string}>}
 */
export async function checkHealth() {
  for (let attempt = 0; attempt <= HEALTH_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT);

    try {
      const res = await fetch("/health", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!res.ok) {
        return { ok: false, error: `Backend responded with status ${res.status}` };
      }

      const data = await res.json();
      return { ok: true, data };
    } catch (err) {
      clearTimeout(timer);

      if (attempt < HEALTH_RETRIES) {
        await new Promise((r) => setTimeout(r, HEALTH_RETRY_DELAY));
        continue;
      }

      if (err.name === "AbortError") {
        return { ok: false, error: "Request timed out — backend did not respond within 5s" };
      }

      if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
        return { ok: false, error: "Cannot reach the backend server — is it running?" };
      }

      return { ok: false, error: err.message };
    }
  }
}

/**
 * Base fetch wrapper for API calls.
 * Requests go through Vite's dev server proxy, so they are same-origin.
 */
export async function apiFetch(path, options = {}) {
  const config = {
    headers: { "Content-Type": "application/json" },
    ...options,
  };

  const res = await fetch(path, config);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || data.message || `Request failed with ${res.status}`);
  }

  return data;
}

export default { checkHealth, apiFetch };
