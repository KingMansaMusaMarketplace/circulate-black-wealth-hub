// Practice prescriptions for the 1325 Clinical pilot. Nothing here is sent to a
// pharmacy. Mirrors hc_pilot_prescriptions_validate; the database is the real lock.
// The interaction list is a small starter list written for the pilot, NOT a licensed
// drug-interaction database, and the screen must say so.

export const RX_ROUTES = ['by mouth', 'under the tongue', 'on the skin', 'inhaled', 'injection', 'eye drops', 'ear drops', 'nasal', 'rectal', 'other'] as const;
export type RxRoute = (typeof RX_ROUTES)[number];

export const RX_STATUS_LABELS: Record<string, string> = {
  active: 'Active', stopped: 'Stopped', renewed: 'Renewed', entered_in_error: 'Entered in error',
};

export const RX_NOT_SENT_NOTICE =
  'Practice prescription — never sent to a pharmacy. Real e-prescribing needs a Surescripts connection, and controlled drugs also need DEA-approved two-step sign-in.';
export const RX_CHECKER_NOTICE =
  'Warnings come from a small starter list written for the pilot, not a licensed drug-interaction database. Always use your own clinical judgment.';

export interface RxInput {
  drug_name: string;
  strength?: string | null;
  dose: string;
  route: string;
  frequency: string;
  quantity: number | null;
  refills: number | null;
  days_supply?: number | null;
  instructions: string;
  indication?: string | null;
  override_reason?: string | null;
}

const SSN = /\d{3}-\d{2}-\d{4}/;

export function validatePrescription(rx: RxInput, warnings: string[]): string | null {
  const name = rx.drug_name.trim();
  if (name.length < 2 || name.length > 120) return 'Medicine name is required (120 characters max).';
  if (rx.dose.trim().length < 1 || rx.dose.trim().length > 60) return 'Dose is required (60 characters max).';
  if (!(RX_ROUTES as readonly string[]).includes(rx.route)) return 'Choose how the medicine is taken.';
  if (rx.frequency.trim().length < 2 || rx.frequency.trim().length > 60) return 'How often is required (60 characters max).';
  if (rx.quantity == null || !Number.isInteger(rx.quantity) || rx.quantity < 1 || rx.quantity > 1000) return 'Quantity must be between 1 and 1,000.';
  if (rx.refills == null || !Number.isInteger(rx.refills) || rx.refills < 0 || rx.refills > 11) return 'Refills must be between 0 and 11.';
  if (rx.days_supply != null && (!Number.isInteger(rx.days_supply) || rx.days_supply < 1 || rx.days_supply > 365)) return 'Days supply must be between 1 and 365.';
  const directions = rx.instructions.trim();
  if (directions.length < 5 || directions.length > 500) return 'Directions for the patient are required (5 to 500 characters).';
  const all = [name, rx.strength, rx.dose, rx.frequency, directions, rx.indication, rx.override_reason].filter(Boolean).join(' ');
  if (SSN.test(all)) return 'Social Security numbers are not allowed.';
  if (warnings.length > 0 && (rx.override_reason ?? '').trim().length < 10) {
    return 'This prescription has a safety warning. Write why it is still right for this patient (at least 10 characters).';
  }
  return null;
}

// ---------- Safety checks ----------

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Same rule as the database: an allergy name of 3+ letters found in the medicine name (or the reverse). */
export function directAllergyMatch(drug: string, allergies: string[]): string | null {
  const d = drug.toLowerCase();
  for (const a of allergies) {
    const al = a.trim().toLowerCase();
    if (al.length >= 3 && (d.includes(al) || al.includes(d))) return a.trim();
  }
  return null;
}

/** Allergy families: an allergy to the family name also warns for these medicines. */
const ALLERGY_FAMILIES: { allergy: string[]; drugs: string[]; label: string }[] = [
  { allergy: ['penicillin'], drugs: ['amoxicillin', 'ampicillin', 'augmentin', 'dicloxacillin', 'piperacillin', 'nafcillin'], label: 'penicillin family' },
  { allergy: ['sulfa', 'sulfonamide'], drugs: ['sulfamethoxazole', 'bactrim', 'septra', 'sulfasalazine'], label: 'sulfa family' },
  { allergy: ['nsaid', 'aspirin'], drugs: ['ibuprofen', 'naproxen', 'diclofenac', 'meloxicam', 'ketorolac', 'celecoxib'], label: 'anti-inflammatory (NSAID) family' },
  { allergy: ['codeine', 'morphine', 'opioid'], drugs: ['codeine', 'morphine', 'hydrocodone', 'oxycodone'], label: 'opioid family' },
];

export function familyAllergyMatch(drug: string, allergies: string[]): string | null {
  const d = norm(drug);
  for (const fam of ALLERGY_FAMILIES) {
    const hasAllergy = allergies.some((a) => fam.allergy.some((f) => norm(a).includes(f)));
    if (hasAllergy && fam.drugs.some((x) => d.includes(x))) return fam.label;
  }
  return null;
}

type Group = { name: string; drugs: string[] };
const G = {
  warfarin: { name: 'warfarin', drugs: ['warfarin', 'coumadin', 'jantoven'] },
  nsaid: { name: 'an anti-inflammatory (NSAID) or aspirin', drugs: ['ibuprofen', 'naproxen', 'aspirin', 'diclofenac', 'meloxicam', 'ketorolac', 'celecoxib', 'advil', 'motrin', 'aleve'] },
  azoleAbx: { name: 'fluconazole, metronidazole or sulfamethoxazole', drugs: ['fluconazole', 'metronidazole', 'sulfamethoxazole', 'bactrim'] },
  ace: { name: 'an ACE inhibitor', drugs: ['lisinopril', 'enalapril', 'ramipril', 'benazepril', 'captopril', 'quinapril'] },
  arb: { name: 'an ARB blood-pressure medicine', drugs: ['losartan', 'valsartan', 'irbesartan', 'olmesartan', 'candesartan', 'telmisartan'] },
  potassium: { name: 'spironolactone or potassium', drugs: ['spironolactone', 'eplerenone', 'potassium chloride', 'klor-con'] },
  pde5: { name: 'sildenafil or tadalafil', drugs: ['sildenafil', 'tadalafil', 'vardenafil', 'viagra', 'cialis'] },
  nitrate: { name: 'a nitrate', drugs: ['nitroglycerin', 'isosorbide'] },
  statin: { name: 'simvastatin or lovastatin', drugs: ['simvastatin', 'lovastatin'] },
  strongInhib: { name: 'clarithromycin, erythromycin or an azole antifungal', drugs: ['clarithromycin', 'erythromycin', 'itraconazole', 'ketoconazole'] },
  ssri: { name: 'an SSRI antidepressant', drugs: ['sertraline', 'fluoxetine', 'citalopram', 'escitalopram', 'paroxetine'] },
  serotonergic: { name: 'tramadol, linezolid, an MAOI or a triptan', drugs: ['tramadol', 'linezolid', 'phenelzine', 'tranylcypromine', 'selegiline', 'sumatriptan', 'rizatriptan'] },
  opioid: { name: 'an opioid', drugs: ['oxycodone', 'hydrocodone', 'morphine', 'codeine', 'fentanyl', 'tramadol', 'hydromorphone', 'methadone'] },
  benzo: { name: 'a benzodiazepine', drugs: ['alprazolam', 'lorazepam', 'diazepam', 'clonazepam', 'temazepam', 'xanax', 'ativan', 'valium'] },
  methotrexate: { name: 'methotrexate', drugs: ['methotrexate'] },
  trimethoprim: { name: 'trimethoprim or sulfamethoxazole', drugs: ['trimethoprim', 'sulfamethoxazole', 'bactrim'] },
  clopidogrel: { name: 'clopidogrel', drugs: ['clopidogrel', 'plavix'] },
  ppi: { name: 'omeprazole or esomeprazole', drugs: ['omeprazole', 'esomeprazole'] },
  lithium: { name: 'lithium', drugs: ['lithium'] },
  lithiumRaisers: { name: 'an NSAID, ACE inhibitor or water pill', drugs: ['ibuprofen', 'naproxen', 'lisinopril', 'enalapril', 'hydrochlorothiazide', 'chlorthalidone'] },
  digoxin: { name: 'digoxin', drugs: ['digoxin'] },
  amiodarone: { name: 'amiodarone', drugs: ['amiodarone'] },
} satisfies Record<string, Group>;

/** Starter pairs: [group A, group B, what can happen]. */
export const STARTER_INTERACTIONS: [Group, Group, string][] = [
  [G.warfarin, G.nsaid, 'higher bleeding risk'],
  [G.warfarin, G.azoleAbx, 'warfarin effect can rise sharply (bleeding risk)'],
  [G.ace, G.potassium, 'potassium can get dangerously high'],
  [G.ace, G.arb, 'kidney injury and high potassium'],
  [G.pde5, G.nitrate, 'dangerously low blood pressure'],
  [G.statin, G.strongInhib, 'serious muscle breakdown'],
  [G.ssri, G.serotonergic, 'serotonin syndrome'],
  [G.opioid, G.benzo, 'slowed or stopped breathing (FDA boxed warning)'],
  [G.methotrexate, G.trimethoprim, 'bone-marrow suppression'],
  [G.clopidogrel, G.ppi, 'clopidogrel may work less well'],
  [G.lithium, G.lithiumRaisers, 'lithium levels can rise to toxic'],
  [G.digoxin, G.amiodarone, 'digoxin levels can rise to toxic'],
];

const inGroup = (drug: string, g: Group) => { const d = norm(drug); return g.drugs.some((x) => d.includes(x)); };

/** Interaction warnings between the new medicine and the patient's current medicines. */
export function interactionWarnings(drug: string, current: string[]): string[] {
  const out: string[] = [];
  for (const other of current) {
    for (const [a, b, effect] of STARTER_INTERACTIONS) {
      const hit = (inGroup(drug, a) && inGroup(other, b)) || (inGroup(drug, b) && inGroup(other, a));
      if (hit) out.push(`Interaction with ${other.trim()}: ${effect}.`);
    }
  }
  return [...new Set(out)];
}

const firstWord = (s: string) => norm(s).split(' ')[0] ?? '';

/** All warnings for a new prescription. `current` are active prescriptions and medicine-list entries. */
export function prescriptionWarnings(drug: string, allergies: string[], current: string[]): string[] {
  if (drug.trim().length < 3) return [];
  const out: string[] = [];
  const direct = directAllergyMatch(drug, allergies);
  if (direct) out.push(`Allergy: this patient has a recorded allergy to ${direct}.`);
  const fam = familyAllergyMatch(drug, allergies);
  if (fam && !direct) out.push(`Allergy: this medicine is in the ${fam}, which matches a recorded allergy.`);
  const head = firstWord(drug);
  const dup = current.find((c) => head.length >= 4 && firstWord(c) === head);
  if (dup) out.push(`Duplicate: the patient already has ${dup.trim()} on the active list.`);
  out.push(...interactionWarnings(drug, current.filter((c) => c !== dup)));
  return out.map((w) => w.slice(0, 200)).slice(0, 20);
}

/** Display text for a stored warning (the database adds the plain code "allergy" on its own match). */
export const warningLabel = (w: string) => (w === 'allergy' ? 'Allergy: matches a recorded allergy (database check).' : w);

export function validateRxStop(stoppedOn: string, prescribedOn: string, reason: string, today = new Date()): string | null {
  if (!stoppedOn) return 'Choose the stop date.';
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
  if (stoppedOn < prescribedOn || new Date(`${stoppedOn}T00:00:00`) > tomorrow) return 'Stop date must be on or after the prescription date and not in the future.';
  if (reason.trim().length < 3) return 'Give a reason for stopping (at least 3 characters).';
  if (SSN.test(reason)) return 'Social Security numbers are not allowed.';
  return null;
}
