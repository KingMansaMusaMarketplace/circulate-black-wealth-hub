import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, MessageSquare, Search, Eye, Globe, DollarSign, CreditCard, Scale,
  FileText, Gift, Handshake, Heart, Calendar, Receipt, QrCode, TrendingUp,
  BarChart3, Mic, Megaphone, Zap, UserPlus, CheckCircle2, Clock, Briefcase,
  ChevronDown, ChevronUp, Sparkles
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
];

const DEPARTMENTS = ['ALL', 'MARKETING', 'FINANCE', 'OPERATIONS', 'COMMUNITY'] as const;

const departmentColors: Record<string, string> = {
  MARKETING: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  FINANCE: 'bg-green-500/20 text-green-400 border-green-500/30',
  OPERATIONS: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  COMMUNITY: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const departmentIcons: Record<string, React.ElementType> = {
  MARKETING: Megaphone,
  FINANCE: DollarSign,
  OPERATIONS: Briefcase,
  COMMUNITY: Heart,
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
