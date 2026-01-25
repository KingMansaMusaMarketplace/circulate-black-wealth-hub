import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Link2, 
  Users, 
  DollarSign, 
  Shield, 
  Code, 
  BarChart3,
  Zap,
  Globe,
  Lock,
  Layers
} from 'lucide-react';

interface FeatureSection {
  id: string;
  title: string;
  icon: React.ElementType;
  claimType: 'independent' | 'dependent' | 'proposed';
  description: string;
  technicalDetails: string[];
  noveltyPoints: string[];
}

const partnerSystemFeatures: FeatureSection[] = [
  {
    id: 'referral-attribution',
    title: 'Partner Referral Attribution System',
    icon: Link2,
    claimType: 'proposed',
    description: 'A method for tracking and attributing business signups across a distributed network of directory partners using unique cryptographic referral identifiers.',
    technicalDetails: [
      'Unique referral code generation using UUID v4 with partner-specific prefix encoding',
      'Server-side attribution tracking with first-touch and last-touch models',
      'Cookie-less tracking via URL parameter persistence through signup flow',
      'Real-time attribution validation against partner database records',
      'Cross-session attribution maintenance for delayed conversions (up to 30-day window)'
    ],
    noveltyPoints: [
      'Eliminates dependency on third-party tracking pixels',
      'Privacy-preserving attribution without persistent user identifiers',
      'Supports multi-directory attribution for businesses listed on multiple partner sites'
    ]
  },
  {
    id: 'revenue-share-engine',
    title: 'Tiered Revenue Share Calculation Engine',
    icon: DollarSign,
    claimType: 'proposed',
    description: 'An automated system for calculating and distributing revenue shares to referral partners based on a hybrid flat-fee plus percentage model.',
    technicalDetails: [
      'Dual-component commission structure: $5 flat fee per conversion + 10% revenue share',
      'Real-time balance tracking with pending/confirmed/paid status states',
      'Minimum payout threshold enforcement ($50) with automated eligibility detection',
      'Commission crediting triggered by payment webhook events (Stripe integration)',
      'Audit trail with full transaction history and reconciliation support'
    ],
    noveltyPoints: [
      'Cash-flow positive model: commissions only credited after successful payment',
      'Transparent real-time earnings dashboard for partner self-service',
      'Supports future tier escalation based on referral volume'
    ]
  },
  {
    id: 'founding-partner-status',
    title: 'Founding Partner Status & Tier System',
    icon: Shield,
    claimType: 'proposed',
    description: 'A time-locked partner classification system that grants enhanced benefits to early adopters who join before a platform milestone.',
    technicalDetails: [
      'Automatic "Founding Partner" badge assignment for partners joining before 10,000 business threshold',
      'Immutable status recorded via database timestamp with milestone snapshot',
      'Tier-specific benefit unlocks: priority support, early feature access, enhanced revenue shares',
      'Partner status displayed in public partner directory and embed widgets',
      'Granular permission system for tier-specific dashboard features'
    ],
    noveltyPoints: [
      'Creates network effect incentive for early directory partnerships',
      'Status cannot be retroactively granted, ensuring exclusivity',
      'Ties partner status to platform growth metrics rather than arbitrary dates'
    ]
  },
  {
    id: 'embed-widget-attribution',
    title: 'Embeddable Widget with Auto-Attribution',
    icon: Code,
    claimType: 'proposed',
    description: 'A JavaScript embed widget that displays platform businesses on partner websites while automatically attributing any resulting signups.',
    technicalDetails: [
      'Iframe-based embed with responsive design and theme customization',
      'Partner referral code automatically injected into all CTA links',
      'Configurable display options: grid/list view, category filters, result limits',
      'Lazy-loading with intersection observer for performance optimization',
      'Cross-origin communication via postMessage API for height synchronization'
    ],
    noveltyPoints: [
      'Zero-configuration attribution: partners copy/paste single code snippet',
      'Embed analytics tracked separately from direct referral links',
      'Supports white-label styling to match partner site branding'
    ]
  },
  {
    id: 'partner-analytics-dashboard',
    title: 'Real-Time Partner Analytics Dashboard',
    icon: BarChart3,
    claimType: 'proposed',
    description: 'A comprehensive analytics interface providing partners with real-time visibility into referral performance, conversion rates, and earnings.',
    technicalDetails: [
      'Real-time metrics: clicks, signups, conversions, earnings (pending/confirmed/paid)',
      'Conversion funnel visualization: Click → Signup → First Payment → Upgrade',
      'Time-series charts with configurable date ranges and granularity',
      'Referral status tracking: pending, active, churned with cohort analysis',
      'CSV export functionality for external reporting and tax purposes'
    ],
    noveltyPoints: [
      'Glassmorphic UI design with mobile-responsive tab navigation',
      'Self-service payout request system with status tracking',
      'Integrated FAQ system for partner education and support reduction'
    ]
  },
  {
    id: 'partner-vetting-workflow',
    title: 'Partner Application & Vetting Workflow',
    icon: Users,
    claimType: 'proposed',
    description: 'An administrative workflow system for reviewing, approving, and managing partner applications with automated notifications.',
    technicalDetails: [
      'Multi-stage application status: pending → approved/rejected',
      'Admin review interface with applicant details and directory verification',
      'Automated email notifications via edge function (send-partner-notification)',
      'Admin preview mode to view any partner dashboard as that partner',
      'Bulk approval/rejection actions with customizable rejection reasons'
    ],
    noveltyPoints: [
      'Ensures partner quality through human review before access granted',
      'Admin impersonation mode for support without credential sharing',
      'Notification system scales via serverless edge function architecture'
    ]
  }
];

const existingPatentClaims = [
  { number: 19, title: 'Closed-Loop Platform Wallet Ecosystem', status: 'ready' },
  { number: 20, title: 'Economic Circulation Velocity Analytics', status: 'ready' }
];

const PatentFeatureSummary: React.FC = () => {
  const handleExportMarkdown = () => {
    const date = new Date().toISOString().split('T')[0];
    let markdown = `# 1325.AI Patent Feature Summary\n`;
    markdown += `## Partner Referral Attribution System\n`;
    markdown += `Generated: ${date}\n`;
    markdown += `Prepared for: Allgaier Patent Solutions (Fraline J. Allgaier, Esq.)\n`;
    markdown += `Filing Target: January 30, 2026\n\n`;
    markdown += `---\n\n`;
    markdown += `## Executive Summary\n\n`;
    markdown += `This document describes novel technical features of the 1325.AI Partner Referral System that may warrant inclusion as dependent claims or a continuation filing to the existing provisional patent application.\n\n`;
    markdown += `The system enables directory owners to earn commissions by referring businesses to the 1325.AI platform through a privacy-preserving attribution mechanism, automated revenue share calculations, and an embeddable widget system.\n\n`;
    markdown += `---\n\n`;
    
    partnerSystemFeatures.forEach((feature, index) => {
      markdown += `## ${index + 1}. ${feature.title}\n\n`;
      markdown += `**Claim Type Recommendation:** ${feature.claimType === 'proposed' ? 'Proposed New Claim' : feature.claimType}\n\n`;
      markdown += `### Description\n${feature.description}\n\n`;
      markdown += `### Technical Implementation Details\n`;
      feature.technicalDetails.forEach(detail => {
        markdown += `- ${detail}\n`;
      });
      markdown += `\n### Novelty Points\n`;
      feature.noveltyPoints.forEach(point => {
        markdown += `- ${point}\n`;
      });
      markdown += `\n---\n\n`;
    });

    markdown += `## Relationship to Existing Claims\n\n`;
    markdown += `The Partner Referral System integrates with and extends the following existing patent claims:\n\n`;
    existingPatentClaims.forEach(claim => {
      markdown += `- **Claim ${claim.number}:** ${claim.title}\n`;
    });
    markdown += `\n`;
    markdown += `The referral attribution system contributes to the "Economic Circulation Velocity Analytics" (Claim 20) by tracking partner-driven business acquisition as a measurable economic flow within the platform ecosystem.\n\n`;
    markdown += `---\n\n`;
    markdown += `## Recommended Actions\n\n`;
    markdown += `1. Review proposed claims for patentability assessment\n`;
    markdown += `2. Determine whether to add as dependent claims to existing provisional\n`;
    markdown += `3. Consider continuation-in-part if claims are sufficiently distinct\n`;
    markdown += `4. Ensure technical specifications align with implemented code\n\n`;
    markdown += `---\n\n`;
    markdown += `*This document was auto-generated by 1325.AI for patent attorney review.*\n`;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `1325AI-Patent-Feature-Summary-${date}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-amber-500/30">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <FileText className="h-8 w-8 text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Patent Feature Summary</CardTitle>
                <p className="text-slate-400 mt-1">Partner Referral Attribution System</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                6 Proposed Claims
              </Badge>
              <Button onClick={handleExportMarkdown} className="bg-amber-600 hover:bg-amber-700 text-white">
                <Download className="w-4 h-4 mr-2" />
                Export for Attorney
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <p className="text-slate-400">Prepared For</p>
              <p className="text-white font-medium">Allgaier Patent Solutions</p>
              <p className="text-slate-300">Fraline J. Allgaier, Esq.</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <p className="text-slate-400">Filing Target</p>
              <p className="text-white font-medium">January 30, 2026</p>
              <p className="text-emerald-400">5 days remaining</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
              <p className="text-slate-400">Related Existing Claims</p>
              <p className="text-white font-medium">Claim 19 & 20</p>
              <p className="text-slate-300">Wallet + Velocity Analytics</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Sections */}
      <div className="grid gap-4">
        {partnerSystemFeatures.map((feature, index) => (
          <Card key={feature.id} className="bg-slate-800/60 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-amber-500/20 rounded-lg shrink-0">
                  <feature.icon className="h-5 w-5 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg text-white">{index + 1}. {feature.title}</CardTitle>
                    <Badge variant="outline" className="border-amber-500/50 text-amber-300 text-xs">
                      Proposed Claim
                    </Badge>
                  </div>
                  <p className="text-slate-300 mt-2 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-2 gap-4 pl-12">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    Technical Implementation
                  </h4>
                  <ul className="space-y-1.5">
                    {feature.technicalDetails.map((detail, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-amber-500 mt-1">•</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Novelty Points
                  </h4>
                  <ul className="space-y-1.5">
                    {feature.noveltyPoints.map((point, i) => (
                      <li key={i} className="text-xs text-emerald-300 flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Relationship to Existing Claims */}
      <Card className="bg-slate-800/60 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            Relationship to Existing Patent Claims
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-slate-300 text-sm">
              The Partner Referral System integrates with and extends the following claims from the current provisional filing:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {existingPatentClaims.map((claim) => (
                <div key={claim.number} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      Claim {claim.number}
                    </Badge>
                    <Badge variant="outline" className="border-emerald-500/50 text-emerald-400 text-xs">
                      Ready
                    </Badge>
                  </div>
                  <p className="text-white font-medium">{claim.title}</p>
                </div>
              ))}
            </div>
            <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/30 mt-4">
              <p className="text-amber-200 text-sm">
                <strong>Integration Note:</strong> The referral attribution system contributes to "Economic Circulation Velocity Analytics" (Claim 20) by tracking partner-driven business acquisition as a measurable economic flow within the platform ecosystem.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border border-amber-500/30">
        <CardHeader>
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-amber-400" />
            Recommended Actions for Attorney Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {[
              'Review proposed claims for patentability assessment',
              'Determine whether to add as dependent claims to existing provisional',
              'Consider continuation-in-part if claims are sufficiently distinct',
              'Ensure technical specifications align with implemented code',
              'Verify claim language does not conflict with existing prior art'
            ].map((action, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <span className="bg-amber-500/20 text-amber-400 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium shrink-0">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatentFeatureSummary;
