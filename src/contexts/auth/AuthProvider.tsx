
import React from 'react';
import { AuthContext } from './AuthContext';
import { useAuthState } from './hooks/useAuthState';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, actions] = useAuthState();

  return (
    <AuthContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AuthContext.Provider>
  );
};
