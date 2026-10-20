import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

type Row = { id: string; clinic_name: string; country: string; contact_name: string; email: string; practice_type: string; clinician_count: number; letter_of_intent: boolean; created_at: string };
const TYPE: Record<string, string> = { independent_practice: 'Independent practice', hospital_department: 'Hospital department', global_clinic: 'Global clinic' };

export function foundingCsv(rows: Row[]) {
  const esc = (v: unknown) => { const s = String(v ?? ''); return /^[=+\-@]/.test(s) ? `"'${s.replace(/"/g, '""')}"` : `"${s.replace(/"/g, '""')}"`; };
  const head = ['Date', 'Clinic', 'Country', 'Contact', 'Email', 'Practice type', 'Clinicians', 'Letter of intent'];
  return [head.map(esc).join(','), ...rows.map(r => [r.created_at.slice(0, 10), r.clinic_name, r.country, r.contact_name, r.email, TYPE[r.practice_type] ?? r.practice_type, r.clinician_count, r.letter_of_intent ? 'Yes' : 'No'].map(esc).join(','))].join('\n');
}

export default function FoundingClinicsList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true); setError('');
    const { data, error: e } = await supabase.from('hc_founding_clinics' as never).select('*').order('created_at', { ascending: false });
    if (e) setError('Could not load the Founding Clinic list.'); else setRows((data ?? []) as Row[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  const download = () => {
    const url = URL.createObjectURL(new Blob([foundingCsv(rows)], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = 'founding-clinics.csv'; a.click(); URL.revokeObjectURL(url);
  };
  const loi = rows.filter(r => r.letter_of_intent).length;
  return <Card className="mt-6">
    <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
      <div><CardTitle>Founding Clinics</CardTitle><p className="mt-1 text-sm text-muted-foreground">{rows.length} clinics · {loi} letters of intent</p></div>
      <div className="flex gap-2"><Button variant="outline" size="sm" onClick={load} disabled={loading}><RefreshCw className="h-4 w-4" />Refresh</Button><Button size="sm" onClick={download} disabled={!rows.length}><Download className="h-4 w-4" />Download spreadsheet</Button></div>
    </CardHeader>
    <CardContent>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : loading ? <p className="text-sm text-muted-foreground">Loading…</p> : !rows.length ? <p className="text-sm text-muted-foreground">No Founding Clinic signups yet.</p> :
        <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border text-left text-muted-foreground"><th className="py-2 pr-4">Date</th><th className="pr-4">Clinic</th><th className="pr-4">Country</th><th className="pr-4">Contact</th><th className="pr-4">Type</th><th className="pr-4">Clinicians</th><th></th></tr></thead>
          <tbody>{rows.map(r => <tr key={r.id} className="border-b border-border/50"><td className="py-2 pr-4 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td><td className="pr-4 font-medium">{r.clinic_name}</td><td className="pr-4">{r.country}</td><td className="pr-4">{r.contact_name}<br /><a className="text-xs text-muted-foreground underline" href={`mailto:${r.email}`}>{r.email}</a></td><td className="pr-4">{TYPE[r.practice_type] ?? r.practice_type}</td><td className="pr-4">{r.clinician_count}</td><td>{r.letter_of_intent && <Badge className="bg-mansagold text-mansablue">Letter of intent</Badge>}</td></tr>)}</tbody></table></div>}
    </CardContent>
  </Card>;
}
