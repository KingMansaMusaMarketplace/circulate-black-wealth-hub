
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { initializeDatabase } from '@/lib/supabase-schema';
import { useToast } from '@/hooks/use-toast';

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

  // Function to initialize database tables
  const setupDatabase = async () => {
    setInitializingDatabase(true);
    try {
      const result = await initializeDatabase();
      if (result.success) {
        setDatabaseInitialized(true);
        console.log('Database initialized successfully');
      } else if (result.isDemo) {
        console.log('Running in demo mode with mock Supabase client');
      } else {
        console.error('Failed to initialize database:', result.error);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    } finally {
      setInitializingDatabase(false);
    }
  };

  // Create a profile in the profiles table
  const createUserProfile = async (userId: string, userMetadata: any) => {
    try {
      const { error } = await supabase.from('profiles').insert({
        id: userId,
        user_type: userMetadata.userType || 'customer',
        full_name: userMetadata.fullName || '',
        email: userMetadata.email || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      
      console.log('User profile created successfully');
      return { success: true };
    } catch (error: any) {
      console.error('Error creating user profile:', error);
      return { success: false, error };
    }
  };

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
    setupDatabase();

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

  const handleSignUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) throw error;
      
      // Create user profile in the database
      if (data.user) {
        await createUserProfile(data.user.id, { ...metadata, email });
      }
      
      toast({
        title: "Sign Up Successful!",
        description: "You're now registered with Mansa Musa Marketplace.",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive"
      });
      
      return { data: null, error };
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Login Successful",
        description: "Welcome back to Mansa Musa Marketplace!",
      });
      
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive"
      });
      
      return { data: null, error };
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserType(null);
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive"
      });
    }
  };

  const value = {
    user,
    loading,
    signUp: handleSignUp,
    signIn: handleSignIn,
    signOut: handleSignOut,
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
