
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { QrCode } from 'lucide-react';

const QRCodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [points, setPoints] = useState(0);
  const [businessName, setBusinessName] = useState('');
  const [hasCamera, setHasCamera] = useState(true);

  // Check if camera permission is available (dummy implementation)
  useEffect(() => {
    // In a real implementation, we would check camera permissions here
    const checkCameraPermission = async () => {
      try {
        // This is a simplified version - in a real app we'd use the MediaDevices API
        setHasCamera(true);
      } catch (error) {
        console.error("Error checking camera:", error);
        setHasCamera(false);
      }
    };

    checkCameraPermission();
  }, []);

  // Simulate QR scanning
  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setScanned(true);
      
      // Simulate different businesses and points values
      const businesses = [
        { name: "Soul Food Kitchen", points: 10 },
        { name: "Prestigious Cuts", points: 15 },
        { name: "Heritage Bookstore", points: 8 },
        { name: "Prosperity Financial", points: 20 }
      ];
      
      const randomBusiness = businesses[Math.floor(Math.random() * businesses.length)];
      setBusinessName(randomBusiness.name);
      setPoints(randomBusiness.points);
      
      toast("Scan Successful!", {
        description: `You earned ${randomBusiness.points} loyalty points at ${randomBusiness.name}.`,
      });
      
      // Reset after showing success
      setTimeout(() => {
        setScanned(false);
      }, 3000);
    }, 2000);
  };

  const requestCameraPermission = () => {
    // In a real implementation, this would request camera permission
    toast("Camera Access Required", {
      description: "This app needs permission to access your camera for scanning QR codes."
    });
    setHasCamera(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-3">
        <QrCode size={20} className="text-mansablue" />
        <h3 className="text-lg font-bold text-gray-900">QR Code Scanner</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6">Scan a business QR code to earn discounts and loyalty points</p>
      
      <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-dashed border-gray-200 mb-6">
        {isScanning ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
            <div className="text-white text-center">
              <div className="mb-3">
                <svg className="animate-spin h-10 w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p>Scanning...</p>
            </div>
          </div>
        ) : scanned ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-mansagold bg-opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white font-bold text-xl">Success!</p>
            <p className="text-white text-lg">+{points} Points</p>
            <p className="text-white mt-1">{businessName}</p>
          </div>
        ) : !hasCamera ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <QrCode size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500 mb-4">Camera access required to scan QR codes</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={requestCameraPermission}
              >
                Enable Camera Access
              </Button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="w-48 h-48 border-2 border-mansablue relative">
              {/* QR code scanner corners */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-mansagold"></div>
              <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-mansagold"></div>
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-mansagold"></div>
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-mansagold"></div>
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-400 text-sm text-center">Tap "Scan" to activate camera</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Button 
        className="w-full bg-mansablue hover:bg-mansablue-dark flex items-center justify-center gap-2"
        disabled={isScanning || scanned}
        onClick={handleScan}
      >
        <QrCode size={16} />
        {isScanning ? 'Scanning...' : scanned ? 'Scanned!' : 'Scan QR Code'}
      </Button>
      
      <div className="mt-4 text-xs text-center text-gray-500">
        Visit a participating business and scan their QR code at checkout
      </div>
    </div>
  );
};

export default QRCodeScanner;
