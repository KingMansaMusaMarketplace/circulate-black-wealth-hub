import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Code, 
  Zap, 
  Shield, 
  TrendingUp, 
  Mic, 
  Users, 
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

const DeveloperLandingPage: React.FC = () => {
  const apis = [
    {
      name: 'CMAL Engine',
      description: 'Economic Circulation Multiplier Attribution Logic - Calculate community economic impact with our proprietary 2.3x multiplier.',
      icon: TrendingUp,
      endpoint: '/v1/cmal/calculate',
      claims: ['Claim 2', 'Claim 3'],
    },
    {
      name: 'Voice AI Bridge',
      description: 'Real-time voice AI with custom persona injection, VAD, and tool calling capabilities.',
      icon: Mic,
      endpoint: '/v1/voice/session/create',
      claims: ['Claim 6', 'Claim 11'],
    },
    {
      name: 'Susu Protocol',
      description: 'Digital ROSCA (rotating savings) with automated escrow management and 1.5% platform fee.',
      icon: Users,
      endpoint: '/v1/susu/circle/create',
      claims: ['Claim 15'],
    },
    {
      name: 'Fraud Detection',
      description: 'Geospatial velocity checks, pattern analysis, and real-time transaction monitoring.',
      icon: AlertTriangle,
      endpoint: '/v1/fraud/analyze',
      claims: ['Claim 4'],
    },
  ];

  const pricingTiers = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        '1,000 CMAL calls',
        '100 Voice minutes',
        '50 Susu transactions',
        '100 Fraud analyses',
        'Community support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$299',
      period: '/month',
      features: [
        '50,000 CMAL calls',
        '5,000 Voice minutes',
        '1,000 Susu transactions',
        '5,000 Fraud analyses',
        'Priority support',
        'Analytics dashboard',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited API calls',
        'Dedicated infrastructure',
        'Custom SLAs',
        'White-label options',
        '24/7 support',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-mansablue-dark to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-mansagold/10 to-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-mansablue/10 to-blue-400/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 border-mansagold/50 text-mansagold bg-mansagold/10">
              USPTO Provisional 63/969,202 Protected
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-mansagold to-white bg-clip-text text-transparent">
                Build the Future of
              </span>
              <br />
              <span className="bg-gradient-to-r from-mansablue via-mansablue-light to-mansablue bg-clip-text text-transparent">
                Community Commerce
              </span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              License our patented economic engines to power your marketplace. 
              27 patent claims protecting the infrastructure that measures, multiplies, 
              and attributes community economic impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold" asChild>
                <Link to="/developers/signup">
                  Get API Keys <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link to="/developers/docs">
                  <Code className="mr-2 h-4 w-4" /> View Documentation
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* APIs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Patented API Engines</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Each API is backed by filed patent claims, giving your platform 
              defensible technology that cannot be replicated.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {apis.map((api, index) => (
              <motion.div
                key={api.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full glass-card border-white/10 hover:border-mansablue/50 transition-all hover:shadow-lg hover:shadow-mansablue/10">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-gradient-to-br from-mansablue to-mansablue-dark">
                        <api.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex gap-1">
                        {api.claims.map((claim) => (
                          <Badge key={claim} variant="outline" className="text-xs border-mansagold/50 text-mansagold">
                            {claim}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardTitle className="mt-4 text-white">{api.name}</CardTitle>
                    <CardDescription className="text-white/60">{api.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <code className="text-sm bg-slate-900/80 text-mansablue-light px-3 py-1.5 rounded font-mono border border-white/10">
                      POST {api.endpoint}
                    </code>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Simple Integration</h2>
              <p className="text-white/60 mb-6">
                Get started in minutes with our SDKs for JavaScript and Python. 
                Calculate economic impact with just a few lines of code.
              </p>
              
              <div className="space-y-4">
                {[
                  'Automatic rate limiting and retry logic',
                  'Type-safe responses with TypeScript',
                  'Comprehensive error handling',
                  'Usage analytics in your dashboard',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-mansagold" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-sm text-white/80 overflow-x-auto">
                <code>{`import { Client } from '@1325ai/sdk';

const client = new Client({
  apiKey: '1325_live_xxx',
});

// Calculate economic impact
const impact = await client.cmal.calculate({
  transactionAmount: 150.00,
  businessCategory: 'restaurant',
  userTier: 'gold'
});

console.log(impact.multipliedImpact);
// Output: 517.50 (3.45x multiplier)`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Usage-Based Pricing</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Pay only for what you use. Start free and scale as you grow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.name}
                className={`relative glass-card border-white/10 ${tier.popular ? 'ring-2 ring-mansablue scale-105' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-mansablue text-white">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-white">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-mansagold">{tier.price}</span>
                    <span className="text-white/60">{tier.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-mansagold" />
                        <span className="text-sm text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${tier.popular ? 'bg-mansablue hover:bg-mansablue-dark text-white' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'}`}
                    asChild
                  >
                    <Link to="/developers/signup">{tier.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-mansablue/20 flex items-center justify-center mx-auto mb-4 border border-mansablue/30">
                <Zap className="h-8 w-8 text-mansablue" />
              </div>
              <h3 className="font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-sm text-white/60">
                Edge-deployed globally for &lt;50ms latency on all API calls.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-mansagold/20 flex items-center justify-center mx-auto mb-4 border border-mansagold/30">
                <Shield className="h-8 w-8 text-mansagold" />
              </div>
              <h3 className="font-semibold text-white mb-2">Patent Protected</h3>
              <p className="text-sm text-white/60">
                27 claims filed under USPTO Provisional 63/969,202.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-mansablue/20 flex items-center justify-center mx-auto mb-4 border border-mansablue/30">
                <Globe className="h-8 w-8 text-mansablue" />
              </div>
              <h3 className="font-semibold text-white mb-2">99.9% Uptime</h3>
              <p className="text-sm text-white/60">
                Enterprise-grade reliability with automatic failover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card max-w-3xl mx-auto p-12 rounded-2xl border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              Create your developer account and get API keys in minutes.
            </p>
            <Button size="lg" className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold" asChild>
              <Link to="/developers/signup">
                Create Developer Account <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="py-8 text-center text-white/40 text-sm border-t border-white/10">
        All APIs protected under USPTO Provisional Patent 63/969,202
        <br />© 2024-2025 1325.AI - All Rights Reserved
      </div>
    </div>
  );
};

export default DeveloperLandingPage;
