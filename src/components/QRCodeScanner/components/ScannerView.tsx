
import React, { useRef } from 'react';
import { Camera, CameraOff, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScannerViewProps {
  isScanning: boolean;
  scanned: boolean;
  hasCamera: boolean;
  permissionStatus: 'granted' | 'denied' | 'prompt';
  videoRef: React.RefObject<HTMLVideoElement>;
  scanResult: any;
  requestCameraPermission: () => Promise<void>;
  handleScan: () => void;
}

const ScannerView: React.FC<ScannerViewProps> = ({
  isScanning,
  scanned,
  hasCamera,
  permissionStatus,
  videoRef,
  scanResult,
  requestCameraPermission,
  handleScan
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
        {/* Scanning animation overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-64 h-64">
            {/* Animated scan line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-mansagold animate-[scan_1.5s_ease-in-out_infinite]"></div>
            
            {/* Scanner corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-mansagold"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-mansagold"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-mansagold"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-mansagold"></div>
          </div>
          
          <div className="absolute bottom-8 text-white text-center">
            <p className="text-sm animate-pulse">Scanning for QR code...</p>
          </div>
        </div>
      </div>
    );
  } 
  
  if (scanned && scanResult) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-mansagold bg-opacity-90">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-white font-bold text-xl">Success!</p>
        <p className="text-white text-lg">+{scanResult.pointsEarned} Points</p>
        <p className="text-white mt-1">{scanResult.businessName}</p>
      </div>
    );
  } 
  
  if (!hasCamera) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <CameraOff size={48} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500 mb-4">Camera access required to scan QR codes</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={requestCameraPermission}
          >
            Enable Camera Access
          </Button>
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

export default ScannerView;
