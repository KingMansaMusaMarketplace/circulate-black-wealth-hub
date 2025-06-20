
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { QRScan } from '@/lib/api/qr-code-api';

export const useLoyaltyHistory = () => {
  const [scans, setScans] = useState<QRScan[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Mock data for now
      setScans([]);
    }
  }, [user]);

  return {
    scans,
    loading
  };
};
