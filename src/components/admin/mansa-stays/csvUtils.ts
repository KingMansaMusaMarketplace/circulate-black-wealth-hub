// Lightweight CSV utilities for admin exports

const escape = (val: any): string => {
  if (val === null || val === undefined) return '';
  const s = String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
};

export function toCSV<T extends Record<string, any>>(rows: T[], columns: { key: keyof T | string; label: string; get?: (row: T) => any }[]): string {
  const header = columns.map(c => escape(c.label)).join(',');
  const body = rows.map(r =>
    columns.map(c => escape(c.get ? c.get(r) : r[c.key as keyof T])).join(',')
  ).join('\n');
  return header + '\n' + body;
}

export function downloadCSV(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const stamp = new Date().toISOString().slice(0, 10);
  a.download = filename.includes('.') ? filename : `${filename}-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
