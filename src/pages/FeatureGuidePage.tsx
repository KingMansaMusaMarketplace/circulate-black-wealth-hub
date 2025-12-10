import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Users, 
  Store, 
  QrCode, 
  TrendingUp, 
  Heart, 
  Mail,
  Calendar,
  Star,
  BarChart3,
  MessageSquare,
  Globe,
  Smartphone,
  Gift,
  Target,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Receipt,
  Wallet,
  Award,
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'consumer' | 'business' | 'impact';
  tags: string[];
  benefits: string[];
  howToUse?: string[];
}

const FeatureGuidePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'consumer' | 'business' | 'impact'>('all');

  const features: Feature[] = [
    {
      id: 'qr-scanning',
      title: 'QR Code Scanning & Instant Discounts',
      description: 'Scan QR codes at checkout to earn loyalty points and receive instant discounts on your purchases.',
      icon: <QrCode className="h-6 w-6" />,
      category: 'consumer',
      tags: ['loyalty', 'savings', 'mobile'],
      benefits: [
        'Get 15% instant discount on purchases',
        'Earn 25 loyalty points per transaction',
        'Automatic tracking of all your purchases',
        'No physical loyalty cards needed'
      ],
      howToUse: [
        'Open the Mansa Musa app',
        'Tap the "Scan" button at checkout',
        'Point camera at business QR code',
        'Discount applied automatically'
      ]
    },
    {
      id: 'business-directory',
      title: 'Black-Owned Business Directory',
      description: 'Discover and connect with Black-owned businesses in your community through our comprehensive directory.',
      icon: <Globe className="h-6 w-6" />,
      category: 'consumer',
      tags: ['discovery', 'search', 'community'],
      benefits: [
        'Find businesses by category and location',
        'Read reviews and ratings from community',
        'View exclusive offers and promotions',
        'Support local Black entrepreneurs'
      ],
      howToUse: [
        'Navigate to Directory page',
        'Use filters to narrow your search',
        'View business profiles and details',
        'Save favorites for quick access'
      ]
    },
    {
      id: 'loyalty-rewards',
      title: 'Loyalty Points & Rewards',
      description: 'Accumulate points with every purchase and redeem them for exclusive discounts and special offers.',
      icon: <Gift className="h-6 w-6" />,
      category: 'consumer',
      tags: ['rewards', 'savings', 'loyalty'],
      benefits: [
        'Earn points on every transaction',
        'Redeem for discounts at any participating business',
        'Track your lifetime savings',
        'Special member-only offers'
      ]
    },
    {
      id: 'business-dashboard',
      title: 'Business Analytics Dashboard',
      description: 'Comprehensive dashboard to track customer engagement, sales trends, and business performance.',
      icon: <BarChart3 className="h-6 w-6" />,
      category: 'business',
      tags: ['analytics', 'insights', 'management'],
      benefits: [
        'Real-time sales and customer data',
        'Track customer retention rates',
        'View peak shopping times',
        'Monitor loyalty program effectiveness'
      ],
      howToUse: [
        'Log in to your business account',
        'Navigate to Analytics Dashboard',
        'View metrics and trends',
        'Download reports for deeper analysis'
      ]
    },
    {
      id: 'booking-system',
      title: 'Appointment Booking & Management',
      description: 'Allow customers to book appointments online and manage your schedule efficiently.',
      icon: <Calendar className="h-6 w-6" />,
      category: 'business',
      tags: ['scheduling', 'appointments', 'automation'],
      benefits: [
        'Reduce no-shows with automated reminders',
        'Accept bookings 24/7',
        'Sync with your calendar',
        'Collect customer information automatically'
      ],
      howToUse: [
        'Set up your services and availability',
        'Share booking link with customers',
        'Receive booking notifications',
        'Manage appointments from dashboard'
      ]
    },
    {
      id: 'full-accounting',
      title: 'Full Accounting Suite',
      description: 'QuickBooks-style financial management for your business with comprehensive reporting.',
      icon: <DollarSign className="h-6 w-6" />,
      category: 'business',
      tags: ['accounting', 'finance', 'reports', 'new'],
      benefits: [
        'Profit & Loss statements',
        'Cash flow tracking',
        'Budget planning & alerts',
        'Balance sheet reports'
      ],
      howToUse: [
        'Access Accounting from your dashboard',
        'Set up your chart of accounts',
        'Generate financial reports anytime',
        'Export to PDF or Excel'
      ]
    },
    {
      id: 'invoice-expense',
      title: 'Invoice & Expense Tracking',
      description: 'Professional billing made easy with comprehensive invoice and expense management.',
      icon: <Receipt className="h-6 w-6" />,
      category: 'business',
      tags: ['invoicing', 'expenses', 'billing', 'new'],
      benefits: [
        'Create professional invoices',
        'Track paid/unpaid/overdue',
        'Expense categorization',
        'Tax rate management'
      ],
      howToUse: [
        'Create invoices from dashboard',
        'Send directly to customers via email',
        'Track payment status automatically',
        'Categorize expenses for tax time'
      ]
    },
    {
      id: 'qr-payment',
      title: 'QR Payment System',
      description: 'Accept payments instantly with your unique QR code that customers can scan and pay.',
      icon: <QrCode className="h-6 w-6" />,
      category: 'business',
      tags: ['payments', 'qr', 'mobile', 'new'],
      benefits: [
        'Unique QR code for your business',
        'Customers scan & pay easily',
        'Automatic loyalty points',
        'Real-time payment tracking'
      ],
      howToUse: [
        'Get your unique business QR code',
        'Display at your checkout counter',
        'Customers scan to pay instantly',
        'Track all payments in real-time'
      ]
    },
    {
      id: 'loyalty-program',
      title: 'Customer Loyalty Program',
      description: 'Build repeat business automatically with tiered rewards and automated progression.',
      icon: <Gift className="h-6 w-6" />,
      category: 'business',
      tags: ['loyalty', 'rewards', 'retention', 'tiers'],
      benefits: [
        'Bronze/Silver/Gold/Platinum tiers',
        'Points multipliers (up to 2x)',
        'Automated tier progression',
        'Reward redemption system'
      ],
      howToUse: [
        'Configure your points structure',
        'Set up reward tiers',
        'Customers earn automatically',
        'Track engagement in analytics'
      ]
    },
    {
      id: 'loyalty-management',
      title: 'Loyalty Program Management',
      description: 'Full admin control over your loyalty system with comprehensive analytics and member tracking.',
      icon: <Award className="h-6 w-6" />,
      category: 'business',
      tags: ['loyalty', 'admin', 'management', 'analytics', 'new'],
      benefits: [
        'Member analytics dashboard',
        'Tier management controls',
        'Reward redemption tracking',
        'Points distribution reports'
      ],
      howToUse: [
        'Access Loyalty Management in dashboard',
        'View member tier distribution',
        'Track reward redemptions',
        'Analyze points trends'
      ]
    },
    {
      id: 'ai-business-coach',
      title: 'AI Business Coach',
      description: 'Get personalized growth insights and recommendations powered by AI to help your business thrive.',
      icon: <Sparkles className="h-6 w-6" />,
      category: 'business',
      tags: ['ai', 'insights', 'growth', 'recommendations', 'new'],
      benefits: [
        'Smart business recommendations',
        'Performance trend analysis',
        'Growth opportunity alerts',
        'Actionable improvement tips'
      ],
      howToUse: [
        'Access AI Coach from dashboard',
        'Review personalized insights',
        'Follow growth recommendations',
        'Track improvement over time'
      ]
    },
    {
      id: 'customer-review-system',
      title: 'Customer Review System',
      description: 'Build credibility with social proof by collecting and showcasing customer reviews.',
      icon: <MessageSquare className="h-6 w-6" />,
      category: 'business',
      tags: ['reviews', 'reputation', 'testimonials', 'new'],
      benefits: [
        'Collect customer reviews easily',
        'Showcase testimonials publicly',
        'Respond to feedback directly',
        'Boost online reputation'
      ],
      howToUse: [
        'Enable reviews in settings',
        'Customers leave reviews after visits',
        'Respond to reviews from dashboard',
        'Reviews appear on your profile'
      ]
    },
    {
      id: 'rewards-marketplace',
      title: 'Rewards Marketplace',
      description: 'Pre-built rewards your customers love with custom creation options and automated fulfillment.',
      icon: <Gift className="h-6 w-6" />,
      category: 'business',
      tags: ['rewards', 'marketplace', 'loyalty', 'new'],
      benefits: [
        '8+ ready-to-use rewards',
        'Custom reward creation',
        'Point cost management',
        'Automated fulfillment tracking'
      ],
      howToUse: [
        'Browse pre-built reward templates',
        'Create custom rewards for your business',
        'Set point costs for each reward',
        'Track redemptions automatically'
      ]
    },
    {
      id: 'bank-reconciliation',
      title: 'Bank Reconciliation',
      description: 'Match transactions automatically and maintain accurate bookkeeping records.',
      icon: <Wallet className="h-6 w-6" />,
      category: 'business',
      tags: ['banking', 'reconciliation', 'bookkeeping', 'new'],
      benefits: [
        'Import bank statements',
        'Auto-match transactions',
        'Identify discrepancies',
        'Accurate bookkeeping'
      ],
      howToUse: [
        'Connect or import bank statements',
        'System auto-matches transactions',
        'Review and confirm matches',
        'Resolve discrepancies easily'
      ]
    },
    {
      id: 'automated-reviews',
      title: 'Automated Review Requests',
      description: 'Automatically request reviews from customers after completed bookings to build your reputation.',
      icon: <Star className="h-6 w-6" />,
      category: 'business',
      tags: ['reviews', 'reputation', 'automation'],
      benefits: [
        'Automatic email requests after service completion',
        'Increase review volume by 3-5x',
        'Track review request analytics',
        'Manual request option for flexibility'
      ],
      howToUse: [
        'System automatically sends after completed bookings',
        'Or manually request from Bookings page',
        'Customer receives professional branded email',
        'View analytics in Reviews dashboard tab'
      ]
    },
    {
      id: 'business-profile',
      title: 'Business Profile & Directory',
      description: 'Get discovered by new customers with a complete public business listing.',
      icon: <Store className="h-6 w-6" />,
      category: 'business',
      tags: ['branding', 'visibility', 'marketing', 'directory'],
      benefits: [
        'Public business listing',
        'Customer reviews & ratings',
        'Photo gallery showcase',
        'Contact & location info'
      ]
    },
    {
      id: 'analytics-dashboard',
      title: 'Analytics Dashboard',
      description: 'Data-driven business insights to help you make smarter decisions.',
      icon: <BarChart3 className="h-6 w-6" />,
      category: 'business',
      tags: ['analytics', 'insights', 'data'],
      benefits: [
        'Sales & revenue trends',
        'Customer behavior analytics',
        'Peak hours identification',
        'Performance benchmarks'
      ],
      howToUse: [
        'Log in to your business account',
        'Navigate to Analytics Dashboard',
        'View metrics and trends',
        'Download reports for deeper analysis'
      ]
    },
    {
      id: 'customer-insights',
      title: 'Customer Behavior Insights',
      description: 'Understand your customer base with detailed analytics on shopping patterns and preferences.',
      icon: <Users className="h-6 w-6" />,
      category: 'business',
      tags: ['insights', 'customers', 'data'],
      benefits: [
        'See customer demographics',
        'Track repeat customer rates',
        'Identify top customers',
        'Personalize marketing efforts'
      ]
    },
    {
      id: 'community-impact',
      title: 'Community Impact Tracking',
      description: 'See the real-time economic impact of your spending on Black-owned businesses and communities.',
      icon: <Heart className="h-6 w-6" />,
      category: 'impact',
      tags: ['impact', 'community', 'transparency'],
      benefits: [
        'Track your personal economic impact',
        'See community-wide statistics',
        'Understand wealth circulation effects',
        'Share impact on social media'
      ],
      howToUse: [
        'Visit Community Impact page',
        'View your personal impact metrics',
        'Explore community-wide data',
        'Share your impact story'
      ]
    },
    {
      id: 'multiplier-effect',
      title: 'The Multiplier Effect Visualization',
      description: 'Watch how your spending creates a ripple effect of economic opportunity in the community.',
      icon: <TrendingUp className="h-6 w-6" />,
      category: 'impact',
      tags: ['education', 'visualization', 'economics'],
      benefits: [
        'Understand economic circulation',
        'See job creation impact',
        'Learn about wealth building',
        'Motivate continued support'
      ]
    },
    {
      id: 'mobile-app',
      title: 'Native Mobile Experience',
      description: 'Full-featured mobile app with offline capabilities and native device integration.',
      icon: <Smartphone className="h-6 w-6" />,
      category: 'consumer',
      tags: ['mobile', 'app', 'convenience'],
      benefits: [
        'Fast, native performance',
        'Works offline',
        'Push notifications',
        'Camera integration for QR scanning'
      ]
    },
    {
      id: 'real-time-updates',
      title: 'Real-Time Business Updates',
      description: 'Get instant notifications about new businesses, special offers, and community events.',
      icon: <Zap className="h-6 w-6" />,
      category: 'consumer',
      tags: ['notifications', 'updates', 'engagement'],
      benefits: [
        'Never miss a new business opening',
        'Get notified of flash sales',
        'Stay connected to community',
        'Customizable notification preferences'
      ]
    }
  ];

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = searchQuery === '' || 
      feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feature.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || feature.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryCount = (category: 'consumer' | 'business' | 'impact') => {
    return features.filter(f => f.category === category).length;
  };

  return (
    <>
      <Helmet>
        <title>Feature Guide - Mansa Musa Marketplace</title>
        <meta name="description" content="Comprehensive guide to all Mansa Musa Marketplace features for consumers, businesses, and community impact tracking." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-mansablue-dark via-mansablue to-mansablue-light relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-96 h-96 bg-mansagold/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-[32rem] h-[32rem] bg-mansagold-light/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-mansablue-light/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-mansagold/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          
          {/* Grid overlay for modern effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-mansablue-dark via-mansablue to-mansablue-light border-b border-mansagold/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-mansagold/10 via-transparent to-mansagold/10"></div>
          <div className="container-custom py-20 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <Badge className="mb-4 bg-mansagold/20 text-mansagold-light border-mansagold/30 backdrop-blur-sm px-6 py-2 text-base font-bold shadow-lg shadow-mansagold/20">
                ✨ Complete Feature Guide
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">
                Everything You Can Do with <span className="bg-gradient-to-r from-mansagold via-mansagold-light to-white bg-clip-text text-transparent">Mansa Musa Marketplace</span>
              </h1>
              <p className="text-xl text-white/90 font-medium drop-shadow-lg">
                Discover powerful features for consumers, business owners, and community impact tracking. 🚀
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mt-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-mansagold h-6 w-6 z-10" />
                <Input
                  type="text"
                  placeholder="Search features... (e.g., 'QR code', 'analytics', 'reviews')"
                  style={{ WebkitTextFillColor: 'inherit', opacity: 1 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-16 text-lg md:text-xl bg-white/95 backdrop-blur-xl shadow-2xl shadow-mansagold/20 border-2 border-mansagold/20 rounded-2xl focus:ring-4 focus:ring-mansagold/30 font-semibold placeholder:text-base md:placeholder:text-lg text-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Content */}
        <section className="container-custom py-12 relative z-10">
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)} className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 p-2 bg-white/95 backdrop-blur-xl shadow-2xl shadow-mansagold/10 rounded-2xl border-2 border-mansagold/20">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue-dark data-[state=active]:to-mansablue data-[state=active]:text-white font-bold rounded-xl transition-all hover:bg-mansagold/5"
              >
                All Features
                <Badge variant="secondary" className="ml-2 bg-mansablue/10 text-mansablue font-bold">{features.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="consumer"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold-dark data-[state=active]:to-mansagold data-[state=active]:text-mansablue font-bold rounded-xl transition-all hover:bg-mansagold/5"
              >
                Consumers
                <Badge variant="secondary" className="ml-2 bg-mansagold/10 text-mansagold-dark font-bold">{getCategoryCount('consumer')}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="business"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansablue data-[state=active]:to-mansablue-light data-[state=active]:text-white font-bold rounded-xl transition-all hover:bg-mansablue/5"
              >
                Businesses
                <Badge variant="secondary" className="ml-2 bg-mansablue/10 text-mansablue font-bold">{getCategoryCount('business')}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="impact"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-mansagold data-[state=active]:to-mansagold-light data-[state=active]:text-mansablue-dark font-bold rounded-xl transition-all hover:bg-mansagold/5"
              >
                Impact
                <Badge variant="secondary" className="ml-2 bg-mansagold/10 text-mansagold-dark font-bold">{getCategoryCount('impact')}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="space-y-6">
              {filteredFeatures.length === 0 ? (
                <Card className="bg-white/95 backdrop-blur-xl border-mansagold/20 shadow-lg">
                  <CardContent className="py-16 text-center">
                    <div className="inline-block p-4 bg-gradient-to-br from-mansablue/10 to-mansagold/10 rounded-full mb-4">
                      <Search className="h-12 w-12 text-mansablue" />
                    </div>
                    <p className="text-foreground/80 text-lg font-medium">No features found matching your search. 🔍</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFeatures.map((feature, index) => {
                    const getCategoryGradient = (category: string) => {
                      switch (category) {
                        case 'consumer':
                          return 'from-mansagold/5 to-mansagold-light/10 border-mansagold/20 hover:shadow-mansagold/20';
                        case 'business':
                          return 'from-mansablue/5 to-mansablue-light/10 border-mansablue/20 hover:shadow-mansablue/20';
                        case 'impact':
                          return 'from-mansagold/10 to-mansablue/5 border-mansagold/20 hover:shadow-mansagold/20';
                        default:
                          return 'from-mansablue/5 to-mansagold/5 border-mansagold/20 hover:shadow-mansagold/20';
                      }
                    };

                    const getIconGradient = (category: string) => {
                      switch (category) {
                        case 'consumer':
                          return 'from-mansagold-dark to-mansagold';
                        case 'business':
                          return 'from-mansablue-dark to-mansablue';
                        case 'impact':
                          return 'from-mansagold to-mansablue';
                        default:
                          return 'from-mansablue to-mansagold';
                      }
                    };

                    return (
                      <Card 
                        key={feature.id} 
                        className={`bg-white/95 backdrop-blur-xl bg-gradient-to-br ${getCategoryGradient(feature.category)} hover:shadow-2xl transition-all duration-300 border-2 animate-fade-in hover:scale-[1.02] group relative overflow-hidden`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        
                        <CardHeader className="relative">
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${getIconGradient(feature.category)} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              {feature.icon}
                            </div>
                            {feature.tags.includes('new') && (
                              <Badge className="bg-gradient-to-r from-mansagold-dark to-mansagold text-mansablue-dark font-bold shadow-md">✨ New</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl font-bold text-foreground">{feature.title}</CardTitle>
                          <CardDescription className="text-base font-medium text-foreground/80">{feature.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 relative">
                          {/* Benefits */}
                          <div>
                            <h4 className="font-bold mb-3 flex items-center text-sm text-foreground">
                              <div className="p-1.5 bg-gradient-to-br from-mansagold-dark to-mansagold rounded-full mr-2">
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              </div>
                              Key Benefits
                            </h4>
                            <ul className="space-y-2">
                              {feature.benefits.map((benefit, idx) => (
                                <li key={idx} className="text-sm font-medium flex items-start p-2 bg-white/60 rounded-lg">
                                  <span className="text-mansagold mr-2 font-bold">✓</span>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* How to Use */}
                          {feature.howToUse && (
                            <div>
                              <h4 className="font-bold mb-3 flex items-center text-sm text-foreground">
                                <div className="p-1.5 bg-gradient-to-br from-mansablue-dark to-mansablue rounded-full mr-2">
                                  <Clock className="h-3 w-3 text-white" />
                                </div>
                                How to Use
                              </h4>
                              <ol className="space-y-2">
                                {feature.howToUse.map((step, idx) => (
                                  <li key={idx} className="text-sm font-medium flex items-start p-2 bg-white/60 rounded-lg">
                                    <span className="bg-gradient-to-br from-mansablue-dark to-mansablue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">{idx + 1}</span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {feature.tags.map((tag) => (
                              <Badge key={tag} className="text-xs font-semibold bg-white/70 border-mansagold/30 text-foreground">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-mansablue-dark via-mansablue to-mansablue-light border-y border-mansagold/20 shadow-2xl py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-mansagold/10 via-transparent to-mansagold/10" />
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold text-white drop-shadow-2xl">Ready to Get Started? 🚀</h2>
              <p className="text-xl text-white/90 font-medium drop-shadow-lg">
                Join thousands of consumers and business owners building economic power in Black communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="bg-mansagold hover:bg-mansagold-light text-mansablue-dark font-bold shadow-2xl shadow-mansagold/30 hover:shadow-mansagold/50 transition-all text-lg px-8 py-6 hover:scale-105"
                >
                  Sign Up as Consumer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/business-signup')}
                  className="bg-white/10 text-white hover:bg-mansagold/20 border-2 border-mansagold backdrop-blur-sm font-bold shadow-2xl hover:shadow-mansagold/50 transition-all text-lg px-8 py-6 hover:scale-105"
                >
                  Register Your Business
                  <Store className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="container-custom py-20 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-mansagold/20 shadow-2xl relative overflow-hidden group">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-mansagold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <CardContent className="text-center space-y-6 p-12 relative">
                <div className="inline-block p-4 bg-gradient-to-br from-mansablue-dark to-mansablue rounded-full mb-4 shadow-lg shadow-mansablue/30">
                  <MessageSquare className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-mansablue-dark via-mansablue to-mansablue-light bg-clip-text text-transparent">
                  Still Have Questions? 💬
                </h2>
                <p className="text-foreground/80 text-lg font-medium">
                  Check out our FAQ page or contact our support team for personalized assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button 
                    onClick={() => navigate('/help')}
                    className="bg-gradient-to-r from-mansablue-dark to-mansablue hover:from-mansablue hover:to-mansablue-light text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Visit FAQ
                  </Button>
                  <Button 
                    onClick={() => navigate('/support')}
                    className="bg-white text-mansablue hover:bg-mansablue/5 font-bold border-2 border-mansablue shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
};

export default FeatureGuidePage;
