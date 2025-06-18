
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import ScanResult from './ScanResult';
import ScannerInstructions from './components/ScannerInstructions';
import { QrCode, Clock, Camera, Loader2 } from 'lucide-react';

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

  // Check camera availability on mobile
  useEffect(() => {
    const checkCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          setCameraError('Camera not supported on this device');
          return;
        }
        
        // For iOS Safari, we need to check permissions differently
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoDevice = devices.some(device => device.kind === 'videoinput');
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

  // Handle scanner button click
  const handleScannerClick = async () => {
    console.log('Scanner button clicked');
    
    if (scanning) {
      setScanning(false);
      return;
    }

    if (!hasCamera) {
      setCameraError('Camera not available');
      return;
    }

    setScanning(true);
    setCameraError(null);

    try {
      // Request camera permission for iOS Safari
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      console.log('Camera access granted');
      
      // For now, simulate a successful scan after 3 seconds
      // In a real implementation, you'd integrate with a QR code scanning library
      setTimeout(() => {
        const mockQrCode = `qr-${Date.now()}`;
        console.log('Simulated QR scan:', mockQrCode);
        
        onScan(mockQrCode);
        setScanning(false);
        
        // Stop the camera stream
        stream.getTracks().forEach(track => track.stop());
      }, 3000);
      
    } catch (error) {
      console.error('Camera error:', error);
      setScanning(false);
      setCameraError(`Camera error: ${error.message}`);
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
                {scanning ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 animate-spin text-mansablue mb-4" />
                    <p className="text-sm text-gray-600">Scanning for QR code...</p>
                    <div className="absolute inset-4 border-2 border-mansablue rounded-lg opacity-50 animate-pulse"></div>
                  </div>
                ) : cameraError ? (
                  <div className="flex flex-col items-center text-center p-4">
                    <Camera className="h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-red-500 mb-2">{cameraError}</p>
                    <p className="text-xs text-gray-500">Please allow camera access to scan QR codes</p>
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
                style={{ minHeight: '48px' }} // Ensure good touch target for mobile
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
