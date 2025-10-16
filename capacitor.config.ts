
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mansamusamarketplace.app',
  appName: 'Mansa Musa Marketplace',
  webDir: 'dist',
  // PRODUCTION BUILD: Server config removed - app loads from local dist folder
  // For development/testing only, you can uncomment the server config below:
  // server: {
  //   url: 'https://www.mansamusamarketplace.com',
  //   cleartext: false
  // },
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
