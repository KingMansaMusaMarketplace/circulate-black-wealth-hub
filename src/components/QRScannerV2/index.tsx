
import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Check, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QRCodeScannerV2: React.FC = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanSuccess, setScanSuccess] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const startScanner = () => {
    setIsScanning(true);
    setScanResult(null);
    setScanSuccess(null);
    setMessage(null);

    const qrScanner = new Html5QrcodeScanner(
      "qrScanner",
      { fps: 10, qrbox: 250 },
      false
    );

    qrScanner.render((decodedText) => {
      qrScanner.clear();
      setIsScanning(false);
      setScanResult(decodedText);

      // Simulate a successful scan for demo purposes
      if (decodedText.includes('mansa-musa') || Math.random() > 0.3) {
        setScanSuccess(true);
        setMessage("You've earned 10 loyalty points!");
      } else {
        setScanSuccess(false);
        setMessage("Invalid QR code. Please try again with a valid Mansa Musa QR code.");
      }
    }, (error) => {
      console.warn(error);
    });
  };

  return (
    <div className="flex flex-col items-center">
      {!isScanning && !scanResult && (
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-4">
            Point your camera at a Mansa Musa QR code to scan
          </p>
          <Button onClick={startScanner}>Start Scanner</Button>
        </div>
      )}

      {isScanning && (
        <div className="w-full max-w-md">
          <p className="text-center text-sm text-gray-500 mb-4">
            Position the QR code within the frame to scan
          </p>
          <div id="qrScanner" className="mx-auto"></div>
        </div>
      )}

      {scanResult && (
        <div className="w-full max-w-md mt-4">
          <div className={`p-6 rounded-lg ${
            scanSuccess ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'
          }`}>
            <div className="flex items-center mb-4">
              {scanSuccess ? (
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-2 rounded-full">
                  <X className="h-6 w-6 text-red-600" />
                </div>
              )}
              <h3 className="ml-3 text-lg font-medium">
                {scanSuccess ? 'Scan Successful' : 'Scan Failed'}
              </h3>
            </div>

            <p className="text-gray-600 mb-4">{message}</p>

            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center"
              onClick={startScanner}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Scan Another QR Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeScannerV2;
