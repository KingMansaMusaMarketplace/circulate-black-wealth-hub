
import { useState, useEffect, useRef } from 'react';
import { UseFormReturn } from "react-hook-form";
import { toast } from 'sonner';
import { optimizeImage } from "../image-upload/utils/imageProcessor";
import { ProductImage } from "@/lib/api/product-api";
import { ProductImageFormValues } from "@/components/business/business-form/models";

interface UseImageFormStateProps {
  form: UseFormReturn<ProductImageFormValues>;
  initialData?: ProductImage | null;
  onSubmit: (values: ProductImageFormValues, file: File) => Promise<void>;
}

export const useImageFormState = ({ 
  form, 
  initialData, 
  onSubmit 
}: UseImageFormStateProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(92);
  const [aspectRatio, setAspectRatio] = useState(16/9);
  const [imageOptimized, setImageOptimized] = useState(false);
  
  // Track original and compressed sizes for analytics
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  
  // Set preview URL if editing an existing product
  useEffect(() => {
    if (initialData) {
      setPreviewUrl(initialData.image_url);
      if (initialData.original_size && initialData.compressed_size) {
        setOriginalSize(initialData.original_size);
        setCompressedSize(initialData.compressed_size);
      }
    } else {
      setPreviewUrl(null);
      form.reset(form.formState.defaultValues);
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

  const handleFormSubmit = async (values: ProductImageFormValues) => {
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
    form.reset(form.formState.defaultValues);
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

  return {
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
  };
};
