
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      title: 'Subscribe',
      description: 'Join for just $10/month and unlock the full directory of Black-owned businesses.',
      icon: '💳'
    },
    {
      number: '02',
      title: 'Discover',
      description: 'Search by Category, Location, or Distance to find businesses near you.',
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Scan & Save',
      description: 'Visit a business, scan their QR code at checkout, and get instant discounts and loyalty points.',
      icon: '📱'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg text-mansablue mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Mansa Musa Marketplace makes it easy to discover, support, and save at Black-owned businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl">{step.icon}</span>
                <span className="text-mansagold font-bold text-xl">{step.number}</span>
              </div>
              <h3 className="font-bold text-xl mb-3 text-mansablue-dark">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-mansablue-dark rounded-xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="heading-md mb-6">Member Benefits</h3>
              <ul className="space-y-4">
                {[
                  'Save 10-20% every time you shop',
                  'Earn Loyalty Points redeemable for real rewards',
                  'Exclusive invites to "Circulate the Dollar" events',
                  'Early access to business promotions and limited deals',
                  'Be part of a growing movement — not just a transaction'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-mansagold mr-3 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="heading-md mb-6">Business Owner Benefits</h3>
              <ul className="space-y-4">
                {[
                  'Free first month to try the platform risk-free',
                  'Visibility to a growing base of loyal customers',
                  'Loyalty Points engine to retain customers longer',
                  'Tools to track customer engagement and QR scans',
                  'Increased brand awareness via Featured Business promotions'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-6 w-6 text-mansagold mr-3 flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
