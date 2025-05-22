
import React from 'react';

const YouTubeLoadingState: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
      <div className="animate-pulse text-white">Loading video...</div>
    </div>
  );
};

export default YouTubeLoadingState;
