
import React from 'react';
import { Loader2, Camera, AlertCircle } from 'lucide-react';

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
      <div className="relative w-full aspect-square max-w-xs mb-4 bg-gray-100 rounded-lg overflow-hidden shadow-inner">
        <div id="qr-reader" className="w-full h-full"></div>
        
        {/* Show scanning guideline */}
        {scanning && !loading && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-mansagold/30 transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-mansagold/30 transform -translate-y-1/2"></div>
            <div className="absolute inset-0 border-2 border-dashed border-mansagold/50 m-10 rounded"></div>
          </div>
        )}
        
        {/* Show loading state */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
              <p className="text-white text-sm">Processing...</p>
            </div>
          </div>
        )}
      </div>
    );
  } 

  return (
    <div className="flex flex-col items-center justify-center w-full aspect-square max-w-xs mb-4 bg-gray-100 rounded-lg shadow-inner">
      <Camera className="h-16 w-16 text-gray-400 mb-4" />
      {cameraError ? (
        <div className="text-center px-4">
          <div className="flex items-center justify-center mb-2">
            <AlertCircle className="h-5 w-5 text-red-500 mr-1" />
            <p className="text-red-500 font-medium">Camera Error</p>
          </div>
          <p className="text-gray-500 text-sm">{cameraError}</p>
        </div>
      ) : (
        <p className="text-gray-500 text-center px-4">
          Click the button below to start scanning
        </p>
      )}
    </div>
  );
};

export default ScannerDisplay;
