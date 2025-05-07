
import React from 'react';
import CompressionStats from '../image-upload/CompressionStats';

interface AdvancedTabProps {
  originalSize: number;
  compressedSize: number;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  originalSize,
  compressedSize
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Advanced Settings</h3>
      <p className="text-sm text-gray-500">Configure additional product settings</p>
      
      <CompressionStats 
        originalSize={originalSize} 
        compressedSize={compressedSize}
      />
    </div>
  );
};

export default AdvancedTab;
