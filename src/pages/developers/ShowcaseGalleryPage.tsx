import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Star, Users, TrendingUp, Globe, Mic, Shield, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ShowcaseGalleryPage = () => {
  const showcaseApps = [
    {
      name: 'AfroMarket',
      description: 'Pan-African e-commerce platform using CMAL to track cross-border economic impact and promote intra-African trade.',
      category: 'Marketplace',
      apisUsed: ['CMAL Engine', 'Fraud Detection'],
      metrics: {
        users: '50,000+',
        impact: '$2.3M tracked',
        rating: 4.8,
      },
      logo: '/placeholder.svg',
      website: '#',
      featured: true,
      testimonial: 'CMAL helped us quantify the real economic impact of supporting African businesses.',
      author: 'Kwame A., CTO',
    },
    {
      name: 'VoiceCommerce',
      description: 'Voice-first shopping assistant for local businesses, enabling phone-based orders with AI-powered conversations.',
      category: 'Voice AI',
      apisUsed: ['Voice AI Bridge', 'CMAL Engine'],
      metrics: {
        users: '12,000+',
        impact: '45K calls/mo',
        rating: 4.9,
      },
      logo: '/placeholder.svg',
      website: '#',
      featured: true,
      testimonial: 'The Voice AI Bridge reduced our support costs by 60% while improving customer satisfaction.',
      author: 'Maria G., Founder',
    },
    {
      name: 'CircleSave',
      description: 'Modern Susu/ROSCA platform for diaspora communities, with automated escrow and contribution tracking.',
      category: 'Fintech',
      apisUsed: ['Susu Protocol', 'Fraud Detection'],
      metrics: {
        users: '8,500+',
        impact: '$890K saved',
        rating: 4.7,
      },
      logo: '/placeholder.svg',
      website: '#',
      featured: false,
      testimonial: 'Susu Protocol automated what used to take hours of manual coordination.',
      author: 'Amara T., CEO',
    },
    {
      name: 'LocalFirst',
      description: 'Business directory connecting consumers with minority-owned businesses, with economic impact attribution.',
      category: 'Directory',
      apisUsed: ['CMAL Engine'],
      metrics: {
        users: '25,000+',
        impact: '$1.1M attributed',
        rating: 4.6,
      },
      logo: '/placeholder.svg',
      website: '#',
      featured: false,
    },
    {
      name: 'SecurePay Africa',
      description: 'Payment gateway with built-in fraud detection for emerging markets, powered by geospatial velocity checks.',
      category: 'Payments',
      apisUsed: ['Fraud Detection', 'CMAL Engine'],
      metrics: {
        users: '15,000+',
        impact: '99.2% fraud blocked',
        rating: 4.8,
      },
      logo: '/placeholder.svg',
      website: '#',
      featured: false,
    },
    {
      name: 'CommunityBank',
      description: 'Digital credit union platform for underserved communities, with transparent impact tracking.',
      category: 'Banking',
      apisUsed: ['CMAL Engine', 'Susu Protocol'],
      metrics: {
        users: '6,200+',
        impact: '$450K circulated',
        rating: 4.5,
      },
      logo: '/placeholder.svg',
      website: '#',
      featured: false,
    },
  ];

  const getApiIcon = (api: string) => {
    switch (api) {
      case 'CMAL Engine':
        return TrendingUp;
      case 'Voice AI Bridge':
        return Mic;
      case 'Susu Protocol':
        return Coins;
      case 'Fraud Detection':
        return Shield;
      default:
        return Globe;
    }
  };

  const getApiColor = (api: string) => {
    switch (api) {
      case 'CMAL Engine':
        return 'bg-mansablue/20 text-mansablue border-mansablue/50';
      case 'Voice AI Bridge':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      case 'Susu Protocol':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'Fraud Detection':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      default:
        return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const featuredApps = showcaseApps.filter((app) => app.featured);
  const otherApps = showcaseApps.filter((app) => !app.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-mansablue-dark to-slate-900">
      {/* Decorative elements */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansagold/5 to-amber-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-mansablue/5 to-blue-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/developers">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Showcase Gallery</h1>
            <p className="text-white/60">Apps and platforms built with 1325.AI APIs</p>
          </div>
        </div>

        {/* Stats Banner */}
        <div className="glass-card border-white/10 rounded-2xl p-6 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-mansagold">116K+</p>
              <p className="text-white/60 text-sm">Total Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-mansablue">$4.8M</p>
              <p className="text-white/60 text-sm">Economic Impact Tracked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-400">6</p>
              <p className="text-white/60 text-sm">Production Apps</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-400">4.7</p>
              <p className="text-white/60 text-sm">Avg. Rating</p>
            </div>
          </div>
        </div>

        {/* Featured Apps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Star className="h-6 w-6 text-mansagold" />
            Featured
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-mansagold/30 h-full hover:border-mansagold/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-mansagold/20 to-mansagold/5 border border-mansagold/30 flex items-center justify-center">
                          <Globe className="h-7 w-7 text-mansagold" />
                        </div>
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            {app.name}
                            <Badge className="bg-mansagold/20 text-mansagold border-mansagold/50 text-xs">
                              Featured
                            </Badge>
                          </CardTitle>
                          <Badge variant="outline" className="border-white/20 text-white/60 text-xs mt-1">
                            {app.category}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="text-white/70 mt-4">{app.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* APIs Used */}
                    <div className="flex flex-wrap gap-2">
                      {app.apisUsed.map((api) => {
                        const Icon = getApiIcon(api);
                        return (
                          <Badge key={api} className={`${getApiColor(api)} text-xs`}>
                            <Icon className="h-3 w-3 mr-1" />
                            {api}
                          </Badge>
                        );
                      })}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 bg-slate-900/50 rounded-lg p-4 border border-white/5">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-white font-semibold">
                          <Users className="h-4 w-4 text-mansablue" />
                          {app.metrics.users}
                        </div>
                        <p className="text-white/40 text-xs">Users</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-semibold">{app.metrics.impact}</p>
                        <p className="text-white/40 text-xs">Impact</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-white font-semibold">
                          <Star className="h-4 w-4 text-mansagold fill-mansagold" />
                          {app.metrics.rating}
                        </div>
                        <p className="text-white/40 text-xs">Rating</p>
                      </div>
                    </div>

                    {/* Testimonial */}
                    {app.testimonial && (
                      <div className="bg-gradient-to-r from-mansablue/10 to-transparent rounded-lg p-4 border-l-2 border-mansablue">
                        <p className="text-white/80 text-sm italic">"{app.testimonial}"</p>
                        <p className="text-mansablue text-xs mt-2">— {app.author}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Other Apps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">More from the Community</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherApps.map((app, index) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-card border-white/10 h-full hover:border-white/20 transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white/60" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{app.name}</CardTitle>
                        <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                          {app.category}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-white/60 mt-3 text-sm">{app.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* APIs Used */}
                    <div className="flex flex-wrap gap-1.5">
                      {app.apisUsed.map((api) => (
                        <Badge key={api} variant="outline" className="border-white/20 text-white/60 text-xs">
                          {api}
                        </Badge>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-white/60">
                        <Users className="h-3.5 w-3.5" />
                        {app.metrics.users}
                      </div>
                      <div className="text-white/60">{app.metrics.impact}</div>
                      <div className="flex items-center gap-1 text-white/60">
                        <Star className="h-3.5 w-3.5 text-mansagold fill-mansagold" />
                        {app.metrics.rating}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="glass-card border-mansablue/30 inline-block p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-4">Built Something Amazing?</h2>
            <p className="text-white/60 mb-6 max-w-md">
              Share your project with the community and get featured in our showcase.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold">
                Submit Your App
              </Button>
              <Link to="/developers/signup">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Get API Keys
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Patent Notice */}
        <div className="mt-12 text-center text-white/40 text-sm">
          All APIs protected under USPTO Provisional Patent 63/969,202
          <br />© 2024-2025 1325.AI - All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default ShowcaseGalleryPage;
