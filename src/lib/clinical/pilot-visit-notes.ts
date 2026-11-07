// Pilot visit notes, dashboard numbers and privacy rules for 1325 Clinical.
// Mirrors the database triggers on hc_pilot_visit_notes / hc_pilot_note_addenda.
// Made-up test patients only — these are HIPAA-style safeguards for the pilot,
// not HIPAA compliance. Real patient data stays locked until vendor BAAs are
// signed and a healthcare attorney approves go-live.

import { containsSsn } from './pilot-records';

export const SAFEGUARD_LABEL = 'HIPAA-ready safeguards (pilot)';

/** Minutes of no activity before the screen locks and hides patient details. */
export const IDLE_LOCK_MINUTES = 10;

export const NOTE_SECTIONS = [
  { key: 'subjective', label: 'What the patient says', hint: 'Symptoms and history in the patient’s words (Subjective)' },
  { key: 'objective', label: 'What you found', hint: 'Exam findings, vital signs, test results (Objective)' },
  { key: 'assessment', label: 'Assessment', hint: 'Diagnosis or clinical impression' },
  { key: 'plan', label: 'Plan', hint: 'Treatment, medicines, follow-up' },
] as const;
export type NoteSectionKey = (typeof NOTE_SECTIONS)[number]['key'];

export type NoteStatus = 'draft' | 'signed' | 'entered_in_error';
export const NOTE_STATUS_LABELS: Record<NoteStatus, string> = {
  draft: 'Draft',
  signed: 'Signed & locked',
  entered_in_error: 'Entered in error',
};

export interface VisitNoteInput {
  visit_date: string;
  visit_reason: string;
  subjective?: string | null;
  objective?: string | null;
  assessment?: string | null;
  plan?: string | null;
}

export function validateVisitNote(n: VisitNoteInput, opts: { forSigning?: boolean; today?: Date } = {}): string | null {
  const today = opts.today ?? new Date();
  const reason = n.visit_reason.trim();
  if (reason.length < 2 || reason.length > 140) return 'Reason for visit is required (140 characters max).';
  const date = new Date(`${n.visit_date}T00:00:00`);
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  if (Number.isNaN(date.getTime()) || date > tomorrow || date < new Date('1900-01-01T00:00:00')) return 'Visit date must not be in the future.';
  for (const s of NOTE_SECTIONS) {
    if ((n[s.key] ?? '').length > 5000) return `${s.label} must be 5,000 characters or fewer.`;
  }
  if (containsSsn(reason, n.subjective, n.objective, n.assessment, n.plan)) return 'Social Security numbers are not allowed.';
  if (opts.forSigning && ((n.assessment ?? '').trim().length < 2 || (n.plan ?? '').trim().length < 2)) {
    return 'Assessment and plan are required before signing.';
  }
  return null;
}

export function validateAddendum(body: string): string | null {
  const t = body.trim();
  if (t.length < 3 || t.length > 5000) return 'Addendum must be 3 to 5,000 characters.';
  if (containsSsn(t)) return 'Social Security numbers are not allowed.';
  return null;
}

/** Only the author may edit or sign a draft; signed notes are locked for everyone. */
export function canEditNote(note: { status: string; created_by: string }, userId: string | null | undefined): boolean {
  return note.status === 'draft' && !!userId && note.created_by === userId;
}

export const canAddAddendum = (note: { status: string }) => note.status === 'signed';

/** Privacy mode: show initials only, e.g. "Testy Example" → "T. E." */
export function maskName(first?: string | null, last?: string | null): string {
  const i = (s?: string | null) => (s && s.trim() ? `${s.trim()[0].toUpperCase()}.` : '');
  return [i(first), i(last)].filter(Boolean).join(' ') || '—';
}

type AnyRow = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export interface DashboardStats {
  activePatients: number;
  visitsThisWeek: number;
  draftNotes: number;
  chartsOpenedToday: number | null;
}

/** Summary tiles. Visits this week = notes (not in error) with a visit date in the last 7 days. */
export function buildDashboardStats(patients: AnyRow[], notes: AnyRow[], audit: AnyRow[] | null, now = new Date()): DashboardStats {
  const today = startOfDay(now);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 6);
  const validNotes = notes.filter((n) => n.status !== 'entered_in_error');
  return {
    activePatients: patients.filter((p) => !p.archived_at).length,
    visitsThisWeek: validNotes.filter((n) => {
      const d = new Date(`${n.visit_date}T00:00:00`);
      return d >= weekAgo && d <= now;
    }).length,
    draftNotes: notes.filter((n) => n.status === 'draft').length,
    chartsOpenedToday: audit ? audit.filter((a) => a.action === 'chart_opened' && new Date(a.created_at) >= today).length : null,
  };
}

/** Daily counts for the last `days` days (oldest first). */
export function dailySeries(rows: AnyRow[], dateField: string, days = 14, now = new Date()): { day: string; label: string; count: number }[] {
  const out: { day: string; label: string; count: number }[] = [];
  const counts = new Map<string, number>();
  for (const r of rows) {
    const v = r[dateField];
    if (!v) continue;
    const d = v.length === 10 ? new Date(`${v}T00:00:00`) : new Date(v);
    if (Number.isNaN(d.getTime())) continue;
    const k = dayKey(d);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const today = startOfDay(now);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const k = dayKey(d);
    out.push({ day: k, label: `${d.getMonth() + 1}/${d.getDate()}`, count: counts.get(k) ?? 0 });
  }
  return out;
}

/** Vital-sign trend points from active vitals records, oldest first. */
export function vitalsSeries(records: AnyRow[]) {
  return records
    .filter((r) => r.record_type === 'vitals' && r.status === 'active')
    .sort((a, b) => (a.recorded_on === b.recorded_on ? String(a.created_at).localeCompare(String(b.created_at)) : String(a.recorded_on).localeCompare(String(b.recorded_on))))
    .map((r) => ({
      date: r.recorded_on as string,
      systolic: r.bp_sys ?? null,
      diastolic: r.bp_dia ?? null,
      heartRate: r.heart_rate ?? null,
      weight: r.weight_lb != null ? Number(r.weight_lb) : null,
    }));
}

export interface ChartLogFilter { person?: string; patientId?: string; from?: string; to?: string }

/** Chart-opened entries only, filtered by staff email, patient and date range (inclusive). */
export function filterChartLog(audit: AnyRow[], f: ChartLogFilter): AnyRow[] {
  const from = f.from ? new Date(`${f.from}T00:00:00`) : null;
  const to = f.to ? new Date(`${f.to}T23:59:59.999`) : null;
  const person = f.person?.trim().toLowerCase();
  return audit.filter((a) => {
    if (a.action !== 'chart_opened') return false;
    if (person && !String(a.actor_email ?? '').toLowerCase().includes(person)) return false;
    if (f.patientId && a.patient_id !== f.patientId) return false;
    const t = new Date(a.created_at);
    if (from && t < from) return false;
    if (to && t > to) return false;
    return true;
  });
}
