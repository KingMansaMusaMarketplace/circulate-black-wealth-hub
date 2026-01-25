import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Lock, 
  Heart, 
  DollarSign, 
  Award,
  AlertTriangle,
  FileCheck,
  Users,
  Target,
  Scale
} from 'lucide-react';

const SalesAgentCodeOfConductPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Sales Agent Code of Conduct | Mansa Musa Marketplace</title>
        <meta name="description" content="The official Code of Conduct for Mansa Musa Marketplace Sales Agents - Professional standards, ethical guidelines, and operational protocols." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            <Shield className="w-3 h-3 mr-1" />
            Official Agent Guidelines
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Sales Agent Code of Conduct
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The Field Manual for Mansa Musa Marketplace Ambassadors
          </p>
          <p className="text-sm text-muted-foreground mt-4 italic">
            Last Updated: December 2024
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Welcome, Mansa Ambassador
                </h2>
                <p className="text-muted-foreground">
                  As a Mansa Musa Agent, you are the face of the world's first <strong>Economic Operating System</strong> for the community. 
                  This Code of Conduct ensures that every agent—from a local ambassador to a city lead—protects the Mansa Musa Marketplace 
                  brand and our proprietary intellectual property while building economic empowerment on the ground.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Professional Integrity */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <span>1. Professional Integrity & Brand Representation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" />
                Accuracy in Communication
              </h3>
              <p className="text-muted-foreground mb-3">
                Agents must only use <strong>official Mansa Musa pitch decks and marketing materials</strong>. 
                All promotional content must be approved by the platform and accurately represent our services.
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  You are strictly prohibited from making "guaranteed profit" or "guaranteed income" claims to merchants.
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                The "Mansa Standard"
              </h3>
              <p className="text-muted-foreground">
                Agents must prioritize the onboarding of businesses that meet our <strong>"Official Certification" standards</strong>:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                <li>Verified physical location or legitimate online presence</li>
                <li>Active business operations with valid licensing (where applicable)</li>
                <li>Community alignment with Mansa Musa values</li>
                <li>Commitment to quality products/services</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Data Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <span>2. Data Security & Anti-Poaching</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Your access to the Merchant Dashboard and Agent Portal is a <strong>privilege</strong>, not a right. 
              This access comes with serious responsibilities.
            </p>

            <div className="grid gap-4">
              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Proprietary Knowledge</h3>
                <p className="text-sm text-muted-foreground">
                  Agents shall <strong>not disclose</strong> the internal logic of the B2B Match algorithm, Proximity Trigger systems, 
                  AI recommendation engines, or any other proprietary technology to any third party, competitor, or unauthorized individual.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Non-Compete Clause</h3>
                <p className="text-sm text-muted-foreground">
                  During your tenure as an agent and for <strong>12 months following termination</strong>, you are prohibited from 
                  working for, consulting for, or starting a competing business directory, B2B marketplace, or economic platform 
                  targeting the same demographic.
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">Lead Ownership</h3>
                <p className="text-sm text-muted-foreground">
                  All merchant data, business leads, contact information, and onboarding documentation gathered during 
                  the recruitment process is the <strong>sole property of Mansa Musa Marketplace</strong>. This data may not be 
                  used for personal gain or shared with third parties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Ethical Onboarding */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <span>3. Ethical Onboarding & "The Ground Game"</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Scale className="w-4 h-4 text-primary" />
                Informed Consent
              </h3>
              <p className="text-muted-foreground">
                Agents must ensure that <strong>every merchant fully understands</strong> the Terms of Service before signing up. 
                This includes explicit explanation of:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                <li>How their inventory data may be used for the B2B Marketplace</li>
                <li>The commission structure and fee schedules</li>
                <li>Data sharing and privacy policies</li>
                <li>The verification and certification process</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Proximity Etiquette
              </h3>
              <p className="text-muted-foreground mb-3">
                When setting up QR Campaigns, NFC tags, or Proximity Triggers for a merchant:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                <li>Ensure hardware/stickers are placed respectfully within the merchant's physical space</li>
                <li>Do not obstruct customer flow or damage property</li>
                <li>Obtain explicit written permission for all physical installations</li>
                <li>Prioritize the merchant's customer experience above all else</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Community Respect
              </h3>
              <p className="text-muted-foreground">
                Agents represent the Mansa Musa brand in the community. You must:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                <li>Treat all merchants with dignity and respect, regardless of business size</li>
                <li>Never pressure or coerce merchants into signing up</li>
                <li>Respect cultural and religious practices of the communities you serve</li>
                <li>Report any discrimination or unethical behavior witnessed during operations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Compensation & Transparency */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <span>4. Compensation & Transparency</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Commission-Only Structure</h3>
              <p className="text-muted-foreground">
                Agents understand and acknowledge that they are <strong>Independent Contractors</strong>. 
                Commission payments are triggered strictly upon:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                <li>Successful verification of a referred merchant</li>
                <li>Merchant subscription activation and payment</li>
                <li>Transaction volume thresholds as tracked by the automated Commission Ledger</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3 italic">
                No salary, benefits, or employment relationship is implied or created by this arrangement.
              </p>
            </div>

            <Separator />

            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <h3 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Anti-Bribery Policy
              </h3>
              <p className="text-sm text-muted-foreground">
                Agents are <strong>strictly prohibited</strong> from:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                <li>Accepting "under-the-table" payments from merchants to expedite verification</li>
                <li>Offering bribes or kickbacks to merchants for signing up</li>
                <li>Manipulating the commission system through fraudulent referrals</li>
                <li>Creating fake merchant accounts or inflating transaction volumes</li>
              </ul>
              <p className="text-sm text-destructive font-medium mt-3">
                Violation of this policy will result in immediate termination and potential legal action.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Payment Transparency</h3>
              <p className="text-muted-foreground">
                All commission calculations, referral tracking, and payment statuses are visible in real-time 
                through your Agent Dashboard. If you believe there is a discrepancy, submit a support ticket 
                within 30 days of the transaction date.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Acknowledgment Section */}
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span>Agent Acknowledgment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              By participating in the Mansa Musa Marketplace Sales Agent Program, you acknowledge that you have 
              read, understood, and agree to abide by this Code of Conduct. Violations may result in:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4 mb-4">
              <li>Commission forfeiture for pending payments</li>
              <li>Immediate termination from the Agent Program</li>
              <li>Revocation of platform access</li>
              <li>Legal action for serious violations (fraud, data theft, etc.)</li>
            </ul>
            <p className="text-sm text-muted-foreground italic">
              This Code of Conduct is incorporated by reference into the Sales Agent Agreement and 
              the Mansa Musa Marketplace Terms of Service.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Questions about this Code of Conduct?</p>
          <p>Contact <a href="mailto:Thomas@1325.AI" className="text-primary hover:underline">Thomas@1325.AI</a></p>
        </div>
      </div>
    </Layout>
  );
};

export default SalesAgentCodeOfConductPage;
