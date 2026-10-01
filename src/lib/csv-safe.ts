// Neutralize spreadsheet formulas (=, +, -, @, tab, CR) and quote a CSV cell.
export function csvCell(val: unknown): string {
  let s = val === null || val === undefined ? '' : String(val);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}
