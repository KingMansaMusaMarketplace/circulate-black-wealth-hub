
import React from 'react';
import { CircleCheck, CircleUser, CircleDollarSign, QrCode } from 'lucide-react';

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
            <h3 className="mt-5 text-lg font-medium text-gray-900">Sign Up Free</h3>
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
            <h3 className="mt-5 text-lg font-medium text-gray-900">Earn Points</h3>
            <p className="mt-2 text-base text-gray-500">
              Build points with each visit, purchase, or social share.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <CircleCheck className="h-12 w-12 text-mansablue" />
            <h3 className="mt-5 text-lg font-medium text-gray-900">Redeem Rewards</h3>
            <p className="mt-2 text-base text-gray-500">
              Use points for discounts, free items, or special offers.
            </p>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <a href="/signup" className="text-mansablue font-medium hover:text-blue-700">
            Get Started Today <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
