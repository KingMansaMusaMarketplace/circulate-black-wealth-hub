
import { useEffect, useState } from 'react';

interface CapacitorState {
  isCapacitor: boolean;
  platform: 'ios' | 'android' | 'web';
  isNative: boolean;
}

export function useCapacitor(): CapacitorState {
  const [state, setState] = useState<CapacitorState>({
    isCapacitor: false,
    platform: 'web',
    isNative: false,
  });

  useEffect(() => {
    const checkCapacitor = async () => {
      try {
        // Check if we're running in Capacitor
        if (window.Capacitor) {
          const platform = window.Capacitor.getPlatform();
          setState({
            isCapacitor: true,
            platform: platform as 'ios' | 'android' | 'web',
            isNative: platform === 'ios' || platform === 'android',
          });
        }
      } catch (error) {
        console.error('Error detecting Capacitor:', error);
      }
    };

    checkCapacitor();
  }, []);

  return state;
}

// Add type definitions for Capacitor in the window object
declare global {
  interface Window {
    Capacitor?: {
      getPlatform: () => string;
      isNativePlatform: () => boolean;
    };
  }
}
