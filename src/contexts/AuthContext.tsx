
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  user_type?: 'customer' | 'business' | 'sales_agent';
  user_metadata?: {
    fullName?: string;
    name?: string;
    role?: string;
    is_admin?: boolean;
    is_customer?: boolean;
    is_agent?: boolean;
    avatar_url?: string;
    avatarUrl?: string;
  };
  app_metadata?: any;
  aud?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userType?: 'customer' | 'business' | 'sales_agent';
  authInitialized: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: any; data?: any }>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<boolean>;
  updateUserPassword?: (newPassword: string) => Promise<{ success: boolean; error?: any }>;
  getMFAFactors?: () => Promise<any[]>;
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
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState<'customer' | 'business' | 'sales_agent' | undefined>();
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    // Simulate checking for existing session
    const checkUser = async () => {
      try {
        // For now, just set loading to false and mark as initialized
        setLoading(false);
        setAuthInitialized(true);
      } catch (error) {
        console.error('Error checking user session:', error);
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Sign in attempt:', email);
      // Simulate sign in
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      console.log('Sign up attempt:', email, metadata);
      // Simulate sign up
      return { error: null, data: { user: { id: '1', email, user_metadata: metadata } } };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setUserType(undefined);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const checkSession = async () => {
    return false;
  };

  const updateUserPassword = async (newPassword: string) => {
    try {
      console.log('Updating password for user');
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const getMFAFactors = async () => {
    return [];
  };

  const value = {
    user,
    loading,
    userType,
    authInitialized,
    signIn,
    signUp,
    signOut,
    checkSession,
    updateUserPassword,
    getMFAFactors
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
