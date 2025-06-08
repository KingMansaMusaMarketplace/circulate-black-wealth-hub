
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationData {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

interface CurrentLocationProps {
  location: LocationData | null;
}

const CurrentLocation: React.FC<CurrentLocationProps> = ({ location }) => {
  if (!location) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Location</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <span className="font-medium">Latitude:</span> {location.lat.toFixed(6)}
          </div>
          <div>
            <span className="font-medium">Longitude:</span> {location.lng.toFixed(6)}
          </div>
          <div>
            <span className="font-medium">Accuracy:</span> {location.accuracy ? `${location.accuracy.toFixed(1)}m` : 'Unknown'}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span> {new Date(location.timestamp).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentLocation;
