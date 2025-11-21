
import React from 'react';
import { Link } from 'react-router-dom';
import { CircleCheck, CircleUser, CircleDollarSign, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowItWorks = () => {
  return (
    <section className="py-12 bg-gray-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Earn rewards and build customer loyalty in just a few simple steps
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <CircleUser className="h-12 w-12 text-mansablue" />
            <h3 className="mt-5 text-lg font-medium text-gray-900">Sign Up</h3>
            <p className="mt-2 text-base text-gray-500">
              Join our platform as a business or customer in just minutes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <QrCode className="h-12 w-12 text-mansablue" />
            <h3 className="mt-5 text-lg font-medium text-gray-900">Scan QR Codes</h3>
            <p className="mt-2 text-base text-gray-500">
              Businesses generate QR codes, customers scan to earn points.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <CircleDollarSign className="h-12 w-12 text-mansablue" />
            <h3 className="mt-5 text-lg font-medium text-gray-900">Shop & Earn Points</h3>
            <p className="mt-2 text-base text-gray-500">
              Make purchases at businesses, scan QR codes, and earn loyalty points with every transaction.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <CircleCheck className="h-12 w-12 text-mansablue" />
            <h3 className="mt-5 text-lg font-medium text-gray-900">Redeem at Businesses</h3>
            <p className="mt-2 text-base text-gray-500">
              Use your earned points for discounts on products, services, and special offers at participating locations.
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Button 
            asChild
            variant="link"
            className="text-mansablue font-medium hover:text-blue-700 cursor-pointer min-h-[44px] text-lg"
          >
            <Link to="/signup">
              Get Started Today <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
