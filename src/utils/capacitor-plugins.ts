
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Initialize Capacitor plugins and handle native functionality
 */
export async function initializeCapacitorPlugins() {
  try {
    // Only interact with Capacitor if we're in a native environment
    if (window?.Capacitor?.isNativePlatform()) {
      // DON'T hide splash screen here - let React tell us when it's ready
      // This prevents blank page issues on iPad and slower devices
      console.log('Capacitor detected - splash will be hidden when app is ready');

      // Safety fallback: ensure splash never gets stuck on iPad/iOS
      setTimeout(async () => {
        try {
          await SplashScreen.hide({ fadeOutDuration: 500 });
          console.log('Safety: Splash screen auto-hidden after timeout');
        } catch (e) {
          // ignore
        }
      }, 3000);
    }
    
    console.log('Capacitor plugins initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
    // Don't throw error - allow app to continue even if splash screen fails
    return false;
  }
}

/**
 * Hide the splash screen - call this when React is fully ready
 */
export async function hideSplashScreen() {
  try {
    if (window?.Capacitor?.isNativePlatform()) {
      // Hide the splash screen with a smooth fade animation
      await SplashScreen.hide({
        fadeOutDuration: 500
      });
      console.log('Splash screen hidden successfully');
    }
  } catch (error) {
    console.error('Error hiding splash screen:', error);
    // Don't throw - app should continue even if splash screen fails
  }
}

/**
 * Check if the app is running within a Capacitor container
 */
export function isCapacitorPlatform(): boolean {
  return window?.Capacitor?.isNativePlatform() || false;
}

/**
 * Get the current platform (ios, android, or web)
 */
export function getCapacitorPlatform(): 'ios' | 'android' | 'web' {
  if (window?.Capacitor) {
    const platform = window.Capacitor.getPlatform();
    return platform as 'ios' | 'android' | 'web';
  }
  return 'web';
}
