
import React from 'react';

const ScannerInstructions: React.FC = () => {
  return (
    <div className="text-center text-sm text-gray-500">
      <p>Position the QR code in the camera view to scan automatically.</p>
      <p className="mt-1">Make sure your camera is enabled and the QR code is well-lit.</p>
    </div>
  );
};

export default ScannerInstructions;
