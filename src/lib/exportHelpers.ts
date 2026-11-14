// Small helpers shared by the tools that export CSV or PDF. Nothing here touches the network.

/** One CSV cell. Text starting with = + - @ tab or CR is prefixed with an apostrophe so spreadsheets don't run it as a formula. */
export function csvCell(v: string | number): string {
  const s = String(v);
  const safe = typeof v === 'string' && /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function csvLine(cells: (string | number)[]): string {
  return cells.map(csvCell).join(',');
}

/** Letters, digits, dot, dash and underscore only, so a typed name can't make an odd or unsafe filename. */
export function safeFilename(name: string, fallback: string): string {
  const cleaned = name
    .normalize('NFKD')
    .replace(/[^A-Za-z0-9 ._-]+/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^[.-]+/, '')
    .slice(0, 60);
  return cleaned || fallback;
}

/** Today's date as YYYY-MM-DD in the visitor's own time zone. */
export function todayStamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Hands a file to the browser as a download. The data stays on this device. */
export function downloadFile(data: string | Uint8Array, filename: string, mime: string): void {
  const blob = new Blob([data as BlobPart], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
