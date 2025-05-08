
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
    const result = await verifyUserMFA(factorId, code, challengeId);
    
    // Clear the MFA challenge after verification attempt
    if (result.success) {
      setCurrentMFAChallenge(null);
    }
    
    return result;
  };

  // Get the current MFA challenge
  const getCurrentMFAChallenge = () => {
    return currentMFAChallenge;
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user?.user_metadata?.userType) {
          setUserType(session.user.user_metadata.userType);
        } else {
          setUserType(null);
        }
        
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          toast.success('You have successfully signed in!');
          // Fetch MFA factors when user signs in
          getMFAFactors();
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out');
          setMfaFactors([]);
          setMfaEnrolled(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user?.user_metadata?.userType) {
        setUserType(session.user.user_metadata.userType);
      }
      
      setLoading(false);
      
      // Fetch MFA factors if user is already signed in
      if (session?.user) {
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
    signUp: (email: string, password: string, metadata?: any) => 
      handleUserSignUp(email, password, metadata, toastWrapper),
    signIn: (email: string, password: string) =>
      enhancedSignIn(email, password, setUser, getMFAFactors, setCurrentMFAChallenge, toastWrapper),
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
