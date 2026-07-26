import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-10 w-10 text-red-400" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-base text-slate-300 mb-8 leading-relaxed">
          You don't have permission to view this page. If you believe this is a mistake, please sign in with the right account or contact support.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-mansagold text-slate-900 hover:bg-mansagold/90 font-bold rounded-xl">
            <Link to="/"><Home className="h-4 w-4 mr-2" />Back to Home</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
            <Link to="/auth"><LogIn className="h-4 w-4 mr-2" />Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
