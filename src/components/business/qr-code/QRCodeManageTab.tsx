
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { QrCode, BadgePercent, Award, Trash2, Calendar, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface QRCodeManageTabProps {
  qrCodes: Array<{
    id: string;
    code_type: 'discount' | 'loyalty' | 'info';
    discount_percentage?: number;
    points_value?: number;
    is_active: boolean;
    expiration_date?: string;
    scan_limit?: number;
    current_scans: number;
    created_at: string;
    qr_image_url?: string;
  }>;
}

export const QRCodeManageTab: React.FC<QRCodeManageTabProps> = ({ qrCodes }) => {
  const [activeQRCodes, setActiveQRCodes] = useState<Record<string, boolean>>(
    qrCodes.reduce((acc, qr) => ({ ...acc, [qr.id]: qr.is_active }), {})
  );

  const handleToggleActive = (qrCodeId: string) => {
    setActiveQRCodes(prev => {
      const newState = { ...prev, [qrCodeId]: !prev[qrCodeId] };
      
      // In a real app, this would update the database
      toast.success(`QR code ${newState[qrCodeId] ? 'activated' : 'deactivated'}`);
      
      return newState;
    });
  };

  const handleDownloadQR = (qrCode: any) => {
    if (!qrCode.qr_image_url) {
      toast.error('QR code image not available');
      return;
    }

    // Create a temporary link element and trigger download
    const link = document.createElement('a');
    link.href = qrCode.qr_image_url;
    link.download = `qr-code-${qrCode.code_type}-${qrCode.id.substring(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('QR code downloaded');
  };

  const handleDeleteQR = (qrCodeId: string) => {
    // In a real app, this would delete from the database
    toast.success('QR code deleted successfully');
  };

  if (qrCodes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 flex flex-col items-center justify-center">
          <QrCode size={48} className="text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No QR Codes Created</h3>
          <p className="text-gray-500 mb-6 text-center">Generate QR codes to share with your customers</p>
          <Button>Generate Your First QR Code</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {qrCodes.map((qrCode) => (
          <Card key={qrCode.id} className={!activeQRCodes[qrCode.id] ? 'opacity-70' : ''}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {qrCode.code_type === 'loyalty' && <Award className="mr-2 h-5 w-5 text-mansagold" />}
                  {qrCode.code_type === 'discount' && <BadgePercent className="mr-2 h-5 w-5 text-green-500" />}
                  {qrCode.code_type === 'info' && <QrCode className="mr-2 h-5 w-5 text-blue-500" />}
                  <CardTitle className="capitalize text-lg">
                    {qrCode.code_type} QR Code
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={activeQRCodes[qrCode.id]}
                    onCheckedChange={() => handleToggleActive(qrCode.id)}
                  />
                  <Label>{activeQRCodes[qrCode.id] ? 'Active' : 'Inactive'}</Label>
                </div>
              </div>
              <CardDescription>
                Created {format(new Date(qrCode.created_at), 'MMM d, yyyy')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-md p-4 flex justify-center items-center">
                {qrCode.qr_image_url ? (
                  <img 
                    src={qrCode.qr_image_url} 
                    alt="QR Code" 
                    className="w-full max-w-[120px] h-auto"
                  />
                ) : (
                  <div className="w-[120px] h-[120px] bg-gray-100 flex items-center justify-center">
                    <QrCode size={40} className="text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="space-y-3 text-sm">
                {qrCode.points_value && (
                  <div className="flex items-center">
                    <Award className="mr-2 h-4 w-4 text-mansagold" />
                    <span>{qrCode.points_value} points per scan</span>
                  </div>
                )}
                
                {qrCode.discount_percentage && (
                  <div className="flex items-center">
                    <BadgePercent className="mr-2 h-4 w-4 text-green-500" />
                    <span>{qrCode.discount_percentage}% discount</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <QrCode className="mr-2 h-4 w-4" />
                  <span>
                    {qrCode.current_scans} scans
                    {qrCode.scan_limit && ` / ${qrCode.scan_limit} limit`}
                  </span>
                </div>
                
                {qrCode.expiration_date && (
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-amber-500" />
                    <span>
                      Expires: {format(new Date(qrCode.expiration_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm" onClick={() => handleDownloadQR(qrCode)}>
                Download
              </Button>
              
              <div className="space-x-2">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteQR(qrCode.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
