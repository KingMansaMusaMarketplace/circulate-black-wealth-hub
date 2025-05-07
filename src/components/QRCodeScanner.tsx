
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { QrCode, Camera, CameraOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLoyaltyQRCode } from '@/hooks/use-loyalty-qr-code';

const QRCodeScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [recentScans, setRecentScans] = useState<Array<{name: string, points: number, date: string}>>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerIntervalRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const { scanQRAndProcessPoints, scanResult } = useLoyaltyQRCode({ autoRefresh: true });

  // Check if camera permission is available
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        // Check if the browser supports the Permissions API
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
          setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
          setHasCamera(result.state === 'granted');
          
          // Listen for permission changes
          result.addEventListener('change', () => {
            setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
            setHasCamera(result.state === 'granted');
          });
        } else {
          // Fallback for browsers not supporting the Permission API
          setHasCamera(true);
          setPermissionStatus('prompt');
        }
      } catch (error) {
        console.error("Error checking camera:", error);
        setHasCamera(false);
        setPermissionStatus('prompt');
      }
    };

    checkCameraPermission();
  }, []);

  // Stop scanning when component unmounts
  useEffect(() => {
    return () => {
      if (scannerIntervalRef.current) {
        window.clearInterval(scannerIntervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Update recent scans when a new scan is processed
  useEffect(() => {
    if (scanResult) {
      const newScan = {
        name: scanResult.businessName || 'Business',
        points: scanResult.pointsEarned || 0,
        date: new Date().toLocaleDateString()
      };
      
      setRecentScans(prev => [newScan, ...prev].slice(0, 5));
      setScanned(true);
      
      // Reset after showing success
      setTimeout(() => {
        setScanned(false);
      }, 3000);
    }
  }, [scanResult]);

  // Simulate QR scanning with real camera stream
  const handleScan = async () => {
    setIsScanning(true);
    
    // In a real implementation, this would use a QR code scanning library
    // Here we're simulating the scanning process
    try {
      if (permissionStatus === 'granted') {
        // Attempt to get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: isMobile ? 'environment' : 'user' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        
        // Simulate scanning for a QR code
        scannerIntervalRef.current = window.setTimeout(() => {
          processScannedResult();
          
          // Stop the camera stream
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
          }
        }, 2000);
      } else {
        // If we don't have permission, just simulate the scan
        setTimeout(processScannedResult, 2000);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCamera(false);
      
      // Fall back to simulation
      setTimeout(processScannedResult, 2000);
    }
  };
  
  // Process a successful scan
  const processScannedResult = async () => {
    setIsScanning(false);
    
    // Use the QR code scanning hook to process the scan
    // For simulation, we're using a random QR code ID
    const qrCodeId = `qr-${Math.random().toString(36).substring(2, 10)}`;
    
    await scanQRAndProcessPoints(qrCodeId, {
      lat: 33.748997,
      lng: -84.387985
    });
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCamera(true);
      setPermissionStatus('granted');
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      toast("Camera Access Required", {
        description: "This app needs permission to access your camera for scanning QR codes."
      });
    }
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
          <div className="absolute inset-0 bg-black bg-opacity-70">
            <video 
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              muted
              playsInline
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center z-10">
                <div className="mb-3">
                  <svg className="animate-spin h-10 w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p>Scanning...</p>
              </div>
            </div>
          </div>
        ) : scanned && scanResult ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-mansagold bg-opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-white font-bold text-xl">Success!</p>
            <p className="text-white text-lg">+{scanResult.pointsEarned} Points</p>
            <p className="text-white mt-1">{scanResult.businessName}</p>
          </div>
        ) : !hasCamera ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <CameraOff size={48} className="mx-auto mb-3 text-gray-400" />
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
        {isScanning ? (
          <>
            <Camera size={16} className="animate-pulse" />
            Scanning...
          </>
        ) : scanned ? (
          <>
            <QrCode size={16} />
            Scanned!
          </>
        ) : (
          <>
            <QrCode size={16} />
            Scan QR Code
          </>
        )}
      </Button>
      
      <div className="mt-4 text-xs text-center text-gray-500">
        Visit a participating business and scan their QR code at checkout
      </div>

      {/* Recent Scans History */}
      {recentScans.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-medium mb-3 text-gray-700">Recent Scans</h4>
          <div className="space-y-2">
            {recentScans.map((scan, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <QrCode size={14} className="text-mansablue" />
                  <span>{scan.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{scan.date}</span>
                  <span className="bg-mansagold/10 text-mansagold text-xs rounded px-1.5 py-0.5">
                    +{scan.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
