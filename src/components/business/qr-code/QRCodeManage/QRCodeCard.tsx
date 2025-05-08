
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QRCode } from '@/lib/api/qr-code-api';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash, Eye, QrCode } from 'lucide-react';

interface QRCodeCardProps {
  qrCode: QRCode;
  onDelete: (id: string) => void;
  onEdit: (qrCode: QRCode) => void;
  onView: (qrCode: QRCode) => void;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({
  qrCode,
  onDelete,
  onEdit,
  onView
}) => {
  const isExpired = qrCode.expiration_date && new Date(qrCode.expiration_date) < new Date();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-md">{qrCode.code_type} QR Code</CardTitle>
          <Badge variant={qrCode.is_active ? "default" : "secondary"}>
            {qrCode.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <QrCode size={48} />
          </div>
          <div>
            {qrCode.points_value && (
              <p className="text-sm"><strong>Points:</strong> {qrCode.points_value}</p>
            )}
            {qrCode.discount_percentage && (
              <p className="text-sm"><strong>Discount:</strong> {qrCode.discount_percentage}%</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Created {qrCode.created_at && formatDistanceToNow(new Date(qrCode.created_at), { addSuffix: true })}
            </p>
            {isExpired && (
              <Badge variant="destructive" className="mt-2">Expired</Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => onView(qrCode)}>
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <Button size="sm" variant="outline" onClick={() => onEdit(qrCode)}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button size="sm" variant="destructive" onClick={() => onDelete(qrCode.id)}>
          <Trash className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QRCodeCard;
