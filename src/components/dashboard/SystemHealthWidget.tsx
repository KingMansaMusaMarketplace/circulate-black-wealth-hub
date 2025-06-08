
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SystemHealthProps {
  className?: string;
}

export const SystemHealthWidget: React.FC<SystemHealthProps> = ({ className }) => {
  const systemStatus = {
    overall: 'healthy',
    database: 'healthy',
    authentication: 'healthy',
    payments: 'warning',
    api: 'healthy'
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-100 text-green-800">Operational</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(systemStatus.overall)}
          System Health
        </CardTitle>
        <CardDescription>
          Current status of all system components
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">Database</span>
          {getStatusBadge(systemStatus.database)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Authentication</span>
          {getStatusBadge(systemStatus.authentication)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">Payments</span>
          {getStatusBadge(systemStatus.payments)}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">API Services</span>
          {getStatusBadge(systemStatus.api)}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemHealthWidget;
