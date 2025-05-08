
import { ToastProps } from './types';
import { 
  handleSignUp, 
  handleSignIn, 
  handleSignOut,
  handleSocialSignIn,
  requestPasswordReset,
  updatePassword 
} from '@/lib/auth';
import { getMFAFactors, createMFAChallenge } from './mfaUtils';

// Helper function to wrap toast in the expected format
export const toastWrapper = (props: ToastProps) => {
  if (props.variant === "destructive") {
    return {
      title: props.title,
      description: props.description,
      variant: props.variant
    };
  } else {
    return {
      title: props.title,
      description: props.description
    };
  }
};

// Enhanced sign-in function that handles MFA challenges
export const enhancedSignIn = async (
  email: string, 
  password: string, 
  setUser: (user: any) => void, 
  getMFAFactors: () => Promise<any[]>, 
  setCurrentMFAChallenge: (challenge: any) => void, 
  toast?: (props: ToastProps) => any
) => {
  try {
    const result = await handleSignIn(email, password, toast);
    
    // Check if MFA challenge is required
    if (result.data?.session === null && result.data?.user !== null) {
      // User exists but session is null - likely needs MFA
      // Store user for later reference
      setUser(result.data.user);
      
      // Fetch available MFA factors
      const factors = await getMFAFactors();
      
      // If user has MFA factors, initiate a challenge
      if (factors.length > 0) {
        const challenge = await createMFAChallenge(factors[0].id);
        
        if (challenge) {
          // Store the challenge for verification
          // Convert expires_at to string if it's not already
          setCurrentMFAChallenge({
            id: challenge.id,
            factorId: factors[0].id,
            expiresAt: String(challenge.expires_at)
          });
          
          // Return a special result indicating MFA is required
          return { 
            ...result, 
            mfaRequired: true,
            factorId: factors[0].id,
            challengeId: challenge.id
          };
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Enhanced sign in error:', error);
    return { data: null, error };
  }
};

export const handleUserSignUp = (email: string, password: string, metadata?: any, toast?: any) => 
  handleSignUp(email, password, metadata, toast);

export const handleUserSignIn = (email: string, password: string, toast?: any) => 
  handleSignIn(email, password, toast);

export const handleUserSignOut = (toast?: any) => 
  handleSignOut(toast);

export const handleUserSocialSignIn = (provider: any, toast?: any) => 
  handleSocialSignIn(provider, toast);

export const handlePasswordReset = (email: string, toast?: any) => 
  requestPasswordReset(email, toast);

export const handleUpdatePassword = (newPassword: string, toast?: any) => 
  updatePassword(newPassword, toast);

// Check if the session is valid
export const checkUserSession = async (): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};
