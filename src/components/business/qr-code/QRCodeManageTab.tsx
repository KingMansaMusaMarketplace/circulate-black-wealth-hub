import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { QRCodeList } from './QRCodeManage';
import { QRCode } from '@/lib/api/qr-code-api';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQRCode } from '@/hooks/qr-code';
import { toast } from 'sonner';
import { QRCodeForm } from './QRCodeGenerator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface QRCodeManageTabProps {
  qrCodes: QRCode[];
}

export const QRCodeManageTab: React.FC<QRCodeManageTabProps> = ({ qrCodes }) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [editingQRCode, setEditingQRCode] = useState<QRCode | null>(null);
  const [viewingQRCode, setViewingQRCode] = useState<QRCode | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [qrCodeToDelete, setQrCodeToDelete] = useState<string | null>(null);
  
  const { updateQRCode, deleteQRCode, loading } = useQRCode();

  const handleDelete = async (id: string) => {
    setQrCodeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!qrCodeToDelete) return;
    
    try {
      const success = await deleteQRCode(qrCodeToDelete);
      if (success) {
        toast.success("QR code deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting QR code:", error);
      toast.error("Failed to delete QR code");
    } finally {
      setDeleteDialogOpen(false);
      setQrCodeToDelete(null);
    }
  };

  const handleEdit = (qrCode: QRCode) => {
    setEditingQRCode(qrCode);
    setOpenEditor(true);
  };

  const handleView = (qrCode: QRCode) => {
    setViewingQRCode(qrCode);
  };

  const handleSubmitEdit = async (values: any) => {
    if (!editingQRCode) return;
    
    try {
      // Process date value
      const expirationDate = values.expirationDate 
        ? new Date(values.expirationDate).toISOString()
        : undefined;

      const updatedQRCode = await updateQRCode(editingQRCode.id, {
        code_type: values.codeType,
        discount_percentage: values.discountPercentage,
        points_value: values.pointsValue,
        scan_limit: values.scanLimit,
        expiration_date: expirationDate,
        is_active: values.isActive,
      });
      
      if (updatedQRCode) {
        toast.success("QR code updated successfully");
        setOpenEditor(false);
        setEditingQRCode(null);
      }
    } catch (error) {
      console.error("Error updating QR code:", error);
      toast.error("Failed to update QR code");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Your QR Codes</h2>
        <Button onClick={() => setOpenEditor(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create New
        </Button>
      </div>

      <QRCodeList 
        qrCodes={qrCodes} 
        onDelete={handleDelete}
        onEdit={handleEdit}
        onView={handleView}
      />

      {/* QR code editor dialog */}
      <Dialog open={openEditor} onOpenChange={setOpenEditor}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingQRCode ? "Edit QR Code" : "Create New QR Code"}</DialogTitle>
          </DialogHeader>
          <QRCodeForm 
            onSubmit={handleSubmitEdit}
            isLoading={loading}
            initialValues={editingQRCode ? {
              codeType: editingQRCode.code_type,
              discountPercentage: editingQRCode.discount_percentage || undefined,
              pointsValue: editingQRCode.points_value || undefined,
              scanLimit: editingQRCode.scan_limit || undefined,
              expirationDate: editingQRCode.expiration_date ? new Date(editingQRCode.expiration_date).toISOString().split('T')[0] : undefined,
              isActive: editingQRCode.is_active
            } : undefined}
          />
        </DialogContent>
      </Dialog>

      {/* QR code view dialog */}
      <Dialog open={!!viewingQRCode} onOpenChange={() => setViewingQRCode(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>QR Code Details</DialogTitle>
          </DialogHeader>
          {viewingQRCode && (
            <div className="space-y-4">
              {viewingQRCode.qr_image_url && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg">
                    <img 
                      src={viewingQRCode.qr_image_url} 
                      alt="QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Type:</div>
                <div>{viewingQRCode.code_type}</div>
                
                {viewingQRCode.points_value && (
                  <>
                    <div className="font-medium">Points Value:</div>
                    <div>{viewingQRCode.points_value}</div>
                  </>
                )}
                
                {viewingQRCode.discount_percentage && (
                  <>
                    <div className="font-medium">Discount:</div>
                    <div>{viewingQRCode.discount_percentage}%</div>
                  </>
                )}
                
                <div className="font-medium">Status:</div>
                <div>{viewingQRCode.is_active ? 'Active' : 'Inactive'}</div>
                
                {viewingQRCode.scan_limit && (
                  <>
                    <div className="font-medium">Scan Limit:</div>
                    <div>{viewingQRCode.scan_limit}</div>
                  </>
                )}
                
                {viewingQRCode.expiration_date && (
                  <>
                    <div className="font-medium">Expires:</div>
                    <div>{new Date(viewingQRCode.expiration_date).toLocaleDateString()}</div>
                  </>
                )}
                
                <div className="font-medium">Created:</div>
                <div>{new Date(viewingQRCode.created_at).toLocaleDateString()}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the QR code
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
