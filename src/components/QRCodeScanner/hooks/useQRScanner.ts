
import { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface UseQRScannerProps {
  onScan: (data: string) => void;
  isMobile: boolean;
}

export const useQRScanner = ({ onScan, isMobile }: UseQRScannerProps) => {
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [scannerReady, setScannerReady] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize scanner
  useEffect(() => {
    if (!html5QrCode && typeof window !== 'undefined') {
      const qrCode = new Html5Qrcode('qr-reader');
      setHtml5QrCode(qrCode);
      setScannerReady(true);
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(error => {
          console.error('Error stopping scanner:', error);
        });
      }
    };
  }, [html5QrCode]);

  // Start scanning function
  const startScanning = async () => {
    if (!html5QrCode) return;

    setScanning(true);
    setCameraError(null);
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    try {
      // Check if camera is available
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length === 0) {
        setCameraError("No camera found on this device.");
        setScanning(false);
        return;
      }

      // Start scanning - use back camera by default on mobile devices
      const cameraId = devices.length > 1 && isMobile ? devices[1].id : devices[0].id;
      
      await html5QrCode.start(
        cameraId,
        config,
        (decodedText) => {
          // On successful scan
          onScan(decodedText);
          // Don't stop scanning - let user scan multiple codes
        },
        (errorMessage) => {
          // Ignored - this happens constantly during scanning
        }
      ).catch((err) => {
        setCameraError(`Error accessing camera: ${err.message || 'Permission denied'}`);
        setScanning(false);
      });
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setCameraError(`Error initializing scanner: ${err.message}`);
      setScanning(false);
    }
  };

  // Stop scanning function
  const stopScanning = async () => {
    if (html5QrCode && html5QrCode.isScanning) {
      try {
        await html5QrCode.stop();
        setScanning(false);
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  // Toggle scanning function
  const toggleScanning = () => {
    if (scanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  return {
    scanning,
    scannerReady,
    cameraError,
    toggleScanning,
    stopScanning
  };
};
