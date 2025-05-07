
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Search, Settings } from "lucide-react";
import { productImageSchema, ProductImageFormValues, defaultProductImageValues } from "../business-form/models";
import { ImageUploadPreview, FormFields, SubmitButton } from "./form";
import SeoFields from "./form/SeoFields";
import { ProductImage } from "@/lib/api/product-api";
import { toast } from "sonner";
import BatchUploader from "./form/image-upload/BatchUploader";
import CompressionStats from "./form/image-upload/CompressionStats";
import { optimizeImage } from "./form/image-upload/utils/imageProcessor";

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
  
  // Fixed the type mismatch here - properly type the function
  const handleImageCropped = (originalSize: number, compressedSize: number) => {
    setOriginalSize(originalSize);
    setCompressedSize(compressedSize);
    setImageOptimized(true);
    toast.success("Image optimized! Don't forget to save the product.");
  };
  
  const handleBatchUpload = async (files: File[]) => {
    if (!onBatchSubmit) {
      toast.error("Batch upload is not available");
      return;
    }
    
    if (files.length === 0) {
      toast.error("No files selected");
      return;
    }
    
    // Get common values for all uploads from the form
    const commonValues = {
      category: form.getValues("category"),
      isActive: form.getValues("isActive"),
      tags: form.getValues("tags")
    };
    
    await onBatchSubmit(files, commonValues);
    toast.success(`Processing ${files.length} files for upload`);
    setActiveTab("single");
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4">
        <TabsTrigger value="single" className="flex items-center gap-2">
          <ImageIcon size={16} />
          Single Upload
        </TabsTrigger>
        {onBatchSubmit && (
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <ImageIcon size={16} />
            Batch Upload
          </TabsTrigger>
        )}
        {initialData && (
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Search size={16} />
            SEO
          </TabsTrigger>
        )}
        {initialData && (
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings size={16} />
            Advanced
          </TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="single">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <h3 className="text-lg font-medium">{initialData ? 'Edit Product' : 'Add New Product or Service'}</h3>
            
            <div className="lg:flex lg:gap-6">
              <div className="lg:w-1/2 space-y-4">
                <ImageUploadPreview 
                  previewUrl={previewUrl} 
                  onUploadClick={handleUploadClick}
                  fileInputRef={fileInputRef}
                  formError={form.formState.errors.root?.message}
                  onFileChange={handleFileChange}
                  quality={quality}
                  setQuality={setQuality}
                  aspectRatio={aspectRatio}
                  setAspectRatio={setAspectRatio}
                  onApplyCrop={handleImageCropped}
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
              isEditing={!!initialData} 
              onCancel={onCancel}
              isValid={form.formState.isValid && (!!selectedFile || !!initialData)}
              isOptimized={imageOptimized}
            />
          </form>
        </Form>
      </TabsContent>
      
      <TabsContent value="batch">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Batch Upload Products</h3>
          
          <Form {...form}>
            <form className="space-y-6">
              <div className="lg:grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <BatchUploader 
                    onSelectFiles={handleBatchUpload}
                    maxFiles={20}
                  />
                </div>
                
                <div className="space-y-4 mt-6 lg:mt-0">
                  <h4 className="text-sm font-medium">Common Settings (Optional)</h4>
                  <p className="text-sm text-gray-500">These settings will be applied to all uploaded images</p>
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Category</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Category for all uploads"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Tags</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Comma-separated tags"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Visibility</FormLabel>
                          <FormDescription>
                            Make all products visible on your store
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
      </TabsContent>
      
      {initialData && (
        <TabsContent value="seo">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <h3 className="text-lg font-medium">Search Engine Optimization</h3>
              <p className="text-sm text-gray-500">Improve how your product appears in search results</p>
              
              <SeoFields businessId={businessId} />
              
              <SubmitButton 
                isUploading={isUploading} 
                isEditing={!!initialData} 
                onCancel={onCancel}
                isValid={form.formState.isValid}
                isOptimized={true}
              />
            </form>
          </Form>
        </TabsContent>
      )}
      
      {initialData && (
        <TabsContent value="advanced">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Advanced Settings</h3>
            <p className="text-sm text-gray-500">Configure additional product settings</p>
            
            <CompressionStats 
              originalSize={originalSize || (initialData.original_size || 0)} 
              compressedSize={compressedSize || (initialData.compressed_size || 0)}
            />
          </div>
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ProductImageForm;
