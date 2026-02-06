import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { MapPin, Bell } from 'lucide-react';
import { useBackgroundLocation } from '@/hooks/use-background-location';
import { toast } from 'sonner';

const ProximitySettings: React.FC = () => {
  const { isTracking, enableBackgroundLocation, disableBackgroundLocation, isNative } = useBackgroundLocation();
  const [radiusMiles, setRadiusMiles] = useState(() => 
    parseFloat(localStorage.getItem('proximity_radius_miles') || '0.5')
  );

  const handleRadiusChange = (value: number[]) => {
    const newRadius = value[0];
    setRadiusMiles(newRadius);
    localStorage.setItem('proximity_radius_miles', newRadius.toString());
  };

  const handleToggleTracking = async (enabled: boolean) => {
    if (enabled) {
      await enableBackgroundLocation();
    } else {
      await disableBackgroundLocation();
    }
  };

  const getRadiusLabel = (miles: number) => {
    if (miles < 0.25) return `${Math.round(miles * 5280)} feet`;
    return `${miles.toFixed(1)} miles`;
  };

  if (!isNative) {
    return (
      <Card className="bg-slate-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MapPin className="h-5 w-5 text-mansagold" />
            Proximity Alerts
          </CardTitle>
          <CardDescription className="text-gray-400">
            Get notified when you're near Black-owned businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Proximity alerts are available in the mobile app.
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Download the app to receive notifications when you're near businesses.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <MapPin className="h-5 w-5 text-mansagold" />
          Proximity Alerts
        </CardTitle>
        <CardDescription className="text-gray-400">
          Get notified when you're near Black-owned businesses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-white">Enable Proximity Alerts</Label>
            <p className="text-xs text-gray-400">
              Receive notifications when near businesses
            </p>
          </div>
          <Switch
            checked={isTracking}
            onCheckedChange={handleToggleTracking}
            className="data-[state=checked]:bg-mansagold"
          />
        </div>

        {/* Radius Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-white">Notification Radius</Label>
            <span className="text-sm font-medium text-mansagold">
              {getRadiusLabel(radiusMiles)}
            </span>
          </div>
          <Slider
            value={[radiusMiles]}
            onValueChange={handleRadiusChange}
            min={0.1}
            max={5}
            step={0.1}
            disabled={!isTracking}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>~500 ft</span>
            <span>1 mile</span>
            <span>5 miles</span>
          </div>
        </div>

        {/* Status Indicator */}
        {isTracking && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-emerald-400">
              Actively monitoring for nearby businesses
            </span>
          </div>
        )}

        {/* Privacy Note */}
        <p className="text-xs text-gray-500">
          Your location is processed on-device and never stored. 
          We only check for nearby businesses when the app is open.
        </p>
      </CardContent>
    </Card>
  );
};

export default ProximitySettings;
