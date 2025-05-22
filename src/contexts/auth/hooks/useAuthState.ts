
import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthError, Session, User, UserResponse } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getMFAStatus, setupMFA } from '../mfaUtils';

export type AuthState = {
  initialized: boolean;
  user: User | null;
  session: Session | null;
  isMfaEnabled: boolean;
  isLoading: boolean;
};

export type AuthActions = {
  signInWithEmail: (email: string, password: string) => Promise<{ error?: AuthError }>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'github') => Promise<void>;
  signUp: (
    email: string,
    password: string,
    metadata?: object
  ) => Promise<{ error?: AuthError; data?: UserResponse }>;
  signOut: () => Promise<void>;
  setupMFA: () => Promise<string>;
};

export function useAuthState(): [AuthState, AuthActions] {
  const [state, setState] = useState<AuthState>({
    initialized: false,
    user: null,
    session: null,
    isMfaEnabled: false,
    isLoading: true,
  });
  
  // Track mounted state to avoid state updates after unmount
  const isMounted = useRef(true);

  // Safe setState that checks if component is still mounted
  const safeSetState = useCallback((newState: Partial<AuthState>) => {
    if (isMounted.current) {
      setState((prevState) => ({ ...prevState, ...newState }));
    }
  }, []);

  // Initialize auth state and set up listeners
  useEffect(() => {
    let authListener: { data: { subscription: { unsubscribe: () => void } } };

    async function initialize() {
      try {
        // First, set up the auth state change listener
        authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          if (isMounted.current) {
            // Check MFA status whenever auth state changes
            let mfaStatus = false;
            if (session?.user) {
              mfaStatus = await getMFAStatus(session.user.id);
            }

            safeSetState({
              user: session?.user ?? null,
              session,
              isMfaEnabled: mfaStatus,
              isLoading: false,
              initialized: true,
            });
          }
        });

        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        let mfaStatus = false;
        if (session?.user) {
          mfaStatus = await getMFAStatus(session.user.id);
        }

        safeSetState({
          user: session?.user ?? null,
          session,
          isMfaEnabled: mfaStatus,
          isLoading: false,
          initialized: true,
        });
      } catch (error) {
        console.error("Error initializing auth:", error);
        safeSetState({ isLoading: false, initialized: true });
      }
    }

    initialize();

    // Clean up subscription on unmount
    return () => {
      isMounted.current = false;
      if (authListener) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [safeSetState]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      safeSetState({ isLoading: true });
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { error };
    } catch (error) {
      console.error("Error signing in:", error);
      return { error: error as AuthError };
    } finally {
      safeSetState({ isLoading: false });
    }
  }, [safeSetState]);

  const signInWithProvider = useCallback(async (provider: 'google' | 'facebook' | 'github') => {
    try {
      safeSetState({ isLoading: true });
      
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Error signing in with provider:", error);
    } finally {
      safeSetState({ isLoading: false });
    }
  }, [safeSetState]);

  const signUp = useCallback(async (email: string, password: string, metadata?: object) => {
    try {
      safeSetState({ isLoading: true });
      
      const { data, error } = await supabase.auth.signUp({
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
      
      return { data, error };
    } catch (error) {
      console.error("Error signing up:", error);
      return { error: error as AuthError };
    } finally {
      safeSetState({ isLoading: false });
    }
  }, [safeSetState]);

  const signOut = useCallback(async () => {
    try {
      safeSetState({ isLoading: true });
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      safeSetState({ isLoading: false });
    }
  }, [safeSetState]);

  const setupMFACallback = useCallback(async () => {
    if (!state.user) {
      throw new Error("User must be logged in to setup MFA");
    }
    return setupMFA(state.user.id);
  }, [state.user]);

  return [
    state,
    {
      signInWithEmail,
      signInWithProvider,
      signUp,
      signOut,
      setupMFA: setupMFACallback,
    },
  ];
}
