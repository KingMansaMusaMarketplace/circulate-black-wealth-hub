
import { supabase } from '@/integrations/supabase/client';
import { Factor, MFAChallenge } from './types';

// Get MFA status for a user
export const checkMFAStatus = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase.auth.mfa.listFactors();
    
    if (error) throw error;
    
    return data?.all && data.all.length > 0;
  } catch (error: any) {
    console.error('Error fetching MFA status:', error);
    return false;
  }
};

// Setup MFA for a user
export const setupMFA = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp'
    });
    
    if (error) throw error;
    
    return data?.id || '';
  } catch (error: any) {
    console.error('Error setting up MFA:', error);
    return '';
  }
};

// Get MFA factors for the current user
export const getMFAFactors = async (): Promise<Factor[]> => {
  try {
    const { data, error } = await supabase.auth.mfa.listFactors();
    
    if (error) throw error;
    
    // Convert Supabase factors to our Factor type
    return (data?.all || []).map(factor => ({
      id: factor.id,
      type: factor.factor_type || 'unknown',
      status: factor.status,
      friendly_name: factor.friendly_name
    })) as Factor[];
  } catch (error: any) {
    console.error('Error fetching MFA factors:', error);
    return [];
  }
};

// Verify an MFA challenge
export const verifyMFA = async (factorId: string, code: string, challengeId: string) => {
  try {
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId,
      code
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('MFA verification error:', error);
    return { success: false, error };
  }
};

// Create an MFA challenge
export const createMFAChallenge = async (factorId: string): Promise<{id: string, expires_at: string | number} | null> => {
  try {
    const { data, error } = await supabase.auth.mfa.challenge({
      factorId: factorId
    });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating MFA challenge:', error);
    return null;
  }
};
