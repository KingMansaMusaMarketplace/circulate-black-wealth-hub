
import React from 'react';
import { Loader2 } from 'lucide-react';

const BusinessProfileLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="h-8 w-8 text-blue-400 animate-spin mr-2" />
      <p className="text-white">Loading business profile...</p>
    </div>
  );
};

export default BusinessProfileLoading;
