import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, FileCheck, Network, Zap, Users, Brain, 
  Wallet, Globe, Lock, Activity, ChevronDown, ChevronUp,
  Award, TrendingUp, Clock, Scale, Building2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Patent claim categories with their claims
const claimCategories = [
  {
    id: 'temporal',
    name: 'Temporal Incentives',
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    claims: [
      { number: 1, title: 'Temporal Founding Member Status System', description: 'Immutable lifetime benefits for early registrants before September 1, 2026 cutoff' }
    ],
    dependentClaims: 3
  },
  {
    id: 'cmal',
    name: 'Economic Engine',
    icon: TrendingUp,
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    claims: [
      { number: 2, title: 'CMAL Engine (2.3x Multiplier)', description: 'Circulatory Multiplier Attribution Logic for tracking economic velocity' },
      { number: 14, title: 'Economic Karma Scoring System', description: 'Trust scoring based on community economic participation' },
      { number: 18, title: 'Community Impact Analytics Engine', description: 'Real-time analytics for measuring community economic impact' },
      { number: 20, title: 'Economic Circulation Velocity Analytics', description: 'Tracks how many times capital circulates within ecosystem' }
    ],
    dependentClaims: 8
  },
  {
    id: 'loyalty',
    name: 'Coalition Loyalty',
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    claims: [
      { number: 3, title: 'Cross-Business Coalition Loyalty Network', description: 'Multi-business loyalty program with shared points system' },
      { number: 6, title: 'Corporate Sponsorship Attribution', description: 'Tracks sponsor impact across community transactions' },
      { number: 7, title: 'Gamification Achievement Engine', description: 'Badge and achievement system for community engagement' }
    ],
    dependentClaims: 6
  },
  {
    id: 'security',
    name: 'Security & Fraud',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    claims: [
      { number: 4, title: 'Geospatial Velocity Fraud Detection', description: '600mph velocity threshold with race-prevention safeguards' },
      { number: 13, title: 'Atomic Fraud Alert Batch Insertion', description: 'Real-time fraud alert batching for high-volume processing' },
      { number: 16, title: 'Biometric-Secured Transaction Verification', description: 'Mobile biometric verification for secure transactions' }
    ],
    dependentClaims: 5
  },
  {
    id: 'b2b',
    name: 'B2B Intelligence',
    icon: Building2,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400',
    claims: [
      { number: 5, title: 'Intelligent B2B Matching Engine', description: 'AI-powered matching of business capabilities and needs' },
      { number: 8, title: 'Hierarchical Sales Agent Commission Network', description: 'Multi-level commission structure with team overrides' }
    ],
    dependentClaims: 4
  },
  {
    id: 'ai',
    name: 'AI & Voice',
    icon: Brain,
    color: 'from-cyan-500 to-teal-500',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30',
    textColor: 'text-cyan-400',
    claims: [
      { number: 10, title: 'AI-Powered Business Recommendations', description: 'Machine learning recommendations based on user behavior' },
      { number: 11, title: 'Real-Time Voice AI Bridge Architecture', description: 'WebRTC-to-Supabase voice processing pipeline' },
      { number: 12, title: 'AI Tool Registry for Voice Concierge', description: 'Function-calling registry for voice AI interactions' }
    ],
    dependentClaims: 5
  },
  {
    id: 'qr',
    name: 'QR & Transactions',
    icon: Zap,
    color: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/30',
    textColor: 'text-yellow-400',
    claims: [
      { number: 9, title: 'QR-Code Transaction Processing', description: 'Atomic check-in with real-time point calculation' },
      { number: 17, title: 'QR Code Atomic Check-in System', description: 'Idempotent transaction handling with deduplication' }
    ],
    dependentClaims: 3
  },
  {
    id: 'wallet',
    name: 'Platform Wallet',
    icon: Wallet,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-500/10',
    borderColor: 'border-pink-500/30',
    textColor: 'text-pink-400',
    claims: [
      { number: 15, title: 'Susu Digital Escrow System', description: 'Rotating credit circles with automated payout scheduling' },
      { number: 19, title: 'Closed-Loop Platform Wallet Ecosystem', description: 'Soft-locked capital within ecosystem with velocity tracking' }
    ],
    dependentClaims: 4
  },
  {
    id: 'partner',
    name: 'Partner System',
    icon: Network,
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    textColor: 'text-indigo-400',
    isNew: true,
    claims: [
      { number: 21, title: 'Partner Referral Attribution System', description: 'UTM-based cookie tracking with atomic webhook processing' },
      { number: 22, title: 'Tiered Revenue Share Calculation Engine', description: 'Multi-tier commission structure (Bronze/Silver/Gold/Platinum)' },
      { number: 23, title: 'Founding Partner Status & Tier System', description: 'Immutable founding benefits with temporal cutoff' },
      { number: 24, title: 'Embeddable Widget with Auto-Attribution', description: 'Auto-injected referral codes in marketing materials' },
      { number: 25, title: 'Real-Time Partner Analytics Dashboard', description: 'Live metrics with funnel visualization and UTM tracking' },
      { number: 26, title: 'Partner Application & Vetting Workflow', description: 'Automated partner approval with notification pipeline' }
    ],
    dependentClaims: 12
  },
  {
    id: 'marketing',
    name: 'Marketing Toolkit',
    icon: Award,
    color: 'from-fuchsia-500 to-pink-500',
    bgColor: 'bg-fuchsia-500/10',
    borderColor: 'border-fuchsia-500/30',
    textColor: 'text-fuchsia-400',
    isNew: true,
    claims: [
      { number: 27, title: 'Automated Partner Marketing Toolkit', description: 'Dynamic attribution injection with ROI messaging (7x value proposition)' }
    ],
    dependentClaims: 3
  }
];

// Calculate totals
const totalIndependentClaims = claimCategories.reduce((acc, cat) => acc + cat.claims.length, 0);
const totalDependentClaims = claimCategories.reduce((acc, cat) => acc + cat.dependentClaims, 0);

const PatentPortfolioVisualization: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [hoveredClaim, setHoveredClaim] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Scale className="h-7 w-7 text-mansagold" />
            Patent Portfolio Visualization
          </h2>
          <p className="text-blue-200/70 mt-1">
            27 Independent Claims • USPTO Provisional Filing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
            <Shield className="h-3 w-3 mr-1" />
            Patent Pending
          </Badge>
          <Badge variant="outline" className="border-amber-500/50 text-amber-400 bg-amber-500/10">
            <Clock className="h-3 w-3 mr-1" />
            Filed Jan 2026
          </Badge>
        </div>
      </div>

      {/* Portfolio Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-mansagold/20 to-amber-500/10 border-mansagold/30">
          <CardContent className="pt-4 text-center">
            <p className="text-4xl font-bold text-mansagold">{totalIndependentClaims}</p>
            <p className="text-xs text-blue-200/70">Independent Claims</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border-blue-500/30">
          <CardContent className="pt-4 text-center">
            <p className="text-4xl font-bold text-blue-400">{totalDependentClaims}+</p>
            <p className="text-xs text-blue-200/70">Dependent Claims</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-emerald-500/30">
          <CardContent className="pt-4 text-center">
            <p className="text-4xl font-bold text-emerald-400">{claimCategories.length}</p>
            <p className="text-xs text-blue-200/70">Technology Areas</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/20 to-violet-500/10 border-purple-500/30">
          <CardContent className="pt-4 text-center">
            <p className="text-4xl font-bold text-purple-400">22</p>
            <p className="text-xs text-blue-200/70">Protected Constants</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-rose-500/20 to-pink-500/10 border-rose-500/30">
          <CardContent className="pt-4 text-center">
            <p className="text-4xl font-bold text-rose-400">$80</p>
            <p className="text-xs text-blue-200/70">Micro Entity Fee</p>
          </CardContent>
        </Card>
      </div>

      {/* Claim Number Grid - Visual Overview */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <FileCheck className="h-5 w-5 text-mansagold" />
            Claim Coverage Map
          </CardTitle>
          <CardDescription className="text-blue-200/60">
            Hover over a claim number to see details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="grid grid-cols-9 md:grid-cols-14 lg:grid-cols-27 gap-2">
              {Array.from({ length: 27 }, (_, i) => {
                const claimNum = i + 1;
                const category = claimCategories.find(cat => 
                  cat.claims.some(c => c.number === claimNum)
                );
                const claim = category?.claims.find(c => c.number === claimNum);
                const Icon = category?.icon || Shield;
                const isNew = category?.isNew;
                
                return (
                  <Tooltip key={claimNum}>
                    <TooltipTrigger asChild>
                      <motion.div
                        className={`relative aspect-square rounded-lg ${category?.bgColor} border ${category?.borderColor} flex items-center justify-center cursor-pointer transition-all ${
                          hoveredClaim === claimNum ? 'ring-2 ring-white scale-110 z-10' : ''
                        }`}
                        onMouseEnter={() => setHoveredClaim(claimNum)}
                        onMouseLeave={() => setHoveredClaim(null)}
                        whileHover={{ scale: 1.1 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <span className={`text-sm font-bold ${category?.textColor}`}>{claimNum}</span>
                        {isNew && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        )}
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs bg-slate-900 border-white/20">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${category?.textColor}`} />
                          <span className="font-semibold text-white">Claim {claimNum}</span>
                          {isNew && <Badge className="bg-amber-500/20 text-amber-400 text-xs">NEW</Badge>}
                        </div>
                        <p className="text-sm font-medium text-white">{claim?.title}</p>
                        <p className="text-xs text-blue-200/70">{claim?.description}</p>
                        <p className="text-xs text-blue-200/50">Category: {category?.name}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid md:grid-cols-2 gap-4">
        {claimCategories.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategory === category.id;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: claimCategories.indexOf(category) * 0.05 }}
            >
              <Card 
                className={`${category.bgColor} border ${category.borderColor} cursor-pointer transition-all hover:scale-[1.02]`}
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-white flex items-center gap-2 text-base">
                          {category.name}
                          {category.isNew && (
                            <Badge className="bg-amber-500/20 text-amber-400 text-xs animate-pulse">NEW</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="text-blue-200/60 text-xs">
                          {category.claims.length} independent • {category.dependentClaims} dependent
                        </CardDescription>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-blue-200/50" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-blue-200/50" />
                    )}
                  </div>
                  
                  {/* Progress bar showing claims in category */}
                  <Progress 
                    value={(category.claims.length / totalIndependentClaims) * 100} 
                    className="h-1 mt-3 bg-white/10" 
                  />
                </CardHeader>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0 space-y-2">
                        {category.claims.map((claim) => (
                          <div 
                            key={claim.number}
                            className="p-3 rounded-lg bg-black/20 border border-white/5"
                          >
                            <div className="flex items-start gap-2">
                              <Badge 
                                variant="outline" 
                                className={`${category.borderColor} ${category.textColor} text-xs shrink-0`}
                              >
                                #{claim.number}
                              </Badge>
                              <div>
                                <p className="text-sm font-medium text-white">{claim.title}</p>
                                <p className="text-xs text-blue-200/60 mt-1">{claim.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filing Timeline */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-mansagold" />
            Patent Filing Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-green-500 via-amber-500 to-blue-500" />
            
            <div className="space-y-6">
              {[
                { date: 'January 22, 2026', action: 'Provisional Application Filed (Claims 1-18)', status: 'completed', color: 'green' },
                { date: 'January 25, 2026', action: 'Amendment Filed (Claims 19-20 Platform Wallet)', status: 'completed', color: 'green' },
                { date: 'January 30, 2026', action: 'Amendment Filed (Claims 21-27 Partner System)', status: 'pending', color: 'amber' },
                { date: 'September 1, 2026', action: 'Founding Member/Partner Cutoff Date', status: 'upcoming', color: 'rose' },
                { date: 'January 22, 2027', action: 'Non-Provisional OR PCT Filing Due', status: 'upcoming', color: 'blue' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4 ml-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={`w-7 h-7 rounded-full bg-${item.color}-500/20 border-2 border-${item.color}-500 flex items-center justify-center z-10`}>
                    {item.status === 'completed' ? (
                      <FileCheck className={`h-3.5 w-3.5 text-${item.color}-400`} />
                    ) : item.status === 'pending' ? (
                      <Clock className={`h-3.5 w-3.5 text-${item.color}-400`} />
                    ) : (
                      <Activity className={`h-3.5 w-3.5 text-${item.color}-400`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.action}</p>
                    <p className="text-xs text-blue-200/60">{item.date}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`border-${item.color}-500/50 text-${item.color}-400 bg-${item.color}-500/10 text-xs`}
                  >
                    {item.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valuation Impact Note */}
      <Card className="bg-gradient-to-r from-mansagold/20 via-amber-500/10 to-orange-500/20 border-mansagold/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-mansagold/20">
              <TrendingUp className="h-6 w-6 text-mansagold" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Strategic Valuation Impact</h3>
              <p className="text-sm text-blue-200/80 mb-3">
                This 27-claim portfolio positions 1325.AI as <span className="text-mansagold font-semibold">"Self-Scaling Infrastructure"</span> with 
                estimated buyout potential in the <span className="text-green-400 font-semibold">$1B+ "Unicorn" territory</span> for strategic acquirers 
                like Visa, Chase, or Block (Square).
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Partner Vetting = Reduced Network Risk</Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">ROI Messaging = Economic Alpha Proof</Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Velocity Analytics = Proprietary Data Asset</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatentPortfolioVisualization;
