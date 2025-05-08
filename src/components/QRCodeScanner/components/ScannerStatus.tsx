
import React from 'react';
import { Loader2, Camera, Zap } from 'lucide-react';
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
    return <Button disabled>No Camera Available</Button>;
  }

  return (
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
  );
};

export default ScannerStatus;
