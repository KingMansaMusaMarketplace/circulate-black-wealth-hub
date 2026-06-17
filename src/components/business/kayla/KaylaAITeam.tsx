import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, MessageSquare, Search, Eye, Globe, DollarSign, CreditCard, Scale,
  FileText, Gift, Handshake, Heart, Calendar, Receipt, QrCode, TrendingUp,
  BarChart3, Mic, Megaphone, Zap, UserPlus, CheckCircle2, Clock, Briefcase,
  ChevronDown, ChevronUp, Sparkles, Crown, ShieldCheck, Cpu, Rocket, Lock,
  BookOpen, Boxes, Mail, Target, Building2, Newspaper, Sprout, Users,
  Home, Car, Wrench, Workflow, Bell, Shield, Tag
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ALL_PERSONAS, KAYLA, personasByDepartment, PERSONA_COUNT } from '@/data/kayla-personas';

interface AIEmployee {
  id: string;
  icon: React.ElementType;
  name: string;
  role: string;
  department: string;
  description: string;
  capabilities: string[];
  status: 'active' | 'available' | 'coming_soon';
  savingsPerMonth: string;
  badge: string;
}

const AI_EMPLOYEES: AIEmployee[] = [
  {
    id: 'review-manager',
    icon: MessageSquare,
    name: 'Review Manager',
    role: 'Customer Relations',
    department: 'MARKETING',
    description: 'Reads, analyzes, and responds to every review with professional, brand-consistent messaging.',
    capabilities: ['Instant professional responses', 'Sentiment analysis', 'Reputation score tracking', 'Escalation for critical feedback'],
    status: 'active',
    savingsPerMonth: '$400',
    badge: 'MARKETING',
  },
  {
    id: 'seo-specialist',
    icon: Search,
    name: 'SEO Specialist',
    role: 'Search Optimization',
    department: 'MARKETING',
    description: 'Monitors and optimizes your visibility with real-time scoring and actionable tips.',
    capabilities: ['Visibility Score (0–100)', 'Profile completeness analysis', 'Keyword optimization', 'Local search boosts'],
    status: 'active',
    savingsPerMonth: '$300',
    badge: 'MARKETING',
  },
  {
    id: 'brand-monitor',
    icon: Eye,
    name: 'Brand Monitor',
    role: 'Reputation Intelligence',
    department: 'MARKETING',
    description: 'Scans the web for brand mentions, news, and social tags using real-time AI intelligence.',
    capabilities: ['Web mention tracking', 'Sentiment scoring (0–1)', 'Draft response generation', 'Competitive benchmarking'],
    status: 'active',
    savingsPerMonth: '$350',
    badge: 'MARKETING',
  },
  {
    id: 'social-content',
    icon: Megaphone,
    name: 'Content Creator',
    role: 'Social Media & Content',
    department: 'MARKETING',
    description: 'Generates social media posts, email campaigns, and marketing copy tailored to your brand.',
    capabilities: ['Social post generation', 'Email campaign drafts', 'Brand voice matching', 'Content calendar'],
    status: 'active',
    savingsPerMonth: '$500',
    badge: 'MARKETING',
  },
  {
    id: 'bookkeeper',
    icon: Receipt,
    name: 'Bookkeeper',
    role: 'Financial Management',
    department: 'FINANCE',
    description: 'Full accounting suite with profit & loss, invoice tracking, and bank reconciliation.',
    capabilities: ['P&L statements', 'Invoice & expense tracking', 'Bank reconciliation', 'Tax rate management'],
    status: 'active',
    savingsPerMonth: '$600',
    badge: 'FINANCE',
  },
  {
    id: 'cash-flow-analyst',
    icon: DollarSign,
    name: 'Cash Flow Analyst',
    role: 'Financial Forecasting',
    department: 'FINANCE',
    description: 'AI-powered financial predictions with 30/60/90-day projections and runway alerts.',
    capabilities: ['Revenue trend analysis', 'Expense pattern detection', 'Cash runway alerts', '30/60/90-day projections'],
    status: 'active',
    savingsPerMonth: '$400',
    badge: 'FINANCE',
  },
  {
    id: 'grant-researcher',
    icon: CreditCard,
    name: 'Grant Researcher',
    role: 'Funding & Grants',
    department: 'FINANCE',
    description: 'Finds grants and funding opportunities tailored to your business with eligibility scoring.',
    capabilities: ['AI-matched grants', 'Eligibility screening', 'Deadline tracking', 'Success probability scoring'],
    status: 'active',
    savingsPerMonth: '$300',
    badge: 'FINANCE',
  },
  {
    id: 'credit-advisor',
    icon: Scale,
    name: 'Credit Advisor',
    role: 'Lending Readiness',
    department: 'FINANCE',
    description: 'Prepares your business for financing with credit readiness scoring and lender matching.',
    capabilities: ['Credit readiness score', 'Document prep checklist', 'Lender matching', 'Financial benchmarks'],
    status: 'active',
    savingsPerMonth: '$250',
    badge: 'FINANCE',
  },
  {
    id: 'records-clerk',
    icon: FileText,
    name: 'Records Clerk',
    role: 'Document Management',
    department: 'OPERATIONS',
    description: 'AI-powered document vault with OCR, semantic search, and compliance monitoring.',
    capabilities: ['Auto-extract metadata', 'Expiration monitoring', 'Natural language search', 'Compliance alerts'],
    status: 'active',
    savingsPerMonth: '$300',
    badge: 'OPERATIONS',
  },
  {
    id: 'loyalty-manager',
    icon: Gift,
    name: 'Loyalty Manager',
    role: 'Customer Retention',
    department: 'OPERATIONS',
    description: 'Automated tiered rewards system with points multipliers and customer engagement.',
    capabilities: ['4-tier loyalty system', 'Points multipliers (up to 2x)', 'Auto tier progression', '8+ reward templates'],
    status: 'active',
    savingsPerMonth: '$350',
    badge: 'OPERATIONS',
  },
  {
    id: 'supply-chain',
    icon: Handshake,
    name: 'Supply Chain Lead',
    role: 'B2B & Supplier Diversity',
    department: 'OPERATIONS',
    description: 'Monitors and grows your community supply chain with B2B matching and diversity reporting.',
    capabilities: ['B2B connection matching', 'Diversity spend reporting', 'Supplier performance', 'Economic multiplier'],
    status: 'active',
    savingsPerMonth: '$250',
    badge: 'OPERATIONS',
  },
  {
    id: 'community-impact',
    icon: Heart,
    name: 'Impact Analyst',
    role: 'Community Scorecard',
    department: 'COMMUNITY',
    description: 'Measures and showcases your community contribution with the CMAL scoring system.',
    capabilities: ['CMAL score (0–1000)', 'Impact badges', 'Engagement metrics', 'Public impact profile'],
    status: 'active',
    savingsPerMonth: '$200',
    badge: 'COMMUNITY',
  },
  {
    id: 'scheduler',
    icon: Calendar,
    name: 'Scheduler',
    role: 'Appointment Management',
    department: 'OPERATIONS',
    description: 'Handles 24/7 online booking with confirmations, reminders, and calendar sync.',
    capabilities: ['Online booking anytime', 'Auto confirmations', 'Calendar sync', 'No-show reduction'],
    status: 'active',
    savingsPerMonth: '$300',
    badge: 'OPERATIONS',
  },
  {
    id: 'tax-preparer',
    icon: BarChart3,
    name: 'Tax Preparer',
    role: 'Tax Compliance',
    department: 'FINANCE',
    description: 'Organizes tax documents, tracks deductions, and prepares summaries for filing.',
    capabilities: ['Deduction tracking', 'Document organization', 'Filing summaries', 'Quarterly estimates'],
    status: 'active',
    savingsPerMonth: '$400',
    badge: 'FINANCE',
  },
  {
    id: 'diversity-compliance',
    icon: Scale,
    name: 'Diversity Compliance Officer',
    role: 'EEO & Supplier Diversity Specialist',
    department: 'COMMUNITY',
    description: 'Ensures your business is compliant and competitive for government contracts and corporate supplier diversity programs.',
    capabilities: ['EEO & OFCCP contract readiness scans', 'Auto-generated D&I impact reports', 'Bias interruption on job posts & marketing copy', 'MBE/WBE certification renewal tracking'],
    status: 'active',
    savingsPerMonth: '$1,200',
    badge: 'COMMUNITY',
  },
  {
    id: 'b2b-partnership-scout',
    icon: UserPlus,
    name: 'B2B Partnership Scout',
    role: 'Strategic Alliances & Lead Generation',
    department: 'MARKETING',
    description: 'Acts as a 24/7 business development rep, finding win-win collaborations within the 1325.ai ecosystem.',
    capabilities: ['Give/Get ecosystem matchmaking', 'Trust-building partnership outreach', 'Trigger event monitoring (funding rounds, relocations)', 'Trust Equity KPI tracking'],
    status: 'active',
    savingsPerMonth: '$1,850',
    badge: 'MARKETING',
  },
  // ============================================================
  // EXECUTIVE — Kayla #01 (CEO) + 8 C-Suite (#02–#09)
  // ============================================================
  {
    id: 'kayla-ceo',
    icon: Crown,
    name: 'Kayla',
    role: 'Chief Executive — Master Orchestrator',
    department: 'EXECUTIVE',
    description: 'Coordinates the full 42-agent team, holds shared business memory, and routes work to the right specialist.',
    capabilities: ['Cross-agent orchestration', 'Shared business context', 'Decision logging', 'Weekly learnings digest'],
    status: 'active',
    savingsPerMonth: '$2,500',
    badge: 'EXECUTIVE',
  },
  {
    id: 'cro-agent',
    icon: TrendingUp,
    name: 'Revenue Officer',
    role: 'Chief Revenue Officer',
    department: 'EXECUTIVE',
    description: 'Owns the top-line. Synthesizes pipeline, pricing, and partnership signals into a weekly revenue plan.',
    capabilities: ['Pipeline synthesis', 'Pricing recommendations', 'Win/loss analysis', 'Quarterly revenue plan'],
    status: 'active',
    savingsPerMonth: '$1,800',
    badge: 'EXECUTIVE',
  },
  {
    id: 'cfo-agent',
    icon: DollarSign,
    name: 'Finance Officer',
    role: 'Chief Financial Officer',
    department: 'EXECUTIVE',
    description: 'Reviews bookkeeping, cash-flow, and grant outputs to deliver a unified weekly financial briefing.',
    capabilities: ['Unified financial briefing', 'Runway oversight', 'Capital strategy', 'Board-ready summaries'],
    status: 'active',
    savingsPerMonth: '$2,000',
    badge: 'EXECUTIVE',
  },
  {
    id: 'cmo-agent',
    icon: Megaphone,
    name: 'Marketing Officer',
    role: 'Chief Marketing Officer',
    department: 'EXECUTIVE',
    description: 'Owns brand voice and campaign mix across SEO, content, reviews, and outreach.',
    capabilities: ['Campaign orchestration', 'Brand voice guardrails', 'Channel mix recommendations', 'Quarterly marketing plan'],
    status: 'active',
    savingsPerMonth: '$1,800',
    badge: 'EXECUTIVE',
  },
  {
    id: 'coo-agent',
    icon: Briefcase,
    name: 'Operations Officer',
    role: 'Chief Operating Officer',
    department: 'EXECUTIVE',
    description: 'Watches scheduling, inventory, supply chain, and records to flag bottlenecks before they hurt revenue.',
    capabilities: ['Bottleneck detection', 'SOP recommendations', 'Vendor performance review', 'Operational KPI dashboard'],
    status: 'active',
    savingsPerMonth: '$1,600',
    badge: 'EXECUTIVE',
  },
  {
    id: 'cto-agent',
    icon: Cpu,
    name: 'Technology Officer',
    role: 'Chief Technology Officer',
    department: 'EXECUTIVE',
    description: 'Oversees website, integrations, and data hygiene. Recommends tooling upgrades and automations.',
    capabilities: ['Integration health checks', 'Data hygiene audits', 'Tool consolidation advice', 'Automation roadmap'],
    status: 'active',
    savingsPerMonth: '$1,400',
    badge: 'EXECUTIVE',
  },
  {
    id: 'cgo-agent',
    icon: Rocket,
    name: 'Growth Officer',
    role: 'Chief Growth Officer',
    department: 'EXECUTIVE',
    description: 'Hunts new markets, partnerships, and ecosystem leverage points across 1325.AI.',
    capabilities: ['Market expansion analysis', 'Ecosystem leverage maps', 'Partnership scoring', 'Growth experiment design'],
    status: 'active',
    savingsPerMonth: '$1,500',
    badge: 'EXECUTIVE',
  },
  {
    id: 'ip-shield-agent',
    icon: ShieldCheck,
    name: 'IP Shield',
    role: 'Chief IP & Compliance Officer',
    department: 'EXECUTIVE',
    description: 'Protects trademarks, patents, and contracts. Watches for infringement and compliance gaps.',
    capabilities: ['Trademark monitoring', 'Contract risk scan', 'Compliance gap alerts', 'IP filing prep'],
    status: 'active',
    savingsPerMonth: '$1,800',
    badge: 'EXECUTIVE',
  },
  {
    id: 'ir-agent',
    icon: Users,
    name: 'Investor Relations Officer',
    role: 'Chief Investor Relations Officer',
    department: 'EXECUTIVE',
    description: 'Maintains investor-ready data room, KPI snapshots, and quarterly update drafts.',
    capabilities: ['Data room curation', 'KPI snapshot generation', 'Quarterly investor letter drafts', 'Cap table hygiene'],
    status: 'active',
    savingsPerMonth: '$1,500',
    badge: 'EXECUTIVE',
  },
  // ============================================================
  // ADDITIONAL SPECIALISTS — completing the 24-specialist roster
  // ============================================================
  {
    id: 'email-outreach',
    icon: Mail,
    name: 'Outreach Specialist',
    role: 'Email & Cold Outreach',
    department: 'MARKETING',
    description: 'Drafts and sequences personalized outreach emails to prospects, press, and partners.',
    capabilities: ['Personalized email drafts', 'Multi-step sequences', 'Reply detection', 'A/B subject testing'],
    status: 'active',
    savingsPerMonth: '$450',
    badge: 'MARKETING',
  },
  {
    id: 'press-pr',
    icon: Newspaper,
    name: 'PR Strategist',
    role: 'Media & Press Relations',
    department: 'MARKETING',
    description: 'Identifies press opportunities, drafts pitches, and tracks earned media coverage.',
    capabilities: ['Journalist matching', 'Pitch drafting', 'Coverage tracking', 'Press kit maintenance'],
    status: 'active',
    savingsPerMonth: '$500',
    badge: 'MARKETING',
  },
  {
    id: 'invoice-collector',
    icon: Target,
    name: 'Collections Agent',
    role: 'Accounts Receivable',
    department: 'FINANCE',
    description: 'Chases overdue invoices with polite, escalating reminders and payment links.',
    capabilities: ['Aging report monitoring', 'Auto-reminder cadence', 'Payment link generation', 'Escalation routing'],
    status: 'active',
    savingsPerMonth: '$350',
    badge: 'FINANCE',
  },
  {
    id: 'inventory-manager',
    icon: Boxes,
    name: 'Inventory Manager',
    role: 'Stock & Supplies',
    department: 'OPERATIONS',
    description: 'Tracks stock levels, reorder points, and supplier lead times to prevent stockouts.',
    capabilities: ['Reorder alerts', 'Lead-time tracking', 'Demand forecasting', 'Supplier performance scoring'],
    status: 'active',
    savingsPerMonth: '$400',
    badge: 'OPERATIONS',
  },
  {
    id: 'legal-drafter',
    icon: BookOpen,
    name: 'Legal Drafter',
    role: 'Contracts & Templates',
    department: 'OPERATIONS',
    description: 'Generates first-pass NDAs, MSAs, vendor agreements, and policy docs from your business profile.',
    capabilities: ['Contract templates', 'Clause library', 'Risk highlights', 'Plain-English summaries'],
    status: 'active',
    savingsPerMonth: '$600',
    badge: 'OPERATIONS',
  },
  {
    id: 'qr-loyalty-engineer',
    icon: QrCode,
    name: 'QR Loyalty Engineer',
    role: 'Scan-to-Earn Pipeline',
    department: 'COMMUNITY',
    description: 'Operates the in-store QR scan-to-earn pipeline with anti-fraud cooldowns and live tier updates.',
    capabilities: ['Atomic award pipeline', '24h per-user cooldown', 'Tier progression', 'Fraud signal detection'],
    status: 'active',
    savingsPerMonth: '$200',
    badge: 'COMMUNITY',
  },
  {
    id: 'events-coordinator',
    icon: Calendar,
    name: 'Events Coordinator',
    role: 'Pop-ups & Community Events',
    department: 'COMMUNITY',
    description: 'Plans, promotes, and tracks RSVPs for community events and Mansa Stays activations.',
    capabilities: ['Event page generation', 'RSVP tracking', 'Promo cross-posting', 'Post-event impact report'],
    status: 'active',
    savingsPerMonth: '$300',
    badge: 'COMMUNITY',
  },
  {
    id: 'mentorship-scout',
    icon: Sprout,
    name: 'Mentorship Scout',
    role: 'Founder Coaching Match',
    department: 'COMMUNITY',
    description: 'Matches owners with mentors, peer founders, and corporate sponsors inside the 1325.AI ecosystem.',
    capabilities: ['Mentor matching', 'Peer cohort formation', 'Sponsor introductions', 'Office-hours scheduling'],
    status: 'active',
    savingsPerMonth: '$250',
    badge: 'COMMUNITY',
  },
  // ============================================================
  // EXPANSION TIER (v32 — Agents #34–#42): Hospitality, Mobility,
  // Automation, and Risk specialists added June 2026.
  // ============================================================
  {
    id: 'stays-concierge',
    icon: Home,
    name: 'Stays Concierge',
    role: 'Guest Experience — Mansa Stays',
    department: 'HOSPITALITY',
    description: 'Handles guest messaging, check-in instructions, and 5-star recovery for every Mansa Stays booking.',
    capabilities: ['24/7 guest messaging', 'Auto check-in / check-out flows', 'Review prompt timing', 'Issue triage & host alerts'],
    status: 'active',
    savingsPerMonth: '$650',
    badge: 'HOSPITALITY',
  },
  {
    id: 'pricing-optimizer',
    icon: Tag,
    name: 'Pricing Optimizer',
    role: 'Dynamic Rate Engine',
    department: 'HOSPITALITY',
    description: 'Adjusts nightly rates based on demand, local events, comp-set, and seasonality to maximize RevPAR.',
    capabilities: ['Demand forecasting', 'Event-driven surge pricing', 'Comp-set monitoring', 'Min-stay optimization'],
    status: 'active',
    savingsPerMonth: '$550',
    badge: 'HOSPITALITY',
  },
  {
    id: 'maintenance-reminder',
    icon: Wrench,
    name: 'Maintenance Reminder',
    role: 'Property & Asset Upkeep',
    department: 'HOSPITALITY',
    description: 'Tracks recurring maintenance, cleaning turns, and inspection cycles so nothing slips between guests.',
    capabilities: ['Turnover scheduling', 'Preventive maintenance alerts', 'Vendor dispatch', 'Photo-verified completions'],
    status: 'active',
    savingsPerMonth: '$300',
    badge: 'HOSPITALITY',
  },
  {
    id: 'driver-dispatcher',
    icon: Car,
    name: 'Driver Dispatcher',
    role: 'Mobility — Noire Rideshare',
    department: 'MOBILITY',
    description: 'Matches riders to drivers, balances supply & demand, and routes airport / event surges in real time.',
    capabilities: ['Real-time matching', 'Surge zone forecasting', 'Driver heatmaps', 'Incident escalation'],
    status: 'active',
    savingsPerMonth: '$800',
    badge: 'MOBILITY',
  },
  {
    id: 'calendar-sync',
    icon: Calendar,
    name: 'Calendar Sync',
    role: 'Cross-Platform Scheduling',
    department: 'AUTOMATION',
    description: 'Keeps Google, Outlook, Stays, and booking calendars in sync to prevent double-bookings and missed slots.',
    capabilities: ['Two-way calendar sync', 'Conflict resolution', 'Buffer-time rules', 'Multi-team visibility'],
    status: 'active',
    savingsPerMonth: '$250',
    badge: 'AUTOMATION',
  },
  {
    id: 'workflow-architect',
    icon: Workflow,
    name: 'Workflow Architect',
    role: 'No-Code Automation Builder',
    department: 'AUTOMATION',
    description: 'Designs and deploys multi-step automations (Zapier-style) across your tools without writing code.',
    capabilities: ['Visual workflow builder', 'Multi-app integrations', 'Conditional branching', 'Run history & rollback'],
    status: 'active',
    savingsPerMonth: '$700',
    badge: 'AUTOMATION',
  },
  {
    id: 'trigger-monitor',
    icon: Bell,
    name: 'Trigger Monitor',
    role: 'Event-Driven Alerts',
    department: 'AUTOMATION',
    description: 'Watches signals — funding rounds, news mentions, inventory thresholds — and fires the right playbook.',
    capabilities: ['Custom trigger rules', 'Signal aggregation', 'Auto-playbook execution', 'Slack / email notifications'],
    status: 'active',
    savingsPerMonth: '$400',
    badge: 'AUTOMATION',
  },
  {
    id: 'tax-risk-strategist',
    icon: BarChart3,
    name: 'Tax Risk Strategist',
    role: 'Quarterly Tax & Audit Defense',
    department: 'RISK',
    description: 'Models quarterly tax exposure, flags audit-risk patterns, and prepares defensible documentation.',
    capabilities: ['Quarterly estimate modeling', 'Audit-risk scoring', 'Document defensibility check', 'Nexus & multi-state alerts'],
    status: 'active',
    savingsPerMonth: '$550',
    badge: 'RISK',
  },
  {
    id: 'compliance-guardian',
    icon: Shield,
    name: 'Compliance Guardian',
    role: 'Regulatory & Policy Watchdog',
    department: 'RISK',
    description: 'Continuously scans federal, state, and industry rules that affect your business and prepares response steps.',
    capabilities: ['Reg change monitoring', 'Industry-specific rule sets', 'Policy update drafts', 'Filing deadline tracking'],
    status: 'active',
    savingsPerMonth: '$900',
    badge: 'RISK',
  },
];

const DEPARTMENTS = ['ALL', 'EXECUTIVE', 'MARKETING', 'FINANCE', 'OPERATIONS', 'COMMUNITY', 'HOSPITALITY', 'MOBILITY', 'AUTOMATION', 'RISK'] as const;

const departmentColors: Record<string, string> = {
  EXECUTIVE: 'bg-mansagold/20 text-mansagold border-mansagold/40',
  MARKETING: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  FINANCE: 'bg-green-500/20 text-green-400 border-green-500/30',
  OPERATIONS: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  COMMUNITY: 'bg-red-500/20 text-red-400 border-red-500/30',
  HOSPITALITY: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  MOBILITY: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  AUTOMATION: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  RISK: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
};

const departmentIcons: Record<string, React.ElementType> = {
  EXECUTIVE: Crown,
  MARKETING: Megaphone,
  FINANCE: DollarSign,
  OPERATIONS: Briefcase,
  COMMUNITY: Heart,
  HOSPITALITY: Home,
  MOBILITY: Car,
  AUTOMATION: Workflow,
  RISK: Shield,
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  available: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  coming_soon: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

interface Props {
  businessId: string;
  onEmployeeSelect?: (employeeId: string) => void;
}

export const KaylaAITeam: React.FC<Props> = ({ businessId, onEmployeeSelect }) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedDept === 'ALL' 
    ? AI_EMPLOYEES 
    : AI_EMPLOYEES.filter(e => e.department === selectedDept);

  const totalSavings = AI_EMPLOYEES
    .filter(e => e.status === 'active')
    .reduce((sum, e) => sum + parseInt(e.savingsPerMonth.replace(/[^0-9]/g, '')), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-7 h-7 text-mansagold" />
            Your AI Team
          </h2>
          <p className="text-white/60 text-sm mt-1">
            {AI_EMPLOYEES.filter(e => e.status === 'active').length} AI employees working 24/7 — replacing{' '}
            <span className="text-mansagold font-semibold">${totalSavings.toLocaleString()}/mo</span> in human labor
          </p>
        </div>

        {/* Department Filter */}
        <div className="flex gap-2 flex-wrap">
          {DEPARTMENTS.map(dept => {
            const DeptIcon = dept !== 'ALL' ? departmentIcons[dept] : Sparkles;
            return (
              <Button
                key={dept}
                variant="outline"
                size="sm"
                onClick={() => setSelectedDept(dept)}
                className={cn(
                  'border-white/10 text-white/60 hover:text-white transition-all text-xs',
                  selectedDept === dept && 'bg-mansagold/20 text-mansagold border-mansagold/40'
                )}
              >
                {DeptIcon && <DeptIcon className="w-3.5 h-3.5 mr-1" />}
                {dept === 'ALL' ? 'All Departments' : dept.charAt(0) + dept.slice(1).toLowerCase()}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((employee, index) => {
            const Icon = employee.icon;
            const isExpanded = expandedId === employee.id;

            return (
              <motion.div
                key={employee.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={cn(
                    'bg-slate-900/60 border-white/10 hover:border-mansagold/30 transition-all cursor-pointer group',
                    isExpanded && 'border-mansagold/40 ring-1 ring-mansagold/20'
                  )}
                  onClick={() => setExpandedId(isExpanded ? null : employee.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mansagold/20 to-amber-500/10 flex items-center justify-center border border-mansagold/20">
                          <Icon className="w-5 h-5 text-mansagold" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm group-hover:text-mansagold transition-colors">
                            {employee.name}
                          </h3>
                          <p className="text-xs text-white/50">{employee.role}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0', departmentColors[employee.department])}>
                          {employee.department}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] text-emerald-400">Active</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-white/60 mb-3 line-clamp-2">{employee.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-400 font-medium">
                        Saves {employee.savingsPerMonth}/mo
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-white/40" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-white/40" />
                      )}
                    </div>

                    {/* Expanded capabilities */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                            {employee.capabilities.map((cap, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <CheckCircle2 className="w-3 h-3 text-mansagold flex-shrink-0" />
                                <span className="text-xs text-white/70">{cap}</span>
                              </div>
                            ))}
                            {onEmployeeSelect && (
                              <Button
                                size="sm"
                                className="w-full mt-2 bg-mansagold/20 text-mansagold hover:bg-mansagold/30 border border-mansagold/30"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEmployeeSelect(employee.id);
                                }}
                              >
                                <Sparkles className="w-3.5 h-3.5 mr-1" />
                                View Activity
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default KaylaAITeam;
