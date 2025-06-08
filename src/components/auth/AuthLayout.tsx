
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      {children}
    </main>
  );
};

export default AuthLayout;
