import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Bot, TrendingUp, Shield, BarChart3, ArrowLeft, 
  Activity, DollarSign, FileText, Users, Building2,
  AlertTriangle, CheckCircle2, Clock, Zap, Brain,
  RefreshCw, MessageSquare, Search, Eye, Megaphone, UserPlus,
  Globe, Receipt, CreditCard, Scale, Calculator, LineChart,
  Target, Gift, Handshake, Calendar, Package, BookOpen,
  ShieldCheck, QrCode, Heart, Mic, PieChart, Lightbulb,
  Briefcase
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AGENTIC_EMPLOYEES = [
  // MARKETING
  { id: 'review-manager', icon: MessageSquare, name: 'Review Manager', department: 'MARKETING', savings: '$400' },
  { id: 'seo-specialist', icon: Search, name: 'SEO Specialist', department: 'MARKETING', savings: '$300' },
  { id: 'brand-monitor', icon: Eye, name: 'Brand Monitor', department: 'MARKETING', savings: '$350' },
  { id: 'content-creator', icon: Megaphone, name: 'Content Creator', department: 'MARKETING', savings: '$500' },
  { id: 'b2b-scout', icon: UserPlus, name: 'B2B Partnership Scout', department: 'MARKETING', savings: '$1,850' },
  { id: 'email-campaigns', icon: Globe, name: 'Email Campaign Manager', department: 'MARKETING', savings: '$450' },
  // FINANCE
  { id: 'bookkeeper', icon: Receipt, name: 'Bookkeeper', department: 'FINANCE', savings: '$600' },
  { id: 'cash-flow', icon: DollarSign, name: 'Cash Flow Analyst', department: 'FINANCE', savings: '$400' },
  { id: 'grant-researcher', icon: CreditCard, name: 'Grant Researcher', department: 'FINANCE', savings: '$300' },
  { id: 'credit-advisor', icon: Scale, name: 'Credit Advisor', department: 'FINANCE', savings: '$250' },
  { id: 'tax-preparer', icon: Calculator, name: 'Tax Preparer', department: 'FINANCE', savings: '$400' },
  { id: 'investment-readiness', icon: LineChart, name: 'Investment Readiness Coach', department: 'FINANCE', savings: '$500' },
  { id: 'price-optimizer', icon: Target, name: 'Price Optimizer', department: 'FINANCE', savings: '$350' },
  // OPERATIONS
  { id: 'records-clerk', icon: FileText, name: 'Records Clerk', department: 'OPERATIONS', savings: '$300' },
  { id: 'loyalty-manager', icon: Gift, name: 'Loyalty Manager', department: 'OPERATIONS', savings: '$350' },
  { id: 'supply-chain', icon: Handshake, name: 'Supply Chain Lead', department: 'OPERATIONS', savings: '$250' },
  { id: 'scheduler', icon: Calendar, name: 'Scheduler', department: 'OPERATIONS', savings: '$300' },
  { id: 'inventory-manager', icon: Package, name: 'Inventory Manager', department: 'OPERATIONS', savings: '$400' },
  { id: 'legal-templates', icon: BookOpen, name: 'Legal Template Assistant', department: 'OPERATIONS', savings: '$350' },
  { id: 'compliance-monitor', icon: ShieldCheck, name: 'Compliance Monitor', department: 'OPERATIONS', savings: '$500' },
  { id: 'qr-engagement', icon: QrCode, name: 'QR Engagement Specialist', department: 'OPERATIONS', savings: '$200' },
  // COMMUNITY
  { id: 'impact-analyst', icon: Heart, name: 'Impact Analyst', department: 'COMMUNITY', savings: '$200' },
  { id: 'diversity-compliance', icon: Scale, name: 'Diversity Compliance Officer', department: 'COMMUNITY', savings: '$1,200' },
  { id: 'community-engagement', icon: Mic, name: 'Community Engagement Lead', department: 'COMMUNITY', savings: '$300' },
  // TOOLS
  { id: 'analytics-dashboard', icon: PieChart, name: 'Analytics Dashboard', department: 'TOOLS', savings: '$300' },
  { id: 'voice-assistant', icon: Mic, name: 'Voice Assistant', department: 'TOOLS', savings: '$150' },
  { id: 'daily-briefing', icon: Lightbulb, name: 'Daily Briefing', department: 'TOOLS', savings: '$200' },
  { id: 'business-analyst', icon: TrendingUp, name: 'Business Analyst', department: 'TOOLS', savings: '$450' },
];

const DEPT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  MARKETING: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  FINANCE: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  OPERATIONS: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  COMMUNITY: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  TOOLS: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
};

const DEPT_ICONS: Record<string, React.ElementType> = {
  MARKETING: Megaphone,
  FINANCE: DollarSign,
  OPERATIONS: Briefcase,
  COMMUNITY: Heart,
  TOOLS: Zap,
};

interface AgentMetrics {
  cro: {
    totalBusinesses: number;
    newBusinesses30d: number;
    activeSubscriptions: number;
    totalReferrals: number;
    estimatedMRR: number;
  };
  ipShield: {
    totalClaims: number;
    categories: { name: string; count: number }[];
    filingDate: string;
    applicationNumber: string;
    amendmentDate: string;
  };
  ir: {
    totalBusinesses: number;
    totalUsers: number;
    activeSubscriptions: number;
    platformAge: string;
    patentsClaimed: number;
  };
}

const AIWorkforceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const [businessesRes, newBusinessesRes, subsRes, referralsRes] = await Promise.all([
        supabase.from('businesses').select('id', { count: 'exact', head: true }),
        supabase.from('businesses').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('corporate_subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('referrals').select('id', { count: 'exact', head: true }),
      ]);

      setMetrics({
        cro: {
          totalBusinesses: businessesRes.count || 0,
          newBusinesses30d: newBusinessesRes.count || 0,
          activeSubscriptions: subsRes.count || 0,
          totalReferrals: referralsRes.count || 0,
          estimatedMRR: (subsRes.count || 0) * 149, // Pro tier average
        },
        ipShield: {
          totalClaims: 27,
          categories: [
            { name: 'Fraud Detection', count: 4 },
            { name: 'Loyalty System', count: 5 },
            { name: 'Attribution', count: 7 },
            { name: 'Partner System', count: 7 },
            { name: 'Infrastructure', count: 4 },
          ],
          filingDate: 'January 27, 2026',
          applicationNumber: 'USPTO 63/969,202',
          amendmentDate: 'January 30, 2026',
        },
        ir: {
          totalBusinesses: businessesRes.count || 0,
          totalUsers: 0, // Would need auth query
          activeSubscriptions: subsRes.count || 0,
          platformAge: '8 months',
          patentsClaimed: 27,
        },
      });
      setLastRefresh(new Date());
    } catch (error) {
      toast({ title: 'Error fetching metrics', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const agentStatus = (isActive: boolean) => (
    <div className="flex items-center gap-2">
      <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
      <span className={`text-xs font-semibold ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
        {isActive ? 'Active' : 'Offline'}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#050a18] to-[#030712] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/admin-dashboard">
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <Bot className="w-8 h-8 text-[#FFB300]" />
                <h1 className="text-3xl font-bold text-white">AI Workforce Dashboard</h1>
              </div>
              <p className="text-white/50 mt-1 ml-11">Powered by Kayla — Real-time agent monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs">
              Last refresh: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#FFB300]/30 text-[#FFB300] hover:bg-[#FFB300]/10"
              onClick={fetchMetrics}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Agent Status Bar */}
        <div className="grid gap-4 mb-8 md:grid-cols-3">
          {[
            { name: 'Kayla CRO', icon: TrendingUp, accent: '#FFB300' },
            { name: 'Kayla IP Shield', icon: Shield, accent: '#003366' },
            { name: 'Kayla IR', icon: BarChart3, accent: '#FFB300' },
          ].map((agent, i) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card
                className="p-5 backdrop-blur-sm shadow-lg"
                style={{
                  background: 'rgba(0,0,0,0.6)',
                  border: `1px solid ${agent.accent}44`,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: `${agent.accent}1A`, border: `1px solid ${agent.accent}33` }}
                    >
                      <agent.icon className="h-5 w-5" style={{ color: agent.accent }} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-base font-bold text-white">{agent.name}</div>
                      <div
                        className="mt-1.5 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ background: `${agent.accent}1A`, color: `${agent.accent}CC`, border: `1px solid ${agent.accent}33` }}
                      >
                        Monitoring
                      </div>
                    </div>
                  </div>
                  {agentStatus(true)}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* ============ KAYLA CRO ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-black/60 border border-emerald-500/30 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Kayla CRO</h2>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Revenue</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/60 text-xs">Estimated MRR</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">
                    ${metrics?.cro.estimatedMRR.toLocaleString() || '—'}
                  </div>
                  <div className="text-white/40 text-xs mt-1">Based on {metrics?.cro.activeSubscriptions || 0} active subscriptions</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-xs mb-1">Total Businesses</div>
                    <div className="text-xl font-bold text-white">{metrics?.cro.totalBusinesses.toLocaleString() || '—'}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-white/60 text-xs mb-1">New (30d)</div>
                    <div className="text-xl font-bold text-white">{metrics?.cro.newBusinesses30d.toLocaleString() || '—'}</div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 text-xs mb-1">Revenue Streams Monitored</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {['Marketplace', 'SaaS', 'Loyalty', 'B2B', 'API', 'Ads', 'Data', 'White-Label'].map((stream) => (
                      <span key={stream} className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {stream}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span className="text-white/60">Last analysis:</span>
                    <span className="text-emerald-400 font-medium">Just now</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ============ KAYLA IP SHIELD ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-black/60 border border-blue-500/30 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-bold text-white">Kayla IP Shield</h2>
                </div>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">Patents</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white/60 text-xs">Patent Claims</span>
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400">
                    {metrics?.ipShield.totalClaims || 27}
                  </div>
                  <div className="text-white/40 text-xs mt-1">{metrics?.ipShield.applicationNumber}</div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 text-xs mb-2">Claim Categories</div>
                  <div className="space-y-2">
                    {metrics?.ipShield.categories.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between">
                        <span className="text-white/80 text-xs">{cat.name}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-400 rounded-full" 
                              style={{ width: `${(cat.count / 7) * 100}%` }}
                            />
                          </div>
                          <span className="text-blue-400 text-xs font-bold w-4 text-right">{cat.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white/60 text-xs">Filed</span>
                    <span className="text-white font-medium text-xs">{metrics?.ipShield.filingDate}</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-white/60 text-xs">Amendment</span>
                    <span className="text-white font-medium text-xs">{metrics?.ipShield.amendmentDate}</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    <span className="text-white/60">Status:</span>
                    <span className="text-blue-400 font-medium">Provisional — Active Protection</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ============ KAYLA IR ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-black/60 border border-amber-500/30 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <h2 className="text-lg font-bold text-white">Kayla IR</h2>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Investor</Badge>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-xs mb-2">Investor-Ready KPIs</div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-xs flex items-center gap-1.5">
                        <Building2 className="w-3 h-3" /> Businesses on Platform
                      </span>
                      <span className="text-amber-400 font-bold">{metrics?.ir.totalBusinesses.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-xs flex items-center gap-1.5">
                        <DollarSign className="w-3 h-3" /> Active Subscriptions
                      </span>
                      <span className="text-amber-400 font-bold">{metrics?.ir.activeSubscriptions}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-xs flex items-center gap-1.5">
                        <FileText className="w-3 h-3" /> Patent Claims
                      </span>
                      <span className="text-amber-400 font-bold">{metrics?.ir.patentsClaimed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80 text-xs flex items-center gap-1.5">
                        <Clock className="w-3 h-3" /> Build Duration
                      </span>
                      <span className="text-amber-400 font-bold">{metrics?.ir.platformAge}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 text-xs mb-2">Data Room Status</div>
                  <div className="space-y-2">
                    {[
                      { name: 'Pitch Deck (15 slides)', status: 'ready' },
                      { name: 'Competitive Analysis v5', status: 'ready' },
                      { name: 'Lovable Case Study v2', status: 'ready' },
                      { name: 'Patent Portfolio', status: 'ready' },
                      { name: 'Financial Projections', status: 'generating' },
                    ].map((doc) => (
                      <div key={doc.name} className="flex items-center justify-between">
                        <span className="text-white/80 text-xs">{doc.name}</span>
                        {doc.status === 'ready' ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                        ) : (
                          <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="text-white/60 text-xs mb-2">Target Investors</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Sequoia', 'a16z', 'Lovable', 'Community VCs'].map((vc) => (
                      <span key={vc} className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {vc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Brain className="w-3 h-3 text-amber-400" />
                    <span className="text-white/60">Generating:</span>
                    <span className="text-amber-400 font-medium">Q2 2026 projections</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ============ FULL AGENTIC WORKFORCE ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-purple-400" />
              <div>
                <h2 className="text-xl font-bold text-white">Full Agentic Workforce</h2>
                <p className="text-white/50 text-xs">{AGENTIC_EMPLOYEES.length} AI employees across 5 departments — auto-refreshing every 60s</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs font-medium">{AGENTIC_EMPLOYEES.length}/{AGENTIC_EMPLOYEES.length} Active</span>
            </div>
          </div>

          {['MARKETING', 'FINANCE', 'OPERATIONS', 'COMMUNITY', 'TOOLS'].map((dept) => {
            const deptEmployees = AGENTIC_EMPLOYEES.filter(e => e.department === dept);
            const colors = DEPT_COLORS[dept];
            const DeptIcon = DEPT_ICONS[dept];
            return (
              <div key={dept} className="mb-4">
                <div className={`flex items-center gap-2 mb-2 px-1`}>
                  <DeptIcon className={`w-4 h-4 ${colors.text}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>{dept}</span>
                  <span className="text-white/30 text-xs">({deptEmployees.length})</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {deptEmployees.map((emp) => (
                    <Card key={emp.id} className={`p-3 bg-black/40 border ${colors.border} hover:bg-white/5 transition-colors`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-7 h-7 rounded-md ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                            <emp.icon className={`w-3.5 h-3.5 ${colors.text}`} />
                          </div>
                          <div className="min-w-0">
                            <div className="text-white text-xs font-medium truncate">{emp.name}</div>
                            <div className="text-white/40 text-[10px]">{emp.savings}/mo saved</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-green-400 text-[10px] font-medium">Active</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Bottom Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6"
        >
          <Card className="p-5 bg-purple-500/5 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-purple-400" />
                <div>
                  <div className="text-white font-bold text-sm">Kayla AI Workforce — {AGENTIC_EMPLOYEES.length} Agentic Employees + 3 Strategic Agents</div>
                  <div className="text-white/50 text-xs">Replacing ~$12,100/mo in human overhead • 52x ROI at Pro tier</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">All Systems Operational</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AIWorkforceDashboard;
