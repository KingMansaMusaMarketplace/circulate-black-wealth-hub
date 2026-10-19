import { EXECUTIVE_TOUR_STEPS } from './executive-tour';
import { SAMPLE_VISITS } from './workspace/sample-visits';

// Fixed scripts, not a second Kayla prompt or a clinical conversation engine.
export const TOUR_NARRATION = [
  'Welcome to thirteen twenty-five dot A I Clinical. I am Kayla, an AI assistant. In this fictional preview, chart preparation links findings to their sources and shows missing information. Current clinical status remains unverified.',
  'This note-taking example uses a fictional visit transcript. Draft assertions must match cited source excerpts. Live recording and real patient records remain locked. A generated draft is not a physician decision.',
  'The doctor reviews the draft and makes a separate decision. A report is available only after the required sign-off. A typed sample signer name does not verify medical licensure.',
  'Care-guide examples include English and Spanish drafts for review. Patient delivery, booking and live communication remain locked. This concludes the fictional walkthrough.',
] as const;

export const TEAM_NARRATION = [
  { id: 'documentation', label: 'Documentation assistance', text: 'Illustrative handoff: documentation assistance. In this rehearsal, exact fictional source excerpts support draft organization. Kayla presents the explanation; no autonomous employee action or human staff work has been performed.' },
  { id: 'billing', label: 'Billing preparation', text: 'Illustrative handoff: billing preparation. Documentation gaps can be reviewed against fictional evidence. This is not code selection, coverage approval, reimbursement clearance or claim submission.' },
  { id: 'readiness', label: 'Operational readiness', text: 'Illustrative handoff: operational readiness. Legal agreements, vendor coverage, security safeguards and pilot results require independent verification. This preview does not certify readiness or activate clinical services.' },
] as const;

export function narrationCatalog() {
  return [
    ...EXECUTIVE_TOUR_STEPS.map((step, i) => ({ id: `tour-${step.id}`, title: step.title, text: TOUR_NARRATION[i], kind: 'explanation' as const })),
    ...SAMPLE_VISITS.map(visit => ({ id: `source-${visit.id}`, title: visit.title, text: visit.lines.map((line, i) => `Line ${i + 1}. ${line}`).join(' '), kind: 'source' as const, visitId: visit.id })),
    ...TEAM_NARRATION.map(item => ({ ...item, title: item.label, kind: 'handoff' as const })),
    { id: 'time-warning', title: 'Viewing time reminder', text: 'Your private viewing has two minutes or less remaining. Please ask Thomas if you need additional time.', kind: 'announcement' as const },
    { id: 'time-extension', title: 'Extra time confirmed', text: 'Thomas has granted additional viewing time. Your updated timer is shown on screen. The same device and confidentiality terms still apply.', kind: 'announcement' as const },
  ];
}

export function visitorAnnouncement(remaining: number, extended: boolean, warned: boolean) {
  if (extended) return 'time-extension';
  if (!warned && remaining > 0 && remaining <= 120000) return 'time-warning';
  return null;
}