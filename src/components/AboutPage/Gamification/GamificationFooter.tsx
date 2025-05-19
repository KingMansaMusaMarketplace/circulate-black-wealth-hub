
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const GamificationFooter = () => {
  return (
    <div className="mt-10 text-center">
      <Link to="/signup">
        <Button className="bg-mansablue hover:bg-mansablue-dark text-white px-6 py-2">
          Start Earning Rewards
        </Button>
      </Link>
      <p className="mt-3 text-sm text-gray-500">
        Join the movement and get rewarded for supporting Black-owned businesses
      </p>
    </div>
  );
};

export default GamificationFooter;
