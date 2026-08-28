import { apiFetch } from "./client";

export function getNodes() {
  return apiFetch("/nodes");
}

export function createNode(body) {
  return apiFetch("/nodes", { method: "POST", body });
}

export function updateNode(nodeId, body) {
  return apiFetch(`/nodes/${encodeURIComponent(nodeId)}`, {
    method: "PATCH",
    body,
  });
}
