
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
    <Card className="bg-slate-900/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Current Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-blue-200">Latitude:</span>
          <span className="font-mono text-yellow-300">{location.lat.toFixed(6)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-200">Longitude:</span>
          <span className="font-mono text-yellow-300">{location.lng.toFixed(6)}</span>
        </div>
        {location.accuracy && (
          <div className="flex justify-between">
            <span className="text-blue-200">Accuracy:</span>
            <span className="font-mono text-yellow-300">{location.accuracy.toFixed(2)}m</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-blue-200">Timestamp:</span>
          <span className="font-mono text-yellow-300">{new Date(location.timestamp).toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentLocation;
