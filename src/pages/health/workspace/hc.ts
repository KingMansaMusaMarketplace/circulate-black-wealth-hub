import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

/** 1325 Clinical data helpers. SAMPLE DATA ONLY — no real patient records. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as any;

export type Row = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export function useRows(table: string, clinicId: string | null, opts: { order?: string; asc?: boolean; select?: string; eq?: [string, string] } = {}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const { order = 'created_at', asc = false, select = '*', eq } = opts;
  const key = eq ? eq.join('=') : '';
  const reload = useCallback(async () => {
    if (!clinicId) return;
    setLoading(true);
    let q = db.from(table).select(select).eq('clinic_id', clinicId).order(order, { ascending: asc });
    if (eq) q = q.eq(eq[0], eq[1]);
    const { data } = await q;
    setRows(data ?? []);
    setLoading(false);
  }, [table, clinicId, order, asc, select, key]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { reload(); }, [reload]);
  return { rows, loading, reload };
}

export const fullName = (p?: Row | null) => (p ? `${p.first_name} ${p.last_name}` : '—');
export const money = (n: number) => `$${Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

/** Extract text from a PDF/TXT file, marking each page as [Page N]. */
export async function extractText(file: File, onProgress?: (done: number, total: number) => void): Promise<{ text: string; pages: number }> {
  if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
    const t = await file.text();
    return { text: `[Page 1]\n${t}`, pages: 1 };
  }
  const pdfjs = await import('pdfjs-dist');
  const worker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
  pdfjs.GlobalWorkerOptions.workerSrc = worker;
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const c = await page.getTextContent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parts.push(`[Page ${i}]\n${c.items.map((it: any) => it.str).join(' ')}`);
    onProgress?.(i, pdf.numPages);
  }
  return { text: parts.join('\n\n'), pages: pdf.numPages };
}
