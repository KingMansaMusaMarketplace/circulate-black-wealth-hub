
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
      <Separator className="my-4 bg-white/10" />
      
      <motion.div 
        className="text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-2">
          <p className="text-slate-300">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-mansagold hover:text-amber-300 transition-colors duration-300 font-semibold"
            >
              Sign up
            </Link>
          </p>
          
          <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <DialogTrigger asChild>
              <button className="text-sm text-slate-400 hover:text-mansablue transition-colors duration-300 font-medium">
                Forgot your password?
              </button>
            </DialogTrigger>
            <DialogContent className="p-0 border-0 bg-transparent shadow-none">
              <PasswordResetForm onBack={() => setShowResetDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <p className="text-xs text-slate-500">
          By signing in, you're joining a movement to circulate wealth in the Black community.
        </p>
      </motion.div>
    </>
  );
};
