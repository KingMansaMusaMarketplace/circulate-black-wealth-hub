
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Image } from "lucide-react";

interface ImageUploadPreviewProps {
  previewUrl: string | null;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  formError?: string;
}

const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({
  previewUrl,
  onUploadClick,
  fileInputRef,
  formError
}) => {
  return (
    <div className="border rounded-lg p-4">
      {previewUrl ? (
        <div className="flex flex-col space-y-4">
          <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-h-[200px] object-contain"
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onUploadClick}
          >
            <Upload className="mr-2 h-4 w-4" /> Change Image
          </Button>
        </div>
      ) : (
        <div 
          className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
          onClick={onUploadClick}
        >
          <Image className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 mb-2">Click to upload a product image</p>
          <p className="text-xs text-gray-400 mb-4">PNG, JPG, WEBP up to 5MB</p>
          <Button 
            type="button" 
            variant="outline"
          >
            <Upload className="mr-2 h-4 w-4" /> Select Image
          </Button>
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={(e) => {
          // This is handled in the parent component
        }} 
        className="hidden" 
        accept="image/*" 
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
