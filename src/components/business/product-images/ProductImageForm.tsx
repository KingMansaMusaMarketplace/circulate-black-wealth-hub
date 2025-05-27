
import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productImageSchema, ProductImageFormValues, defaultProductImageValues } from "../business-form/models";
import { ProductImage } from "@/lib/api/product-api";
import { TabsContent } from "@/components/ui/tabs";
import ProductFormTabs from "./form/tabs/ProductFormTabs";
import SingleUploadTab from "./form/tabs/SingleUploadTab";
import BatchUploadTab from "./form/tabs/BatchUploadTab";
import SeoTab from "./form/tabs/SeoTab";
import AdvancedTab from "./form/tabs/AdvancedTab";
import { useImageFormState } from "./form/hooks/useImageFormState";

interface ProductImageFormProps {
  onSubmit: (values: ProductImageFormValues, file: File) => Promise<void>;
  onBatchSubmit?: (files: File[], defaultValues: Partial<ProductImageFormValues>) => Promise<void>;
  isUploading: boolean;
  isBatchUploading?: boolean;
  businessId: string;
  initialData?: ProductImage | null;
  onCancel?: () => void;
}

const ProductImageForm: React.FC<ProductImageFormProps> = ({ 
  onSubmit, 
  onBatchSubmit,
  isUploading,
  isBatchUploading,
  businessId,
  initialData,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState("single");
  
  const form = useForm<ProductImageFormValues>({
    resolver: zodResolver(productImageSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      price: initialData.price || '',
      isActive: initialData.is_active,
      altText: initialData.alt_text || '',
      metaDescription: initialData.seo_description || '',
      category: initialData.category || '',
      tags: initialData.tags || ''
    } : defaultProductImageValues,
    mode: "onChange"
  });
  
  const {
    fileInputRef,
    previewUrl,
    selectedFile,
    quality,
    aspectRatio,
    originalSize,
    compressedSize,
    imageOptimized,
    setQuality,
    setAspectRatio,
    handleFileChange,
    handleUploadClick,
    handleImageCropped,
    handleFormSubmit
  } = useImageFormState({
    form,
    initialData,
    onSubmit
  });

  return (
    <FormProvider {...form}>
      <ProductFormTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        initialData={initialData}
        onBatchSubmit={!!onBatchSubmit}
      >
        <TabsContent value="single">
          <SingleUploadTab 
            previewUrl={previewUrl}
            onUploadClick={handleUploadClick}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            onSubmit={handleFormSubmit}
            isUploading={isUploading}
            isEditing={!!initialData}
            onCancel={onCancel}
            originalSize={originalSize}
            compressedSize={compressedSize}
            selectedFile={selectedFile}
            quality={quality}
            setQuality={setQuality}
            aspectRatio={aspectRatio}
            setAspectRatio={setAspectRatio}
            onImageCropped={handleImageCropped}
            imageOptimized={imageOptimized}
          />
        </TabsContent>
        
        <TabsContent value="batch">
          {onBatchSubmit && (
            <BatchUploadTab 
              onBatchSubmit={onBatchSubmit}
              isBatchUploading={!!isBatchUploading}
            />
          )}
        </TabsContent>
        
        <TabsContent value="seo">
          {initialData && (
            <SeoTab 
              businessId={businessId}
              isUploading={isUploading}
              isEditing={!!initialData}
              onCancel={onCancel}
            />
          )}
        </TabsContent>
        
        <TabsContent value="advanced">
          {initialData && (
            <AdvancedTab 
              originalSize={originalSize || (initialData.original_size || 0)}
              compressedSize={compressedSize || (initialData.compressed_size || 0)}
            />
          )}
        </TabsContent>
      </ProductFormTabs>
    </FormProvider>
  );
};

export default ProductImageForm;
