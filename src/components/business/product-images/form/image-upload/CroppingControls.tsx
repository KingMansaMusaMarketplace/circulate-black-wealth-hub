
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CroppingControlsProps {
  scale: number;
  setScale: (scale: number) => void;
  rotation: number;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onCancel: () => void;
  onApply: () => void;
  quality?: number;
  setQuality?: (quality: number) => void;
  aspectRatio?: number;
  setAspectRatio?: (ratio: number) => void;
}

const ASPECT_RATIOS = [
  { label: "Free form", value: 0 },
  { label: "Square (1:1)", value: 1 },
  { label: "Landscape (16:9)", value: 16/9 },
  { label: "Portrait (9:16)", value: 9/16 },
  { label: "Standard (4:3)", value: 4/3 },
  { label: "Product (3:2)", value: 3/2 }
];

const CroppingControls: React.FC<CroppingControlsProps> = ({
  scale,
  setScale,
  onCancel,
  onApply,
  quality = 92,
  setQuality,
  aspectRatio = 16/9,
  setAspectRatio
}) => {
  return (
    <div className="space-y-5 mt-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="scale">Zoom: {Math.round(scale * 100)}%</Label>
        </div>
        <Slider
          id="scale"
          min={0.5}
          max={3}
          step={0.01}
          value={[scale]}
          onValueChange={(values) => setScale(values[0])}
        />
      </div>
      
      {setQuality && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="quality">Quality: {quality}%</Label>
          </div>
          <Slider
            id="quality"
            min={10}
            max={100}
            step={1}
            value={[quality]}
            onValueChange={(values) => setQuality(values[0])}
          />
          <p className="text-xs text-muted-foreground">
            Higher quality means larger file size. 80-90% is recommended for most images.
          </p>
        </div>
      )}
      
      {setAspectRatio && (
        <div className="space-y-2">
          <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
          <Select
            value={aspectRatio.toString()}
            onValueChange={(value) => setAspectRatio(parseFloat(value))}
          >
            <SelectTrigger id="aspect-ratio" className="w-full">
              <SelectValue placeholder="Select aspect ratio" />
            </SelectTrigger>
            <SelectContent>
              {ASPECT_RATIOS.map((ratio) => (
                <SelectItem key={ratio.value} value={ratio.value.toString()}>
                  {ratio.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={onApply}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default CroppingControls;
