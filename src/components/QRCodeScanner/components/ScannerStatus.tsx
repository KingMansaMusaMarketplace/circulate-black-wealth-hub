
import React from 'react';
import { Loader2, Camera, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerStatusProps {
  scanning: boolean;
  scannerReady: boolean;
  loading: boolean;
  hasCamera: boolean;
  cameraError: string | null;
  toggleScanning: () => void;
}

const ScannerStatus: React.FC<ScannerStatusProps> = ({
  scanning,
  scannerReady,
  loading,
  hasCamera,
  cameraError,
  toggleScanning,
}) => {
  if (!hasCamera) {
    return (
      <Button disabled className="w-full opacity-70 flex items-center gap-2">
        <Camera className="h-4 w-4" />
        No Camera Available
      </Button>
    );
  }

  return (
    <Button 
      onClick={toggleScanning} 
      disabled={loading || !scannerReady}
      size="lg"
      className={`w-full relative ${scanning ? 'bg-red-500 hover:bg-red-600' : ''}`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : scanning ? (
        <>
          <X className="mr-2 h-4 w-4" />
          Stop Scanner
        </>
      ) : (
        <>
          <Zap className="mr-2 h-4 w-4" />
          Start Scanner
        </>
      )}
      
      {/* Pulsing effect for active scanner */}
      {scanning && (
        <span className="absolute inset-0 rounded-md border-2 border-white animate-pulse opacity-70"></span>
      )}
    </Button>
  );
};

export default ScannerStatus;
