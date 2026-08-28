import { apiFetch } from "./client";

export function getAdminHealth() {
  return apiFetch("/admin/health");
}

export function getAdminSettings() {
  return apiFetch("/admin/settings");
}

export function updateAdminSettings(body) {
  return apiFetch("/admin/settings", { method: "PATCH", body });
}
