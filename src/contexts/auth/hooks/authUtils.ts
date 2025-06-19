
import { AuthError, UserResponse } from '@supabase/supabase-js';
import { ToastProps } from '../types';
import { 
  handleSignUp, 
  handleSignIn, 
  handleSignOut,
  handleSocialSignIn,
  requestPasswordReset,
  updatePassword 
} from '@/lib/auth';
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
