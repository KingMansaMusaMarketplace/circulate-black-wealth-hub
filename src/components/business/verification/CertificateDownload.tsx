import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ExternalLink, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import VerifiedBlackOwnedBadge, { BadgeTier } from '@/components/ui/VerifiedBlackOwnedBadge';

interface CertificateDownloadProps {
  businessName: string;
  certificateNumber: string;
  expiresAt: string;
  badgeTier: BadgeTier;
  verifiedAt: string;
}

const CertificateDownload: React.FC<CertificateDownloadProps> = ({
  businessName,
  certificateNumber,
  expiresAt,
  badgeTier,
  verifiedAt,
}) => {
  const verificationUrl = `${window.location.origin}/verify/${certificateNumber}`;
  
  const embedCode = `<a href="${verificationUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;padding:8px 16px;background:linear-gradient(135deg,#f59e0b,#eab308);color:#1a1a2e;border-radius:8px;text-decoration:none;font-family:system-ui,sans-serif;font-weight:600;font-size:14px;">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  Certified Black-Owned Business
</a>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    toast.success('Embed code copied to clipboard!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    toast.success('Verification link copied!');
  };

  const handleDownloadCertificate = () => {
    // In a real implementation, this would generate/download a PDF
    toast.info('Certificate download will be available soon');
  };

  return (
    <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-yellow-500/5">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-amber-500" />
              Certification Active
            </CardTitle>
            <CardDescription>
              Your business has been verified as Black-owned
            </CardDescription>
          </div>
          <VerifiedBlackOwnedBadge 
            tier={badgeTier} 
            variant="standard"
            certificateNumber={certificateNumber}
            expiresAt={expiresAt}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Certificate Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg border">
          <div>
            <p className="text-xs text-muted-foreground">Business Name</p>
            <p className="font-medium">{businessName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Certificate Number</p>
            <p className="font-mono font-medium">{certificateNumber}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Verified On</p>
            <p className="font-medium">{new Date(verifiedAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Valid Through</p>
            <p className="font-medium">{new Date(expiresAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownloadCertificate} className="gap-2">
            <Download className="h-4 w-4" />
            Download Certificate
          </Button>
          <Button variant="outline" onClick={handleCopyLink} className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Copy Verification Link
          </Button>
        </div>

        {/* Embed Code Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Website Badge</h4>
            <Button variant="ghost" size="sm" onClick={handleCopyEmbed} className="gap-1">
              <Copy className="h-3 w-3" />
              Copy Code
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Add this badge to your website to show customers your business is certified Black-owned.
          </p>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Preview:</p>
            <a 
              href={verificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-mansablue rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              <CheckCircle className="h-4 w-4" />
              Certified Black-Owned Business
            </a>
          </div>
          <pre className="p-3 bg-muted/50 rounded-lg text-xs overflow-x-auto border">
            <code>{embedCode}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default CertificateDownload;
