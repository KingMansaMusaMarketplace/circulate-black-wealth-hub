
import React from "react";
import ReactCrop, { type PercentCrop, centerCrop, makeAspectCrop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import CroppingControls from "./CroppingControls";
import { RotateCw, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CropContainerProps {
  imageUrl: string;
  crop: PercentCrop | undefined;
  setCrop: (crop: PercentCrop) => void;
  setCompletedCrop: (crop: PixelCrop) => void;
  scale: number;
  setScale: (scale: number) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  onCancel: () => void;
  onApply: () => void;
  imgRef: React.RefObject<HTMLImageElement>;
  quality?: number;
  setQuality?: (quality: number) => void;
  aspectRatio?: number;
  setAspectRatio?: (ratio: number) => void;
}

const CropContainer: React.FC<CropContainerProps> = ({
  imageUrl,
  crop,
  setCrop,
  setCompletedCrop,
  scale,
  setScale,
  rotation,
  setRotation,
  onCancel,
  onApply,
  imgRef,
  quality = 92,
  setQuality,
  aspectRatio = 16/9,
  setAspectRatio
}) => {
  // For setting initial crop size on image load
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspectRatio,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  // Handle rotation
  const rotateLeft = () => {
    // Fixed: Directly pass the new calculated number instead of a function
    const newRotation = Math.max(rotation - 90, -360);
    setRotation(newRotation);
  };

  const rotateRight = () => {
    // Fixed: Directly pass the new calculated number instead of a function
    const newRotation = Math.min(rotation + 90, 360);
    setRotation(newRotation);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-center mb-2">
        <div className="flex space-x-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={rotateLeft}
            aria-label="Rotate left"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Rotate Left
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={rotateRight}
            aria-label="Rotate right"
          >
            <RotateCw className="h-4 w-4 mr-1" />
            Rotate Right
          </Button>
        </div>
      </div>

      <ReactCrop
        crop={crop}
        onChange={(c) => {
          // The onChange handler needs to work with PercentCrop
          // Use type checking to ensure it's a PercentCrop
          const percentCrop = c as any;
          if (percentCrop && percentCrop.unit === '%') {
            setCrop(percentCrop as PercentCrop);
          }
        }}
        onComplete={(c) => {
          // For onComplete, we need a PixelCrop
          const pixelCrop: PixelCrop = {
            unit: 'px',
            x: c.x,
            y: c.y,
            width: c.width,
            height: c.height
          };
          setCompletedCrop(pixelCrop);
        }}
        aspect={aspectRatio}
        className="max-h-[400px] transition-transform"
      >
        <img 
          ref={imgRef}
          src={imageUrl} 
          alt="Preview for cropping" 
          onLoad={onImageLoad}
          className="max-h-[400px] object-contain transition-transform duration-300"
          style={{ 
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center' 
          }}
        />
      </ReactCrop>
      
      <CroppingControls 
        scale={scale}
        setScale={setScale}
        rotation={rotation}
        onRotateLeft={rotateLeft}
        onRotateRight={rotateRight}
        onCancel={onCancel}
        onApply={onApply}
        quality={quality}
        setQuality={setQuality}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
      />
    </div>
  );
};

export default CropContainer;
