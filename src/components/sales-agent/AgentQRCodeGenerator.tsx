import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Download, RefreshCw } from 'lucide-react';
import { generateCustomQrCode } from '@/lib/api/qr-generator';
import { toast } from 'sonner';

interface AgentQRCodeGeneratorProps {
  referralCode: string;
}

const AgentQRCodeGenerator: React.FC<AgentQRCodeGeneratorProps> = ({ referralCode }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const referralUrl = `${window.location.origin}/signup?ref=${referralCode}`;

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrUrl = await generateCustomQrCode(referralUrl, {
        size: 400,
        color: '#1E40AF', // Mansablue color
        backgroundColor: '#FFFFFF'
      });
      setQrCodeUrl(qrUrl);
      toast.success('QR Code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (referralCode) {
      generateQRCode();
    }
  }, [referralCode]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `mansa-referral-qr-${referralCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR Code downloaded successfully!');
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          Referral QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Share this QR code at events, on business cards, or in marketing materials. 
          When scanned, it directs people to sign up with your referral code.
        </p>

        <div className="flex justify-center">
          {qrCodeUrl ? (
            <div className="relative">
              <div className="w-64 h-64 border-4 border-primary rounded-lg overflow-hidden bg-white shadow-lg">
                <img 
                  src={qrCodeUrl} 
                  alt="Referral QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold shadow-md">
                Mansa Marketplace
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 border-2 border-dashed border-muted rounded-lg flex items-center justify-center bg-background">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Generating QR Code...</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">
            <strong>Your Referral URL:</strong>
            <div className="mt-1 p-2 bg-background rounded border border-border text-xs break-all">
              {referralUrl}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleDownload} 
            className="flex-1"
            disabled={!qrCodeUrl || isGenerating}
          >
            <Download className="mr-2 h-4 w-4" />
            Download QR Code
          </Button>
          <Button 
            onClick={generateQRCode} 
            variant="outline"
            size="icon"
            disabled={isGenerating}
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>💡 Pro Tip:</strong> Print this QR code on business cards, flyers, or display it at your booth. 
            Each scan tracks back to you automatically!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentQRCodeGenerator;
