
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Edit, Trash2, Eye, Calendar, Users } from 'lucide-react';
import { QRCode } from '@/lib/api/qr-code-api';

interface QRCodeCardProps {
  qrCode: QRCode;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onView: (qrCode: QRCode) => void;
}

const QRCodeCard: React.FC<QRCodeCardProps> = ({
  qrCode,
  onEdit,
  onDelete,
  onView
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'loyalty':
        return 'bg-blue-100 text-blue-800';
      case 'discount':
        return 'bg-green-100 text-green-800';
      case 'checkin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'loyalty':
        return '🎯';
      case 'discount':
        return '💰';
      case 'checkin':
        return '📍';
      default:
        return '🔗';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center gap-2">
            <span>{getTypeIcon(qrCode.code_type)}</span>
            {qrCode.code_type.charAt(0).toUpperCase() + qrCode.code_type.slice(1)} QR Code
          </CardTitle>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            qrCode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {qrCode.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getTypeColor(qrCode.code_type)}`}>
          {qrCode.code_type}
        </span>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* QR Code Preview */}
        <div className="flex justify-center">
          {qrCode.qr_image_url ? (
            <img 
              src={qrCode.qr_image_url} 
              alt="QR Code"
              className="w-32 h-32 border rounded"
            />
          ) : (
            <div className="w-32 h-32 border rounded flex items-center justify-center bg-gray-50">
              <QrCode className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* QR Code Details */}
        <div className="space-y-2 text-sm">
          {qrCode.discount_percentage && (
            <div className="flex justify-between">
              <span className="text-gray-600">Discount:</span>
              <span className="font-medium">{qrCode.discount_percentage}%</span>
            </div>
          )}
          {qrCode.points_value && (
            <div className="flex justify-between">
              <span className="text-gray-600">Points:</span>
              <span className="font-medium">{qrCode.points_value}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600 flex items-center gap-1">
              <Users className="h-3 w-3" />
              Scans:
            </span>
            <span className="font-medium">
              {qrCode.current_scans}
              {qrCode.scan_limit && ` / ${qrCode.scan_limit}`}
            </span>
          </div>
          {qrCode.expiration_date && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Expires:
              </span>
              <span className="text-xs text-gray-500">
                {new Date(qrCode.expiration_date).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Created:</span>
            <span className="text-xs text-gray-500">
              {new Date(qrCode.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(qrCode)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(qrCode.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeCard;
