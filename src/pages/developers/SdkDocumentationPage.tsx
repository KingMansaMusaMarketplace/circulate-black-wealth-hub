import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Copy, Check, Package, Terminal, Zap, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const SdkDocumentationPage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const jsInstall = `npm install @1325ai/sdk`;
  const pyInstall = `pip install 1325ai`;

  const jsQuickStart = `import { Client } from '@1325ai/sdk';

// Initialize the client
const client = new Client({
  apiKey: process.env.API_1325_KEY, // '1325_live_xxx' or '1325_test_xxx'
  sandbox: false, // Set to true for sandbox mode
});

// Calculate economic impact with CMAL
const cmalResult = await client.cmal.calculate({
  transactionAmount: 150.00,
  businessCategory: 'restaurant',
  userTier: 'gold',
});

console.log(\`Original: $\${cmalResult.originalAmount}\`);
console.log(\`Multiplied Impact: $\${cmalResult.multipliedImpact}\`);
console.log(\`Multiplier: \${cmalResult.multiplierApplied}x\`);`;

  const pyQuickStart = `from oneThreeTwoFive import Client

# Initialize the client
client = Client(
    api_key=os.environ.get("API_1325_KEY"),  # '1325_live_xxx' or '1325_test_xxx'
    sandbox=False,  # Set to True for sandbox mode
)

# Calculate economic impact with CMAL
cmal_result = client.cmal.calculate(
    transaction_amount=150.00,
    business_category="restaurant",
    user_tier="gold",
)

print(f"Original: \${result.original_amount}")
print(f"Multiplied Impact: \${result.multiplied_impact}")
print(f"Multiplier: {result.multiplier_applied}x")`;

  const jsCmalExample = `// CMAL Engine - Calculate economic impact
const impact = await client.cmal.calculate({
  transactionAmount: 150.00,
  businessCategory: 'restaurant',
  userTier: 'gold',
});

// CMAL Engine - Attribution chain
const attribution = await client.cmal.attribute({
  transactionId: 'txn_abc123',
  chainOfBusinesses: ['biz_001', 'biz_002', 'biz_003'],
});

console.log(attribution.attributionBreakdown);
console.log(\`Velocity Score: \${attribution.velocityScore}\`);`;

  const jsVoiceExample = `// Voice AI - Create session
const session = await client.voice.createSession({
  personaConfig: {
    name: 'Assistant',
    systemPrompt: 'You are a helpful business assistant...',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
  },
  vadSettings: {
    threshold: 0.5,
    silenceDurationMs: 500,
  },
});

console.log(\`Session ID: \${session.sessionId}\`);
console.log(\`WebSocket URL: \${session.websocketUrl}\`);

// Voice AI - Transcribe audio
const transcription = await client.voice.transcribe({
  audioBase64: 'SGVsbG8gV29ybGQ=...',
  language: 'en',
});

console.log(\`Text: \${transcription.text}\`);
console.log(\`Confidence: \${transcription.confidence}\`);`;

  const jsSusuExample = `// Susu Protocol - Create savings circle
const circle = await client.susu.createCircle({
  name: 'Community Savings',
  contributionAmount: 100,
  frequency: 'monthly',
  memberCount: 10,
  currency: 'USD',
});

console.log(\`Circle ID: \${circle.circleId}\`);
console.log(\`Platform Fee: \${circle.terms.platformFeePercentage}%\`);
console.log(\`Net Payout: $\${circle.terms.netPayoutPerRound}\`);

// Susu Protocol - Record contribution
const contribution = await client.susu.recordContribution({
  circleId: 'circle_abc123',
  contributorId: 'user_xyz',
  amount: 100,
});

console.log(\`Receipt: \${contribution.receiptId}\`);`;

  const jsFraudExample = `// Fraud Detection - Analyze transactions
const analysis = await client.fraud.analyze({
  transactions: [
    { 
      id: 'txn_1', 
      amount: 150, 
      timestamp: '2025-01-29T10:00:00Z', 
      location: { lat: 40.7128, lng: -74.0060 } 
    },
    { 
      id: 'txn_2', 
      amount: 5500, 
      timestamp: '2025-01-29T10:30:00Z', 
      location: { lat: 51.5074, lng: -0.1278 } 
    },
  ],
  timeframeHours: 24,
});

console.log(\`Risk Score: \${analysis.riskScore}\`);
console.log(\`Risk Level: \${analysis.riskLevel}\`);
console.log(\`Alerts: \${analysis.alerts.length}\`);

// Fraud Detection - Verify location
const verification = await client.fraud.verifyLocation({
  userId: 'user_123',
  locationA: { lat: 40.7128, lng: -74.0060, timestamp: '2025-01-29T10:00:00Z' },
  locationB: { lat: 40.7589, lng: -73.9851, timestamp: '2025-01-29T10:30:00Z' },
});

console.log(\`Travel Possible: \${verification.isPossible}\`);
console.log(\`Distance: \${verification.distanceKm}km\`);`;

  const pyCmalExample = `# CMAL Engine - Calculate economic impact
impact = client.cmal.calculate(
    transaction_amount=150.00,
    business_category="restaurant",
    user_tier="gold",
)

# CMAL Engine - Attribution chain
attribution = client.cmal.attribute(
    transaction_id="txn_abc123",
    chain_of_businesses=["biz_001", "biz_002", "biz_003"],
)

print(attribution.attribution_breakdown)
print(f"Velocity Score: {attribution.velocity_score}")`;

  const pyVoiceExample = `# Voice AI - Create session
session = client.voice.create_session(
    persona_config={
        "name": "Assistant",
        "system_prompt": "You are a helpful business assistant...",
        "voice_id": "EXAVITQu4vr4xnSDxMaL",
    },
    vad_settings={
        "threshold": 0.5,
        "silence_duration_ms": 500,
    },
)

print(f"Session ID: {session.session_id}")
print(f"WebSocket URL: {session.websocket_url}")

# Voice AI - Transcribe audio
transcription = client.voice.transcribe(
    audio_base64="SGVsbG8gV29ybGQ=...",
    language="en",
)

print(f"Text: {transcription.text}")`;

  const pySusuExample = `# Susu Protocol - Create savings circle
circle = client.susu.create_circle(
    name="Community Savings",
    contribution_amount=100,
    frequency="monthly",
    member_count=10,
    currency="USD",
)

print(f"Circle ID: {circle.circle_id}")
print(f"Platform Fee: {circle.terms.platform_fee_percentage}%")

# Susu Protocol - Record contribution
contribution = client.susu.record_contribution(
    circle_id="circle_abc123",
    contributor_id="user_xyz",
    amount=100,
)

print(f"Receipt: {contribution.receipt_id}")`;

  const pyFraudExample = `# Fraud Detection - Analyze transactions
analysis = client.fraud.analyze(
    transactions=[
        {
            "id": "txn_1",
            "amount": 150,
            "timestamp": "2025-01-29T10:00:00Z",
            "location": {"lat": 40.7128, "lng": -74.0060},
        },
        {
            "id": "txn_2",
            "amount": 5500,
            "timestamp": "2025-01-29T10:30:00Z",
            "location": {"lat": 51.5074, "lng": -0.1278},
        },
    ],
    timeframe_hours=24,
)

print(f"Risk Score: {analysis.risk_score}")
print(f"Risk Level: {analysis.risk_level}")
print(f"Alerts: {len(analysis.alerts)}")

# Fraud Detection - Verify location
verification = client.fraud.verify_location(
    user_id="user_123",
    location_a={"lat": 40.7128, "lng": -74.0060, "timestamp": "2025-01-29T10:00:00Z"},
    location_b={"lat": 40.7589, "lng": -73.9851, "timestamp": "2025-01-29T10:30:00Z"},
)

print(f"Travel Possible: {verification.is_possible}")`;

  const CodeBlock = ({ code, id, language }: { code: string; id: string; language: string }) => (
    <div className="relative">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
          {language}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(code, id)}
          className="text-white/60 hover:text-white hover:bg-white/10 h-7 w-7 p-0"
        >
          {copiedCode === id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <ScrollArea className="h-auto max-h-96">
        <pre className="bg-slate-900/80 rounded-lg p-4 pt-10 text-sm overflow-x-auto border border-white/10">
          <code className="text-emerald-400">{code}</code>
        </pre>
      </ScrollArea>
    </div>
  );

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
            <h1 className="text-3xl font-bold text-white">SDKs & Libraries</h1>
            <p className="text-white/60">Official SDKs for JavaScript and Python</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card border-white/10 hover:border-mansablue/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-2 bg-mansablue/20 rounded-lg border border-mansablue/30">
                <Package className="h-5 w-5 text-mansablue" />
              </div>
              <div>
                <p className="text-white font-medium">@1325ai/sdk</p>
                <p className="text-white/60 text-sm">JavaScript / TypeScript</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card border-white/10 hover:border-emerald-500/50 transition-colors cursor-pointer">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <Terminal className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">1325ai</p>
                <p className="text-white/60 text-sm">Python 3.8+</p>
              </div>
            </CardContent>
          </Card>
          <Link to="/developers/docs">
            <Card className="glass-card border-white/10 hover:border-mansagold/50 transition-colors cursor-pointer h-full">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-2 bg-mansagold/20 rounded-lg border border-mansagold/30">
                  <BookOpen className="h-5 w-5 text-mansagold" />
                </div>
                <div>
                  <p className="text-white font-medium">REST API Docs</p>
                  <p className="text-white/60 text-sm">Full API reference</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* SDK Tabs */}
        <Tabs defaultValue="javascript" className="space-y-6">
          <TabsList className="bg-slate-800/60 border border-white/10 p-1">
            <TabsTrigger
              value="javascript"
              className="data-[state=active]:bg-mansablue data-[state=active]:text-white text-white/60"
            >
              <Package className="h-4 w-4 mr-2" />
              JavaScript
            </TabsTrigger>
            <TabsTrigger
              value="python"
              className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-white/60"
            >
              <Terminal className="h-4 w-4 mr-2" />
              Python
            </TabsTrigger>
          </TabsList>

          {/* JavaScript SDK */}
          <TabsContent value="javascript" className="space-y-6">
            {/* Installation */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-mansablue" />
                  Installation
                </CardTitle>
                <CardDescription className="text-white/60">
                  Install via npm, yarn, or pnpm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock code={jsInstall} id="js-install" language="bash" />
                <p className="text-white/60 text-sm">
                  Requires Node.js 16+ or modern browser with ES2020 support.
                </p>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Start</CardTitle>
                <CardDescription className="text-white/60">
                  Initialize the client and make your first API call
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={jsQuickStart} id="js-quickstart" language="typescript" />
              </CardContent>
            </Card>

            {/* API Examples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">CMAL Engine</CardTitle>
                  <CardDescription className="text-white/60">Economic impact calculations</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={jsCmalExample} id="js-cmal" language="typescript" />
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Voice AI Bridge</CardTitle>
                  <CardDescription className="text-white/60">Real-time voice AI sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={jsVoiceExample} id="js-voice" language="typescript" />
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Susu Protocol</CardTitle>
                  <CardDescription className="text-white/60">Savings circle management</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={jsSusuExample} id="js-susu" language="typescript" />
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Fraud Detection</CardTitle>
                  <CardDescription className="text-white/60">Transaction security analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={jsFraudExample} id="js-fraud" language="typescript" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Python SDK */}
          <TabsContent value="python" className="space-y-6">
            {/* Installation */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-emerald-400" />
                  Installation
                </CardTitle>
                <CardDescription className="text-white/60">
                  Install via pip or poetry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <CodeBlock code={pyInstall} id="py-install" language="bash" />
                <p className="text-white/60 text-sm">
                  Requires Python 3.8+ with async support.
                </p>
              </CardContent>
            </Card>

            {/* Quick Start */}
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Start</CardTitle>
                <CardDescription className="text-white/60">
                  Initialize the client and make your first API call
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={pyQuickStart} id="py-quickstart" language="python" />
              </CardContent>
            </Card>

            {/* API Examples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">CMAL Engine</CardTitle>
                  <CardDescription className="text-white/60">Economic impact calculations</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={pyCmalExample} id="py-cmal" language="python" />
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Voice AI Bridge</CardTitle>
                  <CardDescription className="text-white/60">Real-time voice AI sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={pyVoiceExample} id="py-voice" language="python" />
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Susu Protocol</CardTitle>
                  <CardDescription className="text-white/60">Savings circle management</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={pySusuExample} id="py-susu" language="python" />
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Fraud Detection</CardTitle>
                  <CardDescription className="text-white/60">Transaction security analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <CodeBlock code={pyFraudExample} id="py-fraud" language="python" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Sandbox Mode */}
        <Card className="glass-card border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" />
              Sandbox Mode
            </CardTitle>
            <CardDescription className="text-white/60">
              Test your integration without incurring real charges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/80">
              Both SDKs support a <code className="text-amber-400 bg-slate-900/60 px-1.5 py-0.5 rounded">sandbox</code> mode 
              that returns mock responses without hitting the production API. Perfect for development and testing.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 rounded-lg p-4 border border-white/10">
                <p className="text-mansablue text-sm font-medium mb-2">JavaScript</p>
                <code className="text-emerald-400 text-sm">
                  {`const client = new Client({ apiKey: '...', sandbox: true });`}
                </code>
              </div>
              <div className="bg-slate-900/80 rounded-lg p-4 border border-white/10">
                <p className="text-emerald-400 text-sm font-medium mb-2">Python</p>
                <code className="text-emerald-400 text-sm">
                  {`client = Client(api_key="...", sandbox=True)`}
                </code>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-400 text-sm">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                Test API Keys
              </Badge>
              <span className="text-white/60">Use keys starting with <code className="text-amber-400">1325_test_</code> for sandbox</span>
            </div>
          </CardContent>
        </Card>

        {/* Patent Notice */}
        <div className="mt-12 text-center text-white/40 text-sm">
          All APIs protected under USPTO Provisional Patent 63/969,202
          <br />© 2024-2025 1325.AI - All Rights Reserved
        </div>
      </div>
    </div>
  );
};

export default SdkDocumentationPage;
