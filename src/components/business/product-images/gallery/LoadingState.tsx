
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-mansablue" />
      <span className="ml-2">Loading products...</span>
    </div>
  );
};

export default LoadingState;
