
import { useState, useRef, useEffect } from 'react';
import { useLoyaltyQRCode } from '@/hooks/use-loyalty-qr-code';
import { useLocation } from '@/hooks/use-location';

export interface ScanResult {
  businessName: string;
  pointsEarned: number;
  discountApplied?: number;
  date: string;
}

export function useQRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [recentScans, setRecentScans] = useState<Array<ScanResult>>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerIntervalRef = useRef<number | null>(null);
  
  const { 
    location, 
    getCurrentPosition,
  } = useLocation({
    skipPermissionCheck: true // Only check permissions when actually needed
  });
  
  const { 
    scanning, 
    scanResult, 
    scanQRAndProcessPoints,
    refreshLoyaltyData 
  } = useLoyaltyQRCode({ autoRefresh: true });

  // Check if camera is available
  useEffect(() => {
    const checkCamera = async () => {
      try {
        // Quick test to see if we can access any media devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        setHasCamera(hasVideoInput);
      } catch (error) {
        console.error("Error checking camera:", error);
        setHasCamera(false);
      }
    };

    checkCamera();
  }, []);

  // Stop scanning when component unmounts
  useEffect(() => {
    return () => {
      if (scannerIntervalRef.current) {
        window.clearInterval(scannerIntervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate QR scanning with real camera stream
  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      // First check if camera is available
      if (!hasCamera) {
        const granted = await requestCameraPermission();
        if (!granted) {
          setIsScanning(false);
          return;
        }
      }
      
      // Attempt to get camera stream with better error handling
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      // Simulate scanning for a QR code
      scannerIntervalRef.current = window.setTimeout(() => {
        processScannedResult();
        
        // Stop the camera stream
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      }, 2000);
    } catch (error: any) {
      console.error("Error accessing camera:", error);
      
      // Provide specific error messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setHasCamera(false);
      } else if (error.name === 'NotFoundError') {
        setHasCamera(false);
      }
      
      setIsScanning(false);
      
      // Don't fall back to simulation - let user know there's an issue
      throw error;
    }
  };
  
  // Process a successful scan
  const processScannedResult = async () => {
    setIsScanning(false);
    
    // Simulate QR code ID
    const mockQrCodeId = `qr-${Math.random().toString(36).substring(2, 10)}`;
    
    // Get user's current location using our hook
    let locationData = null;
    try {
      locationData = await getCurrentPosition();
    } catch (error) {
      console.log('Location not available, proceeding without it');
    }
    
    // Process the QR scan
    const result = await scanQRAndProcessPoints(mockQrCodeId);
    
    if (result) {
      // Add to recent scans
      const newScan = {
        businessName: result.businessName || 'Unknown Business',
        pointsEarned: result.pointsEarned || 0,
        discountApplied: result.discountApplied,
        date: new Date().toLocaleDateString()
      };
      
      setRecentScans(prev => [newScan, ...prev].slice(0, 5));
      
      // Refresh loyalty data to get updated points
      refreshLoyaltyData();
    }
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Stop the stream immediately after getting permission
      stream.getTracks().forEach(track => track.stop());
      
      setHasCamera(true);
      return true;
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      setHasCamera(false);
      return false;
    }
  };

  return {
    isScanning,
    hasCamera,
    recentScans,
    videoRef,
    scanning,
    scanResult,
    handleScan,
    requestCameraPermission
  };
}
