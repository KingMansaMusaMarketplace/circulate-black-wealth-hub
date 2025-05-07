
import React from 'react';
import { QrCode, Award, BadgePercent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface QRCodeManageTabProps {
  qrCodes: any[];
}

export const QRCodeManageTab: React.FC<QRCodeManageTabProps> = ({ qrCodes }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your QR Codes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Scans</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qrCodes.map((qrCode) => (
              <TableRow key={qrCode.id}>
                <TableCell className="font-medium capitalize">
                  <div className="flex items-center gap-2">
                    {qrCode.type === 'loyalty' && <Award className="h-4 w-4 text-mansagold" />}
                    {qrCode.type === 'discount' && <BadgePercent className="h-4 w-4 text-mansablue" />}
                    {qrCode.type === 'info' && <QrCode className="h-4 w-4 text-gray-600" />}
                    {qrCode.type}
                  </div>
                </TableCell>
                <TableCell>
                  {qrCode.type === 'loyalty' && `${qrCode.pointsValue} points`}
                  {qrCode.type === 'discount' && `${qrCode.discountPercentage}% off`}
                  {qrCode.type === 'info' && 'Business Info'}
                </TableCell>
                <TableCell>
                  {qrCode.scanLimit ? 
                    `${qrCode.currentScans}/${qrCode.scanLimit}` : 
                    qrCode.currentScans
                  }
                </TableCell>
                <TableCell>{qrCode.createdAt}</TableCell>
                <TableCell>
                  {qrCode.expirationDate || <span className="text-gray-400">Never</span>}
                </TableCell>
                <TableCell>
                  {qrCode.isActive ? (
                    <Badge className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={qrCode.isActive ? "text-red-500" : "text-green-500"}
                  >
                    {qrCode.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
