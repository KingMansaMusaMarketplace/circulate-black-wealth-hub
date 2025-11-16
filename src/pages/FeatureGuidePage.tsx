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
  ArrowRight
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
      id: 'automated-reviews',
      title: 'Automated Review Requests',
      description: 'Automatically request reviews from customers after completed bookings to build your reputation.',
      icon: <Star className="h-6 w-6" />,
      category: 'business',
      tags: ['reviews', 'reputation', 'automation', 'new'],
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
      title: 'Professional Business Profiles',
      description: 'Create an attractive business profile with photos, descriptions, hours, and special offers.',
      icon: <Store className="h-6 w-6" />,
      category: 'business',
      tags: ['branding', 'visibility', 'marketing'],
      benefits: [
        'Showcase your business with photos',
        'Display hours and contact information',
        'Promote special offers',
        'Increase discoverability'
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-b shadow-2xl">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <div className="container-custom py-20 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm px-6 py-2 text-base font-bold">
                ✨ Complete Feature Guide
              </Badge>
              <h1 className="text-6xl font-bold text-white drop-shadow-2xl">
                Everything You Can Do with <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">Mansa Musa Marketplace</span>
              </h1>
              <p className="text-xl text-white/90 font-medium drop-shadow-lg">
                Discover powerful features for consumers, business owners, and community impact tracking. 🚀
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mt-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-600 h-6 w-6 z-10" />
                <Input
                  type="text"
                  placeholder="Search features... (e.g., 'QR code', 'analytics', 'reviews')"
                  style={{ WebkitTextFillColor: 'inherit', opacity: 1 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-14 h-16 text-2xl bg-white shadow-2xl border-2 border-white/50 rounded-2xl focus:ring-4 focus:ring-purple-300 font-semibold placeholder:text-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Content */}
        <section className="container-custom py-12">
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)} className="space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 p-2 bg-white shadow-xl rounded-2xl border-2 border-purple-200">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white font-bold rounded-xl transition-all"
              >
                All Features
                <Badge variant="secondary" className="ml-2 bg-purple-100 text-purple-700 font-bold">{features.length}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="consumer"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white font-bold rounded-xl transition-all"
              >
                Consumers
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700 font-bold">{getCategoryCount('consumer')}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="business"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white font-bold rounded-xl transition-all"
              >
                Businesses
                <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700 font-bold">{getCategoryCount('business')}</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="impact"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-amber-600 data-[state=active]:text-white font-bold rounded-xl transition-all"
              >
                Impact
                <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700 font-bold">{getCategoryCount('impact')}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="space-y-6">
              {filteredFeatures.length === 0 ? (
                <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 shadow-lg">
                  <CardContent className="py-16 text-center">
                    <div className="inline-block p-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-4">
                      <Search className="h-12 w-12 text-gray-500" />
                    </div>
                    <p className="text-gray-600 text-lg font-medium">No features found matching your search. 🔍</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFeatures.map((feature, index) => {
                    const getCategoryGradient = (category: string) => {
                      switch (category) {
                        case 'consumer':
                          return 'from-blue-50 to-cyan-50 border-blue-200 hover:shadow-blue-200';
                        case 'business':
                          return 'from-green-50 to-emerald-50 border-green-200 hover:shadow-green-200';
                        case 'impact':
                          return 'from-orange-50 to-amber-50 border-orange-200 hover:shadow-orange-200';
                        default:
                          return 'from-purple-50 to-pink-50 border-purple-200 hover:shadow-purple-200';
                      }
                    };

                    const getIconGradient = (category: string) => {
                      switch (category) {
                        case 'consumer':
                          return 'from-blue-500 to-cyan-500';
                        case 'business':
                          return 'from-green-500 to-emerald-500';
                        case 'impact':
                          return 'from-orange-500 to-amber-500';
                        default:
                          return 'from-purple-500 to-pink-500';
                      }
                    };

                    return (
                      <Card 
                        key={feature.id} 
                        className={`bg-gradient-to-br ${getCategoryGradient(feature.category)} hover:shadow-2xl transition-all border-2 animate-fade-in`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between mb-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${getIconGradient(feature.category)} text-white shadow-lg`}>
                              {feature.icon}
                            </div>
                            {feature.tags.includes('new') && (
                              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-md">✨ New</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                          <CardDescription className="text-base font-medium">{feature.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Benefits */}
                          <div>
                            <h4 className="font-bold mb-3 flex items-center text-sm">
                              <div className="p-1.5 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mr-2">
                                <CheckCircle2 className="h-3 w-3 text-white" />
                              </div>
                              Key Benefits
                            </h4>
                            <ul className="space-y-2">
                              {feature.benefits.map((benefit, idx) => (
                                <li key={idx} className="text-sm font-medium flex items-start p-2 bg-white/60 rounded-lg">
                                  <span className="text-green-600 mr-2 font-bold">✓</span>
                                  {benefit}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* How to Use */}
                          {feature.howToUse && (
                            <div>
                              <h4 className="font-bold mb-3 flex items-center text-sm">
                                <div className="p-1.5 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full mr-2">
                                  <Clock className="h-3 w-3 text-white" />
                                </div>
                                How to Use
                              </h4>
                              <ol className="space-y-2">
                                {feature.howToUse.map((step, idx) => (
                                  <li key={idx} className="text-sm font-medium flex items-start p-2 bg-white/60 rounded-lg">
                                    <span className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0">{idx + 1}</span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {feature.tags.map((tag) => (
                              <Badge key={tag} className="text-xs font-semibold bg-white/70">
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
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 border-y shadow-2xl py-20">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
              <h2 className="text-5xl font-bold text-white drop-shadow-2xl">Ready to Get Started? 🚀</h2>
              <p className="text-xl text-white/90 font-medium drop-shadow-lg">
                Join thousands of consumers and business owners building economic power in Black communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="bg-white text-indigo-600 hover:bg-white/90 font-bold shadow-2xl hover:shadow-white/50 transition-all text-lg px-8 py-6"
                >
                  Sign Up as Consumer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/business-signup')}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-indigo-900 hover:from-yellow-300 hover:to-orange-300 font-bold shadow-2xl hover:shadow-orange-400/50 transition-all text-lg px-8 py-6 border-2 border-yellow-200"
                >
                  Register Your Business
                  <Store className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="container-custom py-20">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 shadow-2xl">
              <CardContent className="text-center space-y-6 p-12">
                <div className="inline-block p-4 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full mb-4">
                  <MessageSquare className="h-12 w-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent">
                  Still Have Questions? 💬
                </h2>
                <p className="text-teal-800 text-lg font-medium">
                  Check out our FAQ page or contact our support team for personalized assistance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button 
                    onClick={() => navigate('/help')}
                    className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    Visit FAQ
                  </Button>
                  <Button 
                    onClick={() => navigate('/support')}
                    className="bg-white text-teal-600 hover:bg-teal-50 font-bold border-2 border-teal-600 shadow-lg hover:shadow-xl transition-all"
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
