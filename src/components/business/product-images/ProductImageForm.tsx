
import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productImageSchema, ProductImageFormValues, defaultProductImageValues } from "../business-form/models";
import { ProductImage } from "@/lib/api/product-api";
import { toast } from "sonner";
import { optimizeImage } from "./form/image-upload/utils/imageProcessor";
import ProductFormTabs from "./form/tabs/ProductFormTabs";
import SingleUploadTab from "./form/tabs/SingleUploadTab";
import BatchUploadTab from "./form/tabs/BatchUploadTab";
import SeoTab from "./form/tabs/SeoTab";
import AdvancedTab from "./form/tabs/AdvancedTab";
import { TabsContent } from "@/components/ui/tabs";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(92);
  const [aspectRatio, setAspectRatio] = useState(16/9);
  const [imageOptimized, setImageOptimized] = useState(false);
  
  // Track original and compressed sizes for analytics
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);

  const form = useForm<ProductImageFormValues>({
    resolver: zodResolver(productImageSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      price: initialData.price || '',
      isActive: initialData.is_active,
      altText: initialData.alt_text || '',
      metaDescription: initialData.meta_description || '',
      category: initialData.category || '',
      tags: initialData.tags || ''
    } : defaultProductImageValues,
    mode: "onChange"
  });
  
  // Set preview URL if editing an existing product
  useEffect(() => {
    if (initialData) {
      setPreviewUrl(initialData.image_url);
      setActiveTab("single");
      if (initialData.original_size && initialData.compressed_size) {
        setOriginalSize(initialData.original_size);
        setCompressedSize(initialData.compressed_size);
      }
    } else {
      setPreviewUrl(null);
      form.reset(defaultProductImageValues);
      setOriginalSize(0);
      setCompressedSize(0);
    }
  }, [initialData, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File is too large. Maximum size is 5MB.");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file.");
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setSelectedFile(file);
      setImageOptimized(false);
      setOriginalSize(file.size);
      
      try {
        // Automatically optimize the image
        const optimizedImage = await optimizeImage(file, quality);
        setPreviewUrl(optimizedImage.url);
        setSelectedFile(optimizedImage.file);
        setCompressedSize(optimizedImage.compressedSize);
        setImageOptimized(true);
        
        if (optimizedImage.compressedSize < file.size) {
          const savings = Math.round((1 - optimizedImage.compressedSize / file.size) * 100);
          toast.success(`Image optimized! Reduced size by ${savings}%`);
        }
      } catch (error) {
        // Fallback to standard preview if optimization fails
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        toast.error("Could not optimize image, using original");
      }
    }
  };

  const handleSubmit = async (values: ProductImageFormValues) => {
    // When editing, if no new file is selected, we should show an error
    if (!selectedFile && !initialData) {
      form.setError("root", { 
        message: "Please select an image to upload" 
      });
      return;
    }

    if (selectedFile) {
      await onSubmit(values, selectedFile);
      setImageOptimized(false);
    }
    
    // Reset form after successful submission
    form.reset(defaultProductImageValues);
    setPreviewUrl(null);
    setSelectedFile(null);
    setOriginalSize(0);
    setCompressedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageCropped = (originalSize: number, compressedSize: number) => {
    setOriginalSize(originalSize);
    setCompressedSize(compressedSize);
    setImageOptimized(true);
    toast.success("Image optimized! Don't forget to save the product.");
  };

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
            onSubmit={handleSubmit}
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
