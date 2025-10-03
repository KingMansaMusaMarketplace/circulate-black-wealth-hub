import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

export const useHapticFeedback = () => {
  const isNative = Capacitor.isNativePlatform();

  const impact = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (!isNative) return;
    
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.error('Haptic impact error:', error);
    }
  };

  const notification = async (type: NotificationType = NotificationType.Success) => {
    if (!isNative) return;
    
    try {
      await Haptics.notification({ type });
    } catch (error) {
      console.error('Haptic notification error:', error);
    }
  };

  const selectionStart = async () => {
    if (!isNative) return;
    
    try {
      await Haptics.selectionStart();
    } catch (error) {
      console.error('Haptic selection start error:', error);
    }
  };

  const selectionChanged = async () => {
    if (!isNative) return;
    
    try {
      await Haptics.selectionChanged();
    } catch (error) {
      console.error('Haptic selection changed error:', error);
    }
  };

  const selectionEnd = async () => {
    if (!isNative) return;
    
    try {
      await Haptics.selectionEnd();
    } catch (error) {
      console.error('Haptic selection end error:', error);
    }
  };

  // Predefined feedback patterns for common actions
  const success = () => notification(NotificationType.Success);
  const warning = () => notification(NotificationType.Warning);
  const error = () => notification(NotificationType.Error);
  
  const light = () => impact(ImpactStyle.Light);
  const medium = () => impact(ImpactStyle.Medium);
  const heavy = () => impact(ImpactStyle.Heavy);

  return {
    impact,
    notification,
    selectionStart,
    selectionChanged,
    selectionEnd,
    success,
    warning,
    error,
    light,
    medium,
    heavy,
    isNative
  };
};
