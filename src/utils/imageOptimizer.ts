
// Image optimization utilities
export const generatePlaceholder = (width: number, height: number, text?: string) => {
  const encodedText = encodeURIComponent(text || 'Image');
  return `https://placehold.co/${width}x${height}/e5e7eb/6b7280?text=${encodedText}`;
};

export const preloadCriticalImages = async (imageUrls: string[]): Promise<void> => {
  const promises = imageUrls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Don't fail the whole batch
      img.src = url;
    });
  });

  try {
    await Promise.all(promises);
    console.log('Critical images preloaded');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

export const createImageSrcSet = (baseUrl: string, sizes: number[] = [400, 800, 1200]) => {
  if (baseUrl.includes('placehold.co')) return baseUrl;
  
  const srcSet = sizes.map(size => {
    // For real implementation, you'd modify the URL to request different sizes
    // This is a placeholder for the concept
    return `${baseUrl}?w=${size} ${size}w`;
  }).join(', ');
  
  return srcSet;
};

export const convertToWebP = (imageUrl: string): string => {
  if (imageUrl.includes('placehold.co') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Simple WebP conversion for supported sources
  return imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
};
