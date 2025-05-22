
import { AuthError, UserResponse } from '@supabase/supabase-js';
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
import { toast } from 'sonner';

// Helper function to wrap toast in the expected format
export const toastWrapper = (props: ToastProps) => {
  if (props.variant === "destructive") {
    toast.error(props.title, {
      description: props.description
    });
  } else {
    toast.success(props.title, {
      description: props.description
    });
  }
  
  return props;
};

// Enhanced sign-in function that handles MFA challenges
export const enhancedSignIn = async (
  email: string, 
  password: string, 
  setUser: (user: any) => void, 
  getMFAFactorsFn: () => Promise<any[]>, 
  setCurrentMFAChallenge: (challenge: any) => void, 
  toastFn?: (props: ToastProps) => any
) => {
  try {
    console.log("Attempting enhanced sign-in for:", email);
    const result = await handleSignIn(email, password, toastFn);
    
    if (result.error) {
      console.error("Sign in error:", result.error);
      return result;
    }
    
    console.log("Sign-in result:", result.data?.session ? "Session exists" : "No session", 
                result.data?.user ? "User exists" : "No user");
    
    // Check if MFA challenge is required
    if (result.data?.session === null && result.data?.user !== null) {
      console.log("MFA may be required - session null but user exists");
      
      // User exists but session is null - likely needs MFA
      // Store user for later reference
      setUser(result.data.user);
      
      // Fetch available MFA factors
      const factors = await getMFAFactorsFn();
      console.log("MFA factors:", factors);
      
      // If user has MFA factors, initiate a challenge
      if (factors.length > 0) {
        const challenge = await createMFAChallenge(factors[0].id);
        console.log("MFA challenge created:", challenge);
        
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

export const handleUserSignUp = async (email: string, password: string, metadata?: any, toastFn?: any): Promise<{error?: AuthError, data?: UserResponse}> => {
  console.log("Handling user signup with metadata:", metadata);
  const result = await handleSignUp(email, password, metadata, toastFn);
  console.log("Signup result:", result);
  return result as {error?: AuthError, data?: UserResponse};
};

export const handleUserSignIn = (email: string, password: string, toastFn?: any) => 
  handleSignIn(email, password, toastFn);

export const handleUserSignOut = (toastFn?: any) => 
  handleSignOut(toastFn);

export const handleUserSocialSignIn = (provider: any, toastFn?: any) => 
  handleSocialSignIn(provider, toastFn);

export const handlePasswordReset = (email: string, toastFn?: any) => 
  requestPasswordReset(email, toastFn);

export const handleUpdatePassword = (newPassword: string, toastFn?: any) => 
  updatePassword(newPassword, toastFn);

// Check if the session is valid
export const checkUserSession = async (): Promise<boolean> => {
  try {
    console.log("Checking user session...");
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { session } } = await supabase.auth.getSession();
    console.log("checkUserSession result:", !!session);
    return !!session;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};

// Export these function names to match the imports in useAuthState.ts
export const signInWithEmail = handleUserSignIn;
export const signInWithProvider = handleUserSocialSignIn;
export const signUp = handleUserSignUp;
export const signOut = handleUserSignOut;
export { checkMFAStatus } from './mfaUtils';
