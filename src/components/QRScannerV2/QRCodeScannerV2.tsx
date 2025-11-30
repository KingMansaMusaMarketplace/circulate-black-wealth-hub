
import React from 'react';
import { QrCode } from 'lucide-react';
import { toast } from "sonner";
import { useQRScanner } from '@/hooks/use-qr-scanner';
import ScannerDisplay from './ScannerDisplay';
import ScannerButton from './ScannerButton';
import RecentScans from './RecentScans';
import './scanner-styles.css';

const QRCodeScannerV2 = () => {
  const {
    isScanning,
    hasCamera,
    recentScans,
    videoRef,
    scanning,
    scanResult,
    handleScan,
    requestCameraPermission,
    scannerElementId
  } = useQRScanner();

  const handleCameraPermission = async () => {
    try {
      const success = await requestCameraPermission();
      if (!success) {
        toast("Camera Access Required", {
          description: "This app needs permission to access your camera for scanning QR codes."
        });
      }
      return success;
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      return false;
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
        <ScannerDisplay
          isScanning={isScanning}
          scanning={scanning}
          scanResult={scanResult}
          hasCamera={hasCamera}
          videoRef={videoRef}
          requestCameraPermission={handleCameraPermission}
          scannerElementId={scannerElementId}
        />
      </div>
      
      <ScannerButton
        isScanning={isScanning}
        scanning={scanning}
        scanResult={scanResult}
        onScan={handleScan}
      />
      
      <div className="mt-4 text-xs text-center text-gray-500">
        Visit a participating business and scan their QR code at checkout
      </div>

      {/* Recent Scans History */}
      <RecentScans scans={recentScans} />
    </div>
  );
};

export default QRCodeScannerV2;
