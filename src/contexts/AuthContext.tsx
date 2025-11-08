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
    
    console.log('[AUTH INIT] Starting authentication initialization');

    // Reduced timeout to 3 seconds for faster app start
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('[AUTH INIT] TIMEOUT: Force completing auth after 3s');
        setLoading(false);
      }
    }, 3000);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('[AUTH] Auth state changed:', event);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when authenticated (without blocking)
        if (session?.user) {
          fetchUserProfile(session.user.id).catch(err => 
            console.error('[AUTH] Profile fetch error:', err)
          );
        } else {
          setUserType(null);
          setUserRole(null);
          setProfile(null);
        }
        
        if (isMounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    );

    // Check for existing session (with 2s timeout)
    const initializeAuth = async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 2000)
        );
        
        let result: any;
        try {
          result = await Promise.race([sessionPromise, timeoutPromise]);
        } catch (timeoutError) {
          console.warn('[AUTH INIT] Session fetch timed out, continuing without session');
          if (isMounted) {
            clearTimeout(timeoutId);
            setLoading(false);
          }
          return;
        }
        
        if (!isMounted) return;
        
        const session = result?.data?.session || null;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          fetchUserProfile(session.user.id).catch(err =>
            console.error('[AUTH INIT] Profile fetch error:', err)
          );
        }
        
        if (isMounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      } catch (error) {
        console.error('[AUTH INIT] Error:', error);
        if (isMounted) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
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