
import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useLoyaltyQRCode } from '@/hooks/use-loyalty-qr-code';
import { useLocation } from '@/hooks/use-location';
import { toast } from 'sonner';

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
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerElementId = 'qr-reader-scanner';
  
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

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(err => {
          console.error('Error stopping scanner:', err);
        });
      }
    };
  }, []);

  // Start actual QR code scanning
  const handleScan = async () => {
    if (isScanning) {
      // Stop scanning
      await stopScanning();
      return;
    }

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

      // Initialize Html5Qrcode if not already done
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerElementId);
      }

      const qrCodeScanner = html5QrCodeRef.current;

      // Configure QR code scanner
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      // Start scanning with back camera
      await qrCodeScanner.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          // Successfully scanned a QR code
          console.log('QR Code detected:', decodedText);
          
          // Stop scanning before processing
          await stopScanning();
          
          // Process the scanned QR code
          await processScannedResult(decodedText);
        },
        (errorMessage) => {
          // Ignore scanning errors (these happen constantly during scanning)
        }
      );
      
      toast.success('Scanner started - point at a QR code');
    } catch (error: any) {
      console.error("Error starting scanner:", error);
      
      // Provide specific error messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('Camera permission denied');
        setHasCamera(false);
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera found on this device');
        setHasCamera(false);
      } else {
        toast.error('Failed to start scanner');
      }
      
      setIsScanning(false);
    }
  };

  // Stop the scanner
  const stopScanning = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };
  
  // Process a successful scan with the decoded QR code data
  const processScannedResult = async (decodedText: string) => {
    console.log('Processing scanned QR code:', decodedText);
    
    // Extract QR code ID from the decoded text
    // The QR code should contain the QR code ID from the database
    let qrCodeId = decodedText;
    
    // If the decoded text is a URL, extract the ID from it
    try {
      const url = new URL(decodedText);
      const pathParts = url.pathname.split('/');
      // Look for 'qr' in the path and get the ID after it
      const qrIndex = pathParts.indexOf('qr');
      if (qrIndex !== -1 && pathParts[qrIndex + 1]) {
        qrCodeId = pathParts[qrIndex + 1];
      }
      // Check for query parameter
      const idParam = url.searchParams.get('id') || url.searchParams.get('qrId');
      if (idParam) {
        qrCodeId = idParam;
      }
    } catch {
      // Not a URL, use as-is
    }
    
    console.log('Extracted QR code ID:', qrCodeId);
    
    // Get user's current location
    let locationData = null;
    try {
      locationData = await getCurrentPosition();
    } catch (error) {
      console.log('Location not available, proceeding without it');
    }
    
    // Process the QR scan with the real QR code ID
    const result = await scanQRAndProcessPoints(qrCodeId);
    
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
    requestCameraPermission,
    scannerElementId
  };
}
