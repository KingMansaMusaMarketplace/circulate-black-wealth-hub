// Image optimization utilities

// Generate a low-quality placeholder for progressive loading
export const generatePlaceholder = (width: number, height: number, text?: string) => {
  const encodedText = encodeURIComponent(text || 'Image');
  return `https://placehold.co/${width}x${height}/e5e7eb/6b7280?text=${encodedText}`;
};

// Generate a tiny blur placeholder (data URL)
export const generateBlurPlaceholder = (width = 10, height = 10): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
    <filter id="b" color-interpolation-filters="sRGB">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
    <rect width="100%" height="100%" fill="#1e3a5f" filter="url(#b)"/>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const preloadCriticalImages = async (imageUrls: string[]): Promise<void> => {
  const promises = imageUrls.map(url => {
    return new Promise<void>((resolve) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      link.onload = () => resolve();
      link.onerror = () => resolve(); // Don't fail the whole batch
      document.head.appendChild(link);
    });
  });

  try {
    await Promise.all(promises);
    console.log('[IMAGE] Critical images preloaded');
  } catch (error) {
    console.warn('[IMAGE] Some images failed to preload:', error);
  }
};

// Generate responsive srcset for images
export const createImageSrcSet = (baseUrl: string, sizes: number[] = [400, 800, 1200]): string => {
  if (baseUrl.includes('placehold.co') || baseUrl.startsWith('data:')) return baseUrl;
  
  // For Supabase storage URLs, add width parameter
  if (baseUrl.includes('supabase.co/storage')) {
    return sizes.map(size => `${baseUrl}?width=${size} ${size}w`).join(', ');
  }
  
  // For lovable-uploads, return as-is (CDN handles optimization)
  return baseUrl;
};

// Generate sizes attribute for responsive images
export const generateSizesAttr = (breakpoints: { [key: string]: string } = {}): string => {
  const defaults = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    '': '33vw'
  };
  
  const merged = { ...defaults, ...breakpoints };
  return Object.entries(merged)
    .map(([media, size]) => media ? `${media} ${size}` : size)
    .join(', ');
};

export const convertToWebP = (imageUrl: string): string => {
  if (imageUrl.includes('placehold.co') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // Simple WebP conversion for supported sources
  return imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
};

// Intersection observer-based image prefetch
export const prefetchImagesOnIdle = (imageUrls: string[]): void => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    });
  } else {
    // Fallback for Safari
    setTimeout(() => {
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    }, 2000);
  }
};
