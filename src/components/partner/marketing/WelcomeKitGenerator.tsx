import React, { useState, useRef } from 'react';
import { DirectoryPartner, PartnerStats } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Eye, QrCode, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface WelcomeKitGeneratorProps {
  partner: DirectoryPartner;
  stats: PartnerStats;
}

const WelcomeKitGenerator: React.FC<WelcomeKitGeneratorProps> = ({ partner, stats }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const benefits = [
    'Get discovered by conscious consumers actively seeking Black-owned businesses',
    'Access exclusive B2B matching to find partners, suppliers, and customers',
    'Join rotating savings circles (Susu) for community-powered financing',
    'Build loyalty with integrated rewards and customer engagement tools',
    'Track your economic impact with our proprietary CMAL multiplier system',
  ];

  const valueProposition = {
    monthlyValue: 700,
    monthlyPrice: 100,
    roi: '7x',
  };

  const generateQRCode = async () => {
    try {
      const dataUrl = await QRCode.toDataURL(partner.referral_link, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1B365D',
          light: '#FFFFFF',
        },
      });
      setQrCodeDataUrl(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  const downloadWelcomeKit = async () => {
    setIsGenerating(true);
    try {
      const qrCode = qrCodeDataUrl || await generateQRCode();
      
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Join 1325.AI - Referred by ${partner.directory_name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #1e293b; }
    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
    .header { background: linear-gradient(135deg, #1B365D 0%, #2563eb 100%); color: white; padding: 40px; border-radius: 16px; text-align: center; margin-bottom: 32px; }
    .header h1 { font-size: 2.5rem; margin-bottom: 8px; }
    .header p { font-size: 1.1rem; opacity: 0.9; }
    .partner-badge { background: #f59e0b; color: #1e293b; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin-top: 16px; }
    .content { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); margin-bottom: 24px; }
    .section-title { font-size: 1.5rem; color: #1B365D; margin-bottom: 20px; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; }
    .benefits-list { list-style: none; }
    .benefits-list li { padding: 12px 0; border-bottom: 1px solid #e2e8f0; display: flex; align-items: flex-start; gap: 12px; }
    .benefits-list li:last-child { border-bottom: none; }
    .check { color: #22c55e; font-weight: bold; font-size: 1.2rem; }
    .cta-section { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px; border-radius: 16px; text-align: center; color: #1e293b; }
    .cta-section h2 { font-size: 1.75rem; margin-bottom: 16px; }
    .referral-link { background: white; padding: 16px 24px; border-radius: 8px; font-family: monospace; font-size: 1rem; word-break: break-all; margin: 20px 0; }
    .qr-section { display: flex; justify-content: center; gap: 40px; align-items: center; flex-wrap: wrap; margin-top: 24px; }
    .qr-code { background: white; padding: 16px; border-radius: 8px; }
    .qr-label { font-size: 0.875rem; margin-top: 8px; }
    .footer { text-align: center; padding: 24px; color: #64748b; font-size: 0.875rem; }
    @media print { body { background: white; } .container { max-width: 100%; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="font-family: ui-monospace, SFMono-Regular, monospace; letter-spacing: 0.05em;">Join 1325.AI</h1>
      <p>The Economic Operating System for Black-Owned Businesses</p>
      <div class="partner-badge">Referred by ${partner.directory_name}</div>
    </div>
    
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px; color: #1e293b;">
      <div style="font-size: 2.5rem; font-weight: 800;">$${valueProposition.monthlyValue}/mo</div>
      <div style="font-size: 1.1rem; margin: 8px 0;">in business tools & benefits</div>
      <div style="font-size: 1.5rem; font-weight: 700;">for just $${valueProposition.monthlyPrice}/month</div>
      <div style="margin-top: 8px; font-size: 0.9rem; opacity: 0.9;">That's a ${valueProposition.roi} return on your investment!</div>
    </div>
    
    <div class="content">
      <h2 class="section-title">Why Join <span style="font-family: ui-monospace, SFMono-Regular, monospace; letter-spacing: 0.05em;">1325.AI</span>?</h2>
      <ul class="benefits-list">
        ${benefits.map(b => `<li><span class="check">✓</span><span>${b}</span></li>`).join('')}
      </ul>
    </div>
    
    <div class="cta-section">
      <h2>Ready to Grow Your Business?</h2>
      <p>Sign up FREE before September 1, 2026 to become a Founding Member</p>
      <div class="referral-link">${partner.referral_link}</div>
      <div class="qr-section">
        ${qrCode ? `<div class="qr-code"><img src="${qrCode}" alt="Scan to join" /><div class="qr-label">Scan to Join</div></div>` : ''}
        <div>
          <p><strong>Partner Code:</strong> ${partner.referral_code}</p>
          <p style="margin-top: 8px;">Use this code at signup for attribution</p>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Questions? Contact ${partner.contact_email}</p>
      <p style="margin-top: 8px;">© 2026 <span style="font-family: ui-monospace, SFMono-Regular, monospace; letter-spacing: 0.05em;">1325.AI</span> - Circulating Wealth, Building Legacy</p>
    </div>
  </div>
</body>
</html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `1325-welcome-kit-${partner.referral_code}.html`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Welcome Kit downloaded! Open in browser and print as PDF.');
    } catch (error) {
      console.error('Error generating welcome kit:', error);
      toast.error('Failed to generate welcome kit');
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    generateQRCode();
  }, [partner.referral_link]);

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <FileText className="w-5 h-5 text-amber-400" />
          Digital Welcome Kit
        </CardTitle>
        <CardDescription className="text-slate-400">
          A branded one-pager your members can view or print. Includes your QR code and referral link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview Card */}
        <div className="bg-gradient-to-br from-mansablue to-blue-700 rounded-xl p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">Join <span className="font-mono tracking-wider">1325.AI</span></h3>
              <p className="text-blue-200 text-sm">Referred by {partner.directory_name}</p>
            </div>
            {qrCodeDataUrl && (
              <div className="bg-white p-2 rounded-lg">
                <img src={qrCodeDataUrl} alt="QR Code" className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Value Proposition Banner */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg p-3 mb-4 text-center text-slate-900">
            <div className="text-lg font-bold">${valueProposition.monthlyValue}/mo value → ${valueProposition.monthlyPrice}/mo</div>
            <div className="text-xs opacity-90">{valueProposition.roi} ROI on business tools & benefits</div>
          </div>
          
          <div className="space-y-2 mb-4">
            {benefits.slice(0, 3).map((benefit, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-blue-100">{benefit}</span>
              </div>
            ))}
            <p className="text-blue-200 text-xs ml-6">...and more benefits inside</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-xs text-blue-200 mb-1">Your exclusive signup link:</p>
            <code className="text-amber-300 text-sm break-all">{partner.referral_link}</code>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={downloadWelcomeKit}
            disabled={isGenerating}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Download Welcome Kit'}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(partner.referral_link, '_blank')}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Signup Page
          </Button>
        </div>

        <p className="text-xs text-slate-500">
          Tip: Open the downloaded file in your browser and use Print → Save as PDF for a printable version.
        </p>
      </CardContent>
    </Card>
  );
};

export default WelcomeKitGenerator;
