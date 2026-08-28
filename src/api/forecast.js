import { apiFetch, buildQuery } from "./client";

export function getForecast(nodeId) {
  return apiFetch(`/forecast${buildQuery({ node_id: nodeId })}`);
}
