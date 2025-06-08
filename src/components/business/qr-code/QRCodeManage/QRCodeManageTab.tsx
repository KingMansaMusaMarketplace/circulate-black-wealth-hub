
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCode } from '@/lib/api/qr-code-api';

interface QRCodeManageTabProps {
  qrCodes: QRCode[];
}

export const QRCodeManageTab: React.FC<QRCodeManageTabProps> = ({ qrCodes }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage QR Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {qrCodes.length === 0 ? (
            <p className="text-gray-500">No QR codes created yet.</p>
          ) : (
            <div className="space-y-4">
              {qrCodes.map((qrCode) => (
                <div key={qrCode.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{qrCode.code_type} QR Code</h3>
                      <p className="text-sm text-gray-500">
                        Scans: {qrCode.current_scans}
                        {qrCode.scan_limit && ` / ${qrCode.scan_limit}`}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        qrCode.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {qrCode.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
