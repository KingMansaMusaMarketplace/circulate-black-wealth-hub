
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smartphone } from 'lucide-react';
import { useDeviceDetection } from '@/hooks/use-device-detection';

export const DeviceInfoCard: React.FC = () => {
  const deviceInfo = useDeviceDetection();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          Device Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm font-medium">Platform</div>
            <Badge variant={deviceInfo.isCapacitor ? "default" : "secondary"}>
              {deviceInfo.isCapacitor ? 'Native App' : 'Web App'}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium">OS</div>
            <Badge variant="outline">
              {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Web'}
            </Badge>
          </div>
          <div>
            <div className="text-sm font-medium">Screen Size</div>
            <Badge variant="outline">{deviceInfo.screenSize}</Badge>
          </div>
          <div>
            <div className="text-sm font-medium">Orientation</div>
            <Badge variant="outline">{deviceInfo.orientation}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
