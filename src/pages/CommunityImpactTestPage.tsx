
import React from 'react';
import CommunityImpactTest from '@/components/testing/community-impact/CommunityImpactTest';
import Navbar from '@/components/navbar/Navbar';

const CommunityImpactTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-8">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Community Impact Test Suite</h1>
          <p className="text-blue-100">
            Comprehensive testing for Community Impact tracking functionality
          </p>
        </div>
      </div>

      <div className="py-8">
        <CommunityImpactTest />
      </div>
    </div>
  );
};

export default CommunityImpactTestPage;
