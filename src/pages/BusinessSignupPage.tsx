
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BusinessSignupForm from '@/components/auth/forms/BusinessSignupForm';
import { getSalesAgentByReferralCode } from '@/lib/api/sales-agent-api';
import { SalesAgent } from '@/types/sales-agent';
import { Calendar, DollarSign, QrCode, Users, TrendingUp, Receipt, CheckCircle } from 'lucide-react';

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
      title: 'Booking System',
      description: 'Let customers book appointments online 24/7',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: DollarSign,
      title: 'Accounting Suite',
      description: 'P&L reports, invoices, expenses & budgeting',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: QrCode,
      title: 'QR Payment System',
      description: 'Accept payments with scannable QR codes',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Customer Loyalty',
      description: 'Reward repeat customers automatically',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Track sales, visits & customer insights',
      color: 'from-indigo-500 to-violet-500'
    },
    {
      icon: Receipt,
      title: 'Invoice Management',
      description: 'Create & send professional invoices',
      color: 'from-rose-500 to-red-500'
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Everything Included in Your Subscription
              </h2>
              <p className="text-slate-400">
                All these powerful tools are part of your monthly fee — no extra charges!
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {includedFeatures.map((feature, index) => (
                <div 
                  key={feature.title}
                  className="relative group"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-xl blur-xl transition-opacity duration-300`} />
                  <div className="relative bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300 h-full">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${feature.color} flex-shrink-0`}>
                        <feature.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white text-sm flex items-center gap-1">
                          {feature.title}
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
