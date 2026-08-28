import { apiFetch, buildQuery } from "./client";

export function getAlerts({ limit, offset, severity } = {}) {
  return apiFetch(`/alerts${buildQuery({ limit, offset, severity })}`);
}

export function acknowledgeAlert(alertId) {
  return apiFetch(`/alerts/${encodeURIComponent(alertId)}/acknowledge`, {
    method: "PATCH",
  });
}
