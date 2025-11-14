import React, { useState } from 'react';
import { useCapacitor } from '@/hooks/use-capacitor';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useBackgroundLocation } from '@/hooks/use-background-location';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useNativeShare } from '@/hooks/use-native-share';
import { useOfflineSupport } from '@/hooks/use-offline-support';
import { useAppLifecycle } from '@/hooks/use-app-lifecycle';
import { Geolocation } from '@capacitor/geolocation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Vibrate, 
  MapPin, 
  Bell, 
  Share2, 
  Wifi, 
  Zap,
  CheckCircle2,
  XCircle,
  Phone,
  Layers,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

const NativeFeaturesShowcase = () => {
  const { isNative, platform } = useCapacitor();
  const haptics = useHapticFeedback();
  const { isTracking, enableBackgroundLocation, disableBackgroundLocation } = useBackgroundLocation();
  const { showLocalNotification, sendWelcomeNotification } = usePushNotifications();
  const { shareAppInvite } = useNativeShare();
  const { isOnline, offlineQueue } = useOfflineSupport();
  const { appState, backgroundTime } = useAppLifecycle();
  
  const [locationData, setLocationData] = useState<any>(null);
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const testHaptics = async () => {
    await haptics.light();
    await new Promise(resolve => setTimeout(resolve, 100));
    await haptics.medium();
    await new Promise(resolve => setTimeout(resolve, 100));
    await haptics.heavy();
    await new Promise(resolve => setTimeout(resolve, 200));
    await haptics.success();
    
    setTestResults({ ...testResults, haptics: true });
    toast.success('Haptic feedback test complete! Feel the vibrations?');
  };

  const testLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });
      
      setLocationData({
        latitude: position.coords.latitude.toFixed(6),
        longitude: position.coords.longitude.toFixed(6),
        accuracy: position.coords.accuracy?.toFixed(2),
        altitude: position.coords.altitude?.toFixed(2),
        timestamp: new Date(position.timestamp).toLocaleString()
      });
      
      setTestResults({ ...testResults, location: true });
      await haptics.success();
      toast.success('Location retrieved successfully!');
    } catch (error) {
      setTestResults({ ...testResults, location: false });
      toast.error('Location permission required');
    }
  };

  const testBackgroundLocation = async () => {
    if (isTracking) {
      await disableBackgroundLocation();
      setTestResults({ ...testResults, backgroundLocation: false });
    } else {
      await enableBackgroundLocation();
      setTestResults({ ...testResults, backgroundLocation: true });
    }
  };

  const testNotifications = async () => {
    await showLocalNotification(
      '🎉 Native Notifications Work!',
      'This is a native local notification. Check your notification center!'
    );
    await haptics.success();
    setTestResults({ ...testResults, notifications: true });
    toast.success('Notification sent! Check your notification center.');
  };

  const testNativeShare = async () => {
    try {
      await shareAppInvite();
      setTestResults({ ...testResults, share: true });
      await haptics.light();
    } catch (error) {
      toast.error('Share cancelled or failed');
    }
  };

  const features = [
    {
      id: 'platform',
      icon: Phone,
      title: 'Native Platform',
      description: `Running on ${platform} ${isNative ? '(Native)' : '(Web)'}`,
      status: isNative ? 'active' : 'inactive',
      action: null
    },
    {
      id: 'haptics',
      icon: Vibrate,
      title: 'Haptic Feedback',
      description: 'Tactile responses throughout the app',
      status: testResults.haptics ? 'active' : 'ready',
      action: testHaptics
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'Geolocation',
      description: 'High-accuracy location services',
      status: testResults.location ? 'active' : 'ready',
      action: testLocation
    },
    {
      id: 'backgroundLocation',
      icon: Layers,
      title: 'Background Location',
      description: 'Location tracking when app is closed',
      status: isTracking ? 'active' : 'ready',
      action: testBackgroundLocation
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Push Notifications',
      description: 'Native local and push notifications',
      status: testResults.notifications ? 'active' : 'ready',
      action: testNotifications
    },
    {
      id: 'share',
      icon: Share2,
      title: 'Native Share',
      description: 'System share sheet integration',
      status: testResults.share ? 'active' : 'ready',
      action: testNativeShare
    },
    {
      id: 'offline',
      icon: Wifi,
      title: 'Offline Support',
      description: `Network: ${isOnline ? 'Online' : 'Offline'} ${offlineQueue > 0 ? `(${offlineQueue} queued)` : ''}`,
      status: isOnline ? 'active' : 'offline',
      action: null
    },
    {
      id: 'lifecycle',
      icon: Activity,
      title: 'App Lifecycle',
      description: `State: ${appState} ${backgroundTime > 0 ? `(${Math.round(backgroundTime / 1000)}s bg)` : ''}`,
      status: appState === 'active' ? 'active' : 'background',
      action: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary to-primary-glow rounded-full p-4">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Native Features Showcase</h1>
          <p className="text-muted-foreground text-lg">
            Experience capabilities beyond web browsing
          </p>
          {!isNative && (
            <Badge variant="destructive" className="mt-4">
              ⚠️ Web Version - Build and run natively to test all features
            </Badge>
          )}
        </div>

        {/* Platform Status */}
        <Card className="mb-6 border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Platform Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Platform</p>
                <p className="font-bold text-lg">{platform}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mode</p>
                <p className="font-bold text-lg">{isNative ? 'Native' : 'Web'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="font-bold text-lg flex items-center gap-2">
                  {isOnline ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Online
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      Offline
                    </>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">App State</p>
                <p className="font-bold text-lg capitalize">{appState}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            const statusColors = {
              active: 'bg-green-100 text-green-700 border-green-300',
              ready: 'bg-blue-100 text-blue-700 border-blue-300',
              inactive: 'bg-gray-100 text-gray-700 border-gray-300',
              offline: 'bg-orange-100 text-orange-700 border-orange-300',
              background: 'bg-purple-100 text-purple-700 border-purple-300'
            };

            return (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-full p-2">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge className={statusColors[feature.status as keyof typeof statusColors]}>
                      {feature.status}
                    </Badge>
                    {feature.action && (
                      <Button 
                        onClick={feature.action}
                        size="sm"
                        variant="outline"
                        disabled={!isNative}
                      >
                        Test
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Location Data Display */}
        {locationData && (
          <Card className="mt-6 border-2 border-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                Location Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {Object.entries(locationData).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-muted-foreground capitalize">{key}</p>
                    <p className="font-mono font-semibold">{value as string}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test All Button */}
        <div className="mt-8 text-center">
          <Button 
            onClick={async () => {
              await testHaptics();
              await new Promise(r => setTimeout(r, 500));
              await testLocation();
              await new Promise(r => setTimeout(r, 500));
              await testNotifications();
              toast.success('All tests completed!');
            }}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary-glow"
            disabled={!isNative}
          >
            <Zap className="w-5 h-5 mr-2" />
            Test All Features
          </Button>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-muted/50">
          <CardHeader>
            <CardTitle>For Apple Reviewers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Haptic Feedback:</strong> Tap "Test" to feel native vibrations</p>
            <p>✅ <strong>Geolocation:</strong> Grant location permission to see high-accuracy coordinates</p>
            <p>✅ <strong>Background Location:</strong> Enable to receive notifications when near businesses</p>
            <p>✅ <strong>Notifications:</strong> Check notification center after testing</p>
            <p>✅ <strong>Native Share:</strong> See native share sheet</p>
            <p>✅ <strong>Offline Support:</strong> Turn on airplane mode and try browsing</p>
            <p>✅ <strong>App Lifecycle:</strong> Background the app for 5+ minutes, then return</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NativeFeaturesShowcase;
