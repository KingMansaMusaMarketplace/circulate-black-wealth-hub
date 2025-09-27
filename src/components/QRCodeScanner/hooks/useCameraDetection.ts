
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

  // Check for camera availability with proper permission handling
  useEffect(() => {
    const checkCameraAvailability = async () => {
      try {
        // First check if camera permission is already granted
        if (navigator.permissions) {
          try {
            const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
            if (permission.state === 'denied') {
              setHasCamera(false);
              return;
            }
          } catch (permError) {
            console.log("Permission API not supported, proceeding with camera detection");
          }
        }

        // Try to get camera list
        const devices = await Html5Qrcode.getCameras();
        setHasCamera(devices && devices.length > 0);
      } catch (error) {
        console.error("Error checking camera availability:", error);
        
        // Try to request camera permission explicitly for mobile devices
        if (isMobile) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
              video: { facingMode: 'environment' } 
            });
            // If we get here, camera is available
            setHasCamera(true);
            // Stop the stream immediately
            stream.getTracks().forEach(track => track.stop());
          } catch (permError) {
            console.error("Camera permission denied:", permError);
            setHasCamera(false);
          }
        } else {
          setHasCamera(false);
        }
      }
    };
    
    checkCameraAvailability();
  }, [isMobile]);

  return { hasCamera, isMobile };
};
