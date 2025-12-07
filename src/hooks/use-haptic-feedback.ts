
// Safe native platform check without importing Capacitor
const isNativePlatform = () => {
  try {
    return typeof window !== 'undefined' && 
           window.Capacitor && 
           typeof window.Capacitor.isNativePlatform === 'function' && 
           window.Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

export const useHapticFeedback = () => {
  const isNative = isNativePlatform();

  const impact = async (style: 'Light' | 'Medium' | 'Heavy' = 'Medium') => {
    if (!isNative) return;
    
    try {
      const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
      const impactStyles = { Light: ImpactStyle.Light, Medium: ImpactStyle.Medium, Heavy: ImpactStyle.Heavy };
      await Haptics.impact({ style: impactStyles[style] });
    } catch (error) {
      console.error('Haptic impact error:', error);
    }
  };

  const notification = async (type: 'Success' | 'Warning' | 'Error' = 'Success') => {
    if (!isNative) return;
    
    try {
      const { Haptics, NotificationType } = await import('@capacitor/haptics');
      const notificationTypes = { Success: NotificationType.Success, Warning: NotificationType.Warning, Error: NotificationType.Error };
      await Haptics.notification({ type: notificationTypes[type] });
    } catch (error) {
      console.error('Haptic notification error:', error);
    }
  };

  const selectionStart = async () => {
    if (!isNative) return;
    
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionStart();
    } catch (error) {
      console.error('Haptic selection start error:', error);
    }
  };

  const selectionChanged = async () => {
    if (!isNative) return;
    
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionChanged();
    } catch (error) {
      console.error('Haptic selection changed error:', error);
    }
  };

  const selectionEnd = async () => {
    if (!isNative) return;
    
    try {
      const { Haptics } = await import('@capacitor/haptics');
      await Haptics.selectionEnd();
    } catch (error) {
      console.error('Haptic selection end error:', error);
    }
  };

  // Predefined feedback patterns for common actions
  const success = () => notification('Success');
  const warning = () => notification('Warning');
  const error = () => notification('Error');
  
  const light = () => impact('Light');
  const medium = () => impact('Medium');
  const heavy = () => impact('Heavy');

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
