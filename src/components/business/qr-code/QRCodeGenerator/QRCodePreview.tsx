
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Share } from 'lucide-react';

interface QRCodePreviewProps {
  imageUrl: string;
  codeType: string;
  pointsValue?: number;
  discountPercentage?: number;
  onDownload: () => void;
  onShare: () => void;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({
  imageUrl,
  codeType,
  pointsValue,
  discountPercentage,
  onDownload,
  onShare
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Your QR Code</CardTitle>
        <div className="flex justify-center gap-2 mt-2">
          {codeType === 'points' && pointsValue && (
            <Badge variant="secondary">{pointsValue} Points</Badge>
          )}
          {codeType === 'discount' && discountPercentage && (
            <Badge variant="secondary">{discountPercentage}% Discount</Badge>
          )}
          {codeType === 'combo' && (
            <>
              {pointsValue && <Badge variant="secondary">{pointsValue} Points</Badge>}
              {discountPercentage && <Badge variant="secondary">{discountPercentage}% Discount</Badge>}
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="p-4 bg-white rounded-lg max-w-[250px]">
          <img 
            src={imageUrl} 
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
