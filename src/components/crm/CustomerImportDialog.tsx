import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import readXlsxFile from 'read-excel-file/browser';
import { Upload, Download, FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

type Row = Record<string, string>;
type Mapped = {
  first_name: string; last_name: string; email?: string; phone?: string; company?: string;
  address?: string; city?: string; state?: string; zip_code?: string; notes?: string;
};

const ALIASES: Record<string, string[]> = {
  full_name: ['name', 'full name', 'fullname', 'customer', 'customer name', 'client', 'client name', 'display name'],
  first_name: ['first name', 'firstname', 'first', 'given name'],
  last_name: ['last name', 'lastname', 'last', 'surname', 'family name'],
  email: ['email', 'e-mail', 'email address', 'mail'],
  phone: ['phone', 'phone number', 'mobile', 'cell', 'telephone', 'tel', 'mobile phone'],
  company: ['company', 'business', 'organization', 'organisation'],
  address: ['address', 'street', 'street address', 'address 1', 'address line 1'],
  city: ['city', 'town'],
  state: ['state', 'province', 'region'],
  zip_code: ['zip', 'zip code', 'zipcode', 'postal code', 'postcode'],
  notes: ['notes', 'note', 'comments', 'memo'],
};

const norm = (s: string) => s.toLowerCase().replace(/[_\-]+/g, ' ').replace(/\s+/g, ' ').trim();

function mapRow(row: Row): Mapped | null {
  const get = (key: string) => {
    for (const [h, v] of Object.entries(row)) {
      if (ALIASES[key].includes(norm(h)) && String(v ?? '').trim()) return String(v).trim().slice(0, 500);
    }
    return undefined;
  };
  let first = get('first_name');
  let last = get('last_name');
  const full = get('full_name');
  if (!first && full) {
    const parts = full.split(/\s+/);
    first = parts[0];
    last = last || parts.slice(1).join(' ');
  }
  const email = get('email');
  const phone = get('phone');
  if (!first && !email && !phone) return null;
  return {
    first_name: first || (email ? email.split('@')[0] : 'Customer'),
    last_name: last || '',
    email, phone,
    company: get('company'), address: get('address'), city: get('city'),
    state: get('state'), zip_code: get('zip_code'), notes: get('notes'),
  };
}

const SAMPLE = 'First Name,Last Name,Email,Phone,Company,Address,City,State,Zip,Notes\nJane,Doe,jane@example.com,(312) 555-0100,,123 Main St,Chicago,IL,60601,Prefers Saturday appointments\n';

interface Props { businessId?: string | null; onImported?: () => void; trigger?: React.ReactNode }

export default function CustomerImportDialog({ businessId, onImported, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Mapped[]>([]);
  const [fileName, setFileName] = useState('');
  const [skipped, setSkipped] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const reset = () => { setRows([]); setFileName(''); setSkipped(0); };

  const handleRaw = (raw: Row[]) => {
    const mapped = raw.map(mapRow);
    const good = mapped.filter(Boolean) as Mapped[];
    setRows(good);
    setSkipped(mapped.length - good.length);
    if (!good.length) toast.error("We couldn't find names, emails or phone numbers in that file.");
  };

  const handleFile = useCallback(async (file: File) => {
    const name = file.name.toLowerCase();
    if (file.size > 10 * 1024 * 1024) return toast.error('File is too large (10 MB max).');
    setFileName(file.name);
    try {
      if (name.endsWith('.csv')) {
        Papa.parse<Row>(file, { header: true, skipEmptyLines: true, complete: (r) => handleRaw(r.data) });
      } else if (name.endsWith('.xlsx')) {
        const sheet = await readXlsxFile(file);
        const [head, ...body] = sheet;
        const headers = (head || []).map((h) => String(h ?? ''));
        handleRaw(body.map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] == null ? '' : String(r[i])]))));
      } else {
        toast.error('Please use a .csv or .xlsx file. In Excel, choose File → Save As → Excel Workbook (.xlsx) or CSV.');
        setFileName('');
      }
    } catch {
      toast.error("We couldn't read that file. Try saving it as CSV and uploading again.");
      setFileName('');
    }
  }, []);

  const downloadSample = () => {
    const url = URL.createObjectURL(new Blob([SAMPLE], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'customer-import-template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = async () => {
    if (!rows.length) return;
    setBusy(true);
    try {
      let bizId = businessId;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in first.');
      if (!bizId) {
        const { data } = await supabase.from('businesses').select('id').eq('owner_id', user.id).limit(1).maybeSingle();
        bizId = data?.id;
      }
      if (!bizId) throw new Error('No business found for your account.');
      let done = 0;
      for (let i = 0; i < rows.length; i += 200) {
        const chunk = rows.slice(i, i + 200).map((r) => ({
          ...r, business_id: bizId!, created_by: user.id, source: 'import',
          customer_status: 'active', lifecycle_stage: 'customer',
        }));
        const { error } = await supabase.from('customers').insert(chunk);
        if (error) throw error;
        done += chunk.length;
      }
      toast.success(`Imported ${done} customer${done === 1 ? '' : 's'}.`);
      reset(); setOpen(false); onImported?.();
    } catch (e: any) {
      toast.error(e?.message || 'Import failed.');
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) reset(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" /> Import Past Customer List (CSV / Excel)
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import your past customers</DialogTitle>
          <DialogDescription>
            Drop a CSV or Excel (.xlsx) file from Square, QuickBooks, Google Sheets or any spreadsheet. We match columns like Name, Email and Phone automatically.
          </DialogDescription>
        </DialogHeader>

        {!rows.length ? (
          <label
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 cursor-pointer transition-colors ${dragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/60'}`}
          >
            <FileSpreadsheet className="h-10 w-10 text-primary" />
            <span className="font-medium">{fileName || 'Drag & drop your file here, or click to choose'}</span>
            <span className="text-xs text-muted-foreground">.csv or .xlsx · up to 10 MB</span>
            <input type="file" accept=".csv,.xlsx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
          </label>
        ) : (
          <div className="space-y-3">
            <p className="text-sm">
              <strong>{rows.length}</strong> customers ready from <em>{fileName}</em>
              {skipped > 0 && <span className="text-muted-foreground"> · {skipped} empty rows skipped</span>}
            </p>
            <div className="max-h-64 overflow-auto rounded border border-border text-sm">
              <table className="w-full">
                <thead className="bg-muted/50 text-left">
                  <tr><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Phone</th><th className="p-2">City</th></tr>
                </thead>
                <tbody>
                  {rows.slice(0, 5).map((r, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2">{r.first_name} {r.last_name}</td>
                      <td className="p-2">{r.email || '—'}</td>
                      <td className="p-2">{r.phone || '—'}</td>
                      <td className="p-2">{r.city || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length > 5 && <p className="text-xs text-muted-foreground">Showing first 5 of {rows.length}.</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <Button variant="ghost" size="sm" className="gap-2" onClick={downloadSample}>
            <Download className="h-4 w-4" /> Download sample template
          </Button>
          <div className="flex gap-2">
            {rows.length > 0 && <Button variant="outline" onClick={reset} disabled={busy}>Choose another file</Button>}
            <Button onClick={doImport} disabled={!rows.length || busy} className="gap-2">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Import {rows.length || ''} customers
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
