
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCode } from '@/lib/api/qr-code-api';

interface QRCodeViewerProps {
  qrCode: QRCode | null;
  onClose: () => void;
}

export const QRCodeViewer: React.FC<QRCodeViewerProps> = ({
  qrCode,
  onClose
}) => {
  return (
    <Dialog open={!!qrCode} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>QR Code Details</DialogTitle>
        </DialogHeader>
        {qrCode && (
          <div className="space-y-4">
            {qrCode.qr_image_url && (
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-lg">
                  <img 
                    src={qrCode.qr_image_url} 
                    alt="QR Code" 
                    className="w-48 h-48"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="font-medium">Type:</div>
              <div>{qrCode.code_type}</div>
              
              {qrCode.points_value && (
                <>
                  <div className="font-medium">Points Value:</div>
                  <div>{qrCode.points_value}</div>
                </>
              )}
              
              {qrCode.discount_percentage && (
                <>
                  <div className="font-medium">Discount:</div>
                  <div>{qrCode.discount_percentage}%</div>
                </>
              )}
              
              <div className="font-medium">Status:</div>
              <div>{qrCode.is_active ? 'Active' : 'Inactive'}</div>
              
              {qrCode.scan_limit && (
                <>
                  <div className="font-medium">Scan Limit:</div>
                  <div>{qrCode.scan_limit}</div>
                </>
              )}
              
              {qrCode.expiration_date && (
                <>
                  <div className="font-medium">Expires:</div>
                  <div>{new Date(qrCode.expiration_date).toLocaleDateString()}</div>
                </>
              )}
              
              <div className="font-medium">Created:</div>
              <div>{new Date(qrCode.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
