
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useFormContext } from 'react-hook-form';
import { cn } from "@/lib/utils";
import { Sparkles, Loader2 } from 'lucide-react';
import { useProductDescription } from '@/hooks/use-product-description';
import { toast } from 'sonner';

const FormFields = () => {
  const { control, watch, setValue } = useFormContext();
  const { isGenerating, generateDescription } = useProductDescription();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const productName = watch('title');
  const category = watch('category');
  const price = watch('price');

  const handleAIGenerate = async () => {
    if (!productName) {
      toast.error('Please enter a product name first');
      return;
    }

    const result = await generateDescription({
      productName,
      category,
      price
    });

    if (result) {
      setValue('description', result.description);
      if (result.suggestedTags.length > 0) {
        setValue('tags', result.suggestedTags.join(', '));
      }
      setShowSuggestions(true);
      toast.success('AI suggestions applied! Check the description and tags fields.');
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="title">Product Name</FormLabel>
            <FormControl>
              <Input 
                id="title" 
                placeholder="Enter product name" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel htmlFor="description">Description</FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAIGenerate}
                disabled={isGenerating || !productName}
                className="gap-2 text-xs"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    AI Suggest
                  </>
                )}
              </Button>
            </div>
            <FormControl>
              <Textarea 
                id="description" 
                placeholder="Describe your product or service, or use AI to generate" 
                className="resize-none"
                rows={4}
                {...field} 
              />
            </FormControl>
            <FormDescription className="text-xs">
              Enter a product name above and click "AI Suggest" to generate a compelling description
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="price">Price (optional)</FormLabel>
            <FormControl>
              <Input 
                id="price" 
                placeholder="e.g. $19.99, Starting at $50..." 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="isActive"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Visibility</FormLabel>
              <FormDescription>
                Make this product visible on your store
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
  );
};

export default FormFields;
