
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { productImageSchema, ProductImageFormValues, defaultProductImageValues } from "../business-form/models";
import { ImageUploadPreview, FormFields, SubmitButton } from "./form";
import { ProductImage } from "@/lib/api/product-api";
import { toast } from "sonner";

interface ProductImageFormProps {
  onSubmit: (values: ProductImageFormValues, file: File) => Promise<void>;
  isUploading: boolean;
  initialData?: ProductImage | null;
  onCancel?: () => void;
}

const ProductImageForm: React.FC<ProductImageFormProps> = ({ 
  onSubmit, 
  isUploading,
  initialData,
  onCancel
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(92);
  const [aspectRatio, setAspectRatio] = useState(16/9);
  const [imageOptimized, setImageOptimized] = useState(false);

  const form = useForm<ProductImageFormValues>({
    resolver: zodResolver(productImageSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      price: initialData.price || '',
      isActive: initialData.is_active
    } : defaultProductImageValues,
    mode: "onChange"
  });
  
  // Set preview URL if editing an existing product
  useEffect(() => {
    if (initialData) {
      setPreviewUrl(initialData.image_url);
    } else {
      setPreviewUrl(null);
      form.reset(defaultProductImageValues);
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageCropped = () => {
    setImageOptimized(true);
    toast.success("Image optimized! Don't forget to save the product.");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h3 className="text-lg font-medium">{initialData ? 'Edit Product' : 'Add New Product or Service'}</h3>
        
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

        <FormFields />
        
        <SubmitButton 
          isUploading={isUploading} 
          isEditing={!!initialData} 
          onCancel={onCancel}
          isValid={form.formState.isValid && (!!selectedFile || !!initialData)}
          isOptimized={imageOptimized}
        />
      </form>
    </Form>
  );
};

export default ProductImageForm;
