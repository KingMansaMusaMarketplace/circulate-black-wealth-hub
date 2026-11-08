// "BOOST" — keep your current EHR and add 1325 on top. Pilot connection uses the
// standard SMART on FHIR launch against the PUBLIC SMART Health IT sandbox only,
// which holds made-up (synthetic) patients. The server address is fixed in code:
// there is no box to type another address, nothing is saved, nothing is written back.
// Epic's sandbox uses the same standard but needs a registered client ID from
// fhir.epic.com first (owner action).

import { egfrFromChart, type EgfrResult } from './fairness';
import { prescriptionWarnings } from './prescriptions';

export const BOOST_SANDBOX_ISS = 'https://launch.smarthealthit.org/v/r4/fhir';
export const BOOST_CLIENT_ID = '1325-clinical-boost-pilot';
export const BOOST_SCOPE = 'launch/patient openid fhirUser patient/*.read';
export const BOOST_NOTICE =
  'Test connections to the public SMART Health IT sandbox or Epic’s test sandbox — made-up patients only, never real people or live hospitals. 1325 reads the chart, shows its add-ons, and saves nothing. Nothing is written back.';

export const boostRedirectUri = (origin: string) => `${origin}/health/app?view=boost`;

/** Epic on FHIR public test sandbox (fictional patients). Non-Production client ID only. */
export const EPIC_SANDBOX_ISS = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
export const EPIC_NONPROD_CLIENT_ID = '5e1aa460-7a9c-43a8-af34-05522799ad8d';
export const EPIC_SCOPE = 'openid fhirUser launch/patient patient/Patient.read patient/Condition.read patient/MedicationRequest.read patient/AllergyIntolerance.read patient/Observation.read';
/** Epic's published sandbox test patient (Camila Lopez), used when Epic gives no patient context. */
export const EPIC_TEST_PATIENT_ID = 'erXuFYUfucBZaryVksYEcMg3';

export type BoostServer = 'smart' | 'epic';
export const BOOST_SERVERS: Record<BoostServer, { iss: string; clientId: string; scope: string; label: string }> = {
  smart: { iss: BOOST_SANDBOX_ISS, clientId: BOOST_CLIENT_ID, scope: BOOST_SCOPE, label: 'Public SMART sandbox' },
  epic: { iss: EPIC_SANDBOX_ISS, clientId: EPIC_NONPROD_CLIENT_ID, scope: EPIC_SCOPE, label: 'Epic test sandbox' },
};

const norm = (u: string) => u.replace(/\/$/, '');
/** Which allowed test server this is, or null (guards against any other server). */
export const sandboxKind = (url: string | undefined | null): BoostServer | null => {
  if (!url) return null;
  const u = norm(url);
  return (Object.keys(BOOST_SERVERS) as BoostServer[]).find((k) => BOOST_SERVERS[k].iss === u) ?? null;
};
/** True when the address is one of the fixed test sandboxes. */
export const isSandboxServer = (url: string | undefined | null) => sandboxKind(url) !== null;

/* ---------- Small FHIR readers (only the fields we show) ---------- */
type Coding = { system?: string; code?: string; display?: string };
type Concept = { text?: string; coding?: Coding[] };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Res = Record<string, any>;

export const conceptText = (c?: Concept | null) => c?.text || c?.coding?.find((x) => x.display)?.display || c?.coding?.[0]?.code || 'Unnamed';

export function patientSummary(p: Res) {
  const n = (p.name ?? [])[0] ?? {};
  const name = n.text || [...(n.given ?? []), n.family].filter(Boolean).join(' ') || 'Unnamed test patient';
  return { name, birthDate: (p.birthDate as string | undefined) ?? null, gender: (p.gender as string | undefined) ?? null };
}

const clinicalActive = (r: Res) => {
  const s = r.clinicalStatus?.coding?.[0]?.code;
  return !s || s === 'active' || s === 'recurrence' || s === 'relapse';
};

export const activeConditions = (rs: Res[]) =>
  rs.filter((r) => r.resourceType === 'Condition' && clinicalActive(r)).map((r) => conceptText(r.code));

export const activeMedicines = (rs: Res[]) => [...new Set(
  rs.filter((r) => r.resourceType === 'MedicationRequest' && (!r.status || r.status === 'active'))
    .map((r) => (r.medicationCodeableConcept ? conceptText(r.medicationCodeableConcept) : String(r.medicationReference?.display ?? 'Unnamed medicine'))),
)];

export const allergyNames = (rs: Res[]) =>
  rs.filter((r) => r.resourceType === 'AllergyIntolerance' && clinicalActive(r)).map((r) => conceptText(r.code));

/** Newest serum creatinine (LOINC 2160-0) as value/unit/date. */
export function latestCreatinine(rs: Res[]) {
  const obs = rs
    .filter((r) => r.resourceType === 'Observation' && r.valueQuantity?.value != null
      && (r.code?.coding ?? []).some((c: Coding) => c.code === '2160-0'))
    .map((r) => ({ value: Number(r.valueQuantity.value), unit: String(r.valueQuantity.unit ?? r.valueQuantity.code ?? ''), date: String(r.effectiveDateTime ?? r.issued ?? '').slice(0, 10) }))
    .filter((o) => Number.isFinite(o.value) && /^\d{4}-\d{2}-\d{2}$/.test(o.date))
    .sort((a, b) => b.date.localeCompare(a.date));
  return obs[0] ?? null;
}

export interface BoostInsights { egfr: EgfrResult; medicineWarnings: string[] }

/** 1325 add-ons on top of the outside chart: race-free kidney function and medicine/allergy checks. */
export function boostInsights(input: { birthDate: string | null; gender: string | null; medicines: string[]; allergies: string[]; creatinine: { value: number; unit: string; date: string } | null }): BoostInsights {
  const records = input.creatinine
    ? [{ record_type: 'lab_result', status: 'active', title: 'Creatinine', lab_value: String(input.creatinine.value), lab_unit: input.creatinine.unit, recorded_on: input.creatinine.date }]
    : [];
  const egfr = egfrFromChart(records, input.birthDate, input.gender);
  const seen = new Set<string>();
  const medicineWarnings: string[] = [];
  input.medicines.forEach((m, i) => {
    const others = input.medicines.filter((_, j) => j !== i);
    for (const w of prescriptionWarnings(m, input.allergies, others)) {
      // Pair warnings (interaction / duplicate) show up for both medicines; keep one.
      const pair = w.match(/^Interaction with (.+?): /) ?? w.match(/^Duplicate: the patient already has (.+?) on /);
      const key = pair ? `${w.split(' ')[0]}|${[m.trim().toLowerCase(), pair[1].trim().toLowerCase()].sort().join('|')}` : `${m}|${w}`;
      if (seen.has(key)) continue;
      seen.add(key);
      medicineWarnings.push(`${m} — ${w}`);
    }
  });
  return { egfr, medicineWarnings: medicineWarnings.slice(0, 30) };
}
