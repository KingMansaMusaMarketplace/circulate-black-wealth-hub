export const OPERATIONS_SCENARIO = {
  name: 'Kenya outpatient clinic · fictional snapshot',
  date: '26 October 2026 · 10:00 EAT',
  flow: [
    { id: 'waiting', label: 'Waiting', entries: [{ id: 'FLOW-01', minutes: 12 }, { id: 'FLOW-02', minutes: 7 }] },
    { id: 'triage', label: 'Triage', entries: [{ id: 'FLOW-03', minutes: 4 }] },
    { id: 'clinician', label: 'With clinician', entries: [{ id: 'FLOW-04', minutes: 9 }] },
    { id: 'complete', label: 'Visit complete', entries: [{ id: 'FLOW-05', minutes: null }, { id: 'FLOW-06', minutes: null }] },
  ],
  collections: { cash: 6000, mpesa: 18000, shaAwaiting: 12500 },
  supplies: [
    { id: 'gloves', label: 'Examination gloves', unit: 'boxes', quantity: 3, minimum: 5 },
    { id: 'gauze', label: 'Gauze', unit: 'packs', quantity: 8, minimum: 10 },
    { id: 'syringes', label: 'Single-use syringes', unit: 'boxes', quantity: 12, minimum: 6 },
  ],
} as const;

export function collectionTotals(values: { cash: number; mpesa: number; shaAwaiting: number }) {
  for (const value of Object.values(values)) if (!Number.isFinite(value) || value < 0) throw new Error('Invalid illustrative amount');
  return { received: values.cash + values.mpesa, awaiting: values.shaAwaiting };
}

export function supplyStatus(quantity: number, minimum: number) {
  if (![quantity, minimum].every(value => Number.isInteger(value) && value >= 0)) throw new Error('Invalid illustrative stock');
  return quantity < minimum ? 'Low stock' : 'Adequate';
}

export function flowCounts() {
  return OPERATIONS_SCENARIO.flow.map(stage => ({ id: stage.id, count: stage.entries.length }));
}

export const OPERATIONS_CAPABILITIES = Object.freeze({
  patientEntry: false, queueUpdates: false, collectPayment: false, submitInsurance: false,
  dispense: false, reorder: false, export: false, persist: false, offlineRecords: false, offlineSync: false,
});

export type BrowserConnection = 'Online' | 'Offline' | 'Unknown';
export function browserConnection(): BrowserConnection {
  if (typeof navigator === 'undefined' || typeof navigator.onLine !== 'boolean') return 'Unknown';
  return navigator.onLine ? 'Online' : 'Offline';
}