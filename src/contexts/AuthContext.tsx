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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile when authenticated
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserType(null);
          setUserRole(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
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
        
        // Check roles using the new secure system
        const { data: hasAdminRole } = await supabase.rpc('has_role', {
          _user_id: userId,
          _role: 'admin'
        });
        
        if (hasAdminRole) {
          setUserRole('admin');
        } else {
          // Check other roles as needed
          const { data: hasModeratorRole } = await supabase.rpc('has_role', {
            _user_id: userId,
            _role: 'moderator'
          });
          setUserRole(hasModeratorRole ? 'moderator' : 'user');
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
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
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
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