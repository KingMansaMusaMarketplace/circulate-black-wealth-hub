
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import PasswordResetForm from '@/components/auth/forms/PasswordResetForm';

export const FooterSection: React.FC = () => {
  const [showResetDialog, setShowResetDialog] = useState(false);

  return (
    <>
      <Separator className="my-4" />
      
      <motion.div 
        className="text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-2">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-mansablue hover:text-mansagold transition-colors font-medium"
            >
              Sign up
            </Link>
          </p>
          
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <button className="text-sm text-gray-500 hover:text-mansablue transition-colors">
                Forgot your password?
              </button>
            </DialogTrigger>
            <DialogContent className="p-0 border-0 bg-transparent shadow-none">
              <PasswordResetForm onBack={() => setShowResetDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-xs text-gray-500">
          By signing in, you're joining a movement to circulate wealth in the Black community.
        </p>
      </motion.div>
    </>
  );
};
