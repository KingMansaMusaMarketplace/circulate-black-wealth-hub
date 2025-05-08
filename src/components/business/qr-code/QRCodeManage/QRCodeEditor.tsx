
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { QRCode } from '@/lib/api/qr-code-api';
import { QRCodeForm } from '../QRCodeGenerator/QRCodeForm';
import { useQRCode } from '@/hooks/qr-code';
import { toast } from 'sonner';

interface QRCodeEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  qrCode: QRCode | null;
  isLoading: boolean;
}

export const QRCodeEditor: React.FC<QRCodeEditorProps> = ({
  open,
  onOpenChange,
  qrCode,
  isLoading
}) => {
  const { updateQRCode } = useQRCode();

  const handleSubmit = async (values: any) => {
    if (!qrCode) return;
    
    try {
      // Process date value
      const expirationDate = values.expirationDate 
        ? new Date(values.expirationDate).toISOString()
        : undefined;

      const updatedQRCode = await updateQRCode(qrCode.id, {
        code_type: values.codeType,
        discount_percentage: values.discountPercentage,
        points_value: values.pointsValue,
        scan_limit: values.scanLimit,
        expiration_date: expirationDate,
        is_active: values.isActive,
      });
      
      if (updatedQRCode) {
        toast.success("QR code updated successfully");
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating QR code:", error);
      toast.error("Failed to update QR code");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{qrCode ? "Edit QR Code" : "Create New QR Code"}</DialogTitle>
        </DialogHeader>
        <QRCodeForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialValues={qrCode ? {
            codeType: qrCode.code_type,
            discountPercentage: qrCode.discount_percentage || undefined,
            pointsValue: qrCode.points_value || undefined,
            scanLimit: qrCode.scan_limit || undefined,
            expirationDate: qrCode.expiration_date ? new Date(qrCode.expiration_date).toISOString().split('T')[0] : undefined,
            isActive: qrCode.is_active
          } : undefined}
        />
      </DialogContent>
    </Dialog>
  );
};
