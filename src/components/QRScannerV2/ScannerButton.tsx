
import React from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, Camera } from 'lucide-react';

interface ScannerButtonProps {
  isScanning: boolean;
  scanning: boolean;
  scanResult: any;
  onScan: () => void;
}

const ScannerButton: React.FC<ScannerButtonProps> = ({
  isScanning,
  scanning,
  scanResult,
  onScan
}) => {
  return (
    <Button 
      className="w-full bg-mansablue hover:bg-mansablue-dark flex items-center justify-center gap-2"
      disabled={scanning}
      onClick={onScan}
    >
      {isScanning ? (
        <>
          <Camera size={16} className="animate-pulse" />
          Stop Scanner
        </>
      ) : scanning ? (
        <>
          <Camera size={16} className="animate-pulse" />
          Processing...
        </>
      ) : scanResult ? (
        <>
          <QrCode size={16} />
          Scan Again
        </>
      ) : (
        <>
          <QrCode size={16} />
          Start Scanner
        </>
      )}
    </Button>
  );
};

export default ScannerButton;
