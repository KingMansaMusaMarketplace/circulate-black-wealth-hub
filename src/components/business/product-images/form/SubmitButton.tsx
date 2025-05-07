
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save, Plus } from "lucide-react";

interface SubmitButtonProps {
  isUploading: boolean;
  isEditing?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isUploading, isEditing }) => {
  return (
    <div className="flex justify-end">
      <Button type="submit" disabled={isUploading} className="min-w-[120px] transition-all duration-300 hover:scale-105">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Updating...' : 'Uploading...'}
          </>
        ) : (
          <>
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Product
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </>
            )}
          </>
        )}
      </Button>
    </div>
  );
};

export default SubmitButton;
