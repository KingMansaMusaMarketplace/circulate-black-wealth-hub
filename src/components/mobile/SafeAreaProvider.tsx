
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const SafeAreaContext = createContext<SafeAreaInsets>({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const useSafeArea = () => useContext(SafeAreaContext);

interface SafeAreaProviderProps {
  children: React.ReactNode;
}

export const SafeAreaProvider: React.FC<SafeAreaProviderProps> = ({ children }) => {
  const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      // Get CSS environment variables for safe area
      const computedStyle = getComputedStyle(document.documentElement);
      const top = parseInt(computedStyle.getPropertyValue('--safe-area-inset-top').replace('px', '') || '0');
      const bottom = parseInt(computedStyle.getPropertyValue('--safe-area-inset-bottom').replace('px', '') || '0');
      const left = parseInt(computedStyle.getPropertyValue('--safe-area-inset-left').replace('px', '') || '0');
      const right = parseInt(computedStyle.getPropertyValue('--safe-area-inset-right').replace('px', '') || '0');

      setSafeAreaInsets({ top, bottom, left, right });
    };

    updateSafeArea();
    
    // Listen for orientation changes and viewport changes
    const handleResize = () => {
      setTimeout(updateSafeArea, 100); // Small delay to ensure CSS has updated
    };
    
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', updateSafeArea);

    return () => {
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', updateSafeArea);
    };
  }, []);

  return (
    <SafeAreaContext.Provider value={safeAreaInsets}>
      <div 
        className="min-h-screen w-full overflow-x-hidden"
        style={{
          paddingTop: `max(env(safe-area-inset-top), ${safeAreaInsets.top}px)`,
          paddingBottom: `max(env(safe-area-inset-bottom), ${safeAreaInsets.bottom}px)`,
          paddingLeft: `max(env(safe-area-inset-left), ${safeAreaInsets.left}px)`,
          paddingRight: `max(env(safe-area-inset-right), ${safeAreaInsets.right}px)`,
        }}
      >
        {children}
      </div>
    </SafeAreaContext.Provider>
  );
};
