
// Image optimization utilities
export const preloadCriticalImages = (imageUrls: string[]) => {
  if (typeof window !== 'undefined') {
    imageUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
    
    console.info('Critical images preloaded');
  }
};

export const optimizeImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve as BlobCallback, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Generate placeholder image URL
export const generatePlaceholder = (width: number, height: number, text?: string): string => {
  const encodedText = text ? encodeURIComponent(text) : 'Placeholder';
  return `https://via.placeholder.com/${width}x${height}/cccccc/666666?text=${encodedText}`;
};
