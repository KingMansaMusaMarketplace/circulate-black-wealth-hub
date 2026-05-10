import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Shield, BarChart3, Building2, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TIERS = [
  { name: 'Starter',    price: 99,  quota: '1,000 calls/mo',     features: ['All public endpoints', 'Email support', 'CSV export'] },
  { name: 'Pro',        price: 499, quota: '10,000 calls/mo',    features: ['Everything in Starter', 'Webhook deliveries', 'Custom city scopes'], featured: true },
  { name: 'Enterprise', price: 999, quota: '100,000+ calls/mo',  features: ['Everything in Pro', 'Dedicated success manager', 'Custom data partnerships', 'SLA'] },
];

export default function InstitutionalAPIPage() {
  return (
    <div className="container max-w-6xl mx-auto py-16 px-4">
      <Helmet>
        <title>Institutional Data & Insights API | 1325.AI</title>
        <meta name="description" content="Anonymized circulation, business density, and demographic data for banks, foundations, and CRA-compliant institutions." />
      </Helmet>

      <div className="text-center mb-12">
        <Badge className="mb-4">For Banks · Foundations · Researchers</Badge>
        <h1 className="text-5xl font-bold mb-4">Data & Insights API</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tap into the largest anonymized dataset of dollar circulation across 50,000+ verified Black-owned businesses.
          CRA-compliant. Privacy-first. Patent-protected ledger.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { icon: Database, title: 'Dollar Circulation', desc: 'Anonymized dollar velocity by city and category.' },
          { icon: Building2, title: 'Business Density', desc: 'Verified business counts segmented by region.' },
          { icon: BarChart3, title: 'Demographic Aggregates', desc: 'Aggregated user signups — never PII.' },
        ].map((f) => (
          <Card key={f.title}>
            <CardHeader>
              <f.icon className="h-8 w-8 text-primary mb-2" />
              <CardTitle>{f.title}</CardTitle>
            </CardHeader>
            <CardContent><p className="text-muted-foreground">{f.desc}</p></CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-center mb-8">Pricing</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {TIERS.map((t) => (
          <Card key={t.name} className={t.featured ? 'border-primary ring-2 ring-primary' : ''}>
            <CardHeader>
              {t.featured && <Badge className="mb-2 w-fit">Most Popular</Badge>}
              <CardTitle>{t.name}</CardTitle>
              <CardDescription className="text-3xl font-bold text-foreground">${t.price}<span className="text-base font-normal text-muted-foreground">/mo</span></CardDescription>
              <p className="text-sm text-muted-foreground">{t.quota}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {t.features.map((f) => (
                  <li key={f} className="text-sm flex gap-2"><Shield className="h-4 w-4 text-primary mt-0.5" />{f}</li>
                ))}
              </ul>
              <a href="mailto:partnerships@1325.ai?subject=Data%20%26%20Insights%20API%20Access" className="block">
                <Button className="w-full">Request Access</Button>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Code2 className="h-6 w-6 text-primary mb-2" />
          <CardTitle>Quick start</CardTitle>
          <CardDescription>Once approved, you'll receive an API key. Authenticate with a bearer token.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`curl https://agoclnqfyinwjxdmjnns.functions.supabase.co/data-insights-api/circulation?city=Chicago \\
  -H "Authorization: Bearer YOUR_API_KEY"

# → { success: true, data: { city: "Chicago", transaction_count: 1842, dollar_circulation: 184201.55, ... } }`}
          </pre>
          <Link to="/developer/api-docs" className="inline-block mt-4">
            <Button variant="outline">View full docs</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
