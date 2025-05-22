
import { useState, useEffect } from 'react';
import { fetchBusinesses } from '@/lib/api/directory-api';
import { Business } from '@/types/business';

export function useBusinessDirectory() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBusinesses = async () => {
      setLoading(true);
      try {
        const data = await fetchBusinesses();
        setBusinesses(data);
        setError(null);
      } catch (err) {
        console.error('Error in useBusinessDirectory:', err);
        setError('Failed to load business directory');
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  return {
    businesses,
    loading,
    error
  };
}
