
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BusinessSignupForm from '@/components/auth/forms/BusinessSignupForm';
import { getSalesAgentByReferralCode } from '@/lib/api/sales-agent-api';
import { SalesAgent } from '@/types/sales-agent';
import { Calendar, DollarSign, QrCode, Users, TrendingUp, Receipt, CheckCircle, PieChart, Wallet, BarChart3, Clock, CreditCard, FileText, Target, Bell, Shield } from 'lucide-react';

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

  const includedFeatures = [
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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: DollarSign,
      title: 'Full Accounting Suite',
      description: 'QuickBooks-style financial management',
      details: [
        'Profit & Loss statements',
        'Cash flow tracking',
        'Budget planning & alerts',
        'Balance sheet reports'
      ],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Receipt,
      title: 'Invoice & Expense Tracking',
      description: 'Professional billing made easy',
      details: [
        'Create professional invoices',
        'Track paid/unpaid/overdue',
        'Expense categorization',
        'Tax rate management'
      ],
      color: 'from-rose-500 to-red-500'
    },
    {
      icon: QrCode,
      title: 'QR Payment System',
      description: 'Accept payments instantly',
      details: [
        'Unique QR code for your business',
        'Customers scan & pay easily',
        'Automatic loyalty points',
        'Real-time payment tracking'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Customer Loyalty Program',
      description: 'Build repeat business automatically',
      details: [
        'Points for every purchase',
        'Custom reward tiers',
        'Customer visit tracking',
        'Automated engagement'
      ],
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Data-driven business insights',
      details: [
        'Sales & revenue trends',
        'Customer behavior analytics',
        'Peak hours identification',
        'Performance benchmarks'
      ],
      color: 'from-indigo-500 to-violet-500'
    },
    {
      icon: Wallet,
      title: 'Bank Reconciliation',
      description: 'Match transactions automatically',
      details: [
        'Import bank statements',
        'Auto-match transactions',
        'Identify discrepancies',
        'Accurate bookkeeping'
      ],
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Business Profile & Directory',
      description: 'Get discovered by new customers',
      details: [
        'Public business listing',
        'Customer reviews & ratings',
        'Photo gallery showcase',
        'Contact & location info'
      ],
      color: 'from-sky-500 to-blue-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 relative flex flex-col justify-center py-12">
      <Helmet>
        <title>Business Sign Up | Mansa Musa Marketplace</title>
        <meta name="description" content="Register your business with Mansa Musa Marketplace" />
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
        {/* Info Banner */}
        <div className="container mx-auto px-4 mb-8 animate-fade-in">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-mansablue/30 via-blue-500/30 to-mansagold/30 rounded-2xl blur-2xl" />
            <div className="relative border border-white/10 bg-slate-800/60 backdrop-blur-xl rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold"></div>
              <div className="flex items-center gap-4 pt-2">
                <div className="bg-gradient-to-br from-mansablue via-blue-500 to-mansagold p-4 rounded-2xl shadow-xl shadow-mansagold/30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4"/>
                    <path d="M12 8h.01"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg bg-gradient-to-r from-mansagold via-amber-400 to-orange-400 bg-clip-text text-transparent">New to MMM Payments? 🚀</p>
                  <p className="text-sm text-slate-300 font-medium">Learn how our QR payment system works for your business</p>
                </div>
              </div>
              <Link 
                to="/business/how-it-works" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mansablue via-blue-500 to-mansagold hover:from-blue-600 hover:via-blue-600 hover:to-amber-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-bold hover:scale-105"
              >
                See How It Works
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/>
                  <path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Included Features Section */}
        <div className="container mx-auto px-4 mb-8 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-mansagold/20 border border-mansagold/30 rounded-full mb-4">
                <Shield className="w-4 h-4 text-mansagold" />
                <span className="text-sm font-semibold text-mansagold">All Included In Your Monthly Fee</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Everything You Need to Run Your Business
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                No hidden fees, no extra charges. Get powerful tools worth $500+/month — all included in one simple subscription.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {includedFeatures.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="relative group animate-fade-in"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-300`} />
                  <div className="relative bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-300 h-full">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} flex-shrink-0 shadow-lg`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-white text-lg">
                            {feature.title}
                          </h3>
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        </div>
                        <p className="text-sm text-slate-300 mb-3">
                          {feature.description}
                        </p>
                        <ul className="space-y-1.5">
                          {feature.details.map((detail, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color}`} />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Value Summary */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-mansagold/20 via-amber-500/20 to-orange-500/20 rounded-2xl blur-2xl" />
              <div className="relative bg-slate-800/80 backdrop-blur-xl border border-mansagold/30 rounded-2xl p-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                  <div>
                    <p className="text-3xl font-bold text-mansagold">8+</p>
                    <p className="text-sm text-slate-400">Premium Tools</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div>
                    <p className="text-3xl font-bold text-green-400">$500+</p>
                    <p className="text-sm text-slate-400">Value Per Month</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div>
                    <p className="text-3xl font-bold text-blue-400">24/7</p>
                    <p className="text-sm text-slate-400">Customer Booking</p>
                  </div>
                  <div className="hidden md:block w-px h-12 bg-white/20" />
                  <div>
                    <p className="text-3xl font-bold text-purple-400">$0</p>
                    <p className="text-sm text-slate-400">Extra Fees</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Container with gradient */}
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
