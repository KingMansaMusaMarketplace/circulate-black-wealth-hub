
import { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export const useCameraDetection = () => {
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Check for camera availability
  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        setHasCamera(devices && devices.length > 0);
      } catch (error) {
        console.error("Error checking camera availability:", error);
        setHasCamera(false);
      }
    };
    
    checkCameraAvailability();
  }, []);

  return { hasCamera, isMobile };
};
