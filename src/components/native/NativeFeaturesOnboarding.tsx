import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCapacitor } from '@/hooks/use-capacitor';
import { useHapticFeedback } from '@/hooks/use-haptic-feedback';
import { useBackgroundLocation } from '@/hooks/use-background-location';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { Geolocation } from '@capacitor/geolocation';
import { 
  Smartphone, 
  MapPin, 
  Bell, 
  Vibrate, 
  Share2, 
  Wifi,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

export const NativeFeaturesOnboarding = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedFeatures, setCompletedFeatures] = useState<string[]>([]);
  const { isNative } = useCapacitor();
  const haptics = useHapticFeedback();
  const { enableBackgroundLocation } = useBackgroundLocation();
  const { showLocalNotification } = usePushNotifications();

  useEffect(() => {
    // Only show for native apps and if not already completed
    if (isNative) {
      const hasCompletedOnboarding = localStorage.getItem('native_onboarding_completed');
      if (!hasCompletedOnboarding) {
        // Show after 2 seconds to let the app load
        setTimeout(() => setIsOpen(true), 2000);
      }
    }
  }, [isNative]);

  const features = [
    {
      id: 'haptics',
      icon: Vibrate,
      title: 'Haptic Feedback',
      description: 'Feel the app respond to your touch with tactile feedback',
      action: async () => {
        await haptics.success();
        await haptics.medium();
        await haptics.light();
        toast.success('Feel that? That\'s native haptic feedback!');
      },
      benefit: 'Makes every interaction feel more responsive and native'
    },
    {
      id: 'location',
      icon: MapPin,
      title: 'Background Location',
      description: 'Get notified about nearby Black-owned businesses even when the app is closed',
      action: async () => {
        try {
          await enableBackgroundLocation();
          const position = await Geolocation.getCurrentPosition();
          toast.success(`Location enabled! Latitude: ${position.coords.latitude.toFixed(2)}`);
          await haptics.success();
        } catch (error) {
          toast.error('Location permission needed for this feature');
        }
      },
      benefit: 'Discover businesses without actively using the app'
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Push Notifications',
      description: 'Receive alerts about new businesses, rewards, and community impact',
      action: async () => {
        await showLocalNotification(
          '🎉 Notifications Enabled!',
          'You\'ll now receive updates about Black-owned businesses near you'
        );
        await haptics.success();
        toast.success('Check your notification center!');
      },
      benefit: 'Stay updated with personalized alerts'
    },
    {
      id: 'share',
      icon: Share2,
      title: 'Native Sharing',
      description: 'Share businesses with friends using your phone\'s native share menu',
      action: async () => {
        toast.success('Native share functionality is available throughout the app!');
        await haptics.light();
      },
      benefit: 'Share seamlessly with any app on your device'
    },
    {
      id: 'offline',
      icon: Wifi,
      title: 'Offline Support',
      description: 'Browse businesses and queue actions even without internet',
      action: async () => {
        toast.success('Your actions automatically sync when you\'re back online!');
        await haptics.light();
      },
      benefit: 'Never lose your progress or data'
    }
  ];

  const currentFeature = features[currentStep];

  const handleFeatureAction = async () => {
    await currentFeature.action();
    setCompletedFeatures([...completedFeatures, currentFeature.id]);
    
    if (currentStep < features.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 1500);
    } else {
      setTimeout(() => {
        localStorage.setItem('native_onboarding_completed', 'true');
        setIsOpen(false);
        toast.success('🎉 Native features activated! Enjoy the full experience.');
      }, 2000);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('native_onboarding_completed', 'true');
    setIsOpen(false);
  };

  if (!isNative || !currentFeature) return null;

  const Icon = currentFeature.icon;
  const progress = ((currentStep + 1) / features.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-primary to-primary-glow rounded-full p-4">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Native Mobile Experience
          </DialogTitle>
          <DialogDescription className="text-center">
            This app goes beyond web browsing with powerful native features
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Current Feature */}
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="relative">
              <div className="bg-primary/10 rounded-full p-6">
                <Icon className="w-12 h-12 text-primary" />
              </div>
              {completedFeatures.includes(currentFeature.id) && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">{currentFeature.title}</h3>
              <p className="text-muted-foreground mb-2">{currentFeature.description}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-primary">
                <Zap className="w-4 h-4" />
                <span className="font-semibold">{currentFeature.benefit}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleFeatureAction}
              className="w-full bg-gradient-to-r from-primary to-primary-glow"
              size="lg"
              disabled={completedFeatures.includes(currentFeature.id)}
            >
              {completedFeatures.includes(currentFeature.id) ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Activated!
                </>
              ) : (
                `Try ${currentFeature.title}`
              )}
            </Button>

            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <button 
                onClick={handleSkip}
                className="hover:underline"
              >
                Skip Setup
              </button>
              <span>
                Step {currentStep + 1} of {features.length}
              </span>
            </div>
          </div>

          {/* Completed Features */}
          {completedFeatures.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">Activated Features:</p>
              <div className="flex flex-wrap gap-2">
                {features
                  .filter(f => completedFeatures.includes(f.id))
                  .map(f => {
                    const FIcon = f.icon;
                    return (
                      <div key={f.id} className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                        <FIcon className="w-3 h-3" />
                        <span>{f.title}</span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
