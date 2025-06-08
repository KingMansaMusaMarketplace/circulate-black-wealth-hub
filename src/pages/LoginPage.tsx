
import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '@/components/Navbar';
import LoginContainer from '@/components/auth/LoginContainer';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Login | Mansa Musa Marketplace</title>
      </Helmet>
      
      <Navbar />
      
      <div className="flex min-h-screen">
        <LoginContainer />
      </div>
    </div>
  );
};

export default LoginPage;
