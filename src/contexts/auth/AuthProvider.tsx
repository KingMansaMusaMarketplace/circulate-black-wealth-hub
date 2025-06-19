
import React from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';
import { AuthActions } from './types';
import { handlePasswordReset, handleUpdatePassword, toastWrapper } from './hooks/authUtils';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const authState = useAuthState();
  
  // Define the auth actions
  const authActions: AuthActions = {
    signInWithEmail: async (email: string, password: string) => {
      // This would be implemented with actual Supabase auth
      return { error: null };
    },
    signInWithProvider: async (provider: 'google' | 'facebook' | 'github') => {
      // This would be implemented with actual Supabase auth
    },
    signInWithSocial: async (provider: 'google' | 'facebook' | 'github') => {
      // This would be implemented with actual Supabase auth
    },
    signUp: async (email: string, password: string, metadata?: object) => {
      // This would be implemented with actual Supabase auth
      return { error: null };
    },
    signOut: async () => {
      // This would be implemented with actual Supabase auth
    },
    setupMFA: async () => {
      // This would be implemented with actual Supabase MFA
    },
    checkSession: async () => {
      // This would be implemented with actual Supabase session check
      return true;
    },
    getMFAFactors: async () => {
      // This would be implemented with actual Supabase MFA
      return [];
    },
    signIn: async (email: string, password: string) => {
      // This would be implemented with actual Supabase auth
      return { error: null };
    },
    verifyMFA: async (factorId: string, code: string, challengeId: string) => {
      // This would be implemented with actual Supabase MFA
      return { error: null };
    },
    updateUserPassword: async (newPassword: string) => {
      try {
        const result = await handleUpdatePassword(newPassword, toastWrapper);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    resetPassword: async (email: string) => {
      try {
        const result = await handlePasswordReset(email, toastWrapper);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    }
  };

  const contextValue = {
    ...authState,
    ...authActions
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
