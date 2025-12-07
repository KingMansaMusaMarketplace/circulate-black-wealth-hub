
/**
 * Initialize Capacitor plugins and handle native functionality
 * All Capacitor imports are lazy-loaded to prevent blocking on web
 */

// Safe check for native platform without importing Capacitor
const isNative = () => {
  try {
    return typeof window !== 'undefined' && 
           window.Capacitor && 
           typeof window.Capacitor.isNativePlatform === 'function' && 
           window.Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

export async function initializeCapacitorPlugins() {
  try {
    // Only interact with Capacitor if we're in a native environment
    if (isNative()) {
      console.log('Capacitor detected - splash will be hidden when app is ready');

      // Safety fallback: ensure splash never gets stuck on iPad/iOS
      setTimeout(async () => {
        try {
          const { SplashScreen } = await import('@capacitor/splash-screen');
          await SplashScreen.hide({ fadeOutDuration: 500 });
          console.log('Safety: Splash screen auto-hidden after 5 second timeout');
        } catch (e) {
          console.error('Error in safety splash hide:', e);
        }
      }, 5000);
    }
    
    console.log('Capacitor plugins initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Capacitor plugins:', error);
    return false;
  }
}

/**
 * Hide the splash screen - call this when React is fully ready
 */
export async function hideSplashScreen() {
  try {
    if (isNative()) {
      const { SplashScreen } = await import('@capacitor/splash-screen');
      await SplashScreen.hide({ fadeOutDuration: 500 });
      console.log('Splash screen hidden successfully');
    }
  } catch (error) {
    console.error('Error hiding splash screen:', error);
  }
}

/**
 * Check if the app is running within a Capacitor container
 */
export function isCapacitorPlatform(): boolean {
  try {
    const cap = window?.Capacitor as any;
    return !!(
      (cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) ||
      (cap && typeof cap.getPlatform === 'function' && (cap.getPlatform() === 'ios' || cap.getPlatform() === 'android')) ||
      (typeof window !== 'undefined' && (window.location.protocol.startsWith('capacitor') || window.location.protocol.startsWith('app')))
    );
  } catch {
    return false;
  }
}

/**
 * Get the current platform (ios, android, or web)
 */
export function getCapacitorPlatform(): 'ios' | 'android' | 'web' {
  try {
    if (window?.Capacitor) {
      const platform = window.Capacitor.getPlatform();
      return platform as 'ios' | 'android' | 'web';
    }
  } catch {
    // Ignore errors
  }
  return 'web';
}
