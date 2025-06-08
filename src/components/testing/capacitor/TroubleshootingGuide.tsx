
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const TroubleshootingGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Troubleshooting Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Location not working?</strong> Make sure you've granted location permissions in your browser settings or device settings.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>On mobile devices:</strong> Location accuracy may be affected by GPS signal strength and device settings.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>HTTPS required:</strong> Geolocation API requires a secure context (HTTPS) to function properly.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default TroubleshootingGuide;
