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
  // CRITICAL: Start with loading=false to NEVER block app render on iOS
  // Auth will update state when ready, but app shows content immediately
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    console.log('[AUTH INIT] Starting auth, iOS device:', isIOS, 'UA:', navigator.userAgent.substring(0, 100));

    // CRITICAL: On iOS, we do NOT set loading=true at all to prevent any blocking
    // The app will work as guest until auth completes
    
    // Set up auth state listener FIRST (this is synchronous setup)
    let subscription: { unsubscribe: () => void } | null = null;
    
    try {
      const { data } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          if (!isMounted) return;
          
          console.log('[AUTH] State changed:', event, 'hasSession:', !!newSession);
          
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Fetch profile in background without blocking
          if (newSession?.user) {
            fetchUserProfile(newSession.user.id).catch(err => 
              console.error('[AUTH] Profile fetch error:', err)
            );
          } else {
            setUserType(null);
            setUserRole(null);
            setProfile(null);
          }
        }
      );
      subscription = data?.subscription;
    } catch (err) {
      console.error('[AUTH INIT] Failed to set up auth listener:', err);
    }

    // Check for existing session with AGGRESSIVE timeout for iOS
    const initializeAuth = async () => {
      const timeout = isIOS ? 1500 : 2000; // 1.5s on iOS, 2s elsewhere
      
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => {
            console.warn('[AUTH INIT] Session fetch timeout after', timeout, 'ms');
            resolve(null);
          }, timeout)
        );
        
        const result = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (!isMounted) return;
        
        if (result && 'data' in result) {
          const existingSession = result.data?.session || null;
          console.log('[AUTH INIT] Got session:', !!existingSession);
          
          if (existingSession) {
            setSession(existingSession);
            setUser(existingSession.user);
            
            // Fetch profile in background
            fetchUserProfile(existingSession.user.id).catch(err =>
              console.error('[AUTH INIT] Profile fetch error:', err)
            );
          }
        } else {
          console.log('[AUTH INIT] No session or timed out - continuing as guest');
        }
      } catch (error) {
        console.error('[AUTH INIT] Error:', error);
        // Don't block on errors - app continues as guest
      }
    };

    // Run auth init but don't wait for it
    initializeAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data && !error) {
        setProfile(data);
        setUserType(data.user_type);
        
        // Get user's primary role
        try {
          const { data: userRole } = await supabase.rpc('get_user_role', {
            user_id_param: userId
          });
          setUserRole(userRole || 'customer');
        } catch {
          setUserRole('customer');
        }
      } else {
        setUserType('customer');
        setUserRole('customer');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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