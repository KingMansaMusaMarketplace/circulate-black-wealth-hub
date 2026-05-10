
import React from 'react';
import { Form } from "@/components/ui/form";
import { useFormContext } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from 'lucide-react';
import { ProductImageFormValues } from '../../../business-form/models';
import ImageUploadPreview from '../ImageUploadPreview';
import FormFields from '../FormFields';
import SubmitButton from '../SubmitButton';
import CompressionStats from '../image-upload/CompressionStats';
import { useProductImageAnalysis } from '@/hooks/use-product-image-analysis';

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
  const { isAnalyzing, analyze } = useProductImageAnalysis();

  const handleAutofill = async () => {
    const source = selectedFile ?? previewUrl;
    if (!source) return;
    const result = await analyze(source);
    if (!result) return;
    form.setValue('title', result.title, { shouldValidate: true });
    form.setValue('description', result.description, { shouldValidate: true });
    form.setValue('price', result.suggestedPrice);
    form.setValue('category', result.category);
    form.setValue('tags', result.tags.join(', '));
    form.setValue('altText', result.altText);
    form.setValue('metaDescription', result.description.slice(0, 160));
  };

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

            {previewUrl && (
              <Button
                type="button"
                variant="secondary"
                className="w-full gap-2"
                disabled={isAnalyzing}
                onClick={handleAutofill}
              >
                {isAnalyzing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing photo…</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Auto-fill from photo</>
                )}
              </Button>
            )}

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
