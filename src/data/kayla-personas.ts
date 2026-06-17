/**
 * Canonical persona roster — Kayla + 41 specialists = 42 Agentic AI Employees.
 *
 * Source of truth for persona NAMES that appear in the Complete Platform
 * Manual (v58+). Each persona maps to a functional agent role that lives
 * elsewhere in the codebase (see `src/lib/kayla-agent-router.ts` and the
 * Kayla*.tsx components under `src/components/business/kayla/`).
 *
 * Personas are the presentation layer; routes/components are the
 * implementation layer. Adding a new persona here does NOT create a new
 * agent — it gives an existing functional role a name and bio.
 */

export type PersonaDept =
  | 'Leadership'
  | 'Growth & Marketing'
  | 'Sales & Revenue'
  | 'Customer Success'
  | 'Operations & Finance'
  | 'Product, Data & Engineering'
  | 'Brand, Legal & People'
  | 'Hospitality'
  | 'Mobility'
  | 'Automation'
  | 'Risk';

export interface Persona {
  /** Stable id; lowercase, no spaces */
  id: string;
  /** Display name as it appears in the manual */
  name: string;
  /** Functional role */
  role: string;
  department: PersonaDept;
  /** One-line description from the manual */
  tagline: string;
  /** Functional route id from kayla-agent-router.ts (if applicable) */
  routeId?: string;
}

export const KAYLA: Persona = {
  id: 'kayla',
  name: 'Kayla',
  role: 'Chief AI Officer · Orchestrator',
  department: 'Leadership',
  tagline:
    'CEO of the AI workforce. Coordinates all 41 specialists, owns the customer relationship, and routes work across departments.',
  routeId: 'kayla',
};

export const PERSONAS: Persona[] = [
  // Growth & Marketing (6)
  { id: 'aria',  name: 'Aria',  role: 'Brand & Content Strategist',  department: 'Growth & Marketing', tagline: 'Owns brand voice, content calendar, and long-form drafts. The verbal identity every other agent inherits.' },
  { id: 'nova',  name: 'Nova',  role: 'Performance Marketer',        department: 'Growth & Marketing', tagline: 'Paid acquisition, A/B testing, and channel attribution — running 24 hours a day.', routeId: 'social' },
  { id: 'lena',  name: 'Lena',  role: 'SEO Specialist',              department: 'Growth & Marketing', tagline: 'Keyword research, on-page optimization, schema, and sitemap — compounding organic leverage.', routeId: 'seo' },
  { id: 'mira',  name: 'Mira',  role: 'Social Media Manager',        department: 'Growth & Marketing', tagline: 'Multi-platform scheduling, replies, and trend monitoring. Keeps the brand culturally fluent.', routeId: 'social' },
  { id: 'ezra',  name: 'Ezra',  role: 'Email & Lifecycle',           department: 'Growth & Marketing', tagline: 'Drip campaigns, segmentation, deliverability monitoring — the highest-ROI channel for SMB.' },
  { id: 'iris',  name: 'Iris',  role: 'PR & Outreach',               department: 'Growth & Marketing', tagline: 'Press lists, pitch drafting, mention tracking. Industrializes earned media.' },

  // Sales & Revenue (5)
  { id: 'theo',  name: 'Theo',  role: 'Sales Development Rep',       department: 'Sales & Revenue',    tagline: 'Inbound qualification, meeting booking, CRM hygiene. Never misses the 5-minute SLA.' },
  { id: 'cole',  name: 'Cole',  role: 'Account Executive',           department: 'Sales & Revenue',    tagline: 'Pipeline progression, proposal drafts, follow-ups.' },
  { id: 'vera',  name: 'Vera',  role: 'Revenue Operations',          department: 'Sales & Revenue',    tagline: 'Forecasting, pipeline analytics, attribution reporting.' },
  { id: 'sam',   name: 'Sam',   role: 'Partnerships',                department: 'Sales & Revenue',    tagline: 'Co-marketing, channel deals, referral pipelines.', routeId: 'b2b' },
  { id: 'quinn', name: 'Quinn', role: 'Pricing & Packaging',         department: 'Sales & Revenue',    tagline: 'A/B price tests, discount governance, churn-pricing experiments.', routeId: 'price-strategy' },

  // Customer Success (4)
  { id: 'maya',  name: 'Maya',  role: 'Customer Success Manager',    department: 'Customer Success',   tagline: 'Onboarding, health scoring, and expansion playbooks.', routeId: 'segments' },
  { id: 'rio',   name: 'Rio',   role: 'Tier-1 Support',              department: 'Customer Success',   tagline: 'FAQ resolution, ticket triage, knowledge-base updates.' },
  { id: 'joss',  name: 'Joss',  role: 'Tier-2 Support',              department: 'Customer Success',   tagline: 'Technical troubleshooting and root-cause analysis.' },
  { id: 'beck',  name: 'Beck',  role: 'Community Manager',           department: 'Customer Success',   tagline: 'Forum moderation, advocate program, user-research synthesis.', routeId: 'loyalty' },

  // Operations & Finance (5)
  { id: 'dax',   name: 'Dax',   role: 'Operations Analyst',          department: 'Operations & Finance', tagline: 'KPI dashboards, anomaly alerts, weekly business review.' },
  { id: 'faye',  name: 'Faye',  role: 'Bookkeeping',                 department: 'Operations & Finance', tagline: 'Reconciliation, invoice automation, expense categorization.' },
  { id: 'owen',  name: 'Owen',  role: 'Financial Planning',          department: 'Operations & Finance', tagline: 'Forecast modeling, variance analysis, cash-runway alerts.', routeId: 'cashflow' },
  { id: 'pia',   name: 'Pia',   role: 'Procurement',                 department: 'Operations & Finance', tagline: 'Vendor sourcing, contract review, renewal monitoring.' },
  { id: 'reed',  name: 'Reed',  role: 'Compliance & Tax',            department: 'Operations & Finance', tagline: 'Filing reminders, sales-tax automation, audit prep.', routeId: 'tax' },

  // Product, Data & Engineering (5)
  { id: 'kit',   name: 'Kit',   role: 'Product Analyst',             department: 'Product, Data & Engineering', tagline: 'Funnel analysis, cohort retention, feature-impact reports.' },
  { id: 'tess',  name: 'Tess',  role: 'Data Engineer',               department: 'Product, Data & Engineering', tagline: 'Pipeline maintenance, schema evolution, freshness monitoring.' },
  { id: 'wes',   name: 'Wes',   role: 'QA & Release Engineer',       department: 'Product, Data & Engineering', tagline: 'Regression suites, release notes, smoke tests.' },
  { id: 'zane',  name: 'Zane',  role: 'DevSecOps',                   department: 'Product, Data & Engineering', tagline: 'Security scans, dependency hygiene, RLS policy review.' },
  { id: 'june',  name: 'June',  role: 'ML & Personalization',        department: 'Product, Data & Engineering', tagline: 'Recommendation tuning, ranking models, A/B harness.' },

  // Brand, Legal & People (8)
  { id: 'hugo',  name: 'Hugo',  role: 'Legal Drafting',              department: 'Brand, Legal & People', tagline: 'Contract templates, NDA flow, policy review.', routeId: 'legal' },
  { id: 'ines',  name: 'Ines',  role: 'Talent & Recruiting',         department: 'Brand, Legal & People', tagline: 'JD drafting, candidate screening, interview kits.' },
  { id: 'luca',  name: 'Luca',  role: 'People Ops',                  department: 'Brand, Legal & People', tagline: 'Onboarding, payroll questions, policy lookups.' },
  { id: 'olive', name: 'Olive', role: 'DEI & Culture',               department: 'Brand, Legal & People', tagline: 'Climate surveys, inclusive-language audits, ERG support.' },
  { id: 'pace',  name: 'Pace',  role: 'Executive Assistant',         department: 'Brand, Legal & People', tagline: 'Calendar, travel, and briefing notes for the owner. Chief-of-staff function.' },
  { id: 'rae',   name: 'Rae',   role: 'Investor Relations',          department: 'Brand, Legal & People', tagline: 'Monthly update drafts, KPI snapshots, NDA-gated data room.', routeId: 'investor' },
  { id: 'saga',  name: 'Saga',  role: 'Brand Storyteller',           department: 'Brand, Legal & People', tagline: 'Founding-narrative content, case studies, video scripts.' },
  { id: 'tor',   name: 'Tor',   role: 'Localization',                department: 'Brand, Legal & People', tagline: 'Multi-language content, regional compliance flags.' },

  // Hospitality (3) — v32 expansion
  { id: 'stays-concierge',  name: 'Soli', role: 'Stays Concierge',  department: 'Hospitality', tagline: 'Guest messaging, check-in automation, host playbooks for Mansa Stays.', routeId: 'stays-concierge' },
  { id: 'pricing-optimizer', name: 'Rev', role: 'Pricing Optimizer', department: 'Hospitality', tagline: 'Dynamic nightly + long-stay pricing tuned to occupancy and demand.', routeId: 'pricing' },
  { id: 'calendar-sync',    name: 'Cal',  role: 'Calendar Sync',    department: 'Hospitality', tagline: 'iCal multi-platform reconciliation; prevents double-bookings.', routeId: 'calendar-sync' },

  // Mobility (3)
  { id: 'driver-dispatch',  name: 'Dash', name_alt: undefined as any, role: 'Driver Dispatcher', department: 'Mobility', tagline: 'Route optimization and driver matching for Noire Rideshare.', routeId: 'driver-dispatch' } as Persona,
  { id: 'tax-1099',         name: 'Tex',  role: 'Tax Prep (1099)',  department: 'Mobility',    tagline: 'Quarterly tax estimates for independent drivers.', routeId: 'tax' },
  { id: 'maintenance',      name: 'Mech', role: 'Maintenance Reminder', department: 'Mobility', tagline: 'Vehicle service intervals and alerts.', routeId: 'maintenance' },

  // Automation (2)
  { id: 'workflow-architect', name: 'Flo', role: 'Workflow Architect', department: 'Automation', tagline: 'Visual workflow generation and debugging — no-code playbooks.', routeId: 'workflow-architect' },
  { id: 'trigger-monitor',    name: 'Trig', role: 'Trigger Monitor',   department: 'Automation', tagline: 'Webhook + cron + DB-event router. Always-on signal layer.', routeId: 'trigger-monitor' },

  // Risk (1)
  { id: 'compliance-guardian', name: 'Gard', role: 'Compliance Guardian', department: 'Risk', tagline: 'KYC, W9, GDPR/CCPA, age-gate enforcement.', routeId: 'compliance-guardian' },
];

export const ALL_PERSONAS: Persona[] = [KAYLA, ...PERSONAS];

/** Total agentic AI employee count — must always equal 42. */
export const PERSONA_COUNT = ALL_PERSONAS.length;

/** Look up persona by functional route id (e.g. 'seo' -> Lena). */
export function personaByRouteId(routeId: string): Persona | undefined {
  return ALL_PERSONAS.find((p) => p.routeId === routeId);
}

/** Group personas by department for UI rendering. */
export function personasByDepartment(): Record<PersonaDept, Persona[]> {
  return ALL_PERSONAS.reduce((acc, p) => {
    (acc[p.department] ||= []).push(p);
    return acc;
  }, {} as Record<PersonaDept, Persona[]>);
}
