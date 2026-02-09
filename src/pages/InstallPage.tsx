/**
 * @fileoverview PWA Install Prompt Page
 * 
 * Provides instructions for installing the app on mobile devices
 * and handles the install prompt for supported browsers.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Smartphone, 
  Share, 
  PlusSquare, 
  Chrome,
  Apple,
  CheckCircle,
  Wifi,
  Bell,
  Zap
} from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPage: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsAndroid(/android/.test(ua));
    
    // Check if already installed (standalone mode)
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isStandalone) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-green-800">App Installed!</CardTitle>
            <CardDescription className="text-green-700">
              You're already using the installed version of Mansa Musa Marketplace
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-8">
        <img 
          src="/app-icon-source.png" 
          alt="Mansa Musa Marketplace" 
          className="w-24 h-24 mx-auto mb-4 rounded-2xl shadow-lg"
        />
        <h1 className="text-3xl font-bold mb-2">Install Mansa Musa</h1>
        <p className="text-muted-foreground">
          Get the full app experience with offline access, push notifications, and more
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 bg-muted rounded-lg">
          <Wifi className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-sm font-medium">Offline Access</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <Bell className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-sm font-medium">Notifications</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <Zap className="h-6 w-6 mx-auto mb-2 text-primary" />
          <p className="text-sm font-medium">Faster Loading</p>
        </div>
      </div>

      {/* Install button for Chrome/Edge */}
      {deferredPrompt && (
        <Card className="mb-6 border-primary">
          <CardContent className="pt-6">
            <Button 
              onClick={handleInstallClick} 
              className="w-full"
              size="lg"
            >
              <Download className="h-5 w-5 mr-2" />
              Install App Now
            </Button>
          </CardContent>
        </Card>
      )}

      {isInstalled && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
            <p className="font-medium text-green-800">App installed successfully!</p>
            <p className="text-sm text-green-700">Check your home screen</p>
          </CardContent>
        </Card>
      )}

      {/* iOS Instructions */}
      {isIOS && !deferredPrompt && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Install on iPhone/iPad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Tap the Share button</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  Look for <Share className="h-4 w-4 inline" /> at the bottom of Safari
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Scroll and tap "Add to Home Screen"</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <PlusSquare className="h-4 w-4 inline" /> Add to Home Screen
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Tap "Add" to confirm</p>
                <p className="text-sm text-muted-foreground">
                  The app icon will appear on your home screen
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Android Instructions */}
      {isAndroid && !deferredPrompt && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Install on Android
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <div>
                <p className="font-medium">Tap the menu button</p>
                <p className="text-sm text-muted-foreground">
                  Look for ⋮ (three dots) in Chrome's toolbar
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <div>
                <p className="font-medium">Tap "Install app" or "Add to Home screen"</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Smartphone className="h-4 w-4 inline" /> Install app
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <div>
                <p className="font-medium">Confirm the installation</p>
                <p className="text-sm text-muted-foreground">
                  The app will be added to your home screen
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Desktop Instructions */}
      {!isIOS && !isAndroid && !deferredPrompt && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Install on Desktop
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Look for the install icon in your browser's address bar, or access this page from a mobile device for the best experience.
            </p>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Download className="h-5 w-5 text-primary" />
              <span className="text-sm">
                Click the install icon in the address bar →
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstallPage;
