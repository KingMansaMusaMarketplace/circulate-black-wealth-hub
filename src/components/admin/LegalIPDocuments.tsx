import React, { useState } from 'react';
import { 
  Scale, FileText, FileCheck, ClipboardList, Network, Calendar, 
  Download, ExternalLink, Shield, Globe, CheckCircle2, Clock, 
  AlertCircle, BookOpen, Gavel, Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import USPTOPatentExport from '@/components/sponsorship/USPTOPatentExport';
import PatentFeatureSummary from '@/components/legal/PatentFeatureSummary';
import { toast } from 'sonner';

// Patent claim data for the status tracker
// SYNCHRONIZED with USPTO filing dated 2026-01-24
// Edge function names reflect ACTUAL deployed functions
const independentClaims = [
  { number: 1, title: 'Temporal Founding Member Status System', edgeFunction: 'set_founding_member_status (trigger)', status: 'ready' },
  { number: 2, title: 'CMAL Engine (2.3x Multiplier)', edgeFunction: 'calculate-sponsor-impact', status: 'ready' },
  { number: 3, title: 'Cross-Business Coalition Loyalty Network', edgeFunction: 'coalition-earn-points', status: 'ready' },
  { number: 4, title: 'Geospatial Velocity Fraud Detection', edgeFunction: 'detect-fraud', status: 'ready' },
  { number: 5, title: 'Intelligent B2B Matching Engine', edgeFunction: 'b2b-match', status: 'ready' },
  { number: 6, title: 'Corporate Sponsorship Attribution', edgeFunction: 'calculate-sponsor-impact', status: 'ready' },
  { number: 7, title: 'Gamification Achievement Engine', edgeFunction: 'agent_badges (db schema)', status: 'ready' },
  { number: 8, title: 'Hierarchical Sales Agent Commission Network', edgeFunction: 'process-referral', status: 'ready' },
  { number: 9, title: 'QR-Code Transaction Processing', edgeFunction: 'process-qr-transaction', status: 'ready' },
  { number: 10, title: 'AI-Powered Business Recommendations', edgeFunction: 'ai-recommendations', status: 'ready' },
  { number: 11, title: 'Real-Time Voice AI Bridge Architecture', edgeFunction: 'realtime-voice', status: 'ready' },
  { number: 12, title: 'AI Tool Registry for Voice Concierge', edgeFunction: 'voice-concierge-tools', status: 'ready' },
  { number: 13, title: 'Atomic Fraud Alert Batch Insertion', edgeFunction: 'detect-fraud', status: 'ready' },
  { number: 14, title: 'Economic Karma Scoring System', edgeFunction: 'economic-karma', status: 'ready' },
  { number: 15, title: 'Susu Digital Escrow System', edgeFunction: 'susu-escrow', status: 'ready' },
  { number: 16, title: 'Biometric-Secured Transaction Verification', edgeFunction: 'client-side Capacitor', status: 'ready' },
  { number: 17, title: 'QR Code Atomic Check-in System', edgeFunction: 'process-qr-transaction', status: 'ready' },
  { number: 18, title: 'Community Impact Analytics Engine', edgeFunction: 'generate-impact-report', status: 'ready' },
  // NEW CLAIMS - Platform Wallet + Susu Payout Loop (included in initial filing)
  { number: 19, title: 'Closed-Loop Platform Wallet Ecosystem', edgeFunction: 'process-susu-payout', status: 'ready' },
  { number: 20, title: 'Economic Circulation Velocity Analytics', edgeFunction: 'wallet_transactions (schema)', status: 'ready' },
];

// Actual edge functions with patent protection headers
const edgeFunctionsWithHeaders = [
  { name: 'detect-fraud/index.ts', claim: 4, hasHeader: true },
  { name: 'calculate-sponsor-impact/index.ts', claim: 2, hasHeader: true },
  { name: 'coalition-earn-points/index.ts', claim: 3, hasHeader: true },
  { name: 'process-qr-transaction/index.ts', claim: 9, hasHeader: true },
  { name: 'b2b-match/index.ts', claim: 5, hasHeader: true },
  { name: 'realtime-voice/index.ts', claim: 11, hasHeader: true },
  { name: 'voice-concierge-tools/index.ts', claim: 12, hasHeader: true },
  { name: 'generate-impact-report/index.ts', claim: 18, hasHeader: true },
  { name: 'economic-karma/index.ts', claim: 14, hasHeader: true },
  { name: 'susu-escrow/index.ts', claim: 15, hasHeader: true },
];

const filingTimeline = [
  { date: 'January 22, 2026', action: 'Provisional Application Filed', status: 'pending' },
  { date: 'January 22, 2027', action: 'Non-Provisional OR PCT Filing Due', status: 'upcoming' },
  { date: 'July 22, 2027', action: 'Publication (if PCT)', status: 'upcoming' },
  { date: 'July 22, 2028', action: 'National Phase Entry', status: 'upcoming' },
];

const patentDocuments = [
  { 
    name: 'Complete Filing Package', 
    file: 'USPTO_COMPLETE_FILING_PACKAGE.md', 
    description: 'Master document with all sections combined',
    pages: '~50 pages',
    type: 'primary'
  },
  { 
    name: 'Formal Claims', 
    file: 'USPTO_FORMAL_CLAIMS.md', 
    description: '18 independent + 41 dependent claims',
    pages: '~25 pages',
    type: 'claims'
  },
  { 
    name: 'System Diagrams', 
    file: 'USPTO_SYSTEM_DIAGRAMS.md', 
    description: '9 Mermaid architecture diagrams',
    pages: '~10 pages',
    type: 'diagrams'
  },
  { 
    name: 'Comprehensive Specification', 
    file: 'USPTO_PROVISIONAL_PATENT_APPLICATION_COMPREHENSIVE.md', 
    description: 'Detailed technical specification',
    pages: '~30 pages',
    type: 'specification'
  },
  { 
    name: 'Filing Checklist', 
    file: 'USPTO_FILING_CHECKLIST.md', 
    description: 'Pre-filing verification checklist',
    pages: '~5 pages',
    type: 'checklist'
  },
  { 
    name: 'Temporal Founding Member Claim', 
    file: 'PATENT_CLAIM_2_TEMPORAL_FOUNDING_STATUS.md', 
    description: 'Detailed analysis of Claim 2',
    pages: '~3 pages',
    type: 'analysis'
  },
];

const LegalIPDocuments: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const claimsReady = independentClaims.filter(c => c.status === 'ready').length;
  const totalClaims = independentClaims.length;
  const progressPercent = (claimsReady / totalClaims) * 100;

  const handleViewDocument = (filename: string) => {
    // In a real app, this would open the markdown viewer or download
    toast.info(`Document: ${filename}`, {
      description: 'Document viewing will be available after export generation.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Scale className="h-7 w-7 text-mansagold" />
            Legal & Intellectual Property
          </h2>
          <p className="text-blue-200/70 mt-1">
            USPTO patent filings, IP documentation, and compliance tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">
            <Shield className="h-3 w-3 mr-1" />
            Patent Pending
          </Badge>
          <Badge variant="outline" className="border-mansagold/50 text-mansagold bg-mansagold/10">
            <Globe className="h-3 w-3 mr-1" />
            PCT Ready
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-mansagold">20</p>
              <p className="text-xs text-blue-200/60">Independent Claims</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-mansagold">43+</p>
              <p className="text-xs text-blue-200/60">Dependent Claims</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-mansagold">13</p>
              <p className="text-xs text-blue-200/60">Protected Constants</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">$80</p>
              <p className="text-xs text-blue-200/60">Micro Entity Fee</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white/5 border border-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-mansagold/20 data-[state=active]:text-mansagold">
            <BookOpen className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-mansagold/20 data-[state=active]:text-mansagold">
            <Download className="h-4 w-4 mr-2" />
            Export
          </TabsTrigger>
          <TabsTrigger value="claims" className="data-[state=active]:bg-mansagold/20 data-[state=active]:text-mansagold">
            <Gavel className="h-4 w-4 mr-2" />
            Claims
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-mansagold/20 data-[state=active]:text-mansagold">
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-mansagold/20 data-[state=active]:text-mansagold">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="partner-system" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 text-amber-300">
            <Users className="h-4 w-4 mr-2" />
            Partner System (NEW)
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Patent Application Summary */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Scale className="h-5 w-5 text-mansagold" />
                  Patent Application
                </CardTitle>
                <CardDescription className="text-blue-200/60">
                  USPTO Provisional Patent Application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/70">Title</span>
                    <span className="text-white font-medium text-right max-w-[60%]">
                      Multi-Tenant Vertical Marketplace Operating System
                    </span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/70">Inventor</span>
                    <span className="text-white">Thomas D. Bowling</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/70">Filing Date</span>
                    <span className="text-white">January 22, 2026</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/70">Entity Status</span>
                    <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                      Micro Entity
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Claims Progress */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-mansagold" />
                  Claims Status
                </CardTitle>
                <CardDescription className="text-blue-200/60">
                  Filing readiness progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200/70">Claims Ready</span>
                    <span className="text-mansagold font-bold">{claimsReady}/{totalClaims}</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 bg-white/10" />
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">Specification</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-green-400">Diagrams</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span className="text-sm text-amber-400">Declaration</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span className="text-sm text-amber-400">ADS Form</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Protected Technologies */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-mansagold" />
                Key Protected Technologies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Temporal Founding Member</Badge>
                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">CMAL Engine (2.3x)</Badge>
                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Geospatial Velocity Fraud</Badge>
                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Coalition Loyalty</Badge>
                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Voice AI Bridge</Badge>
                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Atomic Fraud Batching</Badge>
                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">B2B Intelligence Engine</Badge>
                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Sales Agent Network</Badge>
                <Badge className="bg-mansagold/20 text-mansagold border-mansagold/30">Economic Karma System</Badge>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Closed-Loop Wallet (NEW)</Badge>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">Circulation Velocity (NEW)</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Export Tab */}
        <TabsContent value="export">
          <USPTOPatentExport />
        </TabsContent>

        {/* Claims Tab */}
        <TabsContent value="claims" className="space-y-6">
          {/* Independent Claims Table */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Independent Claims (20)</CardTitle>
              <CardDescription className="text-blue-200/60">
                Primary patent claims protecting core innovations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-3 text-blue-200/70">Claim #</th>
                      <th className="text-left py-2 px-3 text-blue-200/70">Title</th>
                      <th className="text-left py-2 px-3 text-blue-200/70">Edge Function</th>
                      <th className="text-left py-2 px-3 text-blue-200/70">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {independentClaims.map((claim) => (
                      <tr key={claim.number} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 px-3 text-mansagold font-mono">{claim.number}</td>
                        <td className="py-2 px-3 text-white">{claim.title}</td>
                        <td className="py-2 px-3 text-blue-200/80 font-mono text-xs">{claim.edgeFunction}</td>
                        <td className="py-2 px-3">
                          <Badge className={`text-xs ${
                            claim.status === 'ready' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          }`}>
                            {claim.status === 'ready' ? 'Ready' : 'Pending'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Edge Functions with Patent Headers */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Protected Edge Functions</CardTitle>
              <CardDescription className="text-blue-200/60">
                Supabase edge functions with patent headers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {edgeFunctionsWithHeaders.map((func) => (
                  <div 
                    key={func.name} 
                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <Network className="h-4 w-4 text-blue-400" />
                      <span className="text-white font-mono text-sm">{func.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-mansagold/50 text-mansagold">
                        Claim {func.claim}
                      </Badge>
                      {func.hasHeader && (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-mansagold" />
                Patent Filing Timeline
              </CardTitle>
              <CardDescription className="text-blue-200/60">
                Key dates for USPTO and PCT filings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-6">
                {/* Timeline line */}
                <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-mansagold via-blue-500 to-white/20" />
                
                {filingTimeline.map((item, index) => (
                  <div key={index} className="relative">
                    <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 ${
                      item.status === 'pending' 
                        ? 'bg-amber-500 border-amber-400' 
                        : 'bg-white/10 border-white/30'
                    }`} />
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-mansagold font-medium">{item.date}</span>
                        <Badge 
                          variant="outline" 
                          className={item.status === 'pending' 
                            ? 'border-amber-500/50 text-amber-400' 
                            : 'border-white/30 text-white/60'
                          }
                        >
                          {item.status === 'pending' ? 'Next Action' : 'Upcoming'}
                        </Badge>
                      </div>
                      <p className="text-white">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* International Filing Targets */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-mansagold" />
                PCT Filing Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {['United States', 'European (EPO)', 'United Kingdom', 'Canada', 'Nigeria'].map((country) => (
                  <div 
                    key={country}
                    className="p-3 rounded-lg bg-white/5 border border-white/10 text-center"
                  >
                    <span className="text-white text-sm">{country}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {patentDocuments.map((doc) => (
              <Card key={doc.file} className="bg-white/5 border-white/10 hover:border-mansagold/30 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      doc.type === 'primary' ? 'bg-mansagold/20' :
                      doc.type === 'claims' ? 'bg-purple-500/20' :
                      doc.type === 'diagrams' ? 'bg-blue-500/20' :
                      'bg-white/10'
                    }`}>
                      <FileText className={`h-5 w-5 ${
                        doc.type === 'primary' ? 'text-mansagold' :
                        doc.type === 'claims' ? 'text-purple-400' :
                        doc.type === 'diagrams' ? 'text-blue-400' :
                        'text-white/70'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{doc.name}</h4>
                      <p className="text-sm text-blue-200/60 mt-1">{doc.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                          {doc.pages}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-mansagold hover:text-mansagold hover:bg-mansagold/10"
                          onClick={() => handleViewDocument(doc.file)}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Partner System Tab - NEW */}
        <TabsContent value="partner-system">
          <PatentFeatureSummary />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalIPDocuments;
