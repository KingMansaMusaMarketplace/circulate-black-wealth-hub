
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Initialize Capacitor plugins and handle native functionality
 */
export async function initializeCapacitorPlugins() {
  try {
    // Only interact with Capacitor if we're in a native environment
    if (window?.Capacitor?.isNativePlatform()) {
      // Wait a bit longer before hiding splash to ensure content is ready
      // This prevents blank page issues on slower devices like iPad
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Hide the splash screen with a smooth fade animation
      await SplashScreen.hide({
        fadeOutDuration: 500
      });
      console.log('Splash screen hidden successfully');
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
