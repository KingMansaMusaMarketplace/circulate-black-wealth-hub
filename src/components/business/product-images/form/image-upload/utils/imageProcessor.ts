
// Apply the crop and return a data URL
export const applyCropToImage = (
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  scale = 1,
  rotation = 0
): string | null => {
  if (!image || !crop) return null;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  // Set proper canvas dimensions for the cropped image
  canvas.width = crop.width;
  canvas.height = crop.height;

  // Save the current context state
  ctx.save();
  
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw the image with crop, scale, and rotation
  // When we have rotation, we need to handle it differently
  if (rotation !== 0) {
    // For rotation, we need to adjust the canvas size to fit the rotated image
    const radians = (Math.PI / 180) * rotation;
    
    // Translate to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2);
    
    // Rotate canvas
    ctx.rotate(radians);
    
    // Scale the image
    ctx.scale(scale, scale);
    
    // Draw the image at the center with crop offset
    ctx.drawImage(
      image,
      crop.x / scale,
      crop.y / scale,
      crop.width / scale,
      crop.height / scale,
      -crop.width / (2 * scale),
      -crop.height / (2 * scale),
      crop.width / scale,
      crop.height / scale
    );
  } else {
    // No rotation, simpler drawing
    ctx.scale(scale, scale);
    ctx.drawImage(
      image,
      crop.x / scale,
      crop.y / scale,
      crop.width / scale,
      crop.height / scale,
      0,
      0,
      crop.width / scale,
      crop.height / scale
    );
  }
  
  // Restore the context state
  ctx.restore();

  // Convert the canvas to a data URL
  return canvas.toDataURL('image/jpeg');
};

// Convert a data URL to a File object
export const dataUrlToFile = async (
  dataUrl: string, 
  fileName: string
): Promise<File> => {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type });
};

// Compress an image file
export const compressImage = async (
  file: File,
  fileName: string,
  quality = 0.8
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        // Use the original dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        
        // Get the compressed data URL
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            const compressedFile = new File([blob], fileName, {
              type: blob.type,
            });
            
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = (error) => {
        reject(error);
      };
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
};
