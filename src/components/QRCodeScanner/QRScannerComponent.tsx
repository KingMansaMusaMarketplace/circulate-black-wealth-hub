
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import ScanResult from './ScanResult';
import ScannerInstructions from './components/ScannerInstructions';
import { QrCode, Clock, Camera, Loader2, AlertCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

interface ScanHistoryItem {
  businessName: string;
  pointsEarned: number;
  timestamp: string;
}

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
  const [scanning, setScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const scannerIdRef = useRef<string>('qr-reader-' + Date.now());

  // Check camera availability
  useEffect(() => {
    const checkCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          setCameraError('Camera not supported on this device');
          return;
        }
        
        const devices = await Html5Qrcode.getCameras();
        const hasVideoDevice = devices && devices.length > 0;
        setHasCamera(hasVideoDevice);
        
        if (!hasVideoDevice) {
          setCameraError('No camera found on this device');
        }
      } catch (error) {
        console.error('Camera check error:', error);
        setHasCamera(false);
        setCameraError('Camera access denied');
      }
    };

    checkCamera();
  }, []);

  // Initialize Html5Qrcode when scanner element is ready
  useEffect(() => {
    if (scannerRef.current && !html5QrCode) {
      try {
        const qrCode = new Html5Qrcode(scannerIdRef.current);
        setHtml5QrCode(qrCode);
      } catch (error) {
        console.error('Error initializing QR scanner:', error);
        setCameraError('Failed to initialize QR scanner');
      }
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(error => {
          console.error('Error stopping scanner during cleanup:', error);
        });
      }
    };
  }, [html5QrCode]);

  // Handle scanner button click
  const handleScannerClick = async () => {
    console.log('Scanner button clicked, scanning:', scanning);
    
    if (scanning) {
      // Stop scanning
      if (html5QrCode && html5QrCode.isScanning) {
        try {
          await html5QrCode.stop();
          setScanning(false);
          setCameraError(null);
        } catch (error) {
          console.error('Error stopping scanner:', error);
        }
      }
      return;
    }

    if (!hasCamera) {
      setCameraError('Camera not available');
      return;
    }

    if (!html5QrCode) {
      setCameraError('QR scanner not initialized');
      return;
    }

    setScanning(true);
    setCameraError(null);

    try {
      // Get available cameras
      const cameras = await Html5Qrcode.getCameras();
      if (cameras.length === 0) {
        setCameraError('No cameras found');
        setScanning(false);
        return;
      }

      // Use back camera if available (for mobile), otherwise use first camera
      const cameraId = cameras.length > 1 ? cameras[1].id : cameras[0].id;
      
      console.log('Starting QR scanner with camera:', cameraId);
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        cameraId,
        config,
        (decodedText, decodedResult) => {
          console.log('QR Code detected:', decodedText);
          onScan(decodedText);
        },
        (errorMessage) => {
          // This fires continuously while scanning, so we don't log it
        }
      );

      console.log('QR scanner started successfully');
      
    } catch (error: any) {
      console.error('Camera error:', error);
      setScanning(false);
      
      if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
        setCameraError('Camera permission denied. Please allow camera access and try again.');
      } else if (error.message.includes('NotFoundError')) {
        setCameraError('No camera found on this device.');
      } else {
        setCameraError(`Camera error: ${error.message || 'Unknown error'}`);
      }
    }
  };

  // Update scan history when a successful scan happens
  useEffect(() => {
    if (scanResult && scanResult.success) {
      setScanHistory(prev => {
        const newHistory = [{
          businessName: scanResult.businessName || 'Business',
          pointsEarned: scanResult.pointsEarned || 0,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 5);
        
        try {
          localStorage.setItem('qrScanHistory', JSON.stringify(newHistory));
        } catch (e) {
          console.error('Failed to save scan history:', e);
        }
        
        return newHistory;
      });
    }
  }, [scanResult]);

  // Load scan history from local storage
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('qrScanHistory');
      if (storedHistory) {
        setScanHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to load scan history:', e);
    }
  }, []);

  return (
    <div className="flex flex-col items-center max-w-md mx-auto space-y-6">
      {scanResult ? (
        <ScanResult result={scanResult} onScanAgain={() => window.location.reload()} />
      ) : (
        <>
          <Card className="w-full">
            <CardContent className="p-6 flex flex-col items-center">
              {/* Scanner Display Area */}
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                {/* QR Scanner Element */}
                <div 
                  id={scannerIdRef.current}
                  ref={scannerRef}
                  className={`w-full h-full ${scanning ? 'block' : 'hidden'}`}
                  style={{ lineHeight: 0 }}
                />
                
                {scanning ? (
                  <div className={`${scanning ? 'hidden' : 'flex'} flex-col items-center justify-center w-full h-full`}>
                    <Loader2 className="h-12 w-12 animate-spin text-mansablue mb-4" />
                    <p className="text-sm text-gray-600">Starting camera...</p>
                  </div>
                ) : cameraError ? (
                  <div className="flex flex-col items-center text-center p-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
                    <p className="text-sm text-red-500 mb-2 font-medium">Camera Error</p>
                    <p className="text-xs text-gray-500">{cameraError}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <QrCode className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 text-center">
                      Position QR code within the frame to scan
                    </p>
                    <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded-lg"></div>
                  </div>
                )}
              </div>

              {/* Scanner Button */}
              <Button 
                onClick={handleScannerClick}
                disabled={loading || (!hasCamera && !scanning)}
                size="lg"
                className={`w-full relative touch-manipulation ${
                  scanning ? 'bg-red-500 hover:bg-red-600' : 'bg-mansablue hover:bg-mansablue-dark'
                }`}
                style={{ minHeight: '48px' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : scanning ? (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Stop Scanner
                  </>
                ) : !hasCamera ? (
                  <>
                    <Camera className="mr-2 h-4 w-4" />
                    Camera Not Available
                  </>
                ) : (
                  <>
                    <QrCode className="mr-2 h-4 w-4" />
                    Start Scanner
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <ScannerInstructions />
          
          {/* Recent Scans History */}
          {scanHistory.length > 0 && (
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock size={16} className="text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-700">Recent Scans</h3>
                </div>
                <div className="space-y-2">
                  {scanHistory.map((scan, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
                      <div className="flex items-center gap-2">
                        <QrCode size={14} className="text-mansablue" />
                        <span className="font-medium">{scan.businessName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">{scan.timestamp}</span>
                        <span className="bg-mansagold/10 text-mansagold text-xs rounded px-1.5 py-0.5">
                          +{scan.pointsEarned}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default QRScannerComponent;
