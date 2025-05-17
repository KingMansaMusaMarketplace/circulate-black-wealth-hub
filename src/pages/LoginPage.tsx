
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

import AuthLayout from '@/components/auth/AuthLayout';
import LoginContainer from '@/components/auth/LoginContainer';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
  const { signIn } = useAuth();

  return (
    <AuthLayout>
      <LoginContainer 
        header={
          <>
            <motion.div 
              className="w-16 h-16 rounded-full bg-mansablue flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-white font-spartan font-bold text-xl">M</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-mansablue">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Sign in to continue building Black economic power
            </p>
          </>
        }
      >
        <LoginForm onSubmit={signIn} />
      </LoginContainer>
    </AuthLayout>
  );
};

export default LoginPage;
