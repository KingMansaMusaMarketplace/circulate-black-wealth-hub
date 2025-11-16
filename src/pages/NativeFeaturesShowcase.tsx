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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/2 left-20 w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-full p-6 shadow-2xl animate-pulse border-4 border-white/30">
              <Smartphone className="w-16 h-16 text-white drop-shadow-lg" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
            Native Features Showcase
          </h1>
          <p className="text-lg font-medium bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            Experience capabilities beyond web browsing
          </p>
          {!isNative && (
            <Badge variant="destructive" className="mt-4">
              ⚠️ Web Version - Build and run natively to test all features
            </Badge>
          )}
        </div>

        {/* Platform Status */}
        <Card className="mb-6 border-4 border-transparent bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/30 dark:to-pink-900/30 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl shadow-lg animate-pulse">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Platform Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-gradient-to-br from-purple-100 via-purple-50 to-white dark:from-purple-900/20 dark:to-transparent rounded-xl border-2 border-purple-200/50">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-1">Platform</p>
                <p className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{platform}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-100 via-pink-50 to-white dark:from-pink-900/20 dark:to-transparent rounded-xl border-2 border-pink-200/50">
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-1">Mode</p>
                <p className="font-bold text-2xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">{isNative ? 'Native' : 'Web'}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-100 via-green-50 to-white dark:from-green-900/20 dark:to-transparent rounded-xl border-2 border-green-200/50">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">Network</p>
                <p className="font-bold text-2xl flex items-center gap-2">
                  {isOnline ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-500 animate-pulse" />
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Online</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-red-500 animate-pulse" />
                      <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Offline</span>
                    </>
                  )}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-100 via-blue-50 to-white dark:from-blue-900/20 dark:to-transparent rounded-xl border-2 border-blue-200/50">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">App State</p>
                <p className="font-bold text-2xl capitalize bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{appState}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const statusColors = {
              active: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg animate-pulse',
              ready: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg',
              inactive: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0 shadow-lg',
              offline: 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg animate-pulse',
              background: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg'
            };

            const cardGradients = [
              'from-white via-purple-50 to-pink-50 dark:from-gray-800 dark:via-purple-900/30 dark:to-pink-900/30',
              'from-white via-blue-50 to-cyan-50 dark:from-gray-800 dark:via-blue-900/30 dark:to-cyan-900/30',
              'from-white via-green-50 to-emerald-50 dark:from-gray-800 dark:via-green-900/30 dark:to-emerald-900/30',
              'from-white via-orange-50 to-red-50 dark:from-gray-800 dark:via-orange-900/30 dark:to-red-900/30',
              'from-white via-pink-50 to-purple-50 dark:from-gray-800 dark:via-pink-900/30 dark:to-purple-900/30',
              'from-white via-indigo-50 to-blue-50 dark:from-gray-800 dark:via-indigo-900/30 dark:to-blue-900/30',
              'from-white via-yellow-50 to-orange-50 dark:from-gray-800 dark:via-yellow-900/30 dark:to-orange-900/30',
              'from-white via-teal-50 to-cyan-50 dark:from-gray-800 dark:via-teal-900/30 dark:to-cyan-900/30'
            ];

            const iconGradients = [
              'from-purple-600 via-purple-500 to-pink-500',
              'from-blue-600 via-blue-500 to-cyan-500',
              'from-green-600 via-green-500 to-emerald-500',
              'from-orange-600 via-orange-500 to-red-500',
              'from-pink-600 via-pink-500 to-purple-500',
              'from-indigo-600 via-indigo-500 to-blue-500',
              'from-yellow-600 via-yellow-500 to-orange-500',
              'from-teal-600 via-teal-500 to-cyan-500'
            ];

            return (
              <Card key={feature.id} className={`bg-gradient-to-br ${cardGradients[index % cardGradients.length]} hover:shadow-2xl transition-all hover:scale-105 border-0 shadow-xl group overflow-hidden relative`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`bg-gradient-to-br ${iconGradients[index % iconGradients.length]} rounded-2xl p-3 shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7 text-white drop-shadow-lg" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                        <CardDescription className="text-sm font-medium mt-1">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="flex items-center justify-between">
                    <Badge className={`${statusColors[feature.status as keyof typeof statusColors]} px-4 py-2 text-sm font-bold`}>
                      {feature.status}
                    </Badge>
                    {feature.action && (
                      <Button 
                        onClick={feature.action}
                        size="sm"
                        className={`bg-gradient-to-r ${iconGradients[index % iconGradients.length]} text-white border-0 shadow-lg hover:shadow-xl hover:scale-110 transition-all font-bold px-6`}
                        disabled={!isNative}
                      >
                        🧪 Test
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
          <Card className="mt-6 border-4 border-transparent bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-gray-800 dark:via-green-900/30 dark:to-emerald-900/30 shadow-2xl animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg animate-pulse">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Location Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(locationData).map(([key, value]) => (
                  <div key={key} className="p-4 bg-gradient-to-br from-green-100 via-green-50 to-white dark:from-green-900/20 dark:to-transparent rounded-xl border-2 border-green-200/50">
                    <p className="text-green-600 dark:text-green-400 capitalize font-medium mb-1">{key}</p>
                    <p className="font-mono font-bold text-lg bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">{value as string}</p>
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
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-xl px-12 py-8 shadow-2xl hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] hover:scale-110 transition-all border-4 border-white/30 font-bold"
            disabled={!isNative}
          >
            <Zap className="w-7 h-7 mr-3 animate-pulse" />
            🚀 Test All Features
          </Button>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-indigo-900/30 dark:to-purple-900/30 border-4 border-transparent shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">For Apple Reviewers</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-base">
            <p className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-l-4 border-purple-500"><strong className="text-purple-700 dark:text-purple-400">✅ Haptic Feedback:</strong> Tap "Test" to feel native vibrations</p>
            <p className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border-l-4 border-green-500"><strong className="text-green-700 dark:text-green-400">✅ Geolocation:</strong> Grant location permission to see high-accuracy coordinates</p>
            <p className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border-l-4 border-blue-500"><strong className="text-blue-700 dark:text-blue-400">✅ Background Location:</strong> Enable to receive notifications when near businesses</p>
            <p className="p-3 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border-l-4 border-orange-500"><strong className="text-orange-700 dark:text-orange-400">✅ Notifications:</strong> Check notification center after testing</p>
            <p className="p-3 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg border-l-4 border-pink-500"><strong className="text-pink-700 dark:text-pink-400">✅ Native Share:</strong> See native share sheet</p>
            <p className="p-3 bg-gradient-to-r from-indigo-100 to-blue-100 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg border-l-4 border-indigo-500"><strong className="text-indigo-700 dark:text-indigo-400">✅ Offline Support:</strong> Turn on airplane mode and try browsing</p>
            <p className="p-3 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-lg border-l-4 border-teal-500"><strong className="text-teal-700 dark:text-teal-400">✅ App Lifecycle:</strong> Background the app for 5+ minutes, then return</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NativeFeaturesShowcase;
