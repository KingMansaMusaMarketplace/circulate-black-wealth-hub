
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { QRCodeList } from './QRCodeList';
import { QRCode } from '@/lib/api/qr-code-api';
import { Plus } from 'lucide-react';
import { useQRCode } from '@/hooks/qr-code';
import { QRCodeEditor } from './QRCodeEditor';
import { QRCodeViewer } from './QRCodeViewer';
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog';

interface QRCodeManageTabProps {
  qrCodes: QRCode[];
}

export const QRCodeManageTab: React.FC<QRCodeManageTabProps> = ({ qrCodes }) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [editingQRCode, setEditingQRCode] = useState<QRCode | null>(null);
  const [viewingQRCode, setViewingQRCode] = useState<QRCode | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [qrCodeToDelete, setQrCodeToDelete] = useState<string | null>(null);
  
  const { deleteQRCode, loading } = useQRCode();

  const handleDelete = async (id: string) => {
    setQrCodeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!qrCodeToDelete) return;
    
    try {
      const success = await deleteQRCode(qrCodeToDelete);
      if (success) {
        // Toast is handled in the hook
      }
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

  const handleCreateNew = () => {
    setEditingQRCode(null);
    setOpenEditor(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Your QR Codes</h2>
        <Button onClick={handleCreateNew}>
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
      <QRCodeEditor
        open={openEditor}
        onOpenChange={setOpenEditor}
        qrCode={editingQRCode}
        isLoading={loading}
      />

      {/* QR code view dialog */}
      <QRCodeViewer
        qrCode={viewingQRCode}
        onClose={() => setViewingQRCode(null)}
      />

      {/* Delete confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default QRCodeManageTab;
