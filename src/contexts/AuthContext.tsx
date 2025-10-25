import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userType: string | null;
  userRole: string | null;
  authInitialized: boolean;
  databaseInitialized: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<{ error: any; success?: boolean }>;
  resetPassword: (email: string) => Promise<{ error: any; success?: boolean }>;
  signInWithSocial: (provider: string) => Promise<{ error: any }>;
  verifyMFA: (factorId: string, code: string, challengeId: string) => Promise<{ error: any; success?: boolean }>;
  getMFAFactors: () => Promise<any[]>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    // iOS-specific logging
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const platform = window?.Capacitor?.isNativePlatform?.() ? 'Native iOS' : 'Web';
    
    console.log('[AUTH INIT] Starting authentication initialization');
    console.log('[AUTH INIT] Platform:', platform);
    console.log('[AUTH INIT] User Agent:', navigator.userAgent);
    console.log('[AUTH INIT] Timestamp:', new Date().toISOString());

    // CRITICAL: Force loading to false after 5 seconds (increased from 3s)
    // This ensures the app never stays in a loading state indefinitely
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('[AUTH INIT] TIMEOUT: Force completing auth initialization after 5 seconds');
        console.warn('[AUTH INIT] This is a failsafe to prevent infinite loading on iOS');
        setLoading(false);
      }
    }, 5000);

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('[AUTH] Auth state changed:', event);
        console.log('[AUTH] Session exists:', !!session);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when authenticated
        if (session?.user) {
          try {
            console.log('[AUTH] Fetching user profile for:', session.user.id);
            await fetchUserProfile(session.user.id);
            console.log('[AUTH] Profile fetch completed successfully');
          } catch (error) {
            console.error('[AUTH] Error fetching profile:', error);
            // Don't let profile fetch errors prevent app from loading
          }
        } else {
          console.log('[AUTH] No session - clearing user data');
          setUserType(null);
          setUserRole(null);
          setProfile(null);
        }
        
        if (isMounted) {
          console.log('[AUTH] Clearing timeout and setting loading to false');
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session with timeout protection
    const initializeAuth = async () => {
      try {
        console.log('[AUTH INIT] Fetching initial session...');
        
        // Increased timeout from 2s to 4s for slower networks
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => {
            console.warn('[AUTH INIT] Session fetch taking longer than 4 seconds');
            reject(new Error('Session fetch timeout after 4 seconds'));
          }, 4000)
        );
        
        let session = null;
        let error = null;
        
        try {
          const result = await Promise.race([
            sessionPromise,
            timeoutPromise
          ]) as any;
          
          session = result?.data?.session || null;
          error = result?.error || null;
        } catch (timeoutError) {
          // Timeout occurred - log it but continue gracefully
          console.warn('[AUTH INIT] Session fetch timed out, continuing without session:', timeoutError);
          // This is OK - user can still use the app, they'll just need to log in
        }
        
        if (error) {
          console.error('[AUTH INIT] Error getting session:', error);
          // Log error but don't throw - allow app to continue
        }
        
        if (!isMounted) {
          console.log('[AUTH INIT] Component unmounted, aborting initialization');
          return;
        }
        
        console.log('[AUTH INIT] Session status:', session ? 'Found existing session' : 'No existing session');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            console.log('[AUTH INIT] Fetching profile for existing session');
            await fetchUserProfile(session.user.id);
          } catch (profileError) {
            console.error('[AUTH INIT] Error fetching profile (non-fatal):', profileError);
            // Don't let profile errors stop initialization
          }
        }
        
        if (isMounted) {
          console.log('[AUTH INIT] Initialization complete - clearing timeout');
          clearTimeout(timeoutId);
          setLoading(false);
          console.log('[AUTH INIT] Auth ready at', new Date().toISOString());
        }
      } catch (error) {
        // Catch any unexpected errors and log them
        console.error('[AUTH INIT] Unexpected error during initialization:', error);
        console.error('[AUTH INIT] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        
        // CRITICAL: Always set loading to false even on error
        // This prevents the app from being stuck in a loading state
        if (isMounted) {
          console.warn('[AUTH INIT] Setting loading to false due to error');
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('[AUTH INIT] Cleanup - unmounting');
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    console.log('[PROFILE] Fetching profile for user:', userId);
    
    // Increased timeout from 2s to 4s for slower networks
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => {
        console.warn('[PROFILE] Fetch taking longer than 4 seconds');
        reject(new Error('Profile fetch timeout after 4 seconds'));
      }, 4000)
    );

    try {
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([profilePromise, timeoutPromise]) as any;
      
      if (data && !error) {
        setProfile(data);
        setUserType(data.user_type);
        
        // Get user's primary role using the new secure function
        try {
          const rolePromise = supabase.rpc('get_user_role', {
            user_id_param: userId
          });

          const { data: userRole } = await Promise.race([rolePromise, timeoutPromise]) as any;
          
          // Set the role from user_roles table
          setUserRole(userRole || 'customer');
        } catch (roleError) {
          // If role check fails, default to 'customer'
          console.warn('Error checking user role:', roleError);
          setUserRole('customer');
        }
      } else {
        // Set defaults if no profile found
        setUserType('customer');
        setUserRole('customer');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Set defaults to prevent blank page
      setUserType('customer');
      setUserRole('customer');
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData || {}
      }
    });
    
    return { error, data };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error, data };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { error: 'No user logged in' };
    
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    
    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }
    
    return { error };
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!user?.email) {
      return { error: { message: 'User email not found' }, success: false };
    }

    // First verify current password
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });

    if (verifyError) {
      return { error: { message: 'Current password incorrect' }, success: false };
    }

    // Then update
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error, success: !error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error, success: !error };
  };

  const signInWithSocial = async (provider: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as any
    });
    return { error };
  };

  const verifyMFA = async (factorId: string, code: string, challengeId: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code
      });
      return { error, success: !error, data };
    } catch (error: any) {
      return { error, success: false };
    }
  };

  const getMFAFactors = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) return [];
      return data?.totp || [];
    } catch (error) {
      return [];
    }
  };

  const value = {
    user,
    session,
    loading,
    userType,
    userRole,
    authInitialized: !loading,
    databaseInitialized: true,
    signUp,
    signIn,
    signOut,
    updateProfile,
    updateUserPassword,
    resetPassword,
    signInWithSocial,
    verifyMFA,
    getMFAFactors,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};