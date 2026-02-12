/**
 * Lightweight Capacitor platform check - separated from capacitor-plugins.ts
 * to avoid dual static+dynamic import warnings in the build.
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
