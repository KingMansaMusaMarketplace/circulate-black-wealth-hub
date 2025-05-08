
import React from 'react';
import { Gift } from 'lucide-react';

const EmptyRewardsState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <Gift className="mx-auto h-12 w-12 text-gray-300 mb-2" />
      <h3 className="text-lg font-medium">No Rewards Available</h3>
      <p className="text-gray-500 text-sm mt-1">
        Check back soon for exciting loyalty rewards!
      </p>
    </div>
  );
};

export default EmptyRewardsState;
