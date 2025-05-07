
import React from 'react';
import { Form } from "@/components/ui/form";
import { useFormContext } from 'react-hook-form';
import { ProductImageFormValues } from '../../../business-form/models';
import ImageUploadPreview from '../ImageUploadPreview';
import FormFields from '../FormFields';
import SubmitButton from '../SubmitButton';
import CompressionStats from '../image-upload/CompressionStats';

interface SingleUploadTabProps {
  previewUrl: string | null;
  onUploadClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (values: ProductImageFormValues) => void;
  isUploading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
  originalSize: number;
  compressedSize: number;
  selectedFile: File | null;
  quality: number;
  setQuality: (quality: number) => void;
  aspectRatio: number;
  setAspectRatio: (ratio: number) => void;
  onImageCropped: (originalSize: number, compressedSize: number) => void;
  imageOptimized: boolean;
}

const SingleUploadTab: React.FC<SingleUploadTabProps> = ({
  previewUrl,
  onUploadClick,
  fileInputRef,
  onFileChange,
  onSubmit,
  isUploading,
  isEditing,
  onCancel,
  originalSize,
  compressedSize,
  selectedFile,
  quality,
  setQuality,
  aspectRatio,
  setAspectRatio,
  onImageCropped,
  imageOptimized
}) => {
  const form = useFormContext<ProductImageFormValues>();
  const formError = form.formState.errors.root?.message;
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-medium">{isEditing ? 'Edit Product' : 'Add New Product or Service'}</h3>
        
        <div className="lg:flex lg:gap-6">
          <div className="lg:w-1/2 space-y-4">
            <ImageUploadPreview 
              previewUrl={previewUrl} 
              onUploadClick={onUploadClick}
              fileInputRef={fileInputRef}
              formError={formError}
              onFileChange={onFileChange}
              quality={quality}
              setQuality={setQuality}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              onApplyCrop={onImageCropped}
            />
            
            {previewUrl && originalSize > 0 && (
              <CompressionStats 
                originalSize={originalSize} 
                compressedSize={compressedSize} 
              />
            )}
          </div>
          
          <div className="lg:w-1/2 mt-4 lg:mt-0">
            <FormFields />
          </div>
        </div>
        
        <SubmitButton 
          isUploading={isUploading} 
          isEditing={isEditing} 
          onCancel={onCancel}
          isValid={form.formState.isValid && (!!selectedFile || !!isEditing)}
          isOptimized={imageOptimized}
        />
      </form>
    </Form>
  );
};

export default SingleUploadTab;
