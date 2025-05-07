
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface CroppingControlsProps {
  scale: number;
  setScale: (scale: number) => void;
  onCancel: () => void;
  onApply: () => void;
}

const CroppingControls: React.FC<CroppingControlsProps> = ({
  scale,
  setScale,
  onCancel,
  onApply
}) => {
  return (
    <>
      <div className="mt-2 flex items-center justify-between px-4">
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          onClick={() => setScale(Math.max(scale - 0.1, 0.5))}
          disabled={scale <= 0.5}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Slider 
          className="w-full mx-4"
          value={[scale * 10]} 
          min={5} 
          max={30} 
          step={1}
          onValueChange={(value) => setScale(value[0] / 10)}
          aria-label="Zoom level"
        />
        
        <Button 
          type="button" 
          size="icon"
          variant="outline" 
          onClick={() => setScale(Math.min(scale + 0.1, 3))}
          disabled={scale >= 3}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-end space-x-2 animate-fade-in mt-4">
        <Button 
          type="button" 
          variant="outline"
          onClick={onCancel}
          aria-label="Cancel cropping"
        >
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button 
          type="button" 
          onClick={onApply}
          aria-label="Apply crop"
          className="transition-all duration-200 hover:bg-primary/90"
        >
          <Check className="mr-2 h-4 w-4" /> Apply Crop
        </Button>
      </div>
    </>
  );
};

export default CroppingControls;
