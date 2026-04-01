import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Search, Users, Store, QrCode, TrendingUp, Heart, Calendar,
  Star, BarChart3, MessageSquare, Globe, Smartphone, Gift, Target,
  Zap, Clock, CheckCircle, ArrowRight, DollarSign, Receipt, Wallet,
  Award, Sparkles, Brain, Shield, ChevronRight, BookOpen
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  details: string[];
  color: string;
  badge: string;
  category: 'consumer' | 'business' | 'impact';
}

const FeatureGuidePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'consumer' | 'business' | 'impact'>('all');

  const features: Feature[] = [
    // Consumer Features
    {
      icon: QrCode,
      title: 'QR Code Scanning & Instant Discounts',
      description: 'Scan QR codes at checkout to earn loyalty points and receive instant discounts',
      details: ['15% instant discount on purchases', 'Earn 25 loyalty points per transaction', 'Automatic purchase tracking', 'No physical loyalty cards needed'],
      color: 'from-mansagold to-amber-600',
      badge: 'CONSUMER',
      category: 'consumer',
    },
    {
      icon: Globe,
      title: 'Verified Business Directory',
      description: 'Discover and connect with verified community businesses',
      details: ['Find businesses by category & location', 'Read community reviews & ratings', 'View exclusive offers & promotions', 'Support local entrepreneurs'],
      color: 'from-blue-500 to-cyan-500',
      badge: 'CONSUMER',
      category: 'consumer',
    },
    {
      icon: Gift,
      title: 'Loyalty Points & Rewards',
      description: 'Accumulate points and redeem for exclusive discounts and offers',
      details: ['Earn points on every transaction', 'Redeem at any participating business', 'Track your lifetime savings', 'Special member-only offers'],
      color: 'from-orange-500 to-amber-500',
      badge: 'CONSUMER',
      category: 'consumer',
    },
    {
      icon: Smartphone,
      title: 'Native Mobile Experience',
      description: 'Full-featured mobile app with offline capabilities',
      details: ['Fast, native performance', 'Works offline', 'Push notifications', 'Camera integration for QR scanning'],
      color: 'from-violet-500 to-purple-500',
      badge: 'CONSUMER',
      category: 'consumer',
    },
    {
      icon: Zap,
      title: 'Real-Time Business Updates',
      description: 'Get instant notifications about new businesses, offers, and events',
      details: ['Never miss a new business opening', 'Get notified of flash sales', 'Stay connected to community', 'Customizable notification preferences'],
      color: 'from-yellow-500 to-orange-500',
      badge: 'CONSUMER',
      category: 'consumer',
    },
    // Business Features
    {
      icon: Sparkles,
      title: 'AI Business Coach (Kayla)',
      description: 'Personalized growth insights and recommendations powered by AI',
      details: ['Smart business recommendations', 'Performance trend analysis', 'Growth opportunity alerts', 'Actionable improvement tips'],
      color: 'from-mansagold to-amber-600',
      badge: 'AI',
      category: 'business',
    },
    {
      icon: BarChart3,
      title: 'Business Analytics Dashboard',
      description: 'Comprehensive dashboard to track engagement, sales, and performance',
      details: ['Real-time sales & customer data', 'Track customer retention rates', 'View peak shopping times', 'Monitor loyalty program effectiveness'],
      color: 'from-indigo-500 to-violet-500',
      badge: 'TOOLS',
      category: 'business',
    },
    {
      icon: Calendar,
      title: 'Appointment Booking & Management',
      description: 'Allow customers to book appointments and manage your schedule',
      details: ['Reduce no-shows with automated reminders', 'Accept bookings 24/7', 'Sync with your calendar', 'Collect customer info automatically'],
      color: 'from-blue-500 to-cyan-500',
      badge: 'TOOLS',
      category: 'business',
    },
    {
      icon: DollarSign,
      title: 'Full Accounting Suite',
      description: 'QuickBooks-style financial management with comprehensive reporting',
      details: ['Profit & Loss statements', 'Cash flow tracking', 'Budget planning & alerts', 'Balance sheet reports'],
      color: 'from-green-500 to-emerald-500',
      badge: 'FINANCE',
      category: 'business',
    },
    {
      icon: Receipt,
      title: 'Invoice & Expense Tracking',
      description: 'Professional billing with comprehensive invoice and expense management',
      details: ['Create professional invoices', 'Track paid/unpaid/overdue', 'Expense categorization', 'Tax rate management'],
      color: 'from-emerald-500 to-green-600',
      badge: 'FINANCE',
      category: 'business',
    },
    {
      icon: Wallet,
      title: 'Bank Reconciliation',
      description: 'Match transactions automatically and maintain accurate bookkeeping',
      details: ['Import bank statements', 'Auto-match transactions', 'Identify discrepancies', 'Accurate bookkeeping'],
      color: 'from-sky-500 to-blue-600',
      badge: 'FINANCE',
      category: 'business',
    },
    {
      icon: QrCode,
      title: 'QR Payment System',
      description: 'Accept payments instantly with your unique QR code',
      details: ['Unique QR code for your business', 'Customers scan & pay easily', 'Automatic loyalty points', 'Real-time payment tracking'],
      color: 'from-purple-500 to-pink-500',
      badge: 'TOOLS',
      category: 'business',
    },
    {
      icon: Gift,
      title: 'Customer Loyalty Program',
      description: 'Build repeat business with tiered rewards and automated progression',
      details: ['Bronze/Silver/Gold/Platinum tiers', 'Points multipliers (up to 2x)', 'Automated tier progression', 'Reward redemption system'],
      color: 'from-orange-500 to-amber-500',
      badge: 'OPERATIONS',
      category: 'business',
    },
    {
      icon: Award,
      title: 'Loyalty Program Management',
      description: 'Full admin control over your loyalty system with analytics',
      details: ['Member analytics dashboard', 'Tier management controls', 'Reward redemption tracking', 'Points distribution reports'],
      color: 'from-fuchsia-500 to-pink-500',
      badge: 'OPERATIONS',
      category: 'business',
    },
    {
      icon: Gift,
      title: 'Rewards Marketplace',
      description: 'Pre-built rewards with custom creation and automated fulfillment',
      details: ['8+ ready-to-use rewards', 'Custom reward creation', 'Point cost management', 'Automated fulfillment tracking'],
      color: 'from-amber-500 to-yellow-500',
      badge: 'OPERATIONS',
      category: 'business',
    },
    {
      icon: MessageSquare,
      title: 'Customer Review System',
      description: 'Build credibility with social proof from customer reviews',
      details: ['Collect customer reviews easily', 'Showcase testimonials publicly', 'Respond to feedback directly', 'Boost online reputation'],
      color: 'from-pink-500 to-rose-500',
      badge: 'MARKETING',
      category: 'business',
    },
    {
      icon: Star,
      title: 'Automated Review Requests',
      description: 'Automatically request reviews after completed bookings',
      details: ['Automatic email requests after service', 'Increase review volume by 3-5x', 'Track review request analytics', 'Manual request option available'],
      color: 'from-violet-500 to-purple-500',
      badge: 'MARKETING',
      category: 'business',
    },
    {
      icon: Store,
      title: 'Business Profile & Directory',
      description: 'Get discovered by new customers with a public listing',
      details: ['Public business listing', 'Customer reviews & ratings', 'Photo gallery showcase', 'Contact & location info'],
      color: 'from-sky-500 to-blue-500',
      badge: 'TOOLS',
      category: 'business',
    },
    {
      icon: Users,
      title: 'Customer Behavior Insights',
      description: 'Detailed analytics on shopping patterns and preferences',
      details: ['See customer demographics', 'Track repeat customer rates', 'Identify top customers', 'Personalize marketing efforts'],
      color: 'from-teal-500 to-emerald-500',
      badge: 'TOOLS',
      category: 'business',
    },
    // Impact Features
    {
      icon: Heart,
      title: 'Community Impact Tracking',
      description: 'See real-time economic impact of spending on community businesses',
      details: ['Track your personal economic impact', 'See community-wide statistics', 'Understand wealth circulation effects', 'Share impact on social media'],
      color: 'from-red-500 to-rose-500',
      badge: 'COMMUNITY',
      category: 'impact',
    },
    {
      icon: TrendingUp,
      title: 'The Multiplier Effect Visualization',
      description: 'Watch how spending creates a ripple effect of economic opportunity',
      details: ['Understand economic circulation', 'See job creation impact', 'Learn about wealth building', 'Motivate continued support'],
      color: 'from-mansagold to-amber-500',
      badge: 'COMMUNITY',
      category: 'impact',
    },
  ];

  const badgeColors: Record<string, string> = {
    'CONSUMER': 'bg-mansagold/20 text-mansagold border-mansagold/30',
    'AI': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    'TOOLS': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'FINANCE': 'bg-green-500/20 text-green-400 border-green-500/30',
    'OPERATIONS': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
    'MARKETING': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'COMMUNITY': 'bg-red-500/20 text-red-400 border-red-500/30',
    'GROWTH': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  };

  const categoryTabs = [
    { value: 'all', label: 'All Features' },
    { value: 'consumer', label: 'Consumers' },
    { value: 'business', label: 'Businesses' },
    { value: 'impact', label: 'Impact' },
  ];

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = searchQuery === '' ||
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.badge.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || feature.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (category: string) => features.filter(f => f.category === category).length;

  return (
    <>
      <Helmet>
        <title>Feature Guide — Everything 1325.AI Can Do | 1325.AI</title>
        <meta name="description" content="Comprehensive guide to all 1325.AI features for consumers, businesses, and community impact tracking." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#050a18] to-[#030712] relative flex flex-col py-12">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-mansablue/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        </div>

        <main className="relative z-10 flex-1 py-8">
          {/* Hero Banner — matches business-signup style */}
          <div className="container mx-auto px-4 mb-8 animate-fade-in">
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-mansagold/30 via-purple-500/20 to-mansablue/30 rounded-3xl blur-3xl" />
              <div className="relative border-2 border-mansagold/40 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-purple-900/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-mansagold via-amber-400 to-orange-500" />
                <div className="absolute top-8 right-10 w-32 h-32 bg-mansagold/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-8 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-mansagold/15 border border-mansagold/30 rounded-full mb-6">
                    <Sparkles className="w-4 h-4 text-mansagold" />
                    <span className="text-sm font-semibold text-mansagold">Complete Feature Guide</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4">
                    <span className="text-white">Everything You Can Do with </span>
                    <span className="bg-gradient-to-r from-mansagold via-amber-300 to-orange-400 bg-clip-text text-transparent">1325.AI</span>
                  </h1>
                  <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                    Discover powerful features for consumers, business owners, and community impact tracking. 🚀
                  </p>

                  {/* Search Bar */}
                  <div className="relative max-w-2xl mx-auto mb-8">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-mansagold h-5 w-5 z-10" />
                    <Input
                      type="text"
                      placeholder="Search features... (e.g., 'QR code', 'analytics', 'reviews')"
                      style={{ WebkitTextFillColor: 'inherit', opacity: 1 }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-14 text-base bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl focus:ring-4 focus:ring-mansagold/30 focus:border-mansagold/50 font-medium text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
                    <div className="text-center">
                      <p className="text-3xl md:text-4xl font-extrabold text-mansagold">{features.length}</p>
                      <p className="text-sm text-slate-400">Total Features</p>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-white/20" />
                    <div className="text-center">
                      <p className="text-3xl md:text-4xl font-extrabold text-blue-400">{getCategoryCount('consumer')}</p>
                      <p className="text-sm text-slate-400">Consumer</p>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-white/20" />
                    <div className="text-center">
                      <p className="text-3xl md:text-4xl font-extrabold text-green-400">{getCategoryCount('business')}</p>
                      <p className="text-sm text-slate-400">Business</p>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-white/20" />
                    <div className="text-center">
                      <p className="text-3xl md:text-4xl font-extrabold text-red-400">{getCategoryCount('impact')}</p>
                      <p className="text-sm text-slate-400">Impact</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="container mx-auto px-4 mb-8 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <div className="max-w-5xl mx-auto flex flex-wrap gap-3 justify-center">
              {categoryTabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setActiveCategory(tab.value as any)}
                  className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 border ${
                    activeCategory === tab.value
                      ? 'bg-mansagold/20 border-mansagold/40 text-mansagold shadow-lg shadow-mansagold/10'
                      : 'bg-slate-800/60 border-white/10 text-slate-300 hover:border-white/25 hover:bg-slate-800/80'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeCategory === tab.value ? 'bg-mansagold/30 text-mansagold' : 'bg-white/10 text-slate-400'
                  }`}>
                    {tab.value === 'all' ? features.length : getCategoryCount(tab.value)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Features Grid — matching business-signup card style */}
          <div className="container mx-auto px-4 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="max-w-5xl mx-auto">
              {filteredFeatures.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-block p-4 bg-slate-800/60 rounded-full mb-4">
                    <Search className="h-12 w-12 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-lg font-medium">No features found matching your search. 🔍</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFeatures.map((feature, index) => (
                    <motion.div
                      key={`${feature.title}-${index}`}
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
              )}
            </div>
          </div>

          {/* CTA Section */}
          <div className="container mx-auto px-4 mt-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="max-w-5xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-mansagold/20 via-amber-500/20 to-orange-500/20 rounded-2xl blur-2xl" />
                <div className="relative bg-slate-800/80 backdrop-blur-xl border border-mansagold/30 rounded-2xl p-8 md:p-12 text-center">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Ready to Get Started? 🚀</h2>
                  <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                    Join thousands of consumers and business owners building economic power in Black communities.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      onClick={() => navigate('/signup')}
                      className="bg-gradient-to-r from-mansagold via-amber-500 to-orange-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-500 text-slate-900 font-bold shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6 hover:scale-105"
                    >
                      Sign Up as Consumer
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => navigate('/business-signup')}
                      className="bg-white/10 text-white hover:bg-mansagold/20 border-2 border-mansagold backdrop-blur-sm font-bold shadow-lg hover:shadow-xl transition-all text-lg px-8 py-6 hover:scale-105"
                    >
                      Register Your Business
                      <Store className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="container mx-auto px-4 mt-8 mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/help')}
                className="flex-1 flex items-center justify-between px-6 py-4 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-mansagold/30 hover:bg-slate-800/80 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-mansagold" />
                  <span className="font-semibold text-white">Visit FAQ & Help Center</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-mansagold transition-colors" />
              </button>
              <button
                onClick={() => navigate('/support')}
                className="flex-1 flex items-center justify-between px-6 py-4 bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-blue-500/30 hover:bg-slate-800/80 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-white">Contact Support</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default FeatureGuidePage;
