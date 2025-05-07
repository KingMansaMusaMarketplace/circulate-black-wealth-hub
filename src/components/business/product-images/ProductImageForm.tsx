
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { productImageSchema, ProductImageFormValues, defaultProductImageValues } from "../business-form/models";
import { ImageUploadPreview, FormFields, SubmitButton } from "./form";

interface ProductImageFormProps {
  onSubmit: (values: ProductImageFormValues, file: File) => Promise<void>;
  isUploading: boolean;
}

const ProductImageForm: React.FC<ProductImageFormProps> = ({ onSubmit, isUploading }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const form = useForm<ProductImageFormValues>({
    resolver: zodResolver(productImageSchema),
    defaultValues: defaultProductImageValues,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: ProductImageFormValues) => {
    if (!selectedFile) {
      form.setError("root", { 
        message: "Please select an image to upload" 
      });
      return;
    }

    await onSubmit(values, selectedFile);
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

  // Set up the onChange handler for the hidden file input
  React.useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.onchange = handleFileChange;
    }
    
    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.onchange = null;
      }
    };
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h3 className="text-lg font-medium">Add New Product or Service</h3>
        
        <ImageUploadPreview 
          previewUrl={previewUrl} 
          onUploadClick={handleUploadClick}
          fileInputRef={fileInputRef}
          formError={form.formState.errors.root?.message}
        />

        <FormFields />
        
        <SubmitButton isUploading={isUploading} />
      </form>
    </Form>
  );
};

export default ProductImageForm;
