
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthenticationNotice: React.FC = () => {
  return (
    <Card className="max-w-2xl mx-auto border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800">
          <Lock className="h-5 w-5" />
          Login Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-amber-700 mb-4">
          To subscribe to a plan, you need to create an account or log in first.
        </p>
        <div className="flex gap-3">
          <Link to="/login" className="flex-1">
            <Button className="w-full">Login</Button>
          </Link>
          <Link to="/signup" className="flex-1">
            <Button variant="outline" className="w-full">Sign Up</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthenticationNotice;
