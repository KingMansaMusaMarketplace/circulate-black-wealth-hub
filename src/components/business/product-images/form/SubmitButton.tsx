
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps {
  isUploading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
  isValid?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isUploading,
  isEditing,
  onCancel,
  isValid = true
}) => {
  return (
    <div className="flex justify-end gap-2">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isUploading}
        >
          Cancel
        </Button>
      )}
      
      <Button
        type="submit"
        disabled={isUploading || !isValid}
        className="bg-mansablue hover:bg-mansablue-dark"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Updating...' : 'Adding...'}
          </>
        ) : (
          isEditing ? 'Update Product' : 'Add Product'
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
