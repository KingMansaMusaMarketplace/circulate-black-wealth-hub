import {
  Crown,
  Landmark,
  Users,
  Megaphone,
  GraduationCap,
  ShieldCheck,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

export interface AgentDivision {
  name: string;
  icon: LucideIcon;
  headcount: number;
  summary: string;
  duties: string[];
  onboardingWeek: string;
}

/**
 * The seven operating divisions of the 42 Agentic AI Employees, as committed
 * in the Enterprise Partnership Dossier. Headcounts total 42.
 */
export const AGENT_DIVISIONS: AgentDivision[] = [
  {
    name: 'Executive Office',
    icon: Crown,
    headcount: 6,
    summary: 'Kayla and her direct reports produce the daily executive brief and run board prep.',
    duties: [
      'Daily executive brief every business day',
      'Quarterly board packet assembled from live data',
      'Cross-division escalation and prioritization',
    ],
    onboardingWeek: 'Week 1',
  },
  {
    name: 'Finance & Stewardship',
    icon: Landmark,
    headcount: 7,
    summary: 'Grant pipeline, budget tracking, and audit-ready financial records.',
    duties: [
      'Scans foundation calendars so deadlines stop slipping',
      'Drafts grant applications end-to-end',
      'Maintains the audit trail and monthly reconciliation',
    ],
    onboardingWeek: 'Weeks 3–4',
  },
  {
    name: 'Member Operations',
    icon: Users,
    headcount: 7,
    summary: 'Renewals, lapsed-member recovery, and chapter roster hygiene.',
    duties: [
      'Automated renewal sequences with a real follow-up cadence',
      'Lapsed-member win-back outreach',
      'Chapter roster and contact data kept current',
    ],
    onboardingWeek: 'Weeks 3–4',
  },
  {
    name: 'Communications',
    icon: Megaphone,
    headcount: 6,
    summary: 'The weekly newsletter and member communications, produced without volunteer hours.',
    duties: [
      'Weekly newsletter drafted, laid out, and scheduled',
      'Event announcements and reminders',
      'Social and press copy on request',
    ],
    onboardingWeek: 'Weeks 5–6',
  },
  {
    name: 'Youth & Programs',
    icon: GraduationCap,
    headcount: 6,
    summary: 'Attendance, outcomes, and consent forms — digital-native instead of paper.',
    duties: [
      'Digitized parental consent and registration forms',
      'Attendance and outcome tracking per program',
      'Program reporting for funders and the board',
    ],
    onboardingWeek: 'Weeks 7–8',
  },
  {
    name: 'Security & Compliance',
    icon: ShieldCheck,
    headcount: 5,
    summary: 'A central access log and background-check status you can actually show a regulator.',
    duties: [
      'Central log of who accessed what, and when',
      'Background-check status tracking',
      'Monthly compliance log delivered automatically',
    ],
    onboardingWeek: 'Weeks 5–6',
  },
  {
    name: 'Impact & Digital Equity',
    icon: BarChart3,
    headcount: 5,
    summary: 'Measures the economic impact of the member-business network.',
    duties: [
      'Member-business directory seeding and verification',
      'Dollar-circulation and impact measurement',
      'Revenue-share reporting transparency',
    ],
    onboardingWeek: 'Weeks 7–8',
  },
];

export const TOTAL_AGENTS = AGENT_DIVISIONS.reduce((sum, d) => sum + d.headcount, 0); // 42
