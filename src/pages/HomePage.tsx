
import React from 'react';
import { Navbar } from '@/components/navbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Mansa Musa Marketplace
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover and support Black-owned businesses, earn rewards, and help circulate Black wealth for generational legacy.
          </p>
          <div className="space-x-4">
            <Link to="/signup/business">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign Up as Business
              </Button>
            </Link>
            <Link to="/signup/customer">
              <Button variant="outline">
                Sign Up as Customer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
