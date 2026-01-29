import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Copy, Check, Code2, Zap, Shield, Users, Calculator, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ApiPlayground from '@/components/developers/ApiPlayground';

const ApiDocumentationPage = () => {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const apis = [
    {
      id: 'cmal',
      name: 'CMAL Engine',
      icon: Calculator,
      description: 'Circulating Money Attribution Layer - Calculate economic impact multipliers',
      patentClaims: '2, 3',
      baseUrl: 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/cmal-api',
      endpoints: [
        {
          method: 'POST',
          path: '/calculate',
          description: 'Calculate the multiplied economic impact of a transaction',
          request: {
            transaction_amount: 150.00,
            business_category: 'restaurant',
            user_tier: 'gold',
          },
          response: {
            original_amount: 150.00,
            multiplied_impact: 345.00,
            multiplier_applied: 2.3,
            circulation_score: 87,
            attribution: {
              direct_impact: 150.00,
              indirect_impact: 195.00,
              community_multiplier: 2.3,
            },
          },
        },
        {
          method: 'POST',
          path: '/attribute',
          description: 'Attribute economic impact across a chain of businesses',
          request: {
            transaction_id: 'txn_abc123',
            chain_of_businesses: ['biz_001', 'biz_002', 'biz_003'],
          },
          response: {
            transaction_id: 'txn_abc123',
            attribution_breakdown: [
              { business_id: 'biz_001', attribution_percentage: 50, impact_amount: 75.00 },
              { business_id: 'biz_002', attribution_percentage: 30, impact_amount: 45.00 },
              { business_id: 'biz_003', attribution_percentage: 20, impact_amount: 30.00 },
            ],
            velocity_score: 0.85,
            chain_efficiency: 0.92,
          },
        },
      ],
    },
    {
      id: 'voice',
      name: 'Voice AI Bridge',
      icon: Zap,
      description: 'Real-time voice AI with persona injection and VAD',
      patentClaims: '6, 11',
      baseUrl: 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/voice-api',
      endpoints: [
        {
          method: 'POST',
          path: '/session/create',
          description: 'Create a new voice AI session with custom persona',
          request: {
            persona_config: {
              name: 'Assistant',
              system_prompt: 'You are a helpful assistant...',
              voice_id: 'EXAVITQu4vr4xnSDxMaL',
            },
            vad_settings: {
              threshold: 0.5,
              silence_duration_ms: 500,
            },
          },
          response: {
            session_id: 'sess_xyz789',
            websocket_url: 'wss://...',
            expires_at: '2025-01-29T04:30:00Z',
          },
        },
        {
          method: 'POST',
          path: '/transcribe',
          description: 'Transcribe audio to text',
          request: {
            audio_base64: 'SGVsbG8gV29ybGQ=...',
            language: 'en',
          },
          response: {
            text: 'Hello, how can I help you today?',
            language: 'en',
            confidence: 0.95,
          },
        },
      ],
    },
    {
      id: 'susu',
      name: 'Susu Protocol',
      icon: Users,
      description: 'Digital escrow for rotational savings circles (ROSCA)',
      patentClaims: '15',
      baseUrl: 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/susu-api',
      endpoints: [
        {
          method: 'POST',
          path: '/circle/create',
          description: 'Create a new Susu savings circle',
          request: {
            name: 'Community Savings',
            contribution_amount: 100,
            frequency: 'monthly',
            member_count: 10,
            currency: 'USD',
          },
          response: {
            circle_id: 'circle_abc123',
            escrow_address: 'escrow_abc1...',
            terms: {
              contribution_amount: 100,
              frequency: 'monthly',
              member_count: 10,
              platform_fee_percentage: 1.5,
              net_payout_per_round: 985.00,
            },
          },
        },
        {
          method: 'POST',
          path: '/contribution',
          description: 'Record a member contribution to escrow',
          request: {
            circle_id: 'circle_abc123',
            contributor_id: 'user_xyz',
            amount: 100,
          },
          response: {
            receipt_id: 'rcpt_123',
            escrow_status: 'held',
            net_contribution: 98.50,
            platform_fee: 1.50,
          },
        },
      ],
    },
    {
      id: 'fraud',
      name: 'Fraud Detection',
      icon: Shield,
      description: 'Geospatial velocity checks and pattern detection',
      patentClaims: '4',
      baseUrl: 'https://agoclnqfyinwjxdmjnns.supabase.co/functions/v1/fraud-api',
      endpoints: [
        {
          method: 'POST',
          path: '/analyze',
          description: 'Analyze transactions for fraud patterns',
          request: {
            transactions: [
              { id: 'txn_1', amount: 150, timestamp: '2025-01-29T10:00:00Z', location: { lat: 40.7128, lng: -74.0060 } },
              { id: 'txn_2', amount: 5500, timestamp: '2025-01-29T10:30:00Z', location: { lat: 51.5074, lng: -0.1278 } },
            ],
            timeframe_hours: 24,
          },
          response: {
            risk_score: 75,
            risk_level: 'high',
            alerts: [
              { type: 'impossible_travel', severity: 'critical', description: 'NYC to London in 30 minutes' },
              { type: 'large_amount', severity: 'high', description: '1 transaction exceeds $5,000' },
            ],
            patterns_detected: ['impossible_travel', 'large_transaction_amounts'],
          },
        },
        {
          method: 'POST',
          path: '/verify-location',
          description: 'Verify if travel between two locations is physically possible',
          request: {
            user_id: 'user_123',
            location_a: { lat: 40.7128, lng: -74.0060, timestamp: '2025-01-29T10:00:00Z' },
            location_b: { lat: 40.7589, lng: -73.9851, timestamp: '2025-01-29T10:30:00Z' },
          },
          response: {
            is_possible: true,
            distance_km: 5.2,
            implied_velocity_kmh: 10.4,
            confidence: 0.99,
            travel_mode_estimate: 'ground',
          },
        },
      ],
    },
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
            <h1 className="text-3xl font-bold text-white">API Documentation</h1>
            <p className="text-white/60">Complete reference for 1325.AI Developer APIs</p>
          </div>
        </div>

        {/* Authentication Section */}
        <Card className="glass-card border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Code2 className="h-5 w-5 text-mansablue" />
              Authentication
            </CardTitle>
            <CardDescription className="text-white/60">
              All API requests require authentication via Bearer token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900/80 rounded-lg p-4 font-mono text-sm border border-white/10">
              <div className="flex items-center justify-between">
                <code className="text-mansagold">
                  Authorization: Bearer 1325_live_xxxxxxxxxxxxx
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('Authorization: Bearer 1325_live_xxxxxxxxxxxxx', 'auth')}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  {copiedEndpoint === 'auth' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <p className="text-white/60 text-sm mt-4">
              Get your API key from the{' '}
              <Link to="/developers/dashboard" className="text-mansablue hover:underline">
                Developer Dashboard
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* API Tabs */}
        <Tabs defaultValue="cmal" className="space-y-6">
          <TabsList className="bg-slate-800/60 border border-white/10 p-1">
            {apis.map((api) => (
              <TabsTrigger
                key={api.id}
                value={api.id}
                className="data-[state=active]:bg-mansablue data-[state=active]:text-white text-white/60"
              >
                <api.icon className="h-4 w-4 mr-2" />
                {api.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {apis.map((api) => (
            <TabsContent key={api.id} value={api.id} className="space-y-6">
              {/* API Header */}
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-mansablue/20 rounded-lg border border-mansablue/30">
                        <api.icon className="h-6 w-6 text-mansablue" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{api.name}</CardTitle>
                        <CardDescription className="text-white/60">{api.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-mansagold/50 text-mansagold">
                      Patent Claims {api.patentClaims}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900/80 rounded-lg p-3 font-mono text-sm border border-white/10">
                    <span className="text-white/60">Base URL: </span>
                    <span className="text-mansablue">{api.baseUrl}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Endpoints */}
              {api.endpoints.map((endpoint, idx) => (
                <Card key={idx} className="glass-card border-white/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          endpoint.method === 'POST'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : 'bg-mansablue/20 text-mansablue border-mansablue/50'
                        }
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-white font-mono">{endpoint.path}</code>
                    </div>
                    <CardDescription className="text-white/60 mt-2">{endpoint.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Request */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm font-medium">Request Body</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(JSON.stringify(endpoint.request, null, 2), `${api.id}-${idx}-req`)
                          }
                          className="text-white/60 hover:text-white hover:bg-white/10"
                        >
                          {copiedEndpoint === `${api.id}-${idx}-req` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <ScrollArea className="h-auto max-h-48">
                        <pre className="bg-slate-900/80 rounded-lg p-4 text-sm overflow-x-auto border border-white/10">
                          <code className="text-emerald-400">{JSON.stringify(endpoint.request, null, 2)}</code>
                        </pre>
                      </ScrollArea>
                    </div>

                    {/* Response */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm font-medium">Response</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(JSON.stringify(endpoint.response, null, 2), `${api.id}-${idx}-res`)
                          }
                          className="text-white/60 hover:text-white hover:bg-white/10"
                        >
                          {copiedEndpoint === `${api.id}-${idx}-res` ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <ScrollArea className="h-auto max-h-64">
                        <pre className="bg-slate-900/80 rounded-lg p-4 text-sm overflow-x-auto border border-white/10">
                          <code className="text-mansablue-light">{JSON.stringify(endpoint.response, null, 2)}</code>
                        </pre>
                      </ScrollArea>
                    </div>

                    {/* cURL Example */}
                    <div>
                      <span className="text-white/80 text-sm font-medium mb-2 block">cURL Example</span>
                      <div className="bg-slate-900/80 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-white/10">
                        <code className="text-mansagold">
                          {`curl -X ${endpoint.method} "${api.baseUrl}${endpoint.path}" \\
  -H "Authorization: Bearer 1325_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(endpoint.request)}'`}
                        </code>
                      </div>
                    </div>

                    {/* Interactive Playground */}
                    <div className="pt-4 border-t border-white/10">
                      <ApiPlayground
                        apiName={api.name}
                        baseUrl={api.baseUrl}
                        endpoint={endpoint}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Rate Limits */}
        <Card className="glass-card border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 rounded-lg p-4 text-center border border-white/10">
                <p className="text-white/60 text-sm">Free Tier</p>
                <p className="text-2xl font-bold text-white">60</p>
                <p className="text-white/40 text-xs">requests/min</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center border border-mansablue/50">
                <p className="text-mansablue text-sm">Pro Tier</p>
                <p className="text-2xl font-bold text-white">300</p>
                <p className="text-white/40 text-xs">requests/min</p>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 text-center border border-mansagold/50">
                <p className="text-mansagold text-sm">Enterprise</p>
                <p className="text-2xl font-bold text-white">Unlimited</p>
                <p className="text-white/40 text-xs">custom limits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patent Notice */}
        <div className="mt-8 text-center text-white/40 text-sm">
          All APIs protected under USPTO Provisional Patent 63/969,202
          <br />© 2024-2025 1325.AI - All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentationPage;
