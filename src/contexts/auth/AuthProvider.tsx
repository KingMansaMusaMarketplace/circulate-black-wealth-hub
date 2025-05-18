import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Provider, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { setupDatabase, checkDatabaseInitialized } from '@/lib/database-init';
import { AuthContextType, Factor, MFAChallenge, ToastProps } from './types';
import { 
  enhancedSignIn, 
  handleUserSignUp, 
  handleUserSignOut, 
  handleUserSocialSignIn,
  handlePasswordReset,
  handleUpdatePassword,
  checkUserSession,
  toastWrapper
} from './authUtils';
import { getMFAFactors as fetchMFAFactors, verifyMFA as verifyUserMFA } from './mfaUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<'customer' | 'business' | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializingDatabase, setInitializingDatabase] = useState(false);
  const [databaseInitialized, setDatabaseInitialized] = useState(false);
  const [mfaFactors, setMfaFactors] = useState<Factor[]>([]);
  const [mfaEnrolled, setMfaEnrolled] = useState(false);
  const [currentMFAChallenge, setCurrentMFAChallenge] = useState<MFAChallenge | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Get MFA factors for the current user
  const getMFAFactors = async (): Promise<Factor[]> => {
    if (!user) return [];
    
    try {
      const factors = await fetchMFAFactors(user.id);
      setMfaFactors(factors);
      setMfaEnrolled(factors.length > 0);
      
      return factors;
    } catch (error) {
      console.error('Error in getMFAFactors:', error);
      return [];
    }
  };

  // Verify an MFA challenge
  const verifyMFA = async (factorId: string, code: string, challengeId: string) => {
    console.log("Verifying MFA:", { factorId, code, challengeId });
    const result = await verifyUserMFA(factorId, code, challengeId);
    
    // Clear the MFA challenge after verification attempt
    if (result.success) {
      console.log("MFA verification successful");
      setCurrentMFAChallenge(null);
      // Update session after successful MFA
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        if (data.session.user?.user_metadata?.userType) {
          setUserType(data.session.user.user_metadata.userType);
        }
      }
    } else {
      console.error("MFA verification failed:", result);
    }
    
    return result;
  };

  // Get the current MFA challenge
  const getCurrentMFAChallenge = () => {
    return currentMFAChallenge;
  };

  useEffect(() => {
    console.log("AuthProvider initialized");
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession);
        
        // Always update the session state
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user?.user_metadata?.userType) {
          console.log("Setting user type from metadata:", currentSession.user.user_metadata.userType);
          setUserType(currentSession.user.user_metadata.userType);
        } else if (currentSession?.user) {
          // Attempt to get user type from profiles if not in metadata
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', currentSession.user.id)
              .single();
            
            if (profileData) {
              console.log("Setting user type from profile:", profileData.user_type);
              setUserType(profileData.user_type as 'customer' | 'business' | null);
            }
          } catch (error) {
            console.error('Error fetching user type from profile:', error);
          }
        } else {
          setUserType(null);
        }
        
        setLoading(false);
        setAuthInitialized(true);
        
        if (event === 'SIGNED_IN') {
          console.log("User signed in, user type:", currentSession?.user?.user_metadata?.userType);
          toast.success('You have successfully signed in!');
          // Fetch MFA factors when user signs in
          getMFAFactors();
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out');
          setMfaFactors([]);
          setMfaEnrolled(false);
        } else if (event === 'USER_UPDATED' && currentSession) {
          getMFAFactors();
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Initial session check:", !!currentSession);
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user?.user_metadata?.userType) {
        console.log("Setting initial user type from metadata:", currentSession.user.user_metadata.userType);
        setUserType(currentSession.user.user_metadata.userType);
      } else if (currentSession?.user) {
        // Attempt to get user type from profiles if not in metadata
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', currentSession.user.id)
            .single();
          
          if (profileData) {
            console.log("Setting initial user type from profile:", profileData.user_type);
            setUserType(profileData.user_type as 'customer' | 'business' | null);
          }
        } catch (error) {
          console.error('Error fetching user type from profile:', error);
        }
      }
      
      setLoading(false);
      setAuthInitialized(true);
      
      // Fetch MFA factors if user is already signed in
      if (currentSession?.user) {
        getMFAFactors();
      }
    });

    // Check if database is initialized
    checkDatabaseInitialized().then((initialized) => {
      setDatabaseInitialized(initialized);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    authInitialized,
    signUp: async (email: string, password: string, metadata?: any) => {
      console.log("Signing up with metadata:", metadata);
      const result = await handleUserSignUp(email, password, metadata, toastWrapper);
      // If signup was successful and we have a session, update the auth state
      if (result.data?.session) {
        setUser(result.data.user || null);
        setSession(result.data.session);
        if (metadata?.userType) {
          setUserType(metadata.userType);
        }
      }
      return result;
    },
    signIn: async (email: string, password: string) => {
      console.log("Signing in:", email);
      const result = await enhancedSignIn(
        email, 
        password, 
        setUser, 
        getMFAFactors, 
        setCurrentMFAChallenge, 
        toastWrapper
      );
      if (result.data?.session) {
        setUser(result.data.user || null);
        setSession(result.data.session);
        const userType = result.data.user?.user_metadata?.userType;
        if (userType) {
          console.log("Setting user type after sign in:", userType);
          setUserType(userType);
        }
      }
      return result;
    },
    signInWithSocial: (provider: Provider) =>
      handleUserSocialSignIn(provider, toastWrapper),
    signOut: async () => {
      const result = await handleUserSignOut(toastWrapper);
      if (result.success) {
        setUser(null);
        setSession(null);
        setUserType(null);
        setMfaFactors([]);
        setMfaEnrolled(false);
        setCurrentMFAChallenge(null);
      }
      return result;
    },
    resetPassword: (email: string) =>
      handlePasswordReset(email, toastWrapper),
    updateUserPassword: (newPassword: string) =>
      handleUpdatePassword(newPassword, toastWrapper),
    userType,
    initializingDatabase,
    databaseInitialized,
    checkSession: checkUserSession,
    mfaEnrolled,
    mfaFactors,
    verifyMFA,
    getMFAFactors,
    getCurrentMFAChallenge
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
