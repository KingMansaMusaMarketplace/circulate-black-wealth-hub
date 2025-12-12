
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthenticationNotice: React.FC = () => {
  return (
    <Card className="max-w-2xl mx-auto border-white/10 bg-slate-900/70 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-mansagold">
          <Lock className="h-5 w-5" />
          <span className="text-slate-100">Login Required</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300 mb-4">
          To subscribe to a plan, you need to create an account or log in first.
        </p>
        <div className="flex gap-3">
          <Button className="flex-1" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button variant="outline" className="flex-1 border-white/30 text-slate-100 hover:bg-slate-800/80" asChild>
            <Link to="/signup">Sign Up</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthenticationNotice;
