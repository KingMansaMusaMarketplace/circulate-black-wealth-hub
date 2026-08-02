
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mansamusamarketplace.app',
  appName: '1325.AI',
  webDir: 'dist',
  // BUNDLED MODE: the app ships a full copy of the site inside the binary, so it
  // opens instantly and never shows a blank screen when the network is slow or
  // offline. Live data (Supabase, Stripe, AI) still comes from the internet.
  server: {
    errorPath: 'native-load-error.html',
    allowNavigation: [
      '1325.ai',
      '*.1325.ai',
      'www.1325.ai',
      '*.supabase.co',
      '*.stripe.com',
      'accounts.google.com',
      '*.googleapis.com',
      '*.lovable.app'
    ],
    cleartext: false,
    androidScheme: 'https',
    iosScheme: 'capacitor'
  },

  plugins: {
    SplashScreen: {
      // Keep splash visible while the remote 1325.ai site loads in WKWebView.
      // Safety net: auto-hide after 8s so a slow/blocked network can never
      // leave the user staring at a frozen splash or a black screen forever.
      launchShowDuration: 8000,
      launchAutoHide: true,
      launchFadeOutDuration: 400,
      launchFadeOutDuration: 400,
      backgroundColor: "#FFFFFF",
      showSpinner: true,
      spinnerColor: "#FFB300",
      androidSplashResourceName: "splash",
      iosSpinnerStyle: "large",
    },
    Geolocation: {
      androidPermissions: [
        'android.permission.ACCESS_COARSE_LOCATION', 
        'android.permission.ACCESS_FINE_LOCATION'
      ],
      iosUsageDescription: "We need your location to show you businesses nearby and process QR code scans"
    },
    Camera: {
      iosUsageDescription: "This app needs access to camera to scan QR codes for loyalty rewards",
      androidPermissions: [
        'android.permission.CAMERA',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE'
      ]
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#000000'
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    LocalNotifications: {
      iconColor: "#F5A623"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  ios: {
    contentInset: "always",
    scheme: "App",
    backgroundColor: "#FFFFFF",
    preferredContentMode: "mobile",
    statusBarStyle: "dark",
    preferredStatusBarStyle: "darkContent",
    // Allow external subresources (Supabase, fonts, maps) in WKWebView
    limitsNavigationsToAppBoundDomains: false,
    handleApplicationNotifications: true,
    allowsLinkPreview: false,
    overrideUserInterfaceStyle: "light",
    scrollEnabled: true,
    webViewAllowsBackForwardNavigationGestures: true,
    minSwipeDistance: 60,
    cordovaSwiftVersion: "5.0",
    plistValues: {
      "ITSAppUsesNonExemptEncryption": false,
      "GKGameCenterFoundationEnabled": true
    }
  },
  android: {
    backgroundColor: "#000000",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    useLegacyBridge: false,
    hideLogs: true
  }
};

export default config;
