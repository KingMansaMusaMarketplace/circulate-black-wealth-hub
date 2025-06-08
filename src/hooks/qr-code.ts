
import { useState } from 'react';
import { toast } from 'sonner';

export const useQRCode = () => {
  const [loading, setLoading] = useState(false);

  const deleteQRCode = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('QR code deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteQRCode,
    loading
  };
};
