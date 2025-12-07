
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, Camera } from 'lucide-react';
import { useScannerState } from './hooks/useScannerState';
import ScannerView from './components/ScannerView';
import ScanHistoryList from './components/ScanHistoryList';

const QRCodeScanner = () => {
  const {
    isScanning,
    scanned,
    hasCamera,
    permissionStatus,
    recentScans,
    videoRef,
    scanResult,
    handleScan,
    requestCameraPermission
  } = useScannerState();

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-3">
        <QrCode size={20} className="text-mansablue" />
        <h3 className="text-lg font-bold text-gray-900">QR Code Scanner</h3>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Scan a business QR code to earn discounts and loyalty points
      </p>
      
      <div className="aspect-square relative overflow-hidden rounded-lg border-2 border-dashed border-gray-200 mb-6">
        <ScannerView
          isScanning={isScanning}
          scanned={scanned}
          hasCamera={hasCamera}
          permissionStatus={permissionStatus}
          videoRef={videoRef}
          scanResult={scanResult}
          requestCameraPermission={requestCameraPermission}
          handleScan={handleScan}
        />
      </div>
      
      <Button 
        className="w-full bg-mansablue hover:bg-mansablue-dark flex items-center justify-center gap-2"
        disabled={isScanning || scanned}
        onClick={() => handleScan()}
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
      <ScanHistoryList scans={recentScans} />
    </div>
  );
};

export default QRCodeScanner;
