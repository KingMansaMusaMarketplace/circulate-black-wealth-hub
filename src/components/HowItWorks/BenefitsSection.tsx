
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const BenefitsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg text-mansablue mb-4">Benefits for Everyone</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mansa Musa Marketplace creates value for customers, businesses, and the entire community.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-2xl font-bold mb-6">For Customers</h3>
            <ul className="space-y-4">
              {[
                'Save 10-20% every time you shop at participating businesses',
                'Earn Loyalty Points redeemable for real rewards',
                'Discover new Black-owned businesses easily',
                'Track your economic impact in the community',
                'Exclusive invites to "Circulate the Dollar" events',
                'Early access to business promotions and limited deals'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-mansagold mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-2xl font-bold mb-6">For Business Owners</h3>
            <ul className="space-y-4">
              {[
                'Free first month to try the platform risk-free',
                'Increased visibility to a loyal customer base',
                'Customer retention through loyalty program',
                'Detailed analytics on customer engagement',
                'Participation in community promotional events',
                'Featured placement opportunities in the app'
              ].map((benefit, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-mansagold mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
