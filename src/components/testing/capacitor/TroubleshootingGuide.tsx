
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TroubleshootingGuide: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Troubleshooting</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Make sure <code>@capacitor/geolocation</code> is installed.</li>
          <li>Check that permissions are properly configured in <code>capacitor.config.ts</code>.</li>
          <li>On Android, verify the manifest has the location permissions.</li>
          <li>On iOS, verify Info.plist contains the location usage descriptions.</li>
          <li>Test on a real device, as emulators may have simulated location services.</li>
          <li>After making changes, run <code>npx cap sync</code> to update native projects.</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default TroubleshootingGuide;
