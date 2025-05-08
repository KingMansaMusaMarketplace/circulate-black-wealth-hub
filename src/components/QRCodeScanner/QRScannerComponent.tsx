
import React, { useRef, useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, Check, X } from "lucide-react";
import { toast } from "sonner";

interface QRScannerProps {
  onScan: (data: string) => void;
  loading?: boolean;
  scanResult?: { 
    success: boolean;
    businessName?: string;
    pointsEarned?: number;
    discountApplied?: number;
  } | null;
}

const QRScannerComponent: React.FC<QRScannerProps> = ({ 
  onScan,
  loading = false,
  scanResult = null 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Request camera permission and start video stream
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setScanning(true);
        setPermission(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Camera access denied. Please enable camera permissions.');
      setPermission(false);
    }
  };

  // Stop video stream
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setScanning(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  // Show scan result for a few seconds
  useEffect(() => {
    if (scanResult) {
      setShowResult(true);
      const timer = setTimeout(() => {
        setShowResult(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scanResult]);

  // Get user's geolocation
  const getLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
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
        () => {
          resolve(null);
        }
      );
    });
  };

  // Handle manual QR code input
  const handleManualInput = () => {
    const code = prompt('Enter QR code:');
    if (code) {
      onScan(code);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="space-y-6">
        {!scanning && !loading && !showResult && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="bg-gray-100 p-10 rounded-lg mb-4">
              <Camera size={80} className="text-gray-400" />
            </div>
            <Button onClick={startScanner} className="w-full">
              Scan QR Code with Camera
            </Button>
            <Button variant="outline" onClick={handleManualInput} className="w-full">
              Enter Code Manually
            </Button>
          </div>
        )}
        
        {permission === false && (
          <div className="text-center text-red-500 p-4">
            Camera access denied. Please enable camera permissions.
          </div>
        )}
        
        {scanning && (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg aspect-video">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-mansablue opacity-70 z-10">
                <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-mansablue"></div>
                <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-mansablue"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-mansablue"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-mansablue"></div>
              </div>
            </div>
            <Button onClick={stopScanner} variant="destructive" className="w-full">
              Cancel Scanning
            </Button>
          </div>
        )}
        
        {loading && (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-10 w-10 animate-spin text-mansablue mb-4" />
            <p className="text-gray-500">Processing QR code...</p>
          </div>
        )}
        
        {showResult && scanResult && (
          <div className="border rounded-lg p-6">
            <div className="flex items-center mb-4">
              {scanResult.success ? (
                <Check className="h-8 w-8 text-green-500 mr-2" />
              ) : (
                <X className="h-8 w-8 text-red-500 mr-2" />
              )}
              <h3 className="text-lg font-medium">
                {scanResult.success ? 'Success!' : 'Scan Failed'}
              </h3>
            </div>
            
            {scanResult.success && (
              <div className="space-y-2">
                {scanResult.businessName && (
                  <p className="text-gray-700">
                    <span className="font-medium">Business:</span> {scanResult.businessName}
                  </p>
                )}
                
                {scanResult.pointsEarned ? (
                  <p className="text-green-600 font-medium">
                    You earned {scanResult.pointsEarned} points!
                  </p>
                ) : scanResult.discountApplied ? (
                  <p className="text-green-600 font-medium">
                    You received a {scanResult.discountApplied}% discount!
                  </p>
                ) : null}
                
                <Button onClick={() => setShowResult(false)} className="w-full mt-4">
                  Done
                </Button>
              </div>
            )}
            
            {!scanResult.success && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Unable to process the QR code. Please try again.
                </p>
                <Button onClick={() => setShowResult(false)} className="w-full">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default QRScannerComponent;
