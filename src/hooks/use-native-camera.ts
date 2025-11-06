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
    width?: number;
    height?: number;
    saveToGallery?: boolean;
  }) => {
    setIsTakingPhoto(true);
    haptics.light();

    try {
      console.log('Checking camera permission...');
      // Check and request permissions if needed
      const currentPermissions = await checkCameraPermission();
      console.log('Current camera permissions:', currentPermissions);
      
      if (currentPermissions.camera !== 'granted') {
        console.log('Camera permission not granted, requesting...');
        const granted = await requestCameraPermission();
        if (!granted) {
          console.log('Camera permission denied');
          toast.error('Camera permission is required. Please enable it in Settings > Privacy > Camera.');
          setIsTakingPhoto(false);
          return null;
        }
      }

      console.log('Opening camera with options:', options);
      // Take the photo
      const photo = await Camera.getPhoto({
        quality: options?.quality ?? 90,
        allowEditing: options?.allowEditing ?? false,
        resultType: options?.resultType ?? CameraResultType.Uri,
        source: options?.source ?? CameraSource.Camera,
        direction: options?.direction ?? CameraDirection.Rear,
        correctOrientation: true,
        width: options?.width,
        height: options?.height,
        saveToGallery: options?.saveToGallery ?? false,
      });

      console.log('Photo captured successfully');
      haptics.success();
      return photo;
    } catch (error: any) {
      console.error('Error taking photo:', error);
      
      // Don't show error if user just cancelled
      if (error.message?.includes('User cancelled') || error.message?.includes('cancelled')) {
        console.log('User cancelled photo');
        toast.info('Photo cancelled');
      } else if (error.message?.includes('permission')) {
        toast.error('Camera permission denied. Please enable it in Settings.');
      } else {
        haptics.error();
        toast.error(`Camera error: ${error.message || 'Failed to take photo'}`);
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
