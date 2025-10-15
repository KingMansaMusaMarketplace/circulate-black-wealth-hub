
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.obamaenergy.wealthhub',
  appName: 'Mansa Musa Marketplace',
  webDir: 'dist',
  // IMPORTANT: For App Store production builds, remove the server configuration
  // The app should load from local dist folder, not external URL
  // For iOS simulator, loading locally is more stable than hot-reload
  // Uncomment the server config below ONLY if you need hot-reload (can be unstable)
  /*
  server: {
    url: 'https://e4235560-3b6b-4780-b91c-854366c7682f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  */
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1B365D",
      showSpinner: true,
      spinnerColor: "#F5A623",
      androidSplashResourceName: "splash",
      iosSpinnerStyle: "small",
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
      style: 'DARK',
      backgroundColor: '#1B365D'
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
    backgroundColor: "#1B365D",
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
    backgroundColor: "#1B365D",
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    useLegacyBridge: false,
    hideLogs: true
  }
};

export default config;
