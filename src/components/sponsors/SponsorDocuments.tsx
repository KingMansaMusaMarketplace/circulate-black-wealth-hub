import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SponsorCertificateGenerator } from './SponsorCertificateGenerator';
import { FileText, Award, Receipt, Download } from 'lucide-react';

interface SponsorDocumentsProps {
  subscription: {
    id: string;
    company_name: string;
    tier: string;
    created_at: string;
    current_period_end: string | null;
  };
}

export function SponsorDocuments({ subscription }: SponsorDocumentsProps) {
  const sponsor = {
    id: subscription.id,
    company_name: subscription.company_name,
    tier: subscription.tier,
    created_at: subscription.created_at,
    current_period_end: subscription.current_period_end,
  };

  return (
    <div className="space-y-6">
      {/* Document Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Award className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-100">Certificate</p>
                <p className="text-xs text-blue-200/60">Official sponsorship certificate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Receipt className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-100">Tax Letter</p>
                <p className="text-xs text-blue-200/60">Acknowledgment for tax purposes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <FileText className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-100">PDF Downloads</p>
                <p className="text-xs text-blue-200/60">Instant document generation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificate Generator */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
        <CardHeader>
          <CardTitle className="text-amber-100 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Generate Documents
          </CardTitle>
          <CardDescription className="text-blue-200/70">
            Download your official sponsorship certificate and tax acknowledgment letter. 
            Customize the validity dates as needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <SponsorCertificateGenerator sponsor={sponsor} />
        </CardContent>
      </Card>

      {/* Usage Tips */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-amber-100 text-base">Document Usage Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-blue-200/80">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong className="text-amber-100">Certificate of Sponsorship:</strong> Use for internal recognition, press releases, and public display. Shows your commitment to supporting Black-owned businesses.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong className="text-amber-100">Tax Acknowledgment Letter:</strong> Provides documentation of your sponsorship for tax purposes. Consult with your tax advisor regarding deductibility.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong className="text-amber-100">Customizable Dates:</strong> Adjust the validity period to match your fiscal year or specific sponsorship terms.</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
