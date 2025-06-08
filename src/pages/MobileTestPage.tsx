
import React from 'react';
import { Helmet } from 'react-helmet';
import { Navbar } from '@/components/navbar';
import Footer from '@/components/Footer';
import PermissionsChecker from '@/components/mobile/PermissionsChecker';
import { useDeviceDetection } from '@/hooks/use-device-detection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Wifi, 
  Battery, 
  Signal,
  Camera,
  MapPin,
  QrCode,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const MobileTestPage: React.FC = () => {
  const deviceInfo = useDeviceDetection();

  const testQRScanner = () => {
    window.location.href = '/scanner';
  };

  const testPayments = () => {
    window.location.href = '/corporate-sponsorship';
  };

  const testGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        alert(`Location: ${position.coords.latitude}, ${position.coords.longitude}`);
      },
      (error) => {
        alert(`Location error: ${error.message}`);
      }
    );
  };

  const connectivity = {
    online: navigator.onLine,
    connection: (navigator as any).connection?.effectiveType || 'unknown',
    downlink: (navigator as any).connection?.downlink || 'unknown'
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Mobile App Test - Mansa Musa Marketplace</title>
        <meta name="description" content="Test mobile app functionality and device capabilities" />
      </Helmet>

      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mobile App Test Suite</h1>
        
        {/* Device Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium">Platform</div>
                <Badge variant={deviceInfo.isCapacitor ? "default" : "secondary"}>
                  {deviceInfo.isCapacitor ? 'Native App' : 'Web App'}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium">OS</div>
                <Badge variant="outline">
                  {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Web'}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-medium">Screen Size</div>
                <Badge variant="outline">{deviceInfo.screenSize}</Badge>
              </div>
              <div>
                <div className="text-sm font-medium">Orientation</div>
                <Badge variant="outline">{deviceInfo.orientation}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connectivity Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Connectivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Online Status</span>
                {connectivity.online ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between">
                <span>Connection Type</span>
                <Badge variant="outline">{connectivity.connection}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <PermissionsChecker />

        {/* Feature Tests */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Feature Tests</CardTitle>
            <CardDescription>
              Test core app functionality on this device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={testQRScanner}
                className="w-full justify-start"
                variant="outline"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Test QR Code Scanner
              </Button>
              
              <Button 
                onClick={testGeolocation}
                className="w-full justify-start"
                variant="outline"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Test Location Services
              </Button>
              
              <Button 
                onClick={testPayments}
                className="w-full justify-start"
                variant="outline"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Test Payment Flow
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Launch Readiness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Launch Readiness Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { item: 'Capacitor Configuration', status: 'complete' },
                { item: 'iOS Safe Area Support', status: 'complete' },
                { item: 'Permission Handling', status: 'complete' },
                { item: 'Offline Detection', status: 'complete' },
                { item: 'Mobile Navigation', status: 'complete' },
                { item: 'Payment Integration', status: 'complete' },
                { item: 'QR Code Scanning', status: 'complete' },
                { item: 'Geolocation Services', status: 'complete' },
                { item: 'PWA Manifest', status: 'complete' },
                { item: 'App Store Compliance', status: 'pending' }
              ].map((check, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span>{check.item}</span>
                  {check.status === 'complete' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default MobileTestPage;
