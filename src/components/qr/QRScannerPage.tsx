import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Camera, QrCode, Flashlight, FlashlightOff, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNativeCamera } from '@/hooks/use-native-camera';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useCapacitor } from '@/hooks/use-capacitor';
import { Html5Qrcode } from 'html5-qrcode';
import QRPayBill from './QRPayBill';

interface ScanResult {
  businessName: string;
  pointsEarned: number;
  discount?: number;
  businessId: string;
  qrCodeId?: string;
}

const QRScannerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [processing, setProcessing] = useState(false);
  
  const { isNative } = useCapacitor();
  const { takePhotoForQRScanning, isTakingPhoto } = useNativeCamera();
  const haptics = useHapticFeedback();

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to use the QR scanner');
      navigate('/auth');
      return;
    }
    
    initializeScanner();
    
    return () => {
      stopScanner();
    };
  }, [user, navigate]);

  const initializeScanner = async () => {
    try {
      // Check for camera permission
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(device => device.kind === 'videoinput');
      
      if (!hasCamera) {
        setHasPermission(false);
        toast.error('No camera detected');
        return;
      }
      
      setHasPermission(true);
    } catch (error: any) {
      console.error('Camera initialization error:', error);
      setHasPermission(false);
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('Camera access denied. Please allow camera access in Settings.');
      } else {
        toast.error(`Camera error: ${error.message || 'Unable to access camera'}`);
      }
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
    setIsScanning(false);
  };

  const processQRCode = useCallback(async (qrCodeData: string) => {
    if (processing) return;
    setProcessing(true);

    try {
      haptics.light();

      // Parse QR code data - expect "mansa://qr/{id}", a URL with /qr/{id}, or a bare UUID
      let qrCodeId = qrCodeData.trim();
      if (qrCodeId.includes('mansa://qr/')) {
        qrCodeId = qrCodeId.split('mansa://qr/')[1];
      } else if (qrCodeId.includes('/qr/')) {
        qrCodeId = qrCodeId.split('/qr/')[1];
      }
      qrCodeId = qrCodeId.split(/[?#]/)[0];

      console.log('Processing QR code ID:', qrCodeId);

      // Atomic, secure server-side validation + scan + loyalty award
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('award_qr_scan', {
        p_qr_code_id: qrCodeId,
      });

      if (rpcErr) {
        console.error('award_qr_scan RPC error:', rpcErr);
        toast.error('Failed to process QR code');
        setProcessing(false);
        return;
      }

      const res = rpcRes as {
        success: boolean;
        error?: string;
        business_id?: string;
        business_name?: string;
        points_earned?: number;
        discount_applied?: number;
      } | null;

      if (!res?.success) {
        const code = res?.error || 'unknown_error';
        const msg =
          code === 'auth_required' ? 'You must be logged in to scan QR codes' :
          code === 'qr_not_found' ? 'Invalid QR code' :
          code === 'qr_inactive' ? 'This QR code is no longer active' :
          code === 'qr_expired' ? 'This QR code has expired' :
          code === 'scan_limit_reached' ? 'This QR code has reached its scan limit' :
          'Failed to process QR code';
        toast.error(msg);
        setProcessing(false);
        return;
      }

      // Stop scanning before showing result
      await stopScanner();

      const result: ScanResult = {
        businessName: res.business_name || 'Business',
        pointsEarned: res.points_earned || 0,
        discount: res.discount_applied || undefined,
        businessId: res.business_id || '',
      };

      setScanResult(result);
      haptics.success();
      toast.success(`Earned ${result.pointsEarned} points!`);
    } catch (error: any) {
      console.error('Error processing QR code:', error);
      toast.error('Failed to process QR code');
    } finally {
      setProcessing(false);
    }
  }, [processing, user, haptics]);

  const startScanning = async () => {
    haptics.light();
    
    if (isNative) {
      await scanWithNativeCamera();
    } else {
      await startWebScanning();
    }
  };

  const startWebScanning = async () => {
    try {
      setIsScanning(true);
      
      // Wait for the DOM to render the scanner container
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!containerRef.current) {
        toast.error('Scanner container not found');
        setIsScanning(false);
        return;
      }

      scannerRef.current = new Html5Qrcode('qr-reader');
      
      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          console.log('QR Code detected:', decodedText);
          processQRCode(decodedText);
        },
        (errorMessage) => {
          // QR code not found - this is normal during scanning
        }
      );
    } catch (error: any) {
      console.error('Scanner start error:', error);
      setIsScanning(false);
      
      if (error.message?.includes('NotAllowedError')) {
        toast.error('Camera access denied. Please allow camera access.');
        setHasPermission(false);
      } else {
        toast.error('Failed to start scanner');
      }
    }
  };

  const scanWithNativeCamera = async () => {
    setIsScanning(true);
    
    try {
      console.log('Opening native camera for QR scanning...');
      const photo = await takePhotoForQRScanning();
      
      if (photo && photo.base64String) {
        console.log('Photo captured, processing QR code...');
        toast.info('Processing QR code...');
        
        // In a real implementation, you'd decode the QR from the image
        // For now, we'll show a message that the feature requires web scanning
        toast.info('For best results, please use the web scanner');
        setIsScanning(false);
      } else {
        console.log('Photo capture cancelled');
        setIsScanning(false);
      }
    } catch (error: any) {
      console.error('Native camera scan error:', error);
      setIsScanning(false);
      toast.error(error.message || 'Failed to access camera');
    }
  };

  const toggleFlash = async () => {
    try {
      if (scannerRef.current) {
        const track = scannerRef.current.getRunningTrackCameraCapabilities?.();
        if (track) {
          setFlashEnabled(!flashEnabled);
          toast.success(flashEnabled ? 'Flash disabled' : 'Flash enabled');
        }
      }
    } catch (error) {
      console.error('Flash toggle failed:', error);
      toast.error('Flash not available on this device');
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(false);
    setProcessing(false);
  };

  const navigateToBusiness = () => {
    if (scanResult) {
      navigate(`/business/${scanResult.businessId}`);
    }
  };

  if (!user) {
    return null;
  }

  if (hasPermission === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Camera Permission Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertDescription>
                To scan QR codes, please allow camera access in your browser settings and refresh the page.
              </AlertDescription>
            </Alert>
            <div className="mt-4 space-y-2">
              <Button onClick={initializeScanner} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/directory')} className="w-full">
                Explore Businesses Instead
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (scanResult) {
    return (
      <>
        <Helmet>
          <title>Scan Successful | 1325.AI</title>
        </Helmet>
        
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle>Scan Successful!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">{scanResult.businessName}</h3>
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                    +{scanResult.pointsEarned} Points Earned
                  </Badge>
                  {scanResult.discount && (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {scanResult.discount}% Discount Applied
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Button onClick={navigateToBusiness} className="w-full">
                  View Business Details
                </Button>
                <Button variant="outline" onClick={resetScanner} className="w-full">
                  Scan Another QR Code
                </Button>
                <Button variant="ghost" onClick={() => navigate('/loyalty')} className="w-full">
                  View My Rewards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>QR Scanner | 1325.AI</title>
        <meta name="description" content="Scan QR codes at verified businesses to earn loyalty points and redeem rewards" />
      </Helmet>

      <div className="min-h-screen bg-black relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                stopScanner();
                navigate(-1);
              }}
              className="text-white bg-black/50 backdrop-blur hover:bg-black/70"
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="text-center">
              <h1 className="text-white font-semibold">QR Scanner</h1>
              <p className="text-white/80 text-sm">Scan to earn points</p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFlash}
              className="text-white bg-black/50 backdrop-blur hover:bg-black/70"
            >
              {flashEnabled ? (
                <FlashlightOff className="h-6 w-6" />
              ) : (
                <Flashlight className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Scanner View */}
        <div className="relative w-full h-screen flex items-center justify-center">
          {isScanning ? (
            <div className="w-full h-full flex items-center justify-center bg-black">
              <div 
                id="qr-reader" 
                ref={containerRef}
                className="w-full max-w-md"
                style={{ minHeight: '300px' }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-white p-8">
              <QrCode className="h-32 w-32 mb-6 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Ready to Scan</h2>
              <p className="text-white/70 text-center mb-8">
                Position a QR code from a Mansa Musa business within the camera frame
              </p>
            </div>
          )}
          
          {/* Processing Overlay */}
          {processing && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4" />
                <p className="text-white text-lg">Processing QR Code...</p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-center mb-6">
            <p className="text-white text-lg mb-2">
              {isScanning ? 'Scanning...' : 'Tap to start scanning'}
            </p>
            <p className="text-white/70 text-sm">
              Earn points and unlock exclusive rewards
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            {!isScanning ? (
              <Button
                onClick={startScanning}
                size="lg"
                disabled={isTakingPhoto || processing}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full"
              >
                <QrCode className="h-6 w-6 mr-2" />
                Start Scanning
              </Button>
            ) : (
              <Button
                onClick={stopScanner}
                variant="outline"
                size="lg"
                disabled={processing}
                className="bg-black/50 text-white border-white/30 px-8 py-4 rounded-full backdrop-blur"
              >
                Stop Scanning
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QRScannerPage;
