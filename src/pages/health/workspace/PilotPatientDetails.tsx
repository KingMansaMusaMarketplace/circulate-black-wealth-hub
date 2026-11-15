import { useState } from 'react';
import { toast } from 'sonner';
import { IdCard, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DETAIL_FIELDS, cleanDetails, formatAddress, formatEmergencyContact, validatePatientDetails, type DetailKey, type PatientDetails } from '@/lib/clinical/patient-details';
import { GALLERY_PHOTO_KEYS } from '@/lib/clinical/pilot-photos';
import { GALLERY_PHOTOS } from './PilotPatientPhoto';
import { db, type Row } from './hc';

const show = (v?: string | null) => (v && String(v).trim() ? String(v) : '—');

/** Read-only details grid, shared by the doctor's chart and the patient's own portal. */
export function PatientDetailsGrid({ patient }: { patient: Row }) {
  const items: [string, string][] = [
    ['Preferred name', show(patient.preferred_name)],
    ['Preferred language', show(patient.preferred_language)],
    ['Phone', show(patient.phone)],
    ['Address', show(formatAddress(patient))],
    ['Emergency contact', show(formatEmergencyContact(patient))],
    ['Primary doctor', show(patient.primary_doctor)],
    ['Insurance', patient.insurance_company ? `${patient.insurance_company}${patient.insurance_plan ? ` · ${patient.insurance_plan}` : ''}` : '—'],
    ['Member ID', show(patient.insurance_member_id)],
  ];
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([k, v]) => <div key={k}><dt className="text-xs uppercase text-muted-foreground">{k}</dt><dd className="break-words">{v}</dd></div>)}
    </dl>
  );
}

/** Doctor-side details sheet. Editing is for made-up test patients only, by registering staff. */
export function PatientDetailsCard({ patient, canEdit, onSaved }: { patient: Row; canEdit: boolean; onSaved: () => void | Promise<void> }) {
  const [editing, setEditing] = useState(false);
  const real = patient.is_real === true;
  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base"><IdCard className="h-4 w-4" />Patient details</CardTitle>
        {canEdit && !real && !editing && <Button size="sm" variant="outline" onClick={() => setEditing(true)}><Pencil className="mr-1 h-4 w-4" />Edit details</Button>}
      </CardHeader>
      <CardContent className="space-y-3">
        {editing
          ? <DetailsForm patient={patient} onCancel={() => setEditing(false)} onSaved={async () => { setEditing(false); await onSaved(); }} />
          : <>
            <PatientDetailsGrid patient={patient} />
            <p className="text-xs text-muted-foreground">{real ? 'Real-patient details are shown read only here.' : 'Made-up details for a test patient. Never type a real person’s address, phone or insurance.'}</p>
          </>}
      </CardContent>
    </Card>
  );
}

function DetailsForm({ patient, onCancel, onSaved }: { patient: Row; onCancel: () => void; onSaved: () => void | Promise<void> }) {
  const [f, setF] = useState<PatientDetails>(() => {
    const init: PatientDetails = { photo_choice: patient.photo_choice ?? null };
    for (const d of DETAIL_FIELDS) init[d.key] = patient[d.key] ?? '';
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = (k: DetailKey) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const sample = patient.is_sample === true;

  const save = async () => {
    if (saving) return;
    const problem = validatePatientDetails(f, { real: false });
    if (problem) { setError(problem); return; }
    setSaving(true); setError('');
    try {
      const clean = cleanDetails(f);
      if (sample) delete clean.photo_choice; // sample patients keep their own bundled face
      const { data, error: e } = await db.from('hc_pilot_patients').update(clean).eq('id', patient.id).select('id').maybeSingle();
      if (e) throw new Error(e.message);
      if (!data?.id) throw new Error('The details could not be confirmed as saved. Refresh before trying again.');
      toast.success('Patient details saved');
      await onSaved();
    } catch (e) { setError(e instanceof Error ? e.message : 'Details could not be saved.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {DETAIL_FIELDS.map((d) => (
          <div key={d.key} className="space-y-1"><Label htmlFor={`pd-${d.key}`}>{d.label}</Label>
            <Input id={`pd-${d.key}`} value={f[d.key] ?? ''} onChange={set(d.key)} maxLength={d.max} /></div>
        ))}
      </div>
      {!sample && (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Sample face <span className="font-normal text-muted-foreground">· computer-generated, not real people · uploads open at go-live</span></legend>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Choose a sample face">
            <button type="button" role="radio" aria-checked={!f.photo_choice} onClick={() => setF({ ...f, photo_choice: null })}
              className={`flex h-16 w-14 items-center justify-center rounded-md border text-xs ${!f.photo_choice ? 'ring-2 ring-mansagold' : ''}`}>Initials</button>
            {GALLERY_PHOTO_KEYS.map((k, i) => (
              <button key={k} type="button" role="radio" aria-checked={f.photo_choice === k} aria-label={`Sample face ${i + 1}`} onClick={() => setF({ ...f, photo_choice: k })}
                className={`overflow-hidden rounded-md border ${f.photo_choice === k ? 'ring-2 ring-mansagold' : ''}`}>
                <img src={GALLERY_PHOTOS[k]} alt="" width={768} height={896} loading="lazy" className="h-16 w-14 object-cover" />
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Button onClick={() => void save()} disabled={saving} className="bg-mansagold text-mansablue hover:bg-mansagold-dark">{saving ? 'Saving…' : 'Save details'}</Button>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancel</Button>
      </div>
    </div>
  );
}
