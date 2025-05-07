
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image, Check, X } from "lucide-react";
import { CropIcon } from "lucide-react";
import ReactCrop, { type Crop as ReactCropType, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

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
  const [crop, setCrop] = useState<ReactCropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  
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
      
      // Draw cropped image
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
      
      // Get data URL
      const base64Image = canvas.toDataURL('image/jpeg');
      setCroppedPreviewUrl(base64Image);
      setIsCropping(false);
    }
  };
  
  // Convert data URL to file for submission
  React.useEffect(() => {
    if (croppedPreviewUrl && fileInputRef.current && fileInputRef.current.files?.length) {
      const originalFile = fileInputRef.current.files[0];
      fetch(croppedPreviewUrl)
        .then(res => res.blob())
        .then(blob => {
          const croppedFile = new File([blob], originalFile.name, { type: 'image/jpeg' });
          
          // Create a DataTransfer to set the files property
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(croppedFile);
          
          // Replace the original file with the cropped one
          if (fileInputRef.current) {
            fileInputRef.current.files = dataTransfer.files;
            // Dispatch change event to update the form state
            const event = new Event('change', { bubbles: true });
            fileInputRef.current.dispatchEvent(event);
          }
        });
    }
  }, [croppedPreviewUrl, fileInputRef]);
  
  // Start cropping mode
  const startCropping = () => {
    setIsCropping(true);
    setCroppedPreviewUrl(null);
  };
  
  // Cancel cropping
  const cancelCropping = () => {
    setIsCropping(false);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };
  
  const displayUrl = croppedPreviewUrl || previewUrl;
  
  return (
    <div className="border rounded-lg p-4">
      {displayUrl ? (
        <div className="flex flex-col space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
            {isCropping ? (
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={16 / 9}
                className="max-h-[400px]"
              >
                <img 
                  ref={imgRef}
                  src={previewUrl!} 
                  alt="Preview for cropping" 
                  onLoad={onImageLoad}
                  className="max-h-[400px] object-contain"
                />
              </ReactCrop>
            ) : (
              <img 
                src={displayUrl} 
                alt="Preview" 
                className="max-h-[400px] object-contain transition-all duration-300"
              />
            )}
          </div>
          
          {isCropping ? (
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline"
                onClick={cancelCropping}
              >
                <X className="mr-2 h-4 w-4" /> Cancel
              </Button>
              <Button 
                type="button" 
                onClick={applyCrop}
              >
                <Check className="mr-2 h-4 w-4" /> Apply Crop
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onUploadClick}
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" /> Change Image
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={startCropping}
              >
                <CropIcon className="mr-2 h-4 w-4" /> Crop
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div 
          className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          onClick={onUploadClick}
        >
          <Image className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 mb-2">Click to upload a product image</p>
          <p className="text-xs text-gray-400 mb-4">PNG, JPG, WEBP up to 5MB</p>
          <Button 
            type="button" 
            variant="outline"
            className="group transition-all duration-200 hover:bg-primary hover:text-white"
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
        <p className="text-sm font-medium text-destructive mt-2">
          {formError}
        </p>
      )}
    </div>
  );
};

export default ImageUploadPreview;
