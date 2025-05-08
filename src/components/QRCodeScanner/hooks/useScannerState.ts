
import { useState, useRef, useEffect } from 'react';
import { toast } from "sonner";
import { useIsMobile } from '@/hooks/use-mobile';
import { useLoyaltyQRCode } from '@/hooks/use-loyalty-qr-code';

export const useScannerState = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [recentScans, setRecentScans] = useState<Array<{name: string, points: number, date: string}>>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerIntervalRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  const { scanQRAndProcessPoints, scanResult } = useLoyaltyQRCode({ autoRefresh: true });

  // Check if camera permission is available
  useEffect(() => {
    checkCameraPermission();
  }, []);

  // Stop scanning when component unmounts
  useEffect(() => {
    return () => {
      stopScannerAndStream();
    };
  }, []);

  // Update recent scans when a new scan is processed
  useEffect(() => {
    if (scanResult) {
      updateRecentScans();
    }
  }, [scanResult]);

  const checkCameraPermission = async () => {
    try {
      // Check if the browser supports the Permissions API
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
        setHasCamera(result.state === 'granted');
        
        // Listen for permission changes
        result.addEventListener('change', () => {
          setPermissionStatus(result.state as 'granted' | 'denied' | 'prompt');
          setHasCamera(result.state === 'granted');
        });
      } else {
        // Fallback for browsers not supporting the Permission API
        setHasCamera(true);
        setPermissionStatus('prompt');
      }
    } catch (error) {
      console.error("Error checking camera:", error);
      setHasCamera(false);
      setPermissionStatus('prompt');
    }
  };

  const stopScannerAndStream = () => {
    if (scannerIntervalRef.current) {
      window.clearInterval(scannerIntervalRef.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const updateRecentScans = () => {
    if (scanResult) {
      const newScan = {
        name: scanResult.businessName || 'Business',
        points: scanResult.pointsEarned || 0,
        date: new Date().toLocaleDateString()
      };
      
      setRecentScans(prev => [newScan, ...prev].slice(0, 5));
      setScanned(true);
      
      // Reset after showing success
      setTimeout(() => {
        setScanned(false);
      }, 3000);
    }
  };

  // Simulate QR scanning with real camera stream
  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      if (permissionStatus === 'granted') {
        // Attempt to get camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: isMobile ? 'environment' : 'user' } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        
        // Simulate scanning for a QR code
        scannerIntervalRef.current = window.setTimeout(() => {
          processScannedResult();
          
          // Stop the camera stream
          stopScannerAndStream();
        }, 2000);
      } else {
        // If we don't have permission, just simulate the scan
        setTimeout(processScannedResult, 2000);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setHasCamera(false);
      
      // Fall back to simulation
      setTimeout(processScannedResult, 2000);
    }
  };
  
  // Process a successful scan
  const processScannedResult = async () => {
    setIsScanning(false);
    
    // Use the QR code scanning hook to process the scan
    // For simulation, we're using a random QR code ID
    const qrCodeId = `qr-${Math.random().toString(36).substring(2, 10)}`;
    
    await scanQRAndProcessPoints(qrCodeId, {
      lat: 33.748997,
      lng: -84.387985
    });
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCamera(true);
      setPermissionStatus('granted');
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      toast("Camera Access Required", {
        description: "This app needs permission to access your camera for scanning QR codes."
      });
    }
  };

  return {
    isScanning,
    scanned,
    hasCamera,
    permissionStatus,
    recentScans,
    videoRef,
    scanResult,
    handleScan,
    requestCameraPermission
  };
};
