import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ScreenshotModeContextType {
  isScreenshotMode: boolean;
  enableScreenshotMode: () => void;
  disableScreenshotMode: () => void;
}

const ScreenshotModeContext = createContext<ScreenshotModeContextType>({
  isScreenshotMode: false,
  enableScreenshotMode: () => {},
  disableScreenshotMode: () => {},
});

export const useScreenshotMode = () => useContext(ScreenshotModeContext);

export const ScreenshotModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  useEffect(() => {
    // Check URL parameter
    const screenshotParam = searchParams.get('screenshot');
    if (screenshotParam === 'true') {
      setIsScreenshotMode(true);
    }
  }, [searchParams]);

  const enableScreenshotMode = () => {
    setIsScreenshotMode(true);
    setSearchParams({ screenshot: 'true' });
  };

  const disableScreenshotMode = () => {
    setIsScreenshotMode(false);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('screenshot');
    setSearchParams(newParams);
  };

  return (
    <ScreenshotModeContext.Provider value={{ isScreenshotMode, enableScreenshotMode, disableScreenshotMode }}>
      {children}
    </ScreenshotModeContext.Provider>
  );
};
