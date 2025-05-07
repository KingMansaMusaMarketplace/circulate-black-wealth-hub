
interface ImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: string;
}

export function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: { x: number; y: number; width: number; height: number },
  scale = 1,
  rotate = 0,
  options: ImageOptions = {}
): Promise<void> {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // devicePixelRatio slightly increases sharpness on retina displays
  // at the expense of slightly more memory usage.
  const pixelRatio = window.devicePixelRatio || 1;

  // Base canvas width/height (before rotation)
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  // Apply maximum dimensions if provided
  if (options.maxWidth && canvas.width > options.maxWidth) {
    const ratio = options.maxWidth / canvas.width;
    canvas.width = options.maxWidth;
    canvas.height *= ratio;
  }
  if (options.maxHeight && canvas.height > options.maxHeight) {
    const ratio = options.maxHeight / canvas.height;
    canvas.height = options.maxHeight;
    canvas.width *= ratio;
  }

  // Set canvas CSS width/height to the original dimensions
  canvas.style.width = `${crop.width}px`;
  canvas.style.height = `${crop.height}px`;

  // Set render context to use desired quality and pixel density
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';
  ctx.imageSmoothingEnabled = true;

  // Translate canvas context to center point, scale, rotate, and translate back
  const centerX = canvas.width / 2 / pixelRatio;
  const centerY = canvas.height / 2 / pixelRatio;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((rotate * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.translate(-centerX, -centerY);

  // Draw the cropped image on the canvas
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  ctx.restore();

  return Promise.resolve();
}

export async function blobToFile(blob: Blob, fileName: string): Promise<File> {
  return new File([blob], fileName, { type: blob.type });
}

export async function getCroppedImage(
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  scale = 1,
  rotate = 0,
  fileName = 'cropped-image.jpg',
  options: ImageOptions = {}
): Promise<File | null> {
  if (!crop || !image) return null;

  const canvas = document.createElement('canvas');
  await canvasPreview(image, canvas, crop, scale, rotate, options);

  // Convert the canvas to a blob
  return new Promise<File>((resolve, reject) => {
    const quality = options.quality ? options.quality / 100 : 0.92; // Default to 92% quality
    const mimeType = options.mimeType || 'image/jpeg';
    
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blobToFile(blob, fileName).then(resolve).catch(reject);
      },
      mimeType,
      quality
    );
  });
}

export async function generateImageThumbnail(
  file: File, 
  maxWidth = 200, 
  maxHeight = 200, 
  quality = 80
): Promise<File | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(null);
              return;
            }
            const newFile = new File([blob], `thumbnail-${file.name}`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(newFile);
          },
          'image/jpeg',
          quality / 100
        );
      };
    };
    reader.onerror = () => resolve(null);
  });
}
