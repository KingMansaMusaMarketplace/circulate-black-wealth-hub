
import React from 'react';
import { ImageIcon } from 'lucide-react';

const EmptyState = ({ isFiltered = false }) => {
  if (isFiltered) {
    return (
      <div className="text-center py-10 animate-fade-in">
        <p className="text-gray-500">No products match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="bg-gray-100 p-6 rounded-full mb-4">
        <ImageIcon size={48} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-1">No products yet</h3>
      <p className="text-gray-500 max-w-md">
        Start showcasing your products or services by adding images and descriptions.
      </p>
    </div>
  );
};

export default EmptyState;
