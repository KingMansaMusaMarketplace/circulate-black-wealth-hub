// Quote a value for CSV and neutralize spreadsheet formulas (=, +, -, @, tab, CR)
// so opening an export in Excel/Sheets can never run attacker-supplied formulas.
export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** Build a formula-safe CSV and download it in the browser. */
export function downloadCsv(filename: string, header: string[], rows: unknown[][]): void {
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
