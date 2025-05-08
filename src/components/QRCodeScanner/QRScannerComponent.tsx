
import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Camera, Zap } from 'lucide-react';
import ScanResult from './ScanResult';

interface QRScannerComponentProps {
  onScan: (data: string) => void;
  loading?: boolean;
  scanResult?: any;
}

const QRScannerComponent: React.FC<QRScannerComponentProps> = ({ 
  onScan, 
  loading = false,
  scanResult = null
}) => {
  const [scannerReady, setScannerReady] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Initialize the scanner
    if (!html5QrCode && typeof window !== 'undefined') {
      const qrCode = new Html5Qrcode('qr-reader');
      setHtml5QrCode(qrCode);
      setScannerReady(true);
    }

    // Clean up on unmount
    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(error => {
          console.error('Error stopping scanner:', error);
        });
      }
    };
  }, [html5QrCode]);

  // Start scanning
  const startScanning = async () => {
    if (!html5QrCode) return;

    setScanning(true);
    setCameraError(null);
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    try {
      // Check if camera is available
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length === 0) {
        setHasCamera(false);
        setCameraError("No camera found on this device.");
        setScanning(false);
        return;
      }

      // Start scanning - use back camera by default on mobile devices
      const cameraId = devices.length > 1 && isMobile ? devices[1].id : devices[0].id;
      
      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          // On successful scan
          onScan(decodedText);
          // Don't stop scanning - let user scan multiple codes
        },
        (errorMessage) => {
          // Ignored - this happens constantly during scanning
        }
      ).catch((err) => {
        setCameraError(`Error accessing camera: ${err.message || 'Permission denied'}`);
        setScanning(false);
      });
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setCameraError(`Error initializing scanner: ${err.message}`);
      setScanning(false);
    }
  };

  // Stop scanning
  const stopScanning = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop();
        setScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  // Toggle scanning
  const toggleScanning = () => {
    if (scanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
      {scanResult ? (
        <ScanResult result={scanResult} onScanAgain={() => window.location.reload()} />
      ) : (
        <>
          <Card className="w-full">
            <CardContent className="p-6 flex flex-col items-center">
              {scanning || loading ? (
                <div className="relative w-full aspect-square max-w-xs mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  <div id="qr-reader" className="w-full h-full"></div>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <Loader2 className="h-8 w-8 animate-spin text-white" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full aspect-square max-w-xs mb-4 bg-gray-100 rounded-lg">
                  <Camera className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-500 text-center">
                    {cameraError || "Click the button below to start scanning"}
                  </p>
                </div>
              )}

              <div className="w-full flex justify-center mt-4">
                {!hasCamera ? (
                  <Button disabled>No Camera Available</Button>
                ) : (
                  <Button 
                    onClick={toggleScanning} 
                    disabled={loading || !scannerReady}
                    size="lg"
                    className={`${scanning ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  >
                    {scanning ? (
                      <>Stop Scanner</>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Start Scanner
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            <p>Position the QR code in the camera view to scan automatically.</p>
            <p className="mt-1">Make sure your camera is enabled and the QR code is well-lit.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default QRScannerComponent;
