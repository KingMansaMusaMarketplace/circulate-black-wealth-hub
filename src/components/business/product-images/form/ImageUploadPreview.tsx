import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, Check, X, ZoomIn, ZoomOut } from "lucide-react";
import { CropIcon } from "lucide-react";
import ReactCrop, { type PercentCrop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface ImageUploadPreviewProps {
  previewUrl: string | null;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  formError?: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  previewUrl,
  onUploadClick,
  fileInputRef,
  formError,
  onFileChange
}) => {
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  
  // For setting initial crop size on image load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (isCropping) {
      const { width, height } = e.currentTarget;
      const initialCrop = centerCrop(
        makeAspectCrop(
          {
            unit: '%',
            width: 90,
          },
          16 / 9,
          width,
          height
        ),
        width,
        height
      );
      setCrop(initialCrop);
    }
  };
  
  // Handle crop completion
  const applyCrop = () => {
    if (imgRef.current && completedCrop && previewUrl) {
      // Create a canvas to draw the cropped image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return;
      }
      
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      // Set canvas size to final desired size
      canvas.width = Math.floor(completedCrop.width * scaleX);
      canvas.height = Math.floor(completedCrop.height * scaleY);
      
      // Apply scale and draw cropped image
      ctx.scale(scale, scale);
      
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX / scale,
        completedCrop.y * scaleY / scale,
        completedCrop.width * scaleX / scale,
        completedCrop.height * scaleY / scale,
        0,
        0,
        canvas.width / scale,
        canvas.height / scale
      );
      
      // Get data URL
      const base64Image = canvas.toDataURL('image/jpeg');
      setCroppedPreviewUrl(base64Image);
      setIsCropping(false);
      setScale(1); // Reset scale after cropping
    }
  };
  
  // Convert data URL to file for submission
  React.useEffect(() => {
    if (croppedPreviewUrl && fileInputRef.current && fileInputRef.current.files?.length) {
      const originalFile = fileInputRef.current.files[0];
      fetch(croppedPreviewUrl)
        .then(res => res.blob())
        .then(blob => {
          // Compress image if it's larger than 1MB
          if (blob.size > 1024 * 1024) {
            compressImage(blob, originalFile.name);
          } else {
            replaceFileInInput(blob, originalFile.name);
          }
        });
    }
  }, [croppedPreviewUrl, fileInputRef]);
  
  // Image compression function
  const compressImage = (blob: Blob, fileName: string) => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Calculate new dimensions while maintaining aspect ratio
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
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
            replaceFileInInput(compressedBlob, fileName);
            URL.revokeObjectURL(img.src);
          }
        },
        'image/jpeg',
        0.8 // compression quality
      );
    };
  };
  
  // Replace file in input
  const replaceFileInInput = (blob: Blob, fileName: string) => {
    const croppedFile = new File([blob], fileName, { type: 'image/jpeg' });
    
    // Create a DataTransfer to set the files property
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(croppedFile);
    
    // Replace the original file with the cropped one
    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
      // Dispatch change event to update the form state
      // Fix Error #1: Create event with proper type and arguments
      const event = new CustomEvent('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };
  
  // Start cropping mode
  const startCropping = () => {
    setIsCropping(true);
    setCroppedPreviewUrl(null);
    setScale(1); // Reset scale when starting to crop
  };
  
  // Cancel cropping
  const cancelCropping = () => {
    setIsCropping(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
    setScale(1); // Reset scale after canceling
  };

  // Zoom in/out functions
  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.1, 3));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.5));
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (validImageTypes.includes(file.type)) {
        // Create a new DataTransfer object to set the file in the input
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
          // Trigger the onChange handler with a synthetic event
          // Fix Error #1: Create event with proper type and arguments
          const event = new CustomEvent('change', { bubbles: true });
          fileInputRef.current.dispatchEvent(event);
        }
      }
    }
  };
  
  const displayUrl = croppedPreviewUrl || previewUrl;
  
  return (
    <div className="border rounded-lg p-4 transition-all duration-300">
      {displayUrl ? (
        <div className="flex flex-col space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
            {isCropping ? (
              <div className="flex flex-col w-full">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => {
                    // Fix Error #3: Store the pixel crop for actual cropping operations
                    // without type conversion - keep it as PixelCrop
                    setCompletedCrop(c);
                  }}
                  aspect={16 / 9}
                  className="max-h-[400px] transition-transform"
                >
                  <img 
                    ref={imgRef}
                    src={previewUrl!} 
                    alt="Preview for cropping" 
                    onLoad={onImageLoad}
                    className="max-h-[400px] object-contain transition-transform duration-300"
                    style={{ transform: `scale(${scale})` }}
                  />
                </ReactCrop>
                
                <div className="mt-2 flex items-center justify-between px-4">
                  <Button 
                    type="button" 
                    size="icon" 
                    variant="outline" 
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  
                  <Slider 
                    className="w-full mx-4"
                    value={[scale * 10]} 
                    min={5} 
                    max={30} 
                    step={1}
                    onValueChange={(value) => setScale(value[0] / 10)}
                    aria-label="Zoom level"
                  />
                  
                  <Button 
                    type="button" 
                    size="icon"
                    variant="outline" 
                    onClick={zoomIn}
                    disabled={scale >= 3}
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <img 
                src={displayUrl} 
                alt="Product image preview" 
                className="max-h-[400px] object-contain transition-all duration-300 hover:scale-[1.02]"
              />
            )}
          </div>
          
          {isCropping ? (
            <div className="flex justify-end space-x-2 animate-fade-in">
              <Button 
                type="button" 
                variant="outline"
                onClick={cancelCropping}
                aria-label="Cancel cropping"
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button 
                type="button" 
                onClick={applyCrop}
                aria-label="Apply crop"
                className="transition-all duration-200 hover:bg-primary/90"
              >
                <Check className="mr-2 h-4 w-4" /> Apply Crop
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2 animate-fade-in">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onUploadClick}
                className="flex-1 transition-all duration-200 hover:border-primary"
                aria-label="Change image"
              >
                <Upload className="mr-2 h-4 w-4" /> Change Image
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={startCropping}
                className="transition-all duration-200 hover:border-primary"
                aria-label="Crop image"
              >
                <CropIcon className="mr-2 h-4 w-4" /> Crop
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300",
            "hover:bg-gray-50",
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          )}
          onClick={onUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label="Drop zone for image upload"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onUploadClick();
            }
          }}
        >
          <Image className="h-12 w-12 text-gray-300 mb-3 animate-pulse" />
          <p className="text-gray-500 mb-2">
            {isDragging ? "Drop image to upload" : "Click or drag to upload a product image"}
          </p>
          <p className="text-xs text-gray-400 mb-4">PNG, JPG, WEBP up to 5MB</p>
          <Button 
            type="button" 
            variant="outline"
            className="group transition-all duration-200 hover:bg-primary hover:text-white"
            aria-label="Select image file"
          >
            <Upload className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" /> Select Image
          </Button>
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden" 
        accept="image/*" 
        aria-label="Upload image"
      />
      
      {formError && (
        <p className="text-sm font-medium text-destructive mt-2" aria-live="assertive">
          {formError}
        </p>
      )}
    </div>
  );
};

export default ImageUploadPreview;
