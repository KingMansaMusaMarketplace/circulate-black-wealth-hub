
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import ScanResult from './ScanResult';
import ScannerDisplay from './components/ScannerDisplay';
import ScannerStatus from './components/ScannerStatus';
import ScannerInstructions from './components/ScannerInstructions';
import { useCameraDetection } from './hooks/useCameraDetection';
import { useQRScanner } from './hooks/useQRScanner';

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
        </>
      )}
    </div>
  );
};

export default QRScannerComponent;
