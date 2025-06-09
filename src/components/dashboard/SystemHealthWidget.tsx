
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

const SystemHealthWidget: React.FC = () => {
  const systemStatus = {
    qrScanning: 'operational',
    loyaltySystem: 'operational',
    businessDirectory: 'operational',
    notifications: 'maintenance'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Operational</Badge>;
      case 'maintenance':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Maintenance</Badge>;
      case 'down':
        return <Badge variant="destructive">Down</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">System Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(systemStatus.qrScanning)}
            <span className="text-sm">QR Scanning</span>
          </div>
          {getStatusBadge(systemStatus.qrScanning)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(systemStatus.loyaltySystem)}
            <span className="text-sm">Loyalty System</span>
          </div>
          {getStatusBadge(systemStatus.loyaltySystem)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(systemStatus.businessDirectory)}
            <span className="text-sm">Business Directory</span>
          </div>
          {getStatusBadge(systemStatus.businessDirectory)}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(systemStatus.notifications)}
            <span className="text-sm">Notifications</span>
          </div>
          {getStatusBadge(systemStatus.notifications)}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthWidget;
