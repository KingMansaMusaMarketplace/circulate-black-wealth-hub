import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Bot, MessageSquare, Search, Eye, Globe, DollarSign, CreditCard, Scale,
  FileText, Gift, Handshake, Heart, Calendar, Receipt, QrCode, TrendingUp,
  BarChart3, Mic, Megaphone, Zap, UserPlus, CheckCircle2, Briefcase,
  ChevronDown, ChevronUp, Sparkles, ArrowLeft, Shield, Package, Target,
  LineChart, Lightbulb, ClipboardCheck, BookOpen, PieChart, Wallet,
  ShieldCheck, Calculator, Layers
} from 'lucide-react';
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
  savingsPerMonth: string;
}

const AI_EMPLOYEES: AIEmployee[] = [
  // MARKETING
  {
    id: 'review-manager',
    icon: MessageSquare,
    name: 'Review Manager',
    role: 'Customer Relations',
    department: 'MARKETING',
    description: 'Reads, analyzes, and responds to every review with professional, brand-consistent messaging.',
    capabilities: ['Instant professional responses', 'Sentiment analysis', 'Reputation score tracking', 'Escalation for critical feedback'],
    savingsPerMonth: '$400',
  },
  {
    id: 'seo-specialist',
    icon: Search,
    name: 'SEO Specialist',
    role: 'Search Optimization',
    department: 'MARKETING',
    description: 'Monitors and optimizes your visibility with real-time scoring and actionable tips.',
    capabilities: ['Visibility Score (0–100)', 'Profile completeness analysis', 'Keyword optimization', 'Local search boosts'],
    savingsPerMonth: '$300',
  },
  {
    id: 'brand-monitor',
    icon: Eye,
    name: 'Brand Monitor',
    role: 'Reputation Intelligence',
    department: 'MARKETING',
    description: 'Scans the web for brand mentions, news, and social tags using real-time AI intelligence.',
    capabilities: ['Web mention tracking', 'Sentiment scoring (0–1)', 'Draft response generation', 'Competitive benchmarking'],
    savingsPerMonth: '$350',
  },
  {
    id: 'social-content',
    icon: Megaphone,
    name: 'Content Creator',
    role: 'Social Media & Content',
    department: 'MARKETING',
    description: 'Generates social media posts, email campaigns, and marketing copy tailored to your brand.',
    capabilities: ['Social post generation', 'Email campaign drafts', 'Brand voice matching', 'Content calendar'],
    savingsPerMonth: '$500',
  },
  {
    id: 'b2b-partnership-scout',
    icon: UserPlus,
    name: 'B2B Partnership Scout',
    role: 'Strategic Alliances & Lead Generation',
    department: 'MARKETING',
    description: 'Acts as a 24/7 business development rep, finding win-win collaborations within the 1325.ai ecosystem.',
    capabilities: ['Give/Get ecosystem matchmaking', 'Trust-building partnership outreach', 'Trigger event monitoring', 'Trust Equity KPI tracking'],
    savingsPerMonth: '$1,850',
  },
  {
    id: 'email-campaign-manager',
    icon: Globe,
    name: 'Email Campaign Manager',
    role: 'Automated Email Marketing',
    department: 'MARKETING',
    description: 'Designs, schedules, and optimizes email campaigns with A/B testing and audience segmentation.',
    capabilities: ['Automated drip sequences', 'A/B subject line testing', 'Audience segmentation', 'Open & click analytics'],
    savingsPerMonth: '$450',
  },

  // FINANCE
  {
    id: 'bookkeeper',
    icon: Receipt,
    name: 'Bookkeeper',
    role: 'Financial Management',
    department: 'FINANCE',
    description: 'Full accounting suite with profit & loss, invoice tracking, and bank reconciliation.',
    capabilities: ['P&L statements', 'Invoice & expense tracking', 'Bank reconciliation', 'Tax rate management'],
    savingsPerMonth: '$600',
  },
  {
    id: 'cash-flow-analyst',
    icon: DollarSign,
    name: 'Cash Flow Analyst',
    role: 'Financial Forecasting',
    department: 'FINANCE',
    description: 'AI-powered financial predictions with 30/60/90-day projections and runway alerts.',
    capabilities: ['Revenue trend analysis', 'Expense pattern detection', 'Cash runway alerts', '30/60/90-day projections'],
    savingsPerMonth: '$400',
  },
  {
    id: 'grant-researcher',
    icon: CreditCard,
    name: 'Grant Researcher',
    role: 'Funding & Grants',
    department: 'FINANCE',
    description: 'Finds grants and funding opportunities tailored to your business with eligibility scoring.',
    capabilities: ['AI-matched grants', 'Eligibility screening', 'Deadline tracking', 'Success probability scoring'],
    savingsPerMonth: '$300',
  },
  {
    id: 'credit-advisor',
    icon: Scale,
    name: 'Credit Advisor',
    role: 'Lending Readiness',
    department: 'FINANCE',
    description: 'Prepares your business for financing with credit readiness scoring and lender matching.',
    capabilities: ['Credit readiness score', 'Document prep checklist', 'Lender matching', 'Financial benchmarks'],
    savingsPerMonth: '$250',
  },
  {
    id: 'tax-preparer',
    icon: Calculator,
    name: 'Tax Preparer',
    role: 'Tax Compliance',
    department: 'FINANCE',
    description: 'Organizes tax documents, tracks deductions, and prepares summaries for filing.',
    capabilities: ['Deduction tracking', 'Document organization', 'Filing summaries', 'Quarterly estimates'],
    savingsPerMonth: '$400',
  },
  {
    id: 'investment-readiness',
    icon: LineChart,
    name: 'Investment Readiness Coach',
    role: 'Investor Preparation',
    department: 'FINANCE',
    description: 'Prepares your pitch deck metrics, financial models, and investor-ready documentation.',
    capabilities: ['Pitch deck data assembly', 'Financial model generation', 'Valuation benchmarks', 'Investor outreach prep'],
    savingsPerMonth: '$500',
  },
  {
    id: 'price-optimizer',
    icon: Target,
    name: 'Price Optimizer',
    role: 'Revenue Optimization',
    department: 'FINANCE',
    description: 'Analyzes market data and competitor pricing to recommend optimal price points.',
    capabilities: ['Competitor price tracking', 'Demand elasticity analysis', 'Margin optimization', 'Dynamic pricing suggestions'],
    savingsPerMonth: '$350',
  },

  // OPERATIONS
  {
    id: 'records-clerk',
    icon: FileText,
    name: 'Records Clerk',
    role: 'Document Management',
    department: 'OPERATIONS',
    description: 'AI-powered document vault with OCR, semantic search, and compliance monitoring.',
    capabilities: ['Auto-extract metadata', 'Expiration monitoring', 'Natural language search', 'Compliance alerts'],
    savingsPerMonth: '$300',
  },
  {
    id: 'loyalty-manager',
    icon: Gift,
    name: 'Loyalty Manager',
    role: 'Customer Retention',
    department: 'OPERATIONS',
    description: 'Automated tiered rewards system with points multipliers and customer engagement.',
    capabilities: ['4-tier loyalty system', 'Points multipliers (up to 2x)', 'Auto tier progression', '8+ reward templates'],
    savingsPerMonth: '$350',
  },
  {
    id: 'supply-chain',
    icon: Handshake,
    name: 'Supply Chain Lead',
    role: 'B2B & Supplier Diversity',
    department: 'OPERATIONS',
    description: 'Monitors and grows your community supply chain with B2B matching and diversity reporting.',
    capabilities: ['B2B connection matching', 'Diversity spend reporting', 'Supplier performance', 'Economic multiplier'],
    savingsPerMonth: '$250',
  },
  {
    id: 'scheduler',
    icon: Calendar,
    name: 'Scheduler',
    role: 'Appointment Management',
    department: 'OPERATIONS',
    description: 'Handles 24/7 online booking with confirmations, reminders, and calendar sync.',
    capabilities: ['Online booking anytime', 'Auto confirmations', 'Calendar sync', 'No-show reduction'],
    savingsPerMonth: '$300',
  },
  {
    id: 'inventory-manager',
    icon: Package,
    name: 'Inventory Manager',
    role: 'Stock & Supply Management',
    department: 'OPERATIONS',
    description: 'Tracks inventory levels, predicts reorder points, and prevents stockouts automatically.',
    capabilities: ['Real-time stock tracking', 'Auto reorder alerts', 'Demand forecasting', 'Waste reduction insights'],
    savingsPerMonth: '$400',
  },
  {
    id: 'legal-templates',
    icon: BookOpen,
    name: 'Legal Template Assistant',
    role: 'Contract & Document Templates',
    department: 'OPERATIONS',
    description: 'Provides customizable legal templates for contracts, NDAs, invoices, and compliance docs.',
    capabilities: ['Contract templates library', 'NDA generator', 'Terms of service drafts', 'Compliance document builder'],
    savingsPerMonth: '$350',
  },
  {
    id: 'compliance-monitor',
    icon: ShieldCheck,
    name: 'Compliance Monitor',
    role: 'Regulatory Compliance',
    department: 'OPERATIONS',
    description: 'Monitors regulatory changes and ensures your business stays compliant with local, state, and federal requirements.',
    capabilities: ['License renewal tracking', 'Regulatory change alerts', 'Compliance checklist automation', 'Audit preparation'],
    savingsPerMonth: '$500',
  },
  {
    id: 'qr-engagement',
    icon: QrCode,
    name: 'QR Engagement Specialist',
    role: 'In-Store Digital Bridge',
    department: 'OPERATIONS',
    description: 'Creates and manages QR code campaigns that bridge physical and digital customer experiences.',
    capabilities: ['Dynamic QR generation', 'Scan analytics tracking', 'Campaign A/B testing', 'Loyalty point triggers'],
    savingsPerMonth: '$200',
  },

  // COMMUNITY
  {
    id: 'community-impact',
    icon: Heart,
    name: 'Impact Analyst',
    role: 'Community Scorecard',
    department: 'COMMUNITY',
    description: 'Measures and showcases your community contribution with the CMAL scoring system.',
    capabilities: ['CMAL score (0–1000)', 'Impact badges', 'Engagement metrics', 'Public impact profile'],
    savingsPerMonth: '$200',
  },
  {
    id: 'diversity-compliance',
    icon: Scale,
    name: 'Diversity Compliance Officer',
    role: 'EEO & Supplier Diversity',
    department: 'COMMUNITY',
    description: 'Ensures compliance and competitiveness for government contracts and corporate supplier diversity programs.',
    capabilities: ['EEO & OFCCP contract readiness', 'D&I impact reports', 'Bias interruption on content', 'MBE/WBE certification tracking'],
    savingsPerMonth: '$1,200',
  },
  {
    id: 'community-engagement',
    icon: Mic,
    name: 'Community Engagement Lead',
    role: 'Local Outreach & Events',
    department: 'COMMUNITY',
    description: 'Identifies sponsorship opportunities, community events, and local partnership channels.',
    capabilities: ['Event discovery & matching', 'Sponsorship ROI tracking', 'Community calendar sync', 'Local partnership suggestions'],
    savingsPerMonth: '$300',
  },

  // TOOLS
  {
    id: 'analytics-dashboard',
    icon: PieChart,
    name: 'Analytics Dashboard',
    role: 'Business Intelligence',
    department: 'TOOLS',
    description: 'Centralizes all your KPIs into a single real-time dashboard with trend analysis.',
    capabilities: ['Real-time KPI tracking', 'Custom report builder', 'Trend visualization', 'Exportable reports'],
    savingsPerMonth: '$300',
  },
  {
    id: 'voice-assistant',
    icon: Mic,
    name: 'Voice Assistant',
    role: 'Hands-Free Operations',
    department: 'TOOLS',
    description: 'Interact with your entire business dashboard using natural voice commands.',
    capabilities: ['Voice-activated queries', 'Hands-free data access', 'Natural language commands', 'Multi-device support'],
    savingsPerMonth: '$150',
  },
  {
    id: 'daily-briefing',
    icon: Lightbulb,
    name: 'Daily Briefing',
    role: 'Proactive Intelligence',
    department: 'TOOLS',
    description: 'Delivers a personalized morning briefing with overnight activity, alerts, and action items.',
    capabilities: ['Overnight activity summary', 'Priority action items', 'Anomaly detection', 'Weekly trend digest'],
    savingsPerMonth: '$200',
  },
  {
    id: 'business-analyst',
    icon: TrendingUp,
    name: 'Business Analyst',
    role: 'Strategic Advisory',
    department: 'TOOLS',
    description: 'Provides strategic recommendations based on your data, market conditions, and growth trajectory.',
    capabilities: ['Growth opportunity scoring', 'Competitive landscape analysis', 'Strategic action plans', 'Performance benchmarking'],
    savingsPerMonth: '$450',
  },
];

const DEPARTMENTS = ['ALL', 'MARKETING', 'FINANCE', 'OPERATIONS', 'COMMUNITY', 'TOOLS'] as const;

const departmentColors: Record<string, string> = {
  MARKETING: 'bg-mansagold/20 text-mansagold border-mansagold/30',
  FINANCE: 'bg-mansablue-light/20 text-mansablue-light border-mansablue-light/30',
  OPERATIONS: 'bg-mansagold-light/20 text-mansagold-light border-mansagold-light/30',
  COMMUNITY: 'bg-mansagold-dark/20 text-mansagold border-mansagold-dark/30',
  TOOLS: 'bg-mansablue/20 text-mansablue-light border-mansablue/30',
};

const departmentDescriptions: Record<string, string> = {
  MARKETING: 'Grow your brand, attract customers, and dominate local search.',
  FINANCE: 'Master your money — from bookkeeping to investor readiness.',
  OPERATIONS: 'Run lean with automated scheduling, inventory, and compliance.',
  COMMUNITY: 'Measure and amplify your community impact.',
  TOOLS: 'Intelligence tools that keep you ahead of the curve.',
};

const departmentIcons: Record<string, React.ElementType> = {
  MARKETING: Megaphone,
  FINANCE: DollarSign,
  OPERATIONS: Briefcase,
  COMMUNITY: Heart,
  TOOLS: Zap,
};

const WhatKaylaDoesPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedDept === 'ALL'
    ? AI_EMPLOYEES
    : AI_EMPLOYEES.filter(e => e.department === selectedDept);

  const totalSavings = AI_EMPLOYEES
    .reduce((sum, e) => sum + parseInt(e.savingsPerMonth.replace(/[^0-9]/g, '')), 0);

  const deptCounts = DEPARTMENTS.filter(d => d !== 'ALL').reduce((acc, dept) => {
    acc[dept] = AI_EMPLOYEES.filter(e => e.department === dept).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen relative overflow-hidden dark">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-mansablue-dark/40 to-[#030712]" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-mansablue/20 to-mansablue-light/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 -right-32 w-[32rem] h-[32rem] bg-gradient-to-tl from-mansagold/15 to-mansagold-light/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-tr from-mansablue-dark/15 to-mansablue/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      {/* Gold top accent */}
      <div className="h-1 bg-gradient-to-r from-transparent via-mansagold to-transparent opacity-60 relative z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-mansagold transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Home</span>
        </Link>

        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mansagold/10 border border-mansagold/30 mb-6">
            <Bot className="w-4 h-4 text-mansagold" />
            <span className="text-xs font-semibold text-mansagold uppercase tracking-wider">Your AI Workforce</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Meet <span className="text-mansagold" style={{ fontFamily: "'Playfair Display', serif" }}>Kayla</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-6">
            {AI_EMPLOYEES.length} Agentic AI employees working 24/7 across {DEPARTMENTS.length - 1} departments — 
            replacing <span className="text-mansagold font-bold">${totalSavings.toLocaleString()}/mo</span> in operational costs.
          </p>
          <p className="text-white/50 max-w-2xl mx-auto text-sm md:text-base">
            One AI employee that handles reviews, marketing, bookkeeping, compliance, and more — so you can focus on the business.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 md:mb-16"
        >
          {[
            { label: 'AI Employees', value: AI_EMPLOYEES.length.toString(), icon: Bot },
            { label: 'Departments', value: (DEPARTMENTS.length - 1).toString(), icon: Layers },
            { label: 'Monthly Savings', value: `$${totalSavings.toLocaleString()}`, icon: Wallet },
            { label: 'Annual ROI', value: `${Math.round((totalSavings * 12) / (149 * 12))}x`, icon: TrendingUp },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 text-center">
              <stat.icon className="w-5 h-5 text-mansagold mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Department Filter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 md:gap-3 justify-center mb-10"
        >
          {DEPARTMENTS.map(dept => {
            const DeptIcon = dept !== 'ALL' ? departmentIcons[dept] : Sparkles;
            const count = dept === 'ALL' ? AI_EMPLOYEES.length : deptCounts[dept];
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200',
                  selectedDept === dept
                    ? 'bg-mansagold/20 text-mansagold border-mansagold/40 shadow-lg shadow-mansagold/10'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                )}
              >
                {DeptIcon && <DeptIcon className="w-4 h-4" />}
                <span>{dept === 'ALL' ? 'All Departments' : dept.charAt(0) + dept.slice(1).toLowerCase()}</span>
                <span className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full',
                  selectedDept === dept ? 'bg-mansagold/30 text-mansagold' : 'bg-white/10 text-white/40'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Department Description */}
        {selectedDept !== 'ALL' && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/50 text-sm mb-8"
          >
            {departmentDescriptions[selectedDept]}
          </motion.p>
        )}

        {/* Employee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                  transition={{ delay: index * 0.03 }}
                >
                  <div
                    className={cn(
                      'bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-6 cursor-pointer transition-all duration-300 group',
                      'hover:border-mansagold/30 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-mansagold/5',
                      isExpanded && 'border-mansagold/40 ring-1 ring-mansagold/20 bg-white/[0.06]'
                    )}
                    onClick={() => setExpandedId(isExpanded ? null : employee.id)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-mansagold/20 to-mansagold-dark/10 flex items-center justify-center border border-mansagold/20 group-hover:shadow-lg group-hover:shadow-mansagold/10 transition-shadow">
                          <Icon className="w-6 h-6 text-mansagold" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-mansagold transition-colors">
                            {employee.name}
                          </h3>
                          <p className="text-xs text-white/50">{employee.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn('text-[10px] px-2 py-0.5', departmentColors[employee.department])}>
                        {employee.department}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-white/60 mb-4 leading-relaxed">{employee.description}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-medium">
                          Saves {employee.savingsPerMonth}/mo
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-white/40">
                        <span className="text-xs">{isExpanded ? 'Less' : 'Details'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Expanded capabilities */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                            {employee.capabilities.map((cap, i) => (
                              <div key={i} className="flex items-start gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-mansagold flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-white/70">{cap}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 md:mt-20"
        >
          <div className="bg-gradient-to-r from-mansagold/10 via-mansagold/5 to-mansagold/10 border border-mansagold/20 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Put Kayla to Work?
            </h2>
            <p className="text-white/60 mb-6 max-w-xl mx-auto">
              Start with the free tier and unlock your full AI workforce for just $149/month — 
              that's less than <span className="text-mansagold font-semibold">$6/day</span> for {AI_EMPLOYEES.length} employees.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/business-signup">
                <Button className="bg-mansagold hover:bg-mansagold/90 text-text-on-gold font-semibold px-8 py-3 rounded-full text-base shadow-lg shadow-mansagold/20">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 rounded-full text-base">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Footer spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
};

export default WhatKaylaDoesPage;
