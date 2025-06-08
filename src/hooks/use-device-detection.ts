
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isCapacitor: boolean;
  screenSize: 'small' | 'medium' | 'large';
  orientation: 'portrait' | 'landscape';
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isCapacitor: false,
    screenSize: 'large',
    orientation: 'portrait',
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      const isMobile = isIOS || isAndroid || window.innerWidth < 768;
      const isCapacitor = !!(window as any).Capacitor;
      
      let screenSize: 'small' | 'medium' | 'large' = 'large';
      if (window.innerWidth < 640) screenSize = 'small';
      else if (window.innerWidth < 1024) screenSize = 'medium';
      
      const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';

      setDeviceInfo({
        isMobile,
        isIOS,
        isAndroid,
        isCapacitor,
        screenSize,
        orientation,
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}
