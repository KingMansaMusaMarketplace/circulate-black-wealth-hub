
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from 'react-hook-form';
import { ProductImageFormValues } from '../../business-form/models';
import { useProductCategories } from '@/hooks/use-product-categories';

interface SeoFieldsProps {
  businessId: string;
}

const SeoFields: React.FC<SeoFieldsProps> = ({ businessId }) => {
  const { control } = useFormContext<ProductImageFormValues>();
  const { categories } = useProductCategories(businessId);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">SEO & Categorization</h3>
      
      <FormField
        control={control}
        name="altText"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alt Text</FormLabel>
            <FormControl>
              <Input
                placeholder="Describe the image for accessibility"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Helps with accessibility and SEO
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="metaDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Enter a detailed description for search engines"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Improves visibility in search results
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center">
                      <Badge style={{ backgroundColor: category.color }} className="mr-2 h-2 w-2 rounded-full p-0" />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Group similar products together
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter comma-separated tags"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Helps with search and filtering
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default SeoFields;
