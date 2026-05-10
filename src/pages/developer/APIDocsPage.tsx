import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ENDPOINTS = [
  {
    method: 'GET', path: '/circulation',
    desc: 'Dollar circulation aggregates. Optional ?city= filter.',
    example: '{ "city": "Chicago", "transaction_count": 1842, "dollar_circulation": 184201.55, "currency": "USD" }',
  },
  {
    method: 'GET', path: '/business-density',
    desc: 'Counts of verified businesses by city and category.',
    example: '{ "verified_business_count": 50234, "by_city": { "Chicago": 412, ... }, "by_category": { "food": 1830, ... } }',
  },
  {
    method: 'GET', path: '/demographics',
    desc: 'Aggregated registered-user counts. No PII returned.',
    example: '{ "registered_users": 128301, "note": "Aggregated counts only — no PII returned." }',
  },
];

export default function APIDocsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <Helmet>
        <title>API Reference | 1325.AI Data & Insights API</title>
      </Helmet>
      <h1 className="text-4xl font-bold mb-4">API Reference</h1>
      <p className="text-muted-foreground mb-8">Base URL: <code className="bg-muted px-2 py-0.5 rounded">https://agoclnqfyinwjxdmjnns.functions.supabase.co/data-insights-api</code></p>

      <Card className="mb-8">
        <CardHeader><CardTitle>Authentication</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-2">All requests require a bearer token:</p>
          <pre className="bg-muted p-3 rounded text-sm">{`Authorization: Bearer mma_live_<your-key>`}</pre>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader><CardTitle>Rate Limits & Quotas</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>60 requests/minute per key.</li>
            <li>Monthly quota depends on your plan (Starter 1,000 / Pro 10,000 / Enterprise 100,000+).</li>
            <li>Quota exceeded returns HTTP 429.</li>
          </ul>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Endpoints</h2>
      <div className="space-y-4">
        {ENDPOINTS.map((e) => (
          <Card key={e.path}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{e.method}</Badge>
                <code className="font-mono">{e.path}</code>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">{e.desc}</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">{e.example}</pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
