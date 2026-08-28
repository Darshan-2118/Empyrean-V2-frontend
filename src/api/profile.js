import { apiFetch } from "./client";

export function getProfile() {
  return apiFetch("/profile");
}

export function updateProfile(body) {
  return apiFetch("/profile", { method: "PATCH", body });
}

export function changePassword({ currentPassword, newPassword }) {
  return apiFetch("/profile/change-password", {
    method: "POST",
    body: { current_password: currentPassword, new_password: newPassword },
  });
}

export function deleteAccount() {
  return apiFetch("/profile", { method: "DELETE" });
}
