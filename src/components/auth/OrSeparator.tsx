
import React from 'react';
import { Separator } from '@/components/ui/separator';

const OrSeparator: React.FC = () => {
  return (
    <div className="relative my-6">
      <Separator />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
        OR
      </span>
    </div>
  );
};

export default OrSeparator;
