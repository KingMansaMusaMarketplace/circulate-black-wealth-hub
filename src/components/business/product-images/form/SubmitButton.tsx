
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isUploading: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isUploading }) => {
  return (
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
  );
};

export default SubmitButton;
