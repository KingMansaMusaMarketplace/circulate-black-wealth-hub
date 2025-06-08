
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
      const top = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-top') || '0');
      const bottom = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-bottom') || '0');
      const left = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-left') || '0');
      const right = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-right') || '0');

      setSafeAreaInsets({ top, bottom, left, right });
    };

    updateSafeArea();
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', updateSafeArea);
    window.addEventListener('resize', updateSafeArea);

    return () => {
      window.removeEventListener('orientationchange', updateSafeArea);
      window.removeEventListener('resize', updateSafeArea);
    };
  }, []);

  return (
    <SafeAreaContext.Provider value={safeAreaInsets}>
      <div 
        style={{
          paddingTop: `env(safe-area-inset-top, ${safeAreaInsets.top}px)`,
          paddingBottom: `env(safe-area-inset-bottom, ${safeAreaInsets.bottom}px)`,
          paddingLeft: `env(safe-area-inset-left, ${safeAreaInsets.left}px)`,
          paddingRight: `env(safe-area-inset-right, ${safeAreaInsets.right}px)`,
        }}
        className="min-h-screen"
      >
        {children}
      </div>
    </SafeAreaContext.Provider>
  );
};
