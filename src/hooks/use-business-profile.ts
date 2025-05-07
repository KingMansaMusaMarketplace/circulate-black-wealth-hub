
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchBusinessProfile, BusinessProfile } from '@/lib/api/business-api';
import { toast } from 'sonner';

export const useBusinessProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
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
        const businessProfile = await fetchBusinessProfile(user.id);
        setProfile(businessProfile);
      } catch (error) {
        console.error('Error loading business profile:', error);
        toast.error('Failed to load business profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleProfileUpdate = (updates: BusinessProfile) => {
    setProfile(prev => prev ? { ...prev, ...updates } : updates);
  };

  const handleImageUpdate = (updates: { logo_url?: string, banner_url?: string }) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  return {
    profile,
    loading,
    handleProfileUpdate,
    handleImageUpdate
  };
};
