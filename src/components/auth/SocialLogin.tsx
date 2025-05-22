
import React from 'react';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { useAuth } from '@/contexts/auth';

interface SocialLoginProps {
  type?: 'signup' | 'login';
}

const SocialLogin: React.FC<SocialLoginProps> = ({ type = 'login' }) => {
  const { signInWithSocial } = useAuth();

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'github') => {
    signInWithSocial(provider);
  };

  return (
    <div className="flex flex-col space-y-3">
      <Button
        type="button"
        variant="outline"
        className="flex items-center"
        onClick={() => handleSocialLogin('google')}
      >
        <FaGoogle className="mr-2 h-4 w-4" />
        {type === 'signup' ? 'Sign up' : 'Sign in'} with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex items-center"
        onClick={() => handleSocialLogin('facebook')}
      >
        <FaFacebook className="mr-2 h-4 w-4" />
        {type === 'signup' ? 'Sign up' : 'Sign in'} with Facebook
      </Button>
      <Button
        type="button"
        variant="outline"
        className="flex items-center"
        onClick={() => handleSocialLogin('github')}
      >
        <FaGithub className="mr-2 h-4 w-4" />
        {type === 'signup' ? 'Sign up' : 'Sign in'} with GitHub
      </Button>
    </div>
  );
};

export default SocialLogin;
