
import React from 'react';
import { Loader2, Camera } from 'lucide-react';

interface ScannerDisplayProps {
  scanning: boolean;
  loading: boolean;
  cameraError: string | null;
}

const ScannerDisplay: React.FC<ScannerDisplayProps> = ({
  scanning,
  loading,
  cameraError,
}) => {
  if (scanning || loading) {
    return (
      <div className="relative w-full aspect-square max-w-xs mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <div id="qr-reader" className="w-full h-full"></div>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
      </div>
    );
  } 

  return (
    <div className="flex flex-col items-center justify-center w-full aspect-square max-w-xs mb-4 bg-gray-100 rounded-lg">
      <Camera className="h-16 w-16 text-gray-400 mb-4" />
      <p className="text-gray-500 text-center">
        {cameraError || "Click the button below to start scanning"}
      </p>
    </div>
  );
};

export default ScannerDisplay;
