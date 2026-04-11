
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import BusinessSignupForm from '@/components/auth/forms/BusinessSignupForm';
import { getSalesAgentByReferralCode } from '@/lib/api/sales-agent-api';
import { SalesAgent } from '@/types/sales-agent';
import { 
  Calendar, DollarSign, QrCode, Users, TrendingUp, Receipt, CheckCircle, 
  Wallet, BarChart3, Shield, Star, Sparkles, MessageSquare, Gift, 
  Brain, Search, FileText, Handshake, Globe, Mic, 
  CreditCard, Target, Heart, Zap, Bot, Eye,
  BookOpen, Megaphone, Scale, ChevronRight,
  Gavel, Share2, Mail, Package, Tags, LineChart, ShieldCheck, BadgeDollarSign
} from 'lucide-react';

const BusinessSignupPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref') || '';
  const [referringAgent, setReferringAgent] = useState<SalesAgent | null>(null);
  
  const checkReferralCode = async (code: string): Promise<SalesAgent | null> => {
    if (!code) return null;
    
    try {
      const agent = await getSalesAgentByReferralCode(code);
      setReferringAgent(agent);
      return agent;
    } catch (error) {
      console.error('Error checking referral code:', error);
      return null;
    }
  };

  const kaylaAIServices = [
    {
      icon: Bot,
      title: 'Kayla — Your AI Employee',
      description: 'A full-time AI agent that works 24/7 managing your business',
      details: [
        'Autonomous task execution',
        'Daily briefing & proactive alerts',
        'Voice & text interaction via WebRTC',
        'Professor-level business expertise'
      ],
      color: 'from-mansagold to-amber-600',
      badge: 'CORE'
    },
    {
      icon: MessageSquare,
      title: 'AI Review Responses',
      description: 'Kayla reads, analyzes, and responds to every review automatically',
      details: [
        'Instant professional responses',
        'Sentiment analysis & tone matching',
        'Reputation score tracking',
        'Escalation for critical feedback'
      ],
      color: 'from-pink-500 to-rose-500',
      badge: 'MARKETING'
    },
    {
      icon: Search,
      title: 'SEO Audit & Optimization',
      description: 'Real-time visibility scoring with actionable improvement tips',
      details: [
        'Visibility Score (0–100)',
        'Profile completeness analysis',
        'Keyword optimization suggestions',
        'Local search ranking boosts'
      ],
      color: 'from-blue-500 to-cyan-500',
      badge: 'MARKETING'
    },
    {
      icon: Eye,
      title: 'Reputation Monitoring',
      description: 'Kayla monitors your brand across the platform in real time',
      details: [
        'Sentiment trend tracking',
        'Competitive benchmarking',
        'Alert on negative reviews',
        'Monthly reputation reports'
      ],
      color: 'from-violet-500 to-purple-500',
      badge: 'MARKETING'
    },
    {
      icon: Globe,
      title: 'Auto-Discovery Engine',
      description: 'AI discovers & imports 17,000+ business listings daily',
      details: [
        '50 parallel searches per minute',
        'Multi-page data enrichment',
        'Verified website & phone required',
        'Global coverage with local focus'
      ],
      color: 'from-teal-500 to-emerald-500',
      badge: 'GROWTH'
    },
    {
      icon: DollarSign,
      title: 'Cash Flow Forecasting',
      description: 'AI-powered financial predictions to plan ahead with confidence',
      details: [
        '30/60/90-day projections',
        'Revenue trend analysis',
        'Expense pattern detection',
        'Cash runway alerts'
      ],
      color: 'from-green-500 to-emerald-500',
      badge: 'FINANCE'
    },
    {
      icon: CreditCard,
      title: 'Grant Matching',
      description: 'Kayla finds grants and funding opportunities tailored to your business',
      details: [
        'AI-matched grant recommendations',
        'Eligibility pre-screening',
        'Application deadline tracking',
        'Success probability scoring'
      ],
      color: 'from-emerald-500 to-green-600',
      badge: 'FINANCE'
    },
    {
      icon: Scale,
      title: 'Credit & Lending Readiness',
      description: 'Prepare your business for financing with AI-guided insights',
      details: [
        'Credit readiness score',
        'Document preparation checklist',
        'Lender matching suggestions',
        'Financial health benchmarks'
      ],
      color: 'from-sky-500 to-blue-600',
      badge: 'FINANCE'
    },
    {
      icon: FileText,
      title: 'Records Management (RAG)',
      description: 'AI-powered document vault with OCR and semantic search',
      details: [
        'Upload & auto-extract metadata',
        'Expiration date monitoring',
        'Natural language document search',
        'Compliance alert system'
      ],
      color: 'from-slate-500 to-gray-600',
      badge: 'OPERATIONS'
    },
    {
      icon: Gift,
      title: 'Loyalty Engine',
      description: 'Automated customer retention with tiered rewards',
      details: [
        'Bronze/Silver/Gold/Platinum tiers',
        'Points multipliers (up to 2x)',
        'Automated tier progression',
        '8+ ready-to-use rewards'
      ],
      color: 'from-orange-500 to-amber-500',
      badge: 'OPERATIONS'
    },
    {
      icon: Handshake,
      title: 'Supplier Diversity Tracking',
      description: 'Monitor and grow your community supply chain impact',
      details: [
        'B2B connection matching',
        'Diversity spend reporting',
        'Supplier performance scores',
        'Community economic multiplier'
      ],
      color: 'from-indigo-500 to-violet-500',
      badge: 'OPERATIONS'
    },
    {
      icon: Heart,
      title: 'Community Impact Scorecard',
      description: 'Measure and showcase your community contribution',
      details: [
        'CMAL score calculation',
        'Impact badges & certifications',
        'Community engagement metrics',
        'Public impact profile'
      ],
      color: 'from-red-500 to-rose-500',
      badge: 'COMMUNITY'
    },
    {
      icon: Calendar,
      title: 'Online Booking System',
      description: 'Let customers book appointments 24/7',
      details: [
        'Customers book online anytime',
        'Automatic email confirmations',
        'Calendar sync & availability',
        'Reduce no-shows with reminders'
      ],
      color: 'from-blue-500 to-cyan-500',
      badge: 'TOOLS'
    },
    {
      icon: Receipt,
      title: 'Full Accounting Suite',
      description: 'QuickBooks-style financial management built in',
      details: [
        'Profit & Loss statements',
        'Invoice & expense tracking',
        'Bank reconciliation',
        'Tax rate management'
      ],
      color: 'from-green-500 to-emerald-500',
      badge: 'TOOLS'
    },
    {
      icon: QrCode,
      title: 'QR Payment System',
      description: 'Accept payments instantly with scan-to-pay',
      details: [
        'Unique QR code for your business',
        'Customers scan & pay easily',
        'Automatic loyalty points',
        'Real-time payment tracking'
      ],
      color: 'from-purple-500 to-pink-500',
      badge: 'TOOLS'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Data-driven insights powered by Kayla',
      details: [
        'Sales & revenue trends',
        'Customer behavior analytics',
        'Peak hours identification',
        'AI-generated recommendations'
      ],
      color: 'from-indigo-500 to-violet-500',
      badge: 'TOOLS'
    },
    {
      icon: BarChart3,
      title: 'Business Profile & Directory',
      description: 'Get discovered in our 50,000+ verified listings',
      details: [
        'Public business listing',
        'Customer reviews & ratings',
        'Photo gallery showcase',
        'Contact & location info'
      ],
      color: 'from-sky-500 to-blue-500',
      badge: 'TOOLS'
    },
    {
      icon: Mic,
      title: 'Voice AI Assistant',
      description: 'Talk to Kayla hands-free with real-time voice',
      details: [
        'Low-latency WebRTC voice',
        'Natural conversation flow',
        'Voice commands for tasks',
        'Multilingual support'
      ],
      color: 'from-fuchsia-500 to-pink-500',
      badge: 'AI'
    },
    {
      icon: Megaphone,
      title: 'Daily Briefing & Alerts',
      description: 'Kayla delivers proactive insights every morning',
      details: [
        'Revenue & booking summaries',
        'New review notifications',
        'Upcoming expiration alerts',
        'Growth opportunity highlights'
      ],
      color: 'from-amber-500 to-yellow-500',
      badge: 'AI'
    },
    {
      icon: Zap,
      title: 'Event-Driven Automation',
      description: 'Real-time AI responses to every business event',
      details: [
        'Instant reaction to reviews & bookings',
        'Automated follow-ups',
        'Smart notification routing',
        '2-minute retry safety net'
      ],
      color: 'from-yellow-500 to-orange-500',
      badge: 'AI'
    },
    {
      icon: Receipt,
      title: 'Tax Preparation',
      description: 'AI-powered tax estimates, deduction tracking & filing prep',
      details: [
        'Quarterly tax estimates',
        'Deduction category tracking',
        'Tax document organization',
        'CPA-ready financial summaries'
      ],
      color: 'from-lime-500 to-green-600',
      badge: 'FINANCE'
    },
    {
      icon: Gavel,
      title: 'Legal Templates',
      description: 'Generate contracts, NDAs, and business agreements instantly',
      details: [
        '10+ template categories',
        'Auto-populated business info',
        'Service agreements & NDAs',
        'Independent contractor forms'
      ],
      color: 'from-stone-500 to-slate-600',
      badge: 'OPERATIONS'
    },
    {
      icon: Share2,
      title: 'Social Media Content',
      description: 'Kayla generates platform-ready posts for your brand',
      details: [
        'Instagram, Facebook, X & LinkedIn',
        'Tone & hashtag optimization',
        'Seasonal & trending topics',
        'One-click copy & post'
      ],
      color: 'from-pink-400 to-fuchsia-500',
      badge: 'MARKETING'
    },
    {
      icon: Mail,
      title: 'Email Campaigns',
      description: 'Automated email marketing with AI-written copy',
      details: [
        'Customer segment targeting',
        'AI-generated subject lines & body',
        'Campaign performance tracking',
        'Drip sequence automation'
      ],
      color: 'from-cyan-500 to-blue-600',
      badge: 'MARKETING'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track stock levels, vendors & get reorder alerts',
      details: [
        'Real-time stock tracking',
        'Low-stock alerts & reorder suggestions',
        'Vendor recommendation engine',
        'Cost & margin analysis'
      ],
      color: 'from-amber-600 to-orange-600',
      badge: 'OPERATIONS'
    },
    {
      icon: Tags,
      title: 'Price Optimization',
      description: 'AI analyzes demand & competition to suggest optimal pricing',
      details: [
        'Market-based price suggestions',
        'Margin impact analysis',
        'Seasonal pricing strategies',
        'Competitor price benchmarking'
      ],
      color: 'from-rose-500 to-red-600',
      badge: 'AI'
    },
    {
      icon: BadgeDollarSign,
      title: 'Investment Readiness',
      description: 'Prepare your business for investors with AI-guided scoring',
      details: [
        'Investor readiness scorecard',
        'Pitch deck data preparation',
        'Financial ratio benchmarks',
        'Growth trajectory analysis'
      ],
      color: 'from-emerald-600 to-teal-600',
      badge: 'FINANCE'
    },
    {
      icon: ShieldCheck,
      title: 'Compliance Monitoring',
      description: 'Track licenses, permits & deadlines so nothing expires',
      details: [
        'License expiration alerts',
        'Permit renewal reminders',
        'Regulatory checklist tracking',
        'Auto-generated compliance reports'
      ],
      color: 'from-blue-600 to-indigo-600',
      badge: 'OPERATIONS'
    },
  ];

  const badgeColors: Record<string, string> = {
    'CORE': 'bg-mansagold/20 text-mansagold border-mansagold/30',
    'MARKETING': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'FINANCE': 'bg-green-500/20 text-green-400 border-green-500/30',
    'OPERATIONS': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    'COMMUNITY': 'bg-red-500/20 text-red-400 border-red-500/30',
    'TOOLS': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'AI': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    'GROWTH': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] relative flex flex-col justify-center py-12">
      <Helmet>
        <title>Business Sign Up — Kayla AI Employee Included | 1325.AI</title>
        <meta name="description" content="Sign up your business on 1325.AI and get Kayla, your AI employee — 28 autonomous services replacing $5,750+/mo in human labor. Included free." />
      </Helmet>

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      </div>
      
      <main className="relative z-10 flex-1 py-8">
        {/* Kayla Hero Banner */}
        <div className="container mx-auto px-4 mb-8 animate-fade-in">
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-mansagold/30 via-purple-500/20 to-mansablue/30 rounded-3xl blur-3xl" />
            <div className="relative border-2 border-mansagold/40 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-purple-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-mansagold via-amber-400 to-orange-500"></div>
              
              {/* Decorative orbs */}
              <div className="absolute top-8 right-10 w-32 h-32 bg-mansagold/15 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-8 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-mansagold/15 border border-mansagold/30 rounded-full mb-6">
                  <Brain className="w-4 h-4 text-mansagold" />
                  <span className="text-sm font-semibold text-mansagold">Powered by Agentic AI</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4">
                  <span className="text-white">Meet </span>
                  <span className="bg-gradient-to-r from-mansagold via-amber-300 to-orange-400 bg-clip-text text-transparent font-['Playfair_Display']">Kayla</span>
                </h1>
                <p className="text-2xl md:text-3xl text-white font-bold mb-3">
                  Your AI Employee — Included Free
                </p>
                <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                  28 autonomous services that replace <span className="text-mansagold font-bold">$1,650–$5,750/month</span> in human labor. 
                  She manages your marketing, finances, operations, and community impact — so you can focus on what you do best.
                </p>
                
                <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-extrabold text-mansagold">28</p>
                    <p className="text-sm text-slate-400">AI Services</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-extrabold text-green-400">$5,750+</p>
                    <p className="text-sm text-slate-400">Value Per Month</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-extrabold text-blue-400">24/7</p>
                    <p className="text-sm text-slate-400">Always Working</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-extrabold text-purple-400">$0</p>
                    <p className="text-sm text-slate-400">Hidden Fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="container mx-auto px-4 mb-8 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
            <Link 
              to="/feature-guide" 
              className="flex-1 flex items-center justify-between px-6 py-4 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-mansagold/30 hover:bg-slate-800/80 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-mansagold" />
                <span className="font-semibold text-white">View Complete Feature Guide</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-mansagold transition-colors" />
            </Link>
            <Link 
              to="/business/how-it-works" 
              className="flex-1 flex items-center justify-between px-6 py-4 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 hover:bg-slate-800/80 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">See How It Works</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Kayla's Services Grid */}
        <div className="container mx-auto px-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-mansagold/20 border border-mansagold/30 rounded-full mb-6">
                <Shield className="w-6 h-6 text-mansagold" />
                <span className="text-lg md:text-xl font-bold text-mansagold">All Included — No Hidden Fees</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5">
                What Kayla Does For Your Business
              </h2>
              <p className="text-slate-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                From AI-powered marketing to autonomous financial management — Kayla handles it all while you grow.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kaylaAIServices.map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.03, duration: 0.4 }}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-15 rounded-2xl blur-xl transition-opacity duration-300`} />
                  <div className="relative bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-5 group-hover:border-white/25 group-hover:bg-slate-800/80 transition-all duration-300 h-full group-hover:shadow-xl group-hover:shadow-black/20">
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} flex-shrink-0 shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-white text-lg group-hover:text-mansagold transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColors[feature.badge]}`}>
                            {feature.badge}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 mb-3">
                          {feature.description}
                        </p>
                        <ul className="space-y-1.5">
                          {feature.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                              <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Value Summary */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-mansagold/20 via-amber-500/20 to-orange-500/20 rounded-2xl blur-2xl" />
              <div className="relative bg-slate-800/80 backdrop-blur-xl border border-mansagold/30 rounded-2xl p-6 text-center">
                <p className="text-lg text-slate-300 mb-4">
                  Kayla replaces the need for a <span className="text-white font-semibold">marketing manager</span>, 
                  <span className="text-white font-semibold"> bookkeeper</span>, 
                  <span className="text-white font-semibold"> SEO specialist</span>, 
                  <span className="text-white font-semibold"> reputation manager</span>, 
                  <span className="text-white font-semibold"> tax preparer</span>, 
                  <span className="text-white font-semibold"> inventory clerk</span>, and 
                  <span className="text-white font-semibold"> business analyst</span> — all in one AI.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                  <div>
                    <p className="text-3xl font-bold text-mansagold">28</p>
                    <p className="text-sm text-slate-400">AI Services</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div>
                    <p className="text-3xl font-bold text-green-400">$5,750+</p>
                    <p className="text-sm text-slate-400">Monthly Value</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div>
                    <p className="text-3xl font-bold text-blue-400">50,000+</p>
                    <p className="text-sm text-slate-400">Verified Listings</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div>
                    <p className="text-3xl font-bold text-purple-400">Real-Time</p>
                    <p className="text-sm text-slate-400">Event-Driven AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Container */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <BusinessSignupForm 
            referralCode={referralCode}
            referringAgent={referringAgent}
            onCheckReferralCode={checkReferralCode}
          />
        </div>
      </main>
    </div>
  );
};

export default BusinessSignupPage;
