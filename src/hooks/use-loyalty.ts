
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';

export const useLoyalty = () => {
  const { user } = useAuth();
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Mock data for now - replace with actual API call
        setLoyaltyPoints(1250);
      } catch (error) {
        console.error('Error fetching loyalty points:', error);
        setLoyaltyPoints(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoyaltyPoints();
  }, [user]);

  return {
    loyaltyPoints,
    isLoading
  };
};
