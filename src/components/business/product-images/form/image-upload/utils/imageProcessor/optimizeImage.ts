
import { ProcessedImage } from './types';

export const optimizeImage = async (file: File, quality: number = 92, maxWidth: number = 1200): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        const originalSize = file.size;
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        // For iPad/mobile, reduce processing load with smaller dimensions
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const effectiveMaxWidth = isMobile ? 1000 : maxWidth;
        
        if (width > effectiveMaxWidth) {
          const ratio = effectiveMaxWidth / width;
          width = effectiveMaxWidth;
          height = Math.round(height * ratio);
        }
        
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d', { 
          alpha: false, // Disable alpha for better performance
          willReadFrequently: false 
        });
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Improve rendering quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Use JPEG for faster processing on mobile, WebP for web
        const outputFormat = isMobile ? 'image/jpeg' : 'image/webp';
        const adjustedQuality = isMobile ? Math.max(quality - 10, 75) : quality;
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create image blob'));
              return;
            }
            
            const compressedSize = blob.size;
            const url = URL.createObjectURL(blob);
            
            // Create a new file from the blob
            const optimizedFile = new File([blob], file.name, {
              type: outputFormat,
              lastModified: Date.now()
            });
            
            resolve({
              file: optimizedFile,
              url,
              originalSize,
              compressedSize,
              width,
              height
            });
          },
          outputFormat,
          adjustedQuality / 100
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};
