// Single source of truth for the 42 Kayla services shown on the
// /business-signup Plan Selection card. Counts must total 42.
// Mirrors AI_EMPLOYEES in src/components/business/kayla/KaylaAITeam.tsx
// (kept as a lightweight list — names only — so the signup card stays small).

export interface KaylaServiceGroup {
  department: string;
  label: string;
  services: string[];
}

export const KAYLA_SERVICE_GROUPS: KaylaServiceGroup[] = [
  {
    department: 'EXECUTIVE',
    label: 'Executive (C-Suite)',
    services: [
      'Kayla — CEO / Orchestrator',
      'Revenue Officer (CRO)',
      'Finance Officer (CFO)',
      'Marketing Officer (CMO)',
      'Operations Officer (COO)',
      'Technology Officer (CTO)',
      'Growth Officer (CGO)',
      'IP Shield (Chief IP & Compliance)',
      'Investor Relations Officer',
    ],
  },
  {
    department: 'MARKETING',
    label: 'Marketing',
    services: [
      'Review Manager',
      'SEO Specialist',
      'Brand Monitor',
      'Content Creator',
      'B2B Partnership Scout',
      'Outreach Specialist',
      'PR Strategist',
    ],
  },
  {
    department: 'FINANCE',
    label: 'Finance',
    services: [
      'Bookkeeper',
      'Cash Flow Analyst',
      'Grant Researcher',
      'Credit Advisor',
      'Tax Preparer',
      'Collections Agent',
    ],
  },
  {
    department: 'OPERATIONS',
    label: 'Operations',
    services: [
      'Records Clerk',
      'Loyalty Manager',
      'Supply Chain Lead',
      'Scheduler',
      'Inventory Manager',
      'Legal Drafter',
    ],
  },
  {
    department: 'COMMUNITY',
    label: 'Community',
    services: [
      'Impact Analyst',
      'Diversity Compliance Officer',
      'QR Loyalty Engineer',
      'Events Coordinator',
      'Mentorship Scout',
    ],
  },
  {
    department: 'HOSPITALITY',
    label: 'Hospitality (Mansa Stays)',
    services: [
      'Stays Concierge',
      'Pricing Optimizer',
      'Maintenance Reminder',
    ],
  },
  {
    department: 'MOBILITY',
    label: 'Mobility (Noire Rideshare)',
    services: [
      'Driver Dispatcher',
    ],
  },
  {
    department: 'AUTOMATION',
    label: 'Automation',
    services: [
      'Calendar Sync',
      'Workflow Architect',
      'Trigger Monitor',
    ],
  },
  {
    department: 'RISK',
    label: 'Risk & Compliance',
    services: [
      'Tax Risk Strategist',
      'Compliance Guardian',
    ],
  },
];

export const KAYLA_SERVICE_TOTAL = KAYLA_SERVICE_GROUPS.reduce(
  (sum, g) => sum + g.services.length,
  0,
);
