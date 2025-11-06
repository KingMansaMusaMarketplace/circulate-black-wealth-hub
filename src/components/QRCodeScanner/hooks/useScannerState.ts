
import { useState, useRef, useEffect } from 'react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { toast } from 'sonner';
import { useConversionTracking } from '@/hooks/use-analytics-tracking';

export interface ScanResult {
  businessName: string;
  pointsEarned: number;
  timestamp: string;
}

export function useScannerState() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [scanResult, setScanResult] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { isNative, platform } = useCapacitor();
  const { trackQRScanFunnelStart, trackQRScanFunnelComplete } = useConversionTracking();

  // Load scan history from local storage on component mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('qrScanHistory');
      if (storedHistory) {
        setRecentScans(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error('Failed to load scan history from local storage:', e);
    }
    
    // Check camera availability
    checkCameraAvailability();
  }, []);

  const checkCameraAvailability = async () => {
    try {
      // For native platforms, we assume camera is available and will request permissions when needed
      if (isNative) {
        setHasCamera(true);
        return;
      }

      // For web platforms, check if the media devices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCamera(false);
        return;
      }

      // Check if camera permission is already granted
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionStatus(permission.state as 'granted' | 'denied' | 'prompt');
      
      // Set hasCamera to true if permission is granted or can be requested
      setHasCamera(permission.state === 'granted' || permission.state === 'prompt');
    } catch (error) {
      console.error('Error checking camera:', error);
      setHasCamera(false);
    }
  };

  const requestCameraPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setPermissionStatus('granted');
      setHasCamera(true);
    } catch (error) {
      console.error('Camera permission denied:', error);
      setPermissionStatus('denied');
      toast.error('Camera access is required to scan QR codes');
    }
  };

  const handleScan = async () => {
    // If we've already scanned something, reset the state
    if (scanned) {
      setScanned(false);
      setScanResult(null);
      return;
    }

    if (permissionStatus !== 'granted' && !isNative) {
      await requestCameraPermission();
      if (permissionStatus === 'denied') return;
    }

    trackQRScanFunnelStart();
    setIsScanning(true);

    try {
      // On native platforms, we would use the Capacitor Camera plugin
      // But for now, we'll simulate a successful scan after 3 seconds
      setTimeout(() => {
        // Simulate a successful scan
        const mockResult = {
          businessName: 'Sample Business',
          pointsEarned: 25,
          timestamp: new Date().toISOString()
        };
        
        // Update recent scans history
        const newScans = [mockResult, ...recentScans].slice(0, 10);
        setRecentScans(newScans);
        localStorage.setItem('qrScanHistory', JSON.stringify(newScans));
        
        setScanResult(mockResult);
        setScanned(true);
        setIsScanning(false);
        
        trackQRScanFunnelComplete(mockResult.pointsEarned);
        toast.success(`Earned ${mockResult.pointsEarned} points at ${mockResult.businessName}!`);
      }, 3000);
    } catch (error) {
      console.error('Error scanning QR code:', error);
      setIsScanning(false);
      toast.error('Failed to scan QR code');
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
}
