
import React from 'react';
import { Repeat, Users, Zap, TrendingUp } from 'lucide-react';

const WhySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-mansablue font-semibold tracking-wide uppercase">Why Choose Us</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Empower Your Business Growth
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Join thousands of businesses and customers in our growing ecosystem
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-mansablue text-white">
                  <Repeat className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Increase Customer Loyalty</h3>
                <p className="mt-2 text-base text-gray-500">
                  Our platform helps you create meaningful relationships with your customers, encouraging repeat business and fostering brand loyalty.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-mansablue text-white">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Data-Driven Insights</h3>
                <p className="mt-2 text-base text-gray-500">
                  Gain valuable insights into customer behavior patterns, preferences, and purchasing habits to optimize your business strategies.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-mansablue text-white">
                  <Zap className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Easy Implementation</h3>
                <p className="mt-2 text-base text-gray-500">
                  Get started in minutes with our user-friendly platform. No technical expertise required—just sign up and start rewarding your customers.
                </p>
              </div>
            </div>

            <div className="flex">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-mansablue text-white">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Community Impact</h3>
                <p className="mt-2 text-base text-gray-500">
                  Join a network of businesses building stronger local economies and communities through innovative customer engagement strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
