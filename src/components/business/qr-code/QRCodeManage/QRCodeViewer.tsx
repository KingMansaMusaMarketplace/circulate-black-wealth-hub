
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, Share2 } from 'lucide-react';
import { QRCode } from '@/lib/api/qr-code-api';
import { toast } from 'sonner';

interface QRCodeViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: QRCode | null;
}

export const QRCodeViewer: React.FC<QRCodeViewerProps> = ({
  open,
  onOpenChange,
  qrCode
}) => {
  const handleDownload = () => {
    if (qrCode?.qr_image_url) {
      const link = document.createElement('a');
      link.href = qrCode.qr_image_url;
      link.download = `qr-code-${qrCode.code_type}-${qrCode.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('QR Code downloaded!');
    }
  };

  const handleCopy = () => {
    if (qrCode?.qr_image_url) {
      navigator.clipboard.writeText(qrCode.qr_image_url);
      toast.success('QR Code URL copied to clipboard!');
    }
  };

  const handleShare = async () => {
    if (qrCode?.qr_image_url && navigator.share) {
      try {
        await navigator.share({
          title: `${qrCode.code_type} QR Code`,
          url: qrCode.qr_image_url
        });
      } catch (error) {
        handleCopy(); // Fallback to copy
      }
    } else {
      handleCopy();
    }
  };

  if (!qrCode) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="capitalize">{qrCode.code_type} QR Code</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-center">
            {qrCode.qr_image_url ? (
              <img 
                src={qrCode.qr_image_url} 
                alt="QR Code"
                className="w-64 h-64 object-contain border rounded-lg"
              />
            ) : (
              <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No image available</p>
              </div>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><strong>Type:</strong> {qrCode.code_type}</div>
              <div><strong>Status:</strong> {qrCode.is_active ? 'Active' : 'Inactive'}</div>
            </div>
            
            {qrCode.discount_percentage && (
              <div><strong>Discount:</strong> {qrCode.discount_percentage}%</div>
            )}
            {qrCode.points_value && (
              <div><strong>Points:</strong> {qrCode.points_value}</div>
            )}
            
            <div><strong>Scans:</strong> {qrCode.current_scans}{qrCode.scan_limit && ` / ${qrCode.scan_limit}`}</div>
            
            {qrCode.expiration_date && (
              <div><strong>Expires:</strong> {new Date(qrCode.expiration_date).toLocaleDateString()}</div>
            )}
            
            <div><strong>Created:</strong> {new Date(qrCode.created_at).toLocaleDateString()}</div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleDownload} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleCopy} variant="outline" className="flex-1">
              <Copy className="mr-2 h-4 w-4" />
              Copy URL
            </Button>
            <Button onClick={handleShare} variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
