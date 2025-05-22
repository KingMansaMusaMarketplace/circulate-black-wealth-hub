
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { QRCodeScannerV2 } from '@/components/QRScannerV2';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const QRCodeScannerV2Page: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = React.useState('scan');

  if (loading) {
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

  if (!user) {
    return <Navigate to="/login" state={{ from: "/scan-v2" }} replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>QR Scanner | Mansa Musa Marketplace</title>
        <meta name="description" content="Scan QR codes to earn loyalty points or access special offers" />
      </Helmet>

      <Navbar />

      <div className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">QR Code Scanner</h1>
          <p className="text-gray-600 mb-6">Scan business QR codes to earn loyalty points</p>

          <Card className="mb-8">
            <CardContent className="p-0">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="scan" className="w-1/2">Scan QR Code</TabsTrigger>
                  <TabsTrigger value="history" className="w-1/2">Scan History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="scan" className="p-6">
                  <QRCodeScannerV2 />
                </TabsContent>
                
                <TabsContent value="history" className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">Recent Scans</h2>
                    <p className="text-gray-500 text-sm">View your recent QR code scans and earned rewards</p>
                  </div>
                  
                  <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No recent scans available</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">How QR Scanning Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <span className="text-blue-600 text-xl font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Find a QR Code</h3>
                <p className="text-sm text-gray-500">Look for QR codes at participating Black-owned businesses</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <span className="text-blue-600 text-xl font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Scan with Camera</h3>
                <p className="text-sm text-gray-500">Align your camera with the QR code to scan it</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <span className="text-blue-600 text-xl font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Earn Points</h3>
                <p className="text-sm text-gray-500">Earn loyalty points or access special offers automatically</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QRCodeScannerV2Page;
