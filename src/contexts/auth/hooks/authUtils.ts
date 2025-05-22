
import { AuthError, UserResponse } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getMFAStatus } from '../mfaUtils';

// Check if a user session exists and is valid
export const checkSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { data, error };
  } catch (error) {
    console.error("Error signing in:", error);
    return { error: error as AuthError };
  }
};

// Sign in with third-party provider
export const signInWithProvider = async (provider: 'google' | 'facebook' | 'github') => {
  try {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  } catch (error) {
    console.error("Error signing in with provider:", error);
    throw error;
  }
};

// Sign up with email and password
export const signUp = async (email: string, password: string, metadata?: object) => {
  try {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          // If this is a referral, store the metadata
          referred_by: metadata && 'referring_agent' in metadata 
            ? (metadata as any).referring_agent
            : null,
          referral_code: metadata && 'referral_code' in metadata
            ? (metadata as any).referral_code
            : null
        },
      },
    });
    
    if (result.error) {
      return { error: result.error };
    }
    
    // Create a properly typed response
    const response: { error?: AuthError; data?: UserResponse } = {
      data: result.data,
      error: undefined
    };
    
    return response;
  } catch (error) {
    console.error("Error signing up:", error);
    return { error: error as AuthError };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Check MFA status for a user
export const checkMFAStatus = async (userId: string) => {
  if (!userId) return false;
  return await getMFAStatus(userId);
};
