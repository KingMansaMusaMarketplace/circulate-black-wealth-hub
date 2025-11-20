
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

const TroubleshootingGuide: React.FC = () => {
  return (
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Troubleshooting Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-slate-800/50 border-blue-400/30">
          <InfoIcon className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong className="text-white">Location not working?</strong> Make sure you've granted location permissions in your browser settings or device settings.
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-slate-800/50 border-blue-400/30">
          <InfoIcon className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong className="text-white">On mobile devices:</strong> Location accuracy may be affected by GPS signal strength and device settings.
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-slate-800/50 border-blue-400/30">
          <InfoIcon className="h-4 w-4 text-blue-400" />
          <AlertDescription className="text-blue-200">
            <strong className="text-white">HTTPS required:</strong> Geolocation API requires a secure context (HTTPS) to function properly.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default TroubleshootingGuide;
