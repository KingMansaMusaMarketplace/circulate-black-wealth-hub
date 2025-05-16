
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.circulateblackwealthhub',
  appName: 'Mansa Musa Marketplace',
  webDir: 'dist',
  server: {
    url: 'https://e4235560-3b6b-4780-b91c-854366c7682f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: true,
      spinnerColor: "#F5A623",
      androidSplashResourceName: "splash"
    }
  }
};

export default config;
