
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, QrCode } from 'lucide-react';
import { QRCode } from '@/lib/api/qr-code-api';

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
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'discount': return 'bg-red-100 text-red-800';
      case 'loyalty': return 'bg-blue-100 text-blue-800';
      case 'checkin': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpired = qrCode.expiration_date && new Date(qrCode.expiration_date) < new Date();
  const isLimitReached = qrCode.scan_limit && qrCode.current_scans >= qrCode.scan_limit;

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg capitalize">{qrCode.code_type} QR Code</CardTitle>
          <Badge className={getTypeColor(qrCode.code_type)}>
            {qrCode.code_type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          {qrCode.qr_image_url ? (
            <img 
              src={qrCode.qr_image_url} 
              alt="QR Code"
              className="w-32 h-32 object-contain border rounded"
            />
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <QrCode className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="space-y-2 text-sm">
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
        </div>

        <div className="flex gap-1">
          <Badge variant={qrCode.is_active && !isExpired && !isLimitReached ? "default" : "secondary"}>
            {qrCode.is_active && !isExpired && !isLimitReached ? 'Active' : 'Inactive'}
          </Badge>
          {isExpired && <Badge variant="destructive">Expired</Badge>}
          {isLimitReached && <Badge variant="outline">Limit Reached</Badge>}
        </div>

        <div className="flex gap-2">
          <Button onClick={() => onView(qrCode)} variant="outline" size="sm" className="flex-1">
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
          <Button onClick={() => onEdit(qrCode)} variant="outline" size="sm" className="flex-1">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button onClick={() => onDelete(qrCode.id)} variant="destructive" size="sm">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeCard;
