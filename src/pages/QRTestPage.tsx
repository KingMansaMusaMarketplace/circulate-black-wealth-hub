import React, { useState, useEffect } from 'react';
import { generateCustomQrCode } from '@/lib/api/qr-generator';
import { Button } from '@/components/ui/button';
import { Loader2, QrCode, Sparkles, Shield, CheckCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 animate-fade-in">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg">
                <QrCode className="h-8 w-8 text-slate-900" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">QR Code Branding Test</h1>
            </div>
            <p className="text-blue-200 ml-16">
              Testing Mansa Musa Marketplace branded QR codes with logo overlay
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code Display */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Branded QR Code
              </h2>
              <div className="aspect-square bg-white rounded-lg flex items-center justify-center border-2 border-yellow-400/30">
                {loading ? (
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                ) : qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Branded QR Code" 
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <p className="text-slate-500">No QR code generated</p>
                )}
              </div>
              <Button 
                onClick={generateTestQR} 
                className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-bold"
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
            </div>

            {/* Information */}
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                Brand Features
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-yellow-400 mb-1">Logo Design</h3>
                  <p className="text-sm text-blue-200">Golden crown with emerald gems representing Mansa Musa's wealth and royalty</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-sm text-yellow-400 mb-1">Size Optimization</h3>
                  <p className="text-sm text-blue-200">Logo is 20% of QR code size - optimal for scanning while maintaining brand visibility</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-sm text-yellow-400 mb-1">Error Correction</h3>
                  <p className="text-sm text-blue-200">High (H) level - allows up to 30% of code to be covered while maintaining scannability</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-sm text-yellow-400 mb-1">Background</h3>
                  <p className="text-sm text-blue-200">White circle with gold border for maximum contrast and brand consistency</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="font-semibold mb-2 text-white">Test Instructions:</h3>
                  <ol className="text-sm space-y-2 text-blue-200 list-decimal list-inside">
                    <li>Open your phone's camera app</li>
                    <li>Point it at the QR code above</li>
                    <li>Verify it scans successfully</li>
                    <li>Logo should be clearly visible</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 backdrop-blur-xl bg-green-500/20 border border-green-400/30 rounded-2xl p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Implementation Complete
            </h3>
            <ul className="text-sm space-y-1 ml-7 text-blue-200">
              <li>• Simplified logo created (crown icon)</li>
              <li>• Logo size optimized to 20% for best scanning</li>
              <li>• White background with gold border added</li>
              <li>• All generated QR codes will include branding automatically</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRTestPage;
