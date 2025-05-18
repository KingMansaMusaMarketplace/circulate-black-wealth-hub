
import React from 'react';
import { Camera, CameraOff } from 'lucide-react';

interface ScannerDisplayProps {
  isScanning: boolean;
  scanning: boolean;
  scanResult: any;
  hasCamera: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  requestCameraPermission: () => Promise<boolean>;
}

const ScannerDisplay: React.FC<ScannerDisplayProps> = ({
  isScanning,
  scanning,
  scanResult,
  hasCamera,
  videoRef,
  requestCameraPermission
}) => {
  if (isScanning) {
    return (
      <div className="absolute inset-0 bg-black bg-opacity-70">
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center z-10">
            <div className="mb-3">
              <svg className="animate-spin h-10 w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p>Scanning...</p>
          </div>
        </div>
      </div>
    );
  } 
  
  if (scanning) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
        <div className="text-white text-center">
          <div className="mb-3">
            <svg className="animate-spin h-10 w-10 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p>Processing scan...</p>
        </div>
      </div>
    );
  } 
  
  if (scanResult) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-mansagold bg-opacity-90">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-white font-bold text-xl">Success!</p>
        <p className="text-white text-lg">+{scanResult.pointsEarned} Points</p>
        <p className="text-white mt-1">{scanResult.businessName}</p>
        {scanResult.discountApplied > 0 && (
          <p className="text-white mt-1">{scanResult.discountApplied}% Discount</p>
        )}
      </div>
    );
  } 
  
  if (!hasCamera) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <CameraOff size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500 mb-4">Camera access required to scan QR codes</p>
          <button 
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
            onClick={requestCameraPermission}
          >
            Enable Camera Access
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <div className="w-48 h-48 border-2 border-mansablue relative">
        {/* QR code scanner corners */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-mansagold"></div>
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-mansagold"></div>
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-mansagold"></div>
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-mansagold"></div>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400 text-sm text-center">Tap "Scan" to activate camera</p>
        </div>
      </div>
    </div>
  );
};

export default ScannerDisplay;
