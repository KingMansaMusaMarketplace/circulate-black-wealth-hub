
import React from 'react';
import { RegistrationVerifier } from '@/components/auth/RegistrationVerifier';

const RegistrationTestPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Registration Flow Testing</h1>
      <p className="mb-4 text-gray-600">
        This page provides tools to test and verify that the frontend registration process correctly syncs with the backend database.
      </p>
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
