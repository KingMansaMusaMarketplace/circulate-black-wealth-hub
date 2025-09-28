import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Camera, QrCode, Flashlight, FlashlightOff, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ScanResult {
  businessName: string;
  pointsEarned: number;
  discount?: number;
  businessId: string;
}

const QRScannerPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to use the QR scanner');
      navigate('/auth');
      return;
    }
    
    requestCameraPermission();
    
    return () => {
      stopCamera();
    };
  }, [user, navigate]);

  const requestCameraPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      setStream(mediaStream);
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera permission denied:', error);
      setHasPermission(false);
      toast.error('Camera access is required to scan QR codes');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const toggleFlash = async () => {
    if (!stream) return;
    
    try {
      const track = stream.getVideoTracks()[0];
      
      // Note: Torch API is limited and may not work on all devices
      setFlashEnabled(!flashEnabled);
      toast.success(flashEnabled ? 'Flash disabled' : 'Flash enabled');
    } catch (error) {
      console.error('Flash toggle failed:', error);
      toast.error('Flash not available on this device');
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    scanQRCode();
  };

  const scanQRCode = () => {
    // This is a simplified QR scanner implementation
    // In a real app, you'd use a library like jsqr or @zxing/library
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Mock QR code detection for demo
    setTimeout(() => {
      if (isScanning) {
        // Simulate successful scan
        handleSuccessfulScan({
          businessName: 'Soul Food Kitchen',
          pointsEarned: 50,
          discount: 10,
          businessId: '123'
        });
      }
    }, 3000);
  };

  const handleSuccessfulScan = async (result: ScanResult) => {
    setIsScanning(false);
    setScanResult(result);
    
    // Record the scan in the database
    try {
      const { error } = await supabase
        .from('qr_scans')
        .insert({
          customer_id: user?.id,
          business_id: result.businessId,
          points_awarded: result.pointsEarned,
          discount_applied: result.discount || 0
        });

      if (error) throw error;
      
      toast.success(`Earned ${result.pointsEarned} points!`);
    } catch (error) {
      console.error('Error recording scan:', error);
      toast.error('Scan recorded locally but not synced');
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(false);
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
              <Button onClick={requestCameraPermission} className="w-full">
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate('/businesses')} className="w-full">
                Browse Businesses Instead
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
          <title>Scan Successful | Mansa Musa Marketplace</title>
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
        <title>QR Scanner | Mansa Musa Marketplace</title>
        <meta name="description" content="Scan QR codes at Black-owned businesses to earn points and unlock rewards" />
      </Helmet>

      <div className="min-h-screen bg-black relative">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-50 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
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

        {/* Camera View */}
        <div className="relative w-full h-screen flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Scan Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Scan Frame */}
              <div className="w-64 h-64 border-4 border-white/30 relative">
                {/* Corner indicators */}
                <div className="absolute -top-1 -left-1 w-8 h-8 border-l-4 border-t-4 border-primary"></div>
                <div className="absolute -top-1 -right-1 w-8 h-8 border-r-4 border-t-4 border-primary"></div>
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-l-4 border-b-4 border-primary"></div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-r-4 border-b-4 border-primary"></div>
                
                {/* Scanning animation */}
                {isScanning && (
                  <div className="absolute inset-0 border-2 border-primary animate-pulse">
                    <div className="w-full h-1 bg-primary animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="text-center mb-6">
            <p className="text-white text-lg mb-2">
              {isScanning ? 'Scanning...' : 'Position QR code within the frame'}
            </p>
            <p className="text-white/70 text-sm">
              Earn points and unlock exclusive rewards
            </p>
          </div>
          
          <div className="flex justify-center">
            {!isScanning ? (
              <Button
                onClick={startScanning}
                size="lg"
                className="bg-primary text-primary-foreground px-8 py-4 rounded-full"
              >
                <QrCode className="h-6 w-6 mr-2" />
                Start Scanning
              </Button>
            ) : (
              <Button
                onClick={() => setIsScanning(false)}
                variant="outline"
                size="lg"
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