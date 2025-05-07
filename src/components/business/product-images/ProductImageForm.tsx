
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Image, Loader2, Upload } from "lucide-react";
import { productImageSchema, ProductImageFormValues, defaultProductImageValues } from "../business-form/models";

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h3 className="text-lg font-medium">Add New Product or Service</h3>
        
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
                onClick={handleUploadClick}
              >
                <Upload className="mr-2 h-4 w-4" /> Change Image
              </Button>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
              onClick={handleUploadClick}
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
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*" 
          />
          
          {form.formState.errors.root && (
            <p className="text-sm font-medium text-destructive mt-2">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="$0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your product or service..." 
                  className="min-h-[100px]"
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
            <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-4">
              <div>
                <FormLabel>Active</FormLabel>
                <p className="text-sm text-gray-500">Make this product visible to customers</p>
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
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isUploading}
            className="bg-mansablue hover:bg-mansablue-dark"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Add Product'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductImageForm;
