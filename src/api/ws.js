import { getAccessToken, getRefreshToken, refreshSession } from "./client";

const REAUTH_INTERVAL_MS = 14 * 60 * 1000;
const EXPIRY_WINDOW_MS = 60 * 1000;
const MAX_BACKOFF_MS = 30000;

function isExpiringSoon(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload.exp * 1000 - Date.now() < EXPIRY_WINDOW_MS;
  } catch {
    return true;
  }
}

async function ensureFreshToken() {
  const token = getAccessToken();
  if (token && !isExpiringSoon(token)) return token;
  const data = await refreshSession();
  return data.access_token;
}

export function connectAlertsSocket({ onAlert, onStateChange } = {}) {
  let socket = null;
  let reauthTimer = null;
  let reconnectTimer = null;
  let attempts = 0;
  let closedByUser = false;

  const setState = (state) => onStateChange?.(state);

  const buildUrl = () => {
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const token = getAccessToken();
    const query = token ? `?token=${encodeURIComponent(token)}` : "";
    return `${proto}://${window.location.host}/ws/alerts${query}`;
  };

  const clearTimers = () => {
    clearTimeout(reauthTimer);
    clearTimeout(reconnectTimer);
  };

  const scheduleReauth = () => {
    clearTimeout(reauthTimer);
    reauthTimer = setTimeout(async () => {
      const ws = socket;
      if (!ws || ws.readyState !== WebSocket.OPEN) return;
      try {
        const token = await ensureFreshToken();
        if (ws !== socket || ws.readyState !== WebSocket.OPEN) return;
        ws.send(JSON.stringify({ token }));
        scheduleReauth();
      } catch {
        if (ws === socket) ws.close();
      }
    }, REAUTH_INTERVAL_MS);
  };

  const connect = () => {
    if (closedByUser) return;
    setState("connecting");
    socket = new WebSocket(buildUrl());

    socket.onopen = () => {
      attempts = 0;
      setState("connected");
      scheduleReauth();
    };

    socket.onmessage = (event) => {
      try {
        onAlert?.(JSON.parse(event.data));
      } catch {
        // ignore non-JSON frames
      }
    };

    socket.onclose = (event) => {
      clearTimers();
      if (closedByUser) return;
      setState(event.code === 4401 ? "unauthorized" : "disconnected");
      const backoff = Math.min(1000 * 2 ** attempts, MAX_BACKOFF_MS);
      attempts += 1;
      reconnectTimer = setTimeout(async () => {
        if (!getAccessToken() && !getRefreshToken()) {
          setState("disconnected");
          return;
        }
        if (event.code === 4401) {
          try {
            await refreshSession();
          } catch {
            setState("disconnected");
            return;
          }
        }
        connect();
      }, backoff);
    };

    socket.onerror = () => {};
  };

  connect();

  return {
    close() {
      closedByUser = true;
      clearTimers();
      socket?.close();
      setState("disconnected");
    },
  };
}
