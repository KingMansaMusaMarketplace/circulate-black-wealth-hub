
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AuthLayout;
