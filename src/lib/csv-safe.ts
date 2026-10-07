// Quote a value for CSV and neutralize spreadsheet formulas (=, +, -, @, tab, CR)
// so opening an export in Excel/Sheets can never run attacker-supplied formulas.
export function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '""';
  let s = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
