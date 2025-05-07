
import React, { useRef } from "react";
import ReactCrop, { type PercentCrop, centerCrop, makeAspectCrop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import CroppingControls from "./CroppingControls";

interface CropContainerProps {
  imageUrl: string;
  crop: PercentCrop | undefined;
  setCrop: (crop: PercentCrop) => void;
  setCompletedCrop: (crop: PixelCrop) => void; // Using PixelCrop type properly
  scale: number;
  setScale: (scale: number) => void;
  onCancel: () => void;
  onApply: () => void;
  imgRef: React.RefObject<HTMLImageElement>;
}

const CropContainer: React.FC<CropContainerProps> = ({
  imageUrl,
  crop,
  setCrop,
  setCompletedCrop,
  scale,
  setScale,
  onCancel,
  onApply,
  imgRef
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
        16 / 9,
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  };

  return (
    <div className="flex flex-col w-full">
      <ReactCrop
        crop={crop}
        onChange={(c) => setCrop(c)}
        onComplete={(c) => {
          // Cast to proper type to fix the error
          setCompletedCrop(c);
        }}
        aspect={16 / 9}
        className="max-h-[400px] transition-transform"
      >
        <img 
          ref={imgRef}
          src={imageUrl} 
          alt="Preview for cropping" 
          onLoad={onImageLoad}
          className="max-h-[400px] object-contain transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
        />
      </ReactCrop>
      
      <CroppingControls 
        scale={scale}
        setScale={setScale}
        onCancel={onCancel}
        onApply={onApply}
      />
    </div>
  );
};

export default CropContainer;
