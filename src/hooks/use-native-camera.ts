import { useState } from 'react';
import { Camera, CameraResultType, CameraSource, CameraDirection } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { toast } from 'sonner';
import { useHapticFeedback } from './use-haptic-feedback';

export const useNativeCamera = () => {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const haptics = useHapticFeedback();
  const isNative = Capacitor.isNativePlatform();

  const checkCameraPermission = async () => {
    if (!isNative) return { camera: 'granted' };
    
    try {
      const permissions = await Camera.checkPermissions();
      return permissions;
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      return { camera: 'denied' };
    }
  };

  const requestCameraPermission = async () => {
    if (!isNative) return true;
    
    try {
      const permissions = await Camera.requestPermissions({ permissions: ['camera'] });
      return permissions.camera === 'granted';
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      toast.error('Camera permission denied');
      return false;
    }
  };

  const takePhoto = async (options?: {
    quality?: number;
    allowEditing?: boolean;
    resultType?: CameraResultType;
    source?: CameraSource;
    direction?: CameraDirection;
  }) => {
    setIsTakingPhoto(true);
    haptics.light();

    try {
      // Check and request permissions if needed
      const currentPermissions = await checkCameraPermission();
      if (currentPermissions.camera !== 'granted') {
        const granted = await requestCameraPermission();
        if (!granted) {
          setIsTakingPhoto(false);
          return null;
        }
      }

      // Take the photo
      const photo = await Camera.getPhoto({
        quality: options?.quality ?? 90,
        allowEditing: options?.allowEditing ?? false,
        resultType: options?.resultType ?? CameraResultType.Uri,
        source: options?.source ?? CameraSource.Camera,
        direction: options?.direction ?? CameraDirection.Rear,
      });

      haptics.success();
      return photo;
    } catch (error: any) {
      console.error('Error taking photo:', error);
      
      // Don't show error if user just cancelled
      if (error.message !== 'User cancelled photos app') {
        haptics.error();
        toast.error('Failed to take photo');
      }
      
      return null;
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const pickPhotoFromGallery = async (options?: {
    quality?: number;
    allowEditing?: boolean;
  }) => {
    setIsTakingPhoto(true);
    haptics.light();

    try {
      const photo = await Camera.getPhoto({
        quality: options?.quality ?? 90,
        allowEditing: options?.allowEditing ?? false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      });

      haptics.success();
      return photo;
    } catch (error: any) {
      console.error('Error picking photo:', error);
      
      if (error.message !== 'User cancelled photos app') {
        haptics.error();
        toast.error('Failed to pick photo');
      }
      
      return null;
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const takePhotoForQRScanning = async () => {
    return await takePhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      direction: CameraDirection.Rear,
    });
  };

  return {
    isTakingPhoto,
    isNative,
    takePhoto,
    pickPhotoFromGallery,
    takePhotoForQRScanning,
    checkCameraPermission,
    requestCameraPermission,
  };
};
