
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

interface CurrentLocationProps {
  location: LocationData;
}

const CurrentLocation: React.FC<CurrentLocationProps> = ({ location }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Latitude:</span>
          <span className="font-mono">{location.lat.toFixed(6)}</span>
        </div>
        <div className="flex justify-between">
          <span>Longitude:</span>
          <span className="font-mono">{location.lng.toFixed(6)}</span>
        </div>
        {location.accuracy && (
          <div className="flex justify-between">
            <span>Accuracy:</span>
            <span className="font-mono">{location.accuracy.toFixed(2)}m</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Timestamp:</span>
          <span className="font-mono">{new Date(location.timestamp).toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentLocation;
