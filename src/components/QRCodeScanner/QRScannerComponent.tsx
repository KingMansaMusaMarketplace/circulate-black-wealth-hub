
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ScanResult from './ScanResult';
import ScannerDisplay from './components/ScannerDisplay';
import ScannerStatus from './components/ScannerStatus';
import ScannerInstructions from './components/ScannerInstructions';
import { useCameraDetection } from './hooks/useCameraDetection';
import { useQRScanner } from './hooks/useQRScanner';
import { QrCode, Clock } from 'lucide-react';

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
  // Use the custom hooks for camera detection and QR scanning
  const { hasCamera, isMobile } = useCameraDetection();
  const { scanning, scannerReady, cameraError, toggleScanning } = useQRScanner({
    onScan,
    isMobile
  });

  // State for scan history
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);

  // Update scan history when a successful scan happens
  useEffect(() => {
    if (scanResult && scanResult.success) {
      setScanHistory(prev => {
        const newHistory = [{
          businessName: scanResult.businessName || 'Business',
          pointsEarned: scanResult.pointsEarned || 0,
          timestamp: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 5); // Keep only 5 most recent scans
        
        // Store in local storage
        try {
          localStorage.setItem('qrScanHistory', JSON.stringify(newHistory));
        } catch (e) {
          console.error('Failed to save scan history to local storage:', e);
        }
        
        return newHistory;
      });
    }
  }, [scanResult]);

  // Load scan history from local storage on component mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('qrScanHistory');
      if (storedHistory) {
        setScanHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to load scan history from local storage:', e);
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
              <ScannerDisplay 
                scanning={scanning} 
                loading={loading} 
                cameraError={cameraError} 
              />

              <div className="w-full flex justify-center mt-4">
                <ScannerStatus
                  scanning={scanning}
                  scannerReady={scannerReady}
                  loading={loading}
                  hasCamera={hasCamera}
                  cameraError={cameraError}
                  toggleScanning={toggleScanning}
                />
              </div>
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
