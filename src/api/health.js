const HEALTH_TIMEOUT = 5000;
const HEALTH_RETRIES = 2;
const HEALTH_RETRY_DELAY = 1000;

export async function checkHealth() {
  for (let attempt = 0; attempt <= HEALTH_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HEALTH_TIMEOUT);

    try {
      const res = await fetch("/health", {
        method: "GET",
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
