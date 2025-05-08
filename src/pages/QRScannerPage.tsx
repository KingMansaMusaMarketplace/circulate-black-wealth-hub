
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScannerComponent from '@/components/QRCodeScanner/QRScannerComponent';
import { useLoyaltyQRCode } from '@/hooks/use-loyalty-qr-code';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import WelcomeTooltip from '@/components/QRCodeScanner/components/WelcomeTooltip';

const QRScannerPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { scanQRAndProcessPoints, scanning, scanResult } = useLoyaltyQRCode({ autoRefresh: true });
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleScan = async (qrCodeId: string) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    try {
      // Try to detect if we're scanning a URL with QR code ID embedded
      let actualQrCodeId = qrCodeId;
      
      if (qrCodeId.includes('?')) {
        // This appears to be a URL, try to extract the QR code ID
        try {
          const url = new URL(qrCodeId);
          const qrParam = url.searchParams.get('qr');
          if (qrParam) {
            actualQrCodeId = qrParam;
          }
        } catch (e) {
          // Not a valid URL, use as-is
          console.log('Not a valid URL, using raw value:', qrCodeId);
        }
      }

      // Get user's location if available
      let location = null;
      try {
        location = await getLocationPromise();
      } catch (error) {
        console.log('Unable to get location:', error);
      }

      await scanQRAndProcessPoints(actualQrCodeId, location);
    } catch (error) {
      console.error('Error processing QR code:', error);
    }
  };

  const getLocationPromise = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Scan QR Code</h1>
        
        {showLogin ? (
          <Card className="max-w-md mx-auto animate-fade-in">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <p className="text-lg">Please login to scan QR codes</p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button variant="outline" onClick={() => setShowLogin(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <QRScannerComponent 
            onScan={handleScan}
            loading={scanning}
            scanResult={scanResult}
          />
        )}
      </div>
      <WelcomeTooltip />
      <Footer />
    </div>
  );
};

export default QRScannerPage;
