
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};

export const preloadCriticalImages = async (imageSrcs: string[]): Promise<void> => {
  try {
    await Promise.all(imageSrcs.map(preloadImage));
    console.log('Critical images preloaded successfully');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

export const preloadFont = (fontUrl: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.type = 'font/woff2';
  link.crossOrigin = 'anonymous';
  link.href = fontUrl;
  document.head.appendChild(link);
};
