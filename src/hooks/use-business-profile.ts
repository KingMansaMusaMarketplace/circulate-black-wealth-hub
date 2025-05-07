
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchBusinessProfile, BusinessProfile } from '@/lib/api/business-api';
import { generateBusinessQRCode } from '@/lib/api/qr-code-api';
import { toast } from 'sonner';

export const useBusinessProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [qrCodeLoading, setQrCodeLoading] = useState(false);
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
        
        // Generate QR code if business exists but doesn't have one
        if (businessProfile && !businessProfile.qr_code_id) {
          generateQrCodeForBusiness(businessProfile.id);
        }
      } catch (error) {
        console.error('Error loading business profile:', error);
        toast.error('Failed to load business profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const generateQrCodeForBusiness = async (businessId: string) => {
    setQrCodeLoading(true);
    try {
      // Generate a default loyalty QR code
      const result = await generateBusinessQRCode(businessId, 'loyalty', {
        pointsValue: 10 // Default 10 points per scan
      });
      
      if (result.success && result.qrCode) {
        // Update local state with QR code info
        setProfile(prev => prev ? {
          ...prev,
          qr_code_id: result.qrCode!.id,
          qr_code_url: result.qrCode!.qr_image_url
        } : null);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setQrCodeLoading(false);
    }
  };

  const handleProfileUpdate = (updates: BusinessProfile) => {
    setProfile(prev => prev ? { ...prev, ...updates } : updates);
  };

  const handleImageUpdate = (updates: { logo_url?: string, banner_url?: string }) => {
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  };

  return {
    profile,
    loading,
    qrCodeLoading,
    handleProfileUpdate,
    handleImageUpdate,
    generateQrCode: generateQrCodeForBusiness
  };
};
