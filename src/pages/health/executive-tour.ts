export const EXECUTIVE_TOUR_STEPS = [
  { id: 'prep', tab: 'prep', title: 'Before the visit', label: 'Chart prep', seconds: 30, detail: 'Prior findings and missing information · current status unverified' },
  { id: 'draft', tab: 'notes', title: 'During the visit', label: 'Note draft', seconds: 45, detail: 'Fictional transcript → source-linked draft · live recording locked' },
  { id: 'review', tab: 'notes', title: 'Doctor review', label: 'Review & report', seconds: 30, detail: 'Doctor decision required · report available only after sign-off' },
  { id: 'care', tab: 'care', title: 'After the visit', label: 'Care guide', seconds: 15, detail: 'English and Spanish drafts · patient delivery locked' },
] as const;

export type ExecutiveTourTab = typeof EXECUTIVE_TOUR_STEPS[number]['tab'];