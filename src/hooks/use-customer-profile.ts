
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchCustomerProfile, saveCustomerProfile, CustomerProfile } from '@/lib/api/customer-api';
import { toast } from 'sonner';

export const useCustomerProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const customerProfile = await fetchCustomerProfile(user.id);
        setProfile(customerProfile);
      } catch (error) {
        console.error('Error loading customer profile:', error);
        toast.error('Failed to load customer profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleProfileUpdate = async (updates: Partial<CustomerProfile>) => {
    if (!user?.id || !profile) {
      toast.error('Please log in to update your profile');
      return false;
    }

    try {
      const updatedProfile = { ...profile, ...updates };
      const result = await saveCustomerProfile(updatedProfile as CustomerProfile);
      
      if (result.success) {
        setProfile(prev => prev ? { ...prev, ...updates } : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      return false;
    }
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
  };

  return {
    profile,
    loading,
    handleProfileUpdate,
    handleAvatarUpdate,
  };
};
