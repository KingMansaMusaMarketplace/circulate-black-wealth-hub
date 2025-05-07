
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

const aspectRatioOptions = [
  { label: "Free", value: 0 },
  { label: "Square (1:1)", value: 1 },
  { label: "Portrait (4:5)", value: 0.8 },
  { label: "Landscape (16:9)", value: 16/9 },
  { label: "Classic (4:3)", value: 4/3 },
  { label: "Cinematic (21:9)", value: 21/9 },
];

const CroppingControls: React.FC<CroppingControlsProps> = ({
  scale,
  setScale,
  rotation,
  onRotateLeft,
  onRotateRight,
  onCancel,
  onApply,
  quality = 92,
  setQuality,
  aspectRatio = 16/9,
  setAspectRatio
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle quality slider change
  const handleQualityChange = (value: number[]) => {
    if (setQuality) {
      setQuality(value[0]);
    }
  };

  // Handle aspect ratio change
  const handleAspectRatioChange = (value: string) => {
    if (setAspectRatio) {
      setAspectRatio(parseFloat(value));
    }
  };

  return (
    <div className="space-y-4 mt-4 border-t pt-4">
      <div className="space-y-4">
        {/* Scale Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="scale">Zoom: {Math.round(scale * 100)}%</Label>
          </div>
          <Slider
            id="scale"
            value={[scale]}
            min={0.5}
            max={3}
            step={0.01}
            onValueChange={(value) => setScale(value[0])}
            className="w-full"
          />
        </div>
        
        {/* Advanced Options Toggle */}
        <Button 
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs"
        >
          {showAdvanced ? "Hide" : "Show"} Advanced Options
        </Button>
        
        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 border rounded-md p-3 bg-gray-50">
            {/* Aspect Ratio Selection */}
            {setAspectRatio && (
              <div className="space-y-2">
                <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                <Select 
                  value={aspectRatio.toString()} 
                  onValueChange={handleAspectRatioChange}
                >
                  <SelectTrigger id="aspect-ratio" className="w-full">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatioOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Image Quality */}
            {setQuality && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="quality">Quality: {quality}%</Label>
                </div>
                <Slider
                  id="quality"
                  value={[quality]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={handleQualityChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower quality = smaller file size
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={onApply}>
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default CroppingControls;
