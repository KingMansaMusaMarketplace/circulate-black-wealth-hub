
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { setupDatabase } from '@/lib/database-init';
import { handleSignUp, handleSignIn, handleSignOut } from '@/lib/auth-operations';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  userType: 'customer' | 'business' | null;
  initializingDatabase: boolean;
  databaseInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializingDatabase, setInitializingDatabase] = useState(false);
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getCurrentUser();
        setUser(data.user);
        
        if (data.user?.user_metadata?.userType) {
          setUserType(data.user.user_metadata.userType);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    setupDatabase(setInitializingDatabase, setDatabaseInitialized);

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        if (session?.user?.user_metadata?.userType) {
          setUserType(session.user.user_metadata.userType);
        } else {
          setUserType(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    loading,
    signUp: (email: string, password: string, metadata?: any) => 
      handleSignUp(email, password, metadata, props => toast(props)),
    signIn: (email: string, password: string) => 
      handleSignIn(email, password, props => toast(props)),
    signOut: async () => {
      const result = await handleSignOut(props => toast(props));
      if (result.success) {
        setUser(null);
        setUserType(null);
      }
    },
    userType,
    initializingDatabase,
    databaseInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
