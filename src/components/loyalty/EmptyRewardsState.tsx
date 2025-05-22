
import React from 'react';
import { Gift, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyRewardsState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-lg border border-blue-100 max-w-md mx-auto">
        <div className="w-20 h-20 bg-mansablue/5 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift className="h-10 w-10 text-mansablue opacity-70" />
        </div>
        
        <h3 className="text-xl font-medium text-mansablue mb-2">No Rewards Available</h3>
        
        <p className="text-gray-600 mb-6">
          Check back soon for exciting loyalty rewards or earn more points by visiting our partner businesses!
        </p>
        
        <div className="flex justify-center">
          <Button variant="outline" className="text-mansablue border-mansablue hover:bg-mansablue/5 flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Explore Businesses
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyRewardsState;
