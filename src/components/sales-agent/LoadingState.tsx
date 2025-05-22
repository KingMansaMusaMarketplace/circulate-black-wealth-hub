
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center p-12">
      <div className="animate-spin w-12 h-12 border-t-4 border-mansablue border-solid rounded-full shadow-md"></div>
    </div>
  );
};

export default LoadingState;
