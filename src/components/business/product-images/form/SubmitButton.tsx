
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check } from "lucide-react";

interface SubmitButtonProps {
  isUploading: boolean;
  isEditing: boolean;
  onCancel?: () => void;
  isValid: boolean;
  isOptimized?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isUploading,
  isEditing,
  onCancel,
  isValid,
  isOptimized = false
}) => {
  return (
    <div className="flex justify-between items-center pt-2">
      <div className="text-sm text-gray-500">
        {isOptimized && (
          <span className="flex items-center text-green-600">
            <Check className="h-4 w-4 mr-1" /> 
            Image optimized
          </span>
        )}
      </div>
      
      <div className="flex space-x-2">
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
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? 'Updating...' : 'Saving...'}
            </>
          ) : (
            isEditing ? 'Update Product' : 'Save Product'
          )}
        </Button>
      </div>
    </div>
  );
};

export default SubmitButton;
