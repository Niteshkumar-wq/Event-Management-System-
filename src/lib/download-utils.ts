/** Trigger a file download in the browser */
export function downloadBlob(content: string | Blob, filename: string, mimeType = "text/plain;charset=utf-8") {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function escapeCsvValue(value: unknown): string {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function objectsToCsv(rows: Record<string, unknown>[], columns?: string[]): string {
  if (rows.length === 0) return "";
  const keys = columns ?? Object.keys(rows[0]);
  const header = keys.map(escapeCsvValue).join(",");
  const body = rows.map((row) => keys.map((k) => escapeCsvValue(row[k])).join(",")).join("\n");
  return `${header}\n${body}`;
}

export function downloadCsv(rows: Record<string, unknown>[], filename: string, columns?: string[]) {
  downloadBlob(objectsToCsv(rows, columns), filename.endsWith(".csv") ? filename : `${filename}.csv`, "text/csv;charset=utf-8");
}

export function downloadJson(data: unknown, filename: string) {
  downloadBlob(
    JSON.stringify(data, null, 2),
    filename.endsWith(".json") ? filename : `${filename}.json`,
    "application/json;charset=utf-8"
  );
}

export function downloadText(content: string, filename: string) {
  downloadBlob(content, filename, "text/plain;charset=utf-8");
}

export function safeFilename(name: string, ext: string): string {
  const base = name.replace(/\.[^.]+$/, "").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") || "export";
  return `${base}.${ext.replace(/^\./, "")}`;
}
