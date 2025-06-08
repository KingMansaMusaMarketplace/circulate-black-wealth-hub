
import { useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { AuthState, AuthActions } from '../types';
import { handleSignIn, handleSignOut } from '@/lib/auth/auth-login';
import { handleSignUp } from '@/lib/auth/auth-signup';
import { handleSocialSignIn } from '@/lib/auth/auth-social';
import { toast } from 'sonner';

export function useAuthState(): [AuthState, AuthActions] {
  const [state, setState] = useState<AuthState>({
    initialized: false,
    user: null,
    session: null,
    isMfaEnabled: false,
    isLoading: true,
    userType: undefined,
    authInitialized: false,
    loading: true,
  });
  
  const isMounted = useRef(true);

  const safeSetState = useCallback((newState: Partial<AuthState>) => {
    if (isMounted.current) {
      setState((prevState) => ({ ...prevState, ...newState }));
    }
  }, []);

  useEffect(() => {
    let authListener: { data: { subscription: { unsubscribe: () => void } } };

    async function initialize() {
      try {
        authListener = supabase.auth.onAuthStateChange(async (event, session) => {
          if (isMounted.current) {
            const userType = session?.user?.user_metadata?.user_type || 
                           session?.user?.user_metadata?.userType;
            
            safeSetState({
              user: session?.user ?? null,
              session,
              userType,
              isMfaEnabled: false,
              isLoading: false,
              initialized: true,
              authInitialized: true,
              loading: false,
            });
          }
        });

        const { data: { session } } = await supabase.auth.getSession();
        const userType = session?.user?.user_metadata?.user_type || 
                        session?.user?.user_metadata?.userType;

        safeSetState({
          user: session?.user ?? null,
          session,
          userType,
          isMfaEnabled: false,
          isLoading: false,
          initialized: true,
          authInitialized: true,
          loading: false,
        });
      } catch (error) {
        console.error("Error initializing auth:", error);
        safeSetState({ 
          isLoading: false, 
          initialized: true, 
          authInitialized: true,
          loading: false 
        });
      }
    }

    initialize();

    return () => {
      isMounted.current = false;
      if (authListener) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, [safeSetState]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    try {
      safeSetState({ isLoading: true, loading: true });
      return await handleSignIn(email, password, ({ title, description, variant }) => {
        toast[variant === 'destructive' ? 'error' : 'success'](title, { description });
      });
    } finally {
      safeSetState({ isLoading: false, loading: false });
    }
  }, [safeSetState]);

  const signInWithProvider = useCallback(async (provider: 'google' | 'facebook' | 'github') => {
    try {
      safeSetState({ isLoading: true, loading: true });
      await handleSocialSignIn(provider, ({ title, description, variant }) => {
        toast[variant === 'destructive' ? 'error' : 'success'](title, { description });
      });
    } finally {
      safeSetState({ isLoading: false, loading: false });
    }
  }, [safeSetState]);

  const signInWithSocial = useCallback(async (provider: 'google' | 'facebook' | 'github') => {
    return signInWithProvider(provider);
  }, [signInWithProvider]);

  const signUp = useCallback(async (email: string, password: string, metadata?: object) => {
    try {
      safeSetState({ isLoading: true, loading: true });
      return await handleSignUp(email, password, metadata, ({ title, description, variant }) => {
        toast[variant === 'destructive' ? 'error' : 'success'](title, { description });
      });
    } finally {
      safeSetState({ isLoading: false, loading: false });
    }
  }, [safeSetState]);

  const signOut = useCallback(async () => {
    try {
      safeSetState({ isLoading: true, loading: true });
      await handleSignOut(({ title, description, variant }) => {
        toast[variant === 'destructive' ? 'error' : 'success'](title, { description });
      });
    } finally {
      safeSetState({ isLoading: false, loading: false });
    }
  }, [safeSetState]);

  const checkSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch (error) {
      console.error('Error checking session:', error);
      return false;
    }
  }, []);

  const getMFAFactors = useCallback(async () => {
    try {
      const { data } = await supabase.auth.mfa.listFactors();
      return data?.totp || [];
    } catch (error) {
      console.error('Error getting MFA factors:', error);
      return [];
    }
  }, []);

  const verifyMFA = useCallback(async (factorId: string, code: string, challengeId: string) => {
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
  }, []);

  const setupMFA = useCallback(async () => {
    // MFA setup implementation
    console.log('MFA setup not implemented');
  }, []);

  return [
    state,
    {
      signInWithEmail,
      signInWithProvider,
      signInWithSocial,
      signUp,
      signOut,
      setupMFA,
      checkSession,
      getMFAFactors,
      verifyMFA,
      signIn: signInWithEmail, // Alias for compatibility
    },
  ];
}
