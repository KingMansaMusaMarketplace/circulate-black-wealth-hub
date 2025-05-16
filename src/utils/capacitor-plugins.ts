
import { SplashScreen } from '@capacitor/splash-screen';

/**
 * Initialize Capacitor plugins and handle native functionality
 */
export async function initializeCapacitorPlugins() {
  try {
    // Hide the splash screen with a fade animation
    await SplashScreen.hide({
      fadeOutDuration: 500
    });
    
    console.log('Capacitor plugins initialized');
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
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
