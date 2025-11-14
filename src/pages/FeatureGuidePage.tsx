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

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
          <div className="container-custom py-16">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <Badge variant="secondary" className="mb-4">
                Complete Feature Guide
              </Badge>
              <h1 className="heading-xl">
                Everything You Can Do with <span className="text-primary">Mansa Musa Marketplace</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Discover powerful features for consumers, business owners, and community impact tracking.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto mt-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search features... (e.g., 'QR code', 'analytics', 'reviews')"
                  style={{ WebkitTextFillColor: 'inherit', opacity: 1 }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Content */}
        <section className="container-custom py-12">
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)} className="space-y-8">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="all">
                All Features
                <Badge variant="secondary" className="ml-2">{features.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="consumer">
                For Consumers
                <Badge variant="secondary" className="ml-2">{getCategoryCount('consumer')}</Badge>
              </TabsTrigger>
              <TabsTrigger value="business">
                For Businesses
                <Badge variant="secondary" className="ml-2">{getCategoryCount('business')}</Badge>
              </TabsTrigger>
              <TabsTrigger value="impact">
                Community Impact
                <Badge variant="secondary" className="ml-2">{getCategoryCount('impact')}</Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="space-y-6">
              {filteredFeatures.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No features found matching your search.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFeatures.map((feature) => (
                    <Card key={feature.id} className="hover:shadow-lg transition-shadow border-2 border-red-500">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            {feature.icon}
                          </div>
                          {feature.tags.includes('new') && (
                            <Badge variant="default">New</Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Benefits */}
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center text-sm">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                            Key Benefits
                          </h4>
                          <ul className="space-y-1">
                            {feature.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                <span className="text-primary mr-2">•</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* How to Use */}
                        {feature.howToUse && (
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center text-sm">
                              <Clock className="h-4 w-4 mr-2 text-blue-600" />
                              How to Use
                            </h4>
                            <ol className="space-y-1">
                              {feature.howToUse.map((step, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start">
                                  <span className="text-primary mr-2 font-semibold">{idx + 1}.</span>
                                  {step}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          {feature.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 border-y py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="heading-lg">Ready to Get Started?</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of consumers and business owners building economic power in Black communities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" onClick={() => navigate('/signup')}>
                  Sign Up as Consumer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/business-signup')}>
                  Register Your Business
                  <Store className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="container-custom py-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="heading-md">Still Have Questions?</h2>
            <p className="text-muted-foreground">
              Check out our FAQ page or contact our support team for personalized assistance.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button variant="outline" onClick={() => navigate('/help')}>
                Visit FAQ
              </Button>
              <Button variant="outline" onClick={() => navigate('/support')}>
                Contact Support
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FeatureGuidePage;
