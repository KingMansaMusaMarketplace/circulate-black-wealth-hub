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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Helmet>
        <title>Native Features Demo | Mansa Musa Marketplace</title>
        <meta name="description" content="Demonstration of native iOS/Android features" />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-mansablue to-blue-700 text-white py-12 shadow-lg">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">📱 Native Features Demo</h1>
          <p className="text-blue-100 text-lg mb-4">
            Testing robust native functionality for App Store compliance
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant={isNative ? "default" : "secondary"} className="text-sm">
              {isNative ? '✅ Native Platform' : '🌐 Web Platform'}
            </Badge>
            <Badge variant="outline" className="text-sm text-white border-white">
              Platform: {platform}
            </Badge>
            <Badge variant="outline" className="text-sm text-white border-white">
              App State: {appState}
            </Badge>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        
        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Environment Information
            </CardTitle>
            <CardDescription>
              Current platform and native capabilities
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
                variant="outline"
              >
                Light Impact
              </Button>
              <Button 
                onClick={() => runFeatureTest('haptics', async () => {
                  await haptics.medium();
                })}
                variant="outline"
              >
                Medium Impact
              </Button>
              <Button 
                onClick={() => runFeatureTest('haptics', async () => {
                  await haptics.heavy();
                })}
                variant="outline"
              >
                Heavy Impact
              </Button>
              <Button 
                onClick={() => runFeatureTest('haptics', async () => {
                  await haptics.success();
                })}
                variant="outline"
              >
                Success
              </Button>
              <Button 
                onClick={() => runFeatureTest('haptics', async () => {
                  await haptics.error();
                })}
                variant="outline"
              >
                Error
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
              >
                Share Business
              </Button>
              <Button 
                onClick={() => runFeatureTest('share', async () => {
                  await shareAppInvite('DEMO123');
                })}
                variant="outline"
              >
                Share App Invite
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
              >
                Welcome Notification
              </Button>
              <Button 
                onClick={() => runFeatureTest('notifications', async () => {
                  sendLoyaltyNotification(100);
                })}
                variant="outline"
              >
                Loyalty Points (+100)
              </Button>
              <Button 
                onClick={() => runFeatureTest('notifications', async () => {
                  showLocalNotification(
                    '🎉 Special Offer!',
                    'Get 20% off at businesses near you today!'
                  );
                })}
                variant="outline"
              >
                Promotional Alert
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
                className="w-full"
              >
                Verify Location Tracking
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
                className="w-full"
              >
                Queue Test Action
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