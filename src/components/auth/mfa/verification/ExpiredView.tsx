
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ExpiredViewProps {
  onCancel: () => void;
}

export const ExpiredView: React.FC<ExpiredViewProps> = ({ onCancel }) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verification Expired</CardTitle>
        <CardDescription>
          The verification challenge has expired. Please try logging in again.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onCancel}
          className="w-full"
        >
          Back to Login
        </Button>
      </CardContent>
    </Card>
  );
};
