
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCode as QRCodeType } from '@/lib/api/qr-code-api';
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { QrCode, Download, X } from 'lucide-react';

interface QRCodeViewerProps {
  qrCode: QRCodeType | null;
  onClose: () => void;
}

export const QRCodeViewer: React.FC<QRCodeViewerProps> = ({
  qrCode,
  onClose
}) => {
  if (!qrCode) return null;
  
  // Function to download QR code as image
  const downloadQRCode = () => {
    if (qrCode.qr_image_url) {
      const link = document.createElement('a');
      link.href = qrCode.qr_image_url;
      link.download = `qr-code-${qrCode.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Function to create QR code URL if one doesn't exist
  const getQRCodeImage = () => {
    if (qrCode.qr_image_url) {
      return qrCode.qr_image_url;
    }
    
    // Generate a QR code URL using an online service
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      `https://mansa-musa.vercel.app/scan?qr=${qrCode.id}&business=${qrCode.business_id}`
    )}`;
  };

  return (
    <Dialog open={!!qrCode} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code Details</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="flex flex-col items-center">
          {getQRCodeImage() ? (
            <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <img 
                src={getQRCodeImage()} 
                alt="QR Code" 
                className="w-48 h-48 object-contain"
              />
            </div>
          ) : (
            <div className="mb-4 p-4 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <QrCode size={96} className="text-gray-400" />
            </div>
          )}
          
          <div className="space-y-3 w-full mt-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Type:</span>
              <Badge variant="outline">{qrCode.code_type}</Badge>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={qrCode.is_active ? "default" : "secondary"}>
                {qrCode.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            {qrCode.points_value && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Points Value:</span>
                <span>{qrCode.points_value}</span>
              </div>
            )}
            
            {qrCode.discount_percentage && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Discount:</span>
                <span>{qrCode.discount_percentage}%</span>
              </div>
            )}
            
            {qrCode.scan_limit && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Scans:</span>
                <span>{qrCode.current_scans} / {qrCode.scan_limit}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Created:</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(qrCode.created_at), { addSuffix: true })}
              </span>
            </div>
            
            {qrCode.expiration_date && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Expires:</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(qrCode.expiration_date), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
          
          <Button 
            onClick={downloadQRCode} 
            className="mt-4 w-full"
            disabled={!qrCode.qr_image_url}
          >
            <Download className="mr-2 h-4 w-4" /> Download QR Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
