import React, { useState, useEffect } from 'react';
import { generateCustomQrCode } from '@/lib/api/qr-generator';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const QRTestPage = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateTestQR = async () => {
    setLoading(true);
    try {
      // Generate a test QR code with branding
      const testData = 'test-qr-' + Date.now();
      const url = await generateCustomQrCode(testData, {
        size: 512,
        useBranding: true
      });
      setQrCodeUrl(url);
    } catch (error) {
      console.error('Error generating test QR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateTestQR();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">QR Code Branding Test</h1>
        <p className="text-muted-foreground mb-8">
          Testing Mansa Musa Marketplace branded QR codes with logo overlay
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Display */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Branded QR Code</h2>
            <div className="aspect-square bg-white rounded-lg flex items-center justify-center border-2 border-border">
              {loading ? (
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              ) : qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="Branded QR Code" 
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <p className="text-muted-foreground">No QR code generated</p>
              )}
            </div>
            <Button 
              onClick={generateTestQR} 
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate New Test QR'
              )}
            </Button>
          </Card>

          {/* Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Brand Features</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Logo Design</h3>
                <p className="text-sm">Golden crown with emerald gems representing Mansa Musa's wealth and royalty</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Size Optimization</h3>
                <p className="text-sm">Logo is 20% of QR code size - optimal for scanning while maintaining brand visibility</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Error Correction</h3>
                <p className="text-sm">High (H) level - allows up to 30% of code to be covered while maintaining scannability</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">Background</h3>
                <p className="text-sm">White circle with gold border for maximum contrast and brand consistency</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Test Instructions:</h3>
                <ol className="text-sm space-y-2 list-decimal list-inside">
                  <li>Open your phone's camera app</li>
                  <li>Point it at the QR code above</li>
                  <li>Verify it scans successfully</li>
                  <li>Logo should be clearly visible</li>
                </ol>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-primary">✓</span>
            Implementation Complete
          </h3>
          <ul className="text-sm space-y-1 ml-6">
            <li>• Simplified logo created (crown icon)</li>
            <li>• Logo size optimized to 20% for best scanning</li>
            <li>• White background with gold border added</li>
            <li>• All generated QR codes will include branding automatically</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QRTestPage;
