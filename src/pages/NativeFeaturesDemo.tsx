import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Share2, 
  MapPin, 
  Wifi, 
  WifiOff, 
  Vibrate, 
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useNativeShare } from '@/hooks/use-native-share';
import { useOfflineSupport } from '@/hooks/use-offline-support';
import { useBackgroundLocation } from '@/hooks/use-background-location';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useCapacitor } from '@/hooks/use-capacitor';
import { useAppLifecycle } from '@/hooks/use-app-lifecycle';
import { toast } from 'sonner';

const NativeFeaturesDemo: React.FC = () => {
  const haptics = useHapticFeedback();
  const { shareBusiness, shareAppInvite } = useNativeShare();
  const { isOnline, offlineQueue, queueAction } = useOfflineSupport();
  const { isTracking, lastPosition } = useBackgroundLocation();
  const { sendWelcomeNotification, sendLoyaltyNotification, showLocalNotification } = usePushNotifications();
  const { isCapacitor, platform, isNative } = useCapacitor();
  const { appState, backgroundTime } = useAppLifecycle();

  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const runFeatureTest = async (featureName: string, testFn: () => Promise<void>) => {
    try {
      await testFn();
      setTestResults(prev => ({ ...prev, [featureName]: true }));
      toast.success(`${featureName} test passed!`);
    } catch (error) {
      setTestResults(prev => ({ ...prev, [featureName]: false }));
      toast.error(`${featureName} test failed`);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Helmet>
        <title>Native Features Demo | Mansa Musa Marketplace</title>
        <meta name="description" content="Demonstration of native iOS/Android features" />
      </Helmet>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-16 shadow-2xl animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <h1 className="text-5xl font-bold mb-4 animate-scale-in">📱 Native Features Demo</h1>
          <p className="text-white/90 text-xl mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Experience cutting-edge native functionality ✨
          </p>
          <div className="flex gap-3 flex-wrap animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Badge 
              variant={isNative ? "default" : "secondary"} 
              className={`text-sm px-4 py-2 ${isNative ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'} shadow-lg transition-all hover:scale-105`}
            >
              {isNative ? '✅ Native Platform' : '🌐 Web Platform'}
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2 text-white border-white/50 hover:bg-white/10 transition-all hover:scale-105 shadow-lg">
              Platform: {platform}
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2 text-white border-white/50 hover:bg-white/10 transition-all hover:scale-105 shadow-lg">
              App State: {appState}
            </Badge>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8 relative z-10">
        
        {/* Environment Info */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-purple-50 to-pink-50 backdrop-blur-sm animate-fade-in hover:shadow-3xl hover:scale-[1.02] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse"></div>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 rounded-xl shadow-lg animate-pulse">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Environment Information
              </span>
            </CardTitle>
            <CardDescription className="text-base ml-14">
              Current platform and native capabilities 🚀✨
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Platform</p>
              <p className="font-semibold">{platform}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Native App</p>
              <p className="font-semibold">{isNative ? 'Yes' : 'No (Web)'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">App State</p>
              <p className="font-semibold capitalize">{appState}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Background Time</p>
              <p className="font-semibold">{Math.floor(backgroundTime / 1000)}s</p>
            </div>
          </CardContent>
        </Card>

        {/* Haptic Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Vibrate className="w-5 h-5" />
              Haptic Feedback
              {testResults['haptics'] && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
            </CardTitle>
            <CardDescription>
              Tactile responses throughout the app
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => runFeatureTest('haptics', async () => {
                  await haptics.light();
                })}
                className="bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                💨 Light Impact
              </Button>
              <Button 
                onClick={() => runFeatureTest('haptics', async () => {
                  await haptics.medium();
                })}
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                ⚡ Medium Impact
              </Button>
              <Button 
                onClick={() => runFeatureTest('haptics', async () => {
                  await haptics.heavy();
                })}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                💥 Heavy Impact
              </Button>
              <Button 
                onClick={() => runFeatureTest('haptics', async () => {
                  await haptics.success();
                })}
                className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                ✅ Success
              </Button>
              <Button 
                onClick={() => runFeatureTest('haptics', async () => {
                  await haptics.error();
                })}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                ❌ Error
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Native Share */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Native Share Integration
              {testResults['share'] && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
            </CardTitle>
            <CardDescription>
              Platform-native share sheets (iOS/Android)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => runFeatureTest('share', async () => {
                  await shareBusiness('Demo Business', '123');
                })}
                className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                🏪 Share Business
              </Button>
              <Button 
                onClick={() => runFeatureTest('share', async () => {
                  await shareAppInvite('DEMO123');
                })}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                🎁 Share App Invite
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Push & Local Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Push & Local Notifications
              {testResults['notifications'] && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
            </CardTitle>
            <CardDescription>
              Rich notifications with actions and deep links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => runFeatureTest('notifications', async () => {
                  sendWelcomeNotification();
                })}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                👋 Welcome Notification
              </Button>
              <Button 
                onClick={() => runFeatureTest('notifications', async () => {
                  sendLoyaltyNotification(100);
                })}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                ⭐ Loyalty Points (+100)
              </Button>
              <Button 
                onClick={() => runFeatureTest('notifications', async () => {
                  showLocalNotification(
                    '🎉 Special Offer!',
                    'Get 20% off at businesses near you today!'
                  );
                })}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                🎉 Promotional Alert
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Background Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Background Location Tracking
              {testResults['location'] && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
            </CardTitle>
            <CardDescription>
              Monitors location even when app is backgrounded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Tracking Status</p>
                  <p className="text-sm text-gray-500">
                    {isTracking ? 'Active - Monitoring location' : 'Inactive'}
                  </p>
                </div>
                <Badge variant={isTracking ? "default" : "secondary"}>
                  {isTracking ? 'ON' : 'OFF'}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Current Position</p>
                <p className="font-semibold">
                  {lastPosition 
                    ? `${lastPosition.coords.latitude.toFixed(4)}, ${lastPosition.coords.longitude.toFixed(4)}`
                    : 'Not available'
                  }
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Position Accuracy</p>
                <p className="font-semibold">
                  {lastPosition?.coords.accuracy ? `${lastPosition.coords.accuracy.toFixed(0)}m` : 'N/A'}
                </p>
              </div>

              <Button 
                onClick={() => runFeatureTest('location', async () => {
                  // Test is successful if tracking is enabled
                  if (!isTracking) throw new Error('Location tracking not active');
                })}
                className="w-full bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                📍 Verify Location Tracking
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Offline Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              Offline-First Architecture
              {testResults['offline'] && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />}
            </CardTitle>
            <CardDescription>
              Works fully offline with automatic sync
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Network Status</p>
                  <p className="text-sm text-gray-500">
                    {isOnline ? 'Connected' : 'Offline'}
                  </p>
                </div>
                <Badge variant={isOnline ? "default" : "destructive"}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-500">Queued Actions</p>
                <p className="font-semibold">{offlineQueue} pending</p>
              </div>

              <Button 
                onClick={() => runFeatureTest('offline', async () => {
                  queueAction({ type: 'test', data: { test: true } });
                })}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                🔄 Queue Test Action
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions for Apple Reviewers */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="text-blue-700">
              📋 For Apple App Review
            </CardTitle>
            <CardDescription>
              How to test these native features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold text-blue-700">1. Haptic Feedback</p>
              <p className="text-gray-600">Tap any button above - you'll feel tactile responses unique to native apps</p>
            </div>
            <div>
              <p className="font-semibold text-blue-700">2. Native Share</p>
              <p className="text-gray-600">Tap "Share Business" to see the iOS native share sheet (not available in web browsers)</p>
            </div>
            <div>
              <p className="font-semibold text-blue-700">3. Notifications</p>
              <p className="text-gray-600">Tap notification buttons to receive native iOS notifications with app icon and sounds</p>
            </div>
            <div>
              <p className="font-semibold text-blue-700">4. Background Location</p>
              <p className="text-gray-600">Enable location → Background the app → Move around → Receive proximity notifications (only works in native apps)</p>
            </div>
            <div>
              <p className="font-semibold text-blue-700">5. Offline Mode</p>
              <p className="text-gray-600">Turn on Airplane Mode → Queue actions → Disable Airplane Mode → See automatic sync</p>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default NativeFeaturesDemo;