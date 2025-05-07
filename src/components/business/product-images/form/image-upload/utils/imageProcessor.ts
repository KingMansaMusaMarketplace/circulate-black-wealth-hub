
/**
 * Utility functions for image processing
 */

/**
 * Compress an image blob to reduce its size
 */
export const compressImage = async (
  blob: Blob, 
  fileName: string,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        // If canvas context is not available, return original blob as file
        resolve(new File([blob], fileName, { type: 'image/jpeg' }));
        URL.revokeObjectURL(img.src);
        return;
      }
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw resized image to canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert canvas to blob with compression
      canvas.toBlob(
        (compressedBlob) => {
          if (compressedBlob) {
            const compressedFile = new File([compressedBlob], fileName, { type: 'image/jpeg' });
            resolve(compressedFile);
          } else {
            // If compression fails, return original blob as file
            resolve(new File([blob], fileName, { type: 'image/jpeg' }));
          }
          URL.revokeObjectURL(img.src);
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      // Handle image loading error
      resolve(new File([blob], fileName, { type: 'image/jpeg' }));
      URL.revokeObjectURL(img.src);
    };
  });
};

/**
 * Apply crop to an image and return the cropped image as a data URL
 */
export const applyCropToImage = (
  imgElement: HTMLImageElement,
  crop: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  scale = 1
): string | null => {
  if (!imgElement) {
    return null;
  }
  
  // Create a canvas to draw the cropped image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return null;
  }
  
  const scaleX = imgElement.naturalWidth / imgElement.width;
  const scaleY = imgElement.naturalHeight / imgElement.height;
  
  // Set canvas size to final desired size
  canvas.width = Math.floor(crop.width * scaleX);
  canvas.height = Math.floor(crop.height * scaleY);
  
  // Apply scale and draw cropped image
  ctx.scale(scale, scale);
  
  ctx.drawImage(
    imgElement,
    crop.x * scaleX / scale,
    crop.y * scaleY / scale,
    crop.width * scaleX / scale,
    crop.height * scaleY / scale,
    0,
    0,
    canvas.width / scale,
    canvas.height / scale
  );
  
  // Get data URL
  return canvas.toDataURL('image/jpeg');
};

/**
 * Create a File object from a data URL
 */
export const dataUrlToFile = async (
  dataUrl: string,
  fileName: string
): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: 'image/jpeg' });
};
