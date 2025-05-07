
export interface ProcessedImage {
  file: File;
  url: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

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
        
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = Math.round(height * ratio);
        }
        
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP for better compression
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
              type: 'image/webp',
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
          'image/webp',
          quality / 100
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

export const applyImageCrop = async (
  sourceFile: File, 
  crop: any, 
  scale: number = 1,
  rotation: number = 0,
  quality: number = 92
): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error('Failed to read file'));
        return;
      }
      
      const img = new Image();
      img.onload = () => {
        const originalSize = sourceFile.size;
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Calculate the exact crop dimensions
        const scaleX = img.width / crop.width;
        const scaleY = img.height / crop.height;
        
        const pixelCrop = {
          x: crop.x * scaleX,
          y: crop.y * scaleY,
          width: crop.width * scaleX,
          height: crop.height * scaleY,
        };
        
        // Set canvas dimensions to the cropped size
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        
        // First save the context state
        ctx.save();
        
        // Move to the center of the canvas
        ctx.translate(canvas.width/2, canvas.height/2);
        
        // Rotate the canvas
        if (rotation) {
          ctx.rotate((rotation * Math.PI) / 180);
        }
        
        // Apply scaling
        if (scale !== 1) {
          ctx.scale(scale, scale);
        }
        
        // Draw the image, centering it on the canvas
        ctx.drawImage(
          img,
          pixelCrop.x - (canvas.width / 2 / scale),
          pixelCrop.y - (canvas.height / 2 / scale),
          img.width,
          img.height
        );
        
        // Restore the context state
        ctx.restore();
        
        // Convert to webp for better compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create image blob'));
              return;
            }
            
            const compressedSize = blob.size;
            const url = URL.createObjectURL(blob);
            
            // Create a new file from the blob
            const optimizedFile = new File([blob], sourceFile.name, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            
            resolve({
              file: optimizedFile,
              url,
              originalSize,
              compressedSize,
              width: canvas.width,
              height: canvas.height
            });
          },
          'image/webp',
          quality / 100
        );
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = event.target.result as string;
    };
    
    reader.readAsDataURL(sourceFile);
  });
};

export const getBlobFromCanvas = (canvas: HTMLCanvasElement, fileType: string = 'image/webp', quality: number = 0.92): Promise<Blob> => {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob as Blob);
    }, fileType, quality);
  });
};
