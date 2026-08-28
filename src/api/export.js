import { apiFetch, buildQuery } from "./client";

export async function exportReadings({ from, to, nodeId } = {}) {
  const res = await apiFetch(`/export${buildQuery({ from, to, node_id: nodeId })}`, {
    raw: true,
  });
  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") || "";
  const starMatch = disposition.match(/filename\*\s*=\s*utf-8'[^']*'([^;]+)/i);
  const match = disposition.match(/filename="?([^";]+)"?/);
  let filename = match?.[1] || "readings_export.csv";
  if (starMatch) {
    try {
      filename = decodeURIComponent(starMatch[1].trim());
    } catch {
      filename = match?.[1] || "readings_export.csv";
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return filename;
}
