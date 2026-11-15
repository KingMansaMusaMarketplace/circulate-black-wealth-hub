/**
 * Pilot chart tab layout: six main tabs plus a "More" menu, so the chart never
 * wraps on laptops/iPads. Every screen that existed before is still reachable;
 * older tab names (used by links from other screens) resolve to their new home.
 */
export type ChartTabId = 'summary' | 'notes' | 'meds' | 'results' | 'vitals' | 'problems' | 'social' | 'portal' | 'all';

export interface ChartTab { id: ChartTabId; label: string; }

export const MAIN_CHART_TABS: readonly ChartTab[] = [
  { id: 'summary', label: 'Summary' },
  { id: 'notes', label: 'Visit notes' },
  { id: 'meds', label: 'Medications' },
  { id: 'results', label: 'Orders & results' },
  { id: 'vitals', label: 'Vitals' },
  { id: 'problems', label: 'Problems & allergies' },
];

export const MORE_CHART_TABS: readonly ChartTab[] = [
  { id: 'social', label: 'Social needs' },
  { id: 'portal', label: 'Patient portal' },
  { id: 'all', label: 'All records' },
];

/** Old tab names → where that screen lives now. */
export const LEGACY_CHART_TABS: Readonly<Record<string, ChartTabId>> = {
  rx: 'meds',        // Prescriptions now sit inside Medications
  orders: 'results', // Lab orders now sit inside Orders & results
  labs: 'results',   // Lab results now sit inside Orders & results
};

export function visibleMoreTabs(canSeePortal: boolean): ChartTab[] {
  return MORE_CHART_TABS.filter((t) => t.id !== 'portal' || canSeePortal);
}

/** Resolve any requested tab (new or old name) to a tab the viewer can open. */
export function resolveChartTab(requested: string | undefined | null, canSeePortal: boolean): ChartTabId {
  if (!requested) return 'summary';
  const id = (LEGACY_CHART_TABS[requested] ?? requested) as ChartTabId;
  if (MAIN_CHART_TABS.some((t) => t.id === id)) return id;
  if (visibleMoreTabs(canSeePortal).some((t) => t.id === id)) return id;
  return 'summary';
}

export function isMoreTab(id: string): boolean {
  return MORE_CHART_TABS.some((t) => t.id === id);
}
