
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EnvironmentInfoProps {
  isCapacitor: boolean;
  platform: string;
  isNative: boolean;
  permissionStatus: string;
}

const EnvironmentInfo: React.FC<EnvironmentInfoProps> = ({
  isCapacitor,
  platform,
  isNative,
  permissionStatus
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Capacitor:</span>
          <Badge variant={isCapacitor ? "default" : "secondary"}>
            {isCapacitor ? "Enabled" : "Disabled"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Platform:</span>
          <Badge variant="outline">{platform}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Native:</span>
          <Badge variant={isNative ? "default" : "secondary"}>
            {isNative ? "Yes" : "No"}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>Location Permission:</span>
          <Badge variant={permissionStatus === 'granted' ? "default" : "destructive"}>
            {permissionStatus}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentInfo;
