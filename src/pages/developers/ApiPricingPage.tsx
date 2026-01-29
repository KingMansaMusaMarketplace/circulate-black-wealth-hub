import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Zap, Shield, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ApiPricingPage = () => {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for testing and small projects',
      icon: Zap,
      color: 'text-white',
      borderColor: 'border-white/20',
      features: [
        { name: 'CMAL API calls', value: '1,000/mo' },
        { name: 'Voice AI minutes', value: '100/mo' },
        { name: 'Susu transactions', value: '50/mo' },
        { name: 'Fraud analyses', value: '100/mo' },
        { name: 'Rate limit', value: '60/min' },
        { name: 'Support', value: 'Community' },
      ],
      cta: 'Get Started Free',
      ctaVariant: 'outline' as const,
    },
    {
      name: 'Pro',
      price: '$299',
      period: '/month',
      description: 'For growing applications and startups',
      icon: Shield,
      color: 'text-mansablue',
      borderColor: 'border-mansablue',
      popular: true,
      features: [
        { name: 'CMAL API calls', value: '50,000/mo' },
        { name: 'Voice AI minutes', value: '5,000/mo' },
        { name: 'Susu transactions', value: '1,000/mo' },
        { name: 'Fraud analyses', value: '5,000/mo' },
        { name: 'Rate limit', value: '300/min' },
        { name: 'Support', value: 'Email + Chat' },
        { name: 'Overage pricing', value: 'Pay as you go' },
        { name: 'Webhook support', value: 'Included' },
      ],
      cta: 'Start Pro Trial',
      ctaVariant: 'default' as const,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large-scale deployments and custom needs',
      icon: Building2,
      color: 'text-mansagold',
      borderColor: 'border-mansagold/50',
      features: [
        { name: 'CMAL API calls', value: 'Unlimited' },
        { name: 'Voice AI minutes', value: 'Unlimited' },
        { name: 'Susu transactions', value: 'Unlimited' },
        { name: 'Fraud analyses', value: 'Unlimited' },
        { name: 'Rate limit', value: 'Custom' },
        { name: 'Support', value: 'Dedicated + SLA' },
        { name: 'White-label option', value: 'Available' },
        { name: 'Custom integrations', value: 'Included' },
        { name: 'On-premise deployment', value: 'Available' },
      ],
      cta: 'Contact Sales',
      ctaVariant: 'outline' as const,
    },
  ];

  const overagePricing = [
    { api: 'CMAL Engine', unit: 'per call', price: '$0.002' },
    { api: 'Voice AI Bridge', unit: 'per minute', price: '$0.05' },
    { api: 'Susu Protocol', unit: 'per transaction', price: '$0.01' },
    { api: 'Fraud Detection', unit: 'per analysis', price: '$0.01' },
  ];

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
            <h1 className="text-3xl font-bold text-white">API Pricing</h1>
            <p className="text-white/60">Simple, transparent pricing for every scale</p>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={`glass-card ${tier.borderColor} relative ${
                tier.popular ? 'ring-2 ring-mansablue scale-105' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-mansablue text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <div className="mx-auto p-3 bg-slate-900/80 rounded-full w-fit mb-4 border border-white/10">
                  <tier.icon className={`h-8 w-8 ${tier.color}`} />
                </div>
                <CardTitle className={`text-2xl ${tier.color}`}>{tier.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-mansagold">{tier.price}</span>
                  <span className="text-white/60">{tier.period}</span>
                </div>
                <CardDescription className="text-white/60 mt-2">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className={`h-4 w-4 ${tier.popular ? 'text-mansablue' : 'text-mansagold'}`} />
                        <span className="text-white/80 text-sm">{feature.name}</span>
                      </div>
                      <span className="text-white font-medium text-sm">{feature.value}</span>
                    </li>
                  ))}
                </ul>
                <Link to={tier.name === 'Enterprise' ? '#' : '/developers/signup'}>
                  <Button
                    variant={tier.ctaVariant}
                    className={`w-full ${
                      tier.popular
                        ? 'bg-mansablue hover:bg-mansablue-dark text-white'
                        : 'border-white/20 text-white hover:bg-white/10'
                    }`}
                  >
                    {tier.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Overage Pricing */}
        <Card className="glass-card border-white/10 mb-12">
          <CardHeader>
            <CardTitle className="text-white">Overage Pricing</CardTitle>
            <CardDescription className="text-white/60">
              Pay-as-you-go rates when you exceed your plan limits (Pro tier only)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {overagePricing.map((item) => (
                <div key={item.api} className="bg-slate-900/80 rounded-lg p-4 text-center border border-white/10">
                  <p className="text-white font-medium mb-1">{item.api}</p>
                  <p className="text-2xl font-bold text-mansagold">{item.price}</p>
                  <p className="text-white/40 text-xs">{item.unit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="glass-card border-white/10 mb-12">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="text-white font-medium mb-2">What counts as an API call?</h4>
              <p className="text-white/60 text-sm">
                Each request to any API endpoint counts as one call. Failed requests due to client errors (4xx) are
                not counted. Rate limit responses (429) are not billed.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">How is Voice AI billed?</h4>
              <p className="text-white/60 text-sm">
                Voice AI is billed per minute of audio processed. Transcription and session management calls are billed
                separately based on audio duration.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Can I switch plans?</h4>
              <p className="text-white/60 text-sm">
                Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately with prorated billing.
                Downgrades apply at the next billing cycle.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Is there a free trial for Pro?</h4>
              <p className="text-white/60 text-sm">
                Yes! All new Pro subscribers get a 14-day free trial with full access to Pro features. No credit card
                required to start.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">What about patent licensing?</h4>
              <p className="text-white/60 text-sm">
                API usage includes a license to use our patented technology (USPTO 63/969,202) within your
                applications. Enterprise customers can negotiate white-label and sublicensing terms.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <div className="glass-card inline-block p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Build?</h2>
            <p className="text-white/60 mb-6">
              Start with our free tier and scale as you grow. No credit card required.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/developers/signup">
                <Button className="bg-mansagold hover:bg-mansagold-dark text-mansablue-dark font-bold">Get API Keys</Button>
              </Link>
              <Link to="/developers/docs">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Read Documentation
                </Button>
              </Link>
            </div>
          </div>
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

export default ApiPricingPage;
