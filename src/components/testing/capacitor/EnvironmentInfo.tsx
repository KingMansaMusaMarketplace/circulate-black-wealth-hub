
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Capacitor Detected:</span> {isCapacitor ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-medium">Platform:</span> {platform}
          </div>
          <div>
            <span className="font-medium">Native Platform:</span> {isNative ? 'Yes' : 'No'}
          </div>
          <div>
            <span className="font-medium">Permission Status:</span> {permissionStatus}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnvironmentInfo;
