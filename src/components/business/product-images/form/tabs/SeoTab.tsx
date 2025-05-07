
import React from 'react';
import { Form } from "@/components/ui/form";
import { useFormContext } from 'react-hook-form';
import { ProductImageFormValues } from '../../../business-form/models';
import SeoFields from '../SeoFields';
import SubmitButton from '../SubmitButton';

interface SeoTabProps {
  businessId: string;
  isUploading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
}

const SeoTab: React.FC<SeoTabProps> = ({
  businessId,
  isUploading,
  isEditing,
  onCancel
}) => {
  const form = useFormContext<ProductImageFormValues>();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="space-y-6">
        <h3 className="text-lg font-medium">Search Engine Optimization</h3>
        <p className="text-sm text-gray-500">Improve how your product appears in search results</p>
        
        <SeoFields businessId={businessId} />
        
        <SubmitButton 
          isUploading={isUploading} 
          isEditing={isEditing} 
          onCancel={onCancel}
          isValid={form.formState.isValid}
          isOptimized={true}
        />
      </form>
    </Form>
  );
};

export default SeoTab;
