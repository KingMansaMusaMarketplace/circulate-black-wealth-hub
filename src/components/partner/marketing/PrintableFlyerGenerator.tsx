import React, { useState } from 'react';
import { DirectoryPartner, PartnerStats } from '@/types/partner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Printer, Eye } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface PrintableFlyerGeneratorProps {
  partner: DirectoryPartner;
  stats: PartnerStats;
}

const PrintableFlyerGenerator: React.FC<PrintableFlyerGeneratorProps> = ({ partner, stats }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const benefits = [
    { title: 'Get Discovered', desc: 'By conscious consumers seeking Black-owned businesses' },
    { title: 'B2B Matching', desc: 'Find partners, suppliers, and customers' },
    { title: 'Susu Circles', desc: 'Community-powered rotating savings' },
    { title: 'Loyalty Tools', desc: 'Build customer engagement & rewards' },
    { title: 'Impact Tracking', desc: 'See your economic contribution' },
  ];

  const valueProposition = {
    monthlyValue: 700,
    monthlyPrice: 100,
    roi: '7x',
  };

  const generateFlyer = async () => {
    setIsGenerating(true);
    try {
      const qrCode = await QRCode.toDataURL(partner.referral_link, {
        width: 150,
        margin: 1,
        color: { dark: '#1B365D', light: '#FFFFFF' },
      });

      const flyerHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Join 1325.ai - Flyer</title>
  <style>
    @page { size: letter; margin: 0.5in; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: white; color: #1e293b; }
    .flyer { width: 8in; min-height: 10in; padding: 0.5in; }
    .header { background: linear-gradient(135deg, #1B365D 0%, #2563eb 100%); color: white; padding: 32px; border-radius: 16px; text-align: center; margin-bottom: 24px; }
    .header h1 { font-size: 2.5rem; margin-bottom: 8px; }
    .header p { font-size: 1.1rem; opacity: 0.9; }
    .value-box { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 24px; color: #1e293b; }
    .value-box .big { font-size: 3rem; font-weight: 800; }
    .value-box .medium { font-size: 1.5rem; font-weight: 600; margin: 8px 0; }
    .value-box .small { font-size: 1rem; opacity: 0.9; }
    .benefits { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .benefit { background: #f8fafc; padding: 16px; border-radius: 8px; border-left: 4px solid #1B365D; }
    .benefit h3 { font-size: 1rem; color: #1B365D; margin-bottom: 4px; }
    .benefit p { font-size: 0.875rem; color: #64748b; }
    .cta-section { background: #1e293b; color: white; padding: 32px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; }
    .cta-left { flex: 1; }
    .cta-left h2 { font-size: 1.75rem; margin-bottom: 8px; }
    .cta-left p { opacity: 0.8; margin-bottom: 16px; }
    .cta-left .link { background: #f59e0b; color: #1e293b; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 0.875rem; word-break: break-all; display: inline-block; }
    .cta-right { text-align: center; margin-left: 24px; }
    .cta-right img { background: white; padding: 8px; border-radius: 8px; }
    .cta-right p { font-size: 0.75rem; margin-top: 8px; opacity: 0.8; }
    .footer { text-align: center; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0; }
    .footer p { font-size: 0.75rem; color: #64748b; }
    .partner-badge { display: inline-block; background: #f59e0b; color: #1e293b; padding: 6px 16px; border-radius: 20px; font-weight: 600; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="flyer">
    <div class="header">
      <h1>Join 1325.ai</h1>
      <p>The Economic Operating System for Black-Owned Businesses</p>
      <div class="partner-badge">Referred by ${partner.directory_name}</div>
    </div>
    
    <div class="value-box">
      <div class="big">$${valueProposition.monthlyValue}/mo</div>
      <div class="medium">in business tools for just $${valueProposition.monthlyPrice}/mo</div>
      <div class="small">That's a ${valueProposition.roi} return on your investment!</div>
    </div>
    
    <div class="benefits">
      ${benefits.map(b => `
        <div class="benefit">
          <h3>✓ ${b.title}</h3>
          <p>${b.desc}</p>
        </div>
      `).join('')}
    </div>
    
    <div class="cta-section">
      <div class="cta-left">
        <h2>Sign Up FREE</h2>
        <p>Become a Founding Member before September 1, 2026</p>
        <div class="link">${partner.referral_link}</div>
        <p style="margin-top: 12px; font-size: 0.875rem;">Partner Code: <strong>${partner.referral_code}</strong></p>
      </div>
      <div class="cta-right">
        <img src="${qrCode}" alt="Scan to join" width="120" />
        <p>Scan to Join</p>
      </div>
    </div>
    
    <div class="footer">
      <p>Questions? Contact ${partner.contact_email} | © 2026 1325.ai - Circulating Wealth, Building Legacy</p>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

      const blob = new Blob([flyerHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      
      toast.success('Flyer opened! Use Print → Save as PDF');
    } catch (error) {
      console.error('Error generating flyer:', error);
      toast.error('Failed to generate flyer');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Printer className="w-5 h-5 text-amber-400" />
          Printable Flyer
        </CardTitle>
        <CardDescription className="text-slate-400">
          A designed flyer for events, networking, and trade shows. Print or save as PDF.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="bg-white rounded-xl p-4 text-slate-900">
          <div className="bg-gradient-to-r from-mansablue to-blue-600 text-white p-4 rounded-lg text-center mb-3">
            <h3 className="font-bold text-lg">Join 1325.ai</h3>
            <p className="text-sm text-blue-200">Referred by {partner.directory_name}</p>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-3 rounded-lg text-center mb-3 text-slate-900">
            <div className="text-xl font-bold">${valueProposition.monthlyValue}/mo → ${valueProposition.monthlyPrice}/mo</div>
            <div className="text-xs">{valueProposition.roi} ROI</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            {benefits.slice(0, 4).map((b, i) => (
              <div key={i} className="bg-slate-100 p-2 rounded border-l-2 border-mansablue">
                <div className="font-semibold">✓ {b.title}</div>
              </div>
            ))}
          </div>
          
          <div className="bg-slate-800 text-white p-3 rounded-lg flex justify-between items-center">
            <div>
              <div className="font-bold text-sm">Sign Up FREE</div>
              <div className="text-xs text-slate-400">Code: {partner.referral_code}</div>
            </div>
            <div className="w-12 h-12 bg-white rounded flex items-center justify-center text-slate-400 text-xs">
              QR
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={generateFlyer}
            disabled={isGenerating}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            <Printer className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Print / Save as PDF'}
          </Button>
        </div>

        <p className="text-xs text-slate-500">
          Tip: Opens in new tab with print dialog. Select "Save as PDF" as your printer for a downloadable file.
        </p>
      </CardContent>
    </Card>
  );
};

export default PrintableFlyerGenerator;
