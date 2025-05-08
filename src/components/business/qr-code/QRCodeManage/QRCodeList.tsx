
import React from 'react';
import QRCodeCard from './QRCodeCard';
import { QRCode } from '@/lib/api/qr-code-api';
import { EmptyState } from './QRCodeEmptyState';

interface QRCodeListProps {
  qrCodes: QRCode[];
  onDelete: (id: string) => void;
  onEdit: (qrCode: QRCode) => void;
  onView: (qrCode: QRCode) => void;
}

export const QRCodeList: React.FC<QRCodeListProps> = ({
  qrCodes,
  onDelete,
  onEdit,
  onView
}) => {
  if (qrCodes.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {qrCodes.map((qrCode) => (
        <QRCodeCard
          key={qrCode.id}
          qrCode={qrCode}
          onDelete={onDelete}
          onEdit={onEdit}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default QRCodeList;
