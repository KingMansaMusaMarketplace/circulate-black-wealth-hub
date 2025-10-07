
import React from 'react';
import { RegistrationVerifier } from '@/components/auth/RegistrationVerifier';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const RegistrationTestPage = () => {
  const { user, userType } = useAuth();
  
  // Only allow access to authenticated administrative users
  const { userRole } = useAuth();
  const isAdmin = user && userRole === 'admin';
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access denied. You need administrative privileges to access this page.
          </AlertDescription>
        </Alert>
        <div className="text-center mt-8">
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Registration Flow Testing</h1>
      <p className="mb-4 text-gray-600">
        This page provides tools to test and verify that the frontend registration process correctly syncs with the backend database.
      </p>
      <Alert variant="default" className="mb-4 border border-yellow-200 bg-yellow-50">
        <AlertCircle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-700">
          This is a protected administrative tool. Access should be restricted in production.
        </AlertDescription>
      </Alert>
      <RegistrationVerifier />
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="font-medium text-yellow-800">Important Note</h3>
        <p className="text-sm text-yellow-700">
          This is a testing tool and should not be accessible in production.
          Test accounts are created with real database entries but use clearly marked test emails.
        </p>
      </div>
    </div>
  );
};

export default RegistrationTestPage;
