
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import BatchUploader from '../image-upload/BatchUploader';
import { ProductImageFormValues } from '../../../business-form/models';

interface BatchUploadTabProps {
  onBatchSubmit: (files: File[], defaultValues: Partial<ProductImageFormValues>) => Promise<void>;
  isBatchUploading: boolean;
}

const BatchUploadTab: React.FC<BatchUploadTabProps> = ({
  onBatchSubmit,
  isBatchUploading
}) => {
  const form = useFormContext<ProductImageFormValues>();
  
  const handleBatchUpload = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }
    
    // Get common values for all uploads from the form
    const commonValues = {
      category: form.getValues("category"),
      isActive: form.getValues("isActive"),
      tags: form.getValues("tags")
    };
    
    await onBatchSubmit(files, commonValues);
  };
  
  return (
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
  );
};

export default BatchUploadTab;
