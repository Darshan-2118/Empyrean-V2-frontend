import { apiFetch, buildQuery } from "./client";

export function getLatestReadings() {
  return apiFetch("/readings/latest");
}

export function getReadingsHistory({ from, to, nodeId, bucket } = {}) {
  return apiFetch(
    `/readings/history${buildQuery({ from, to, node_id: nodeId, bucket })}`,
  );
}
