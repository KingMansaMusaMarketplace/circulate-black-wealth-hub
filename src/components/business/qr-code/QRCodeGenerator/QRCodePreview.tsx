
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';
import { QRCode } from '@/lib/api/qr-code-api';

interface QRCodePreviewProps {
  qrCode: QRCode | null;
  isGenerating: boolean;
  onDownload?: () => void;
  onShare?: () => void;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  qrCode,
  isGenerating,
  onDownload = () => {},
  onShare = () => {}
}) => {
  if (isGenerating) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Generating QR Code...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-mansablue"></div>
        </CardContent>
      </Card>
    );
  }

  if (!qrCode) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle>QR Code Preview</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-center">
            Fill out the form and click Generate to create your QR code
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Your QR Code</CardTitle>
        <div className="flex justify-center gap-2 mt-2">
          {qrCode.code_type === 'loyalty' && qrCode.points_value && (
            <Badge variant="secondary">{qrCode.points_value} Points</Badge>
          )}
          {qrCode.code_type === 'discount' && qrCode.discount_percentage && (
            <Badge variant="secondary">{qrCode.discount_percentage}% Discount</Badge>
          )}
          {qrCode.code_type === 'info' && (
            <Badge variant="secondary">Information</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="p-4 bg-white rounded-lg max-w-[250px]">
          <img 
            src={qrCode.qr_image_url || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=placeholder'} 
            alt="QR Code" 
            className="w-full h-auto"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-center gap-4">
        <Button variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" onClick={onShare}>
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodePreview;
