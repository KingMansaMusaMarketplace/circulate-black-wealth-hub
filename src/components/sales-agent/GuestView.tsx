
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, DollarSign, Medal, Users } from 'lucide-react';

const GuestView: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Hero section */}
      <div className="text-center py-8 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Become a Mansa Musa Marketplace Sales Agent</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Join our growing team of sales agents and earn commissions by connecting businesses and customers to the Mansa Musa Marketplace.
        </p>
        <Button asChild size="lg" className="bg-mansablue hover:bg-mansablue-dark">
          <a href="/login?redirect=/sales-agent">
            Sign In to Apply <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
      </div>

      {/* Benefits grid */}
      <div className="bg-gray-50 py-12 px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Benefits of Becoming a Sales Agent</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-mansablue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-mansablue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Earn Commissions</h3>
            <p className="text-gray-600">
              Receive 10% commission on all subscription fees from businesses and customers you refer to our platform.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-mansablue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Medal className="h-6 w-6 text-mansablue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Performance Rewards</h3>
            <p className="text-gray-600">
              Top-performing agents receive bonuses, recognition, and exclusive access to special events.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-mansablue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-mansablue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Impact</h3>
            <p className="text-gray-600">
              Help build wealth in Black communities by connecting businesses with customers who value supporting them.
            </p>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">How the Sales Agent Program Works</h2>
        
        <ol className="space-y-8">
          <li className="flex gap-4">
            <div className="bg-mansablue text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold">1</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Sign Up & Apply</h3>
              <p className="text-gray-600">
                Create an account and complete the sales agent application. Our team will review your application.
              </p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="bg-mansablue text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold">2</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Pass the Qualification Test</h3>
              <p className="text-gray-600">
                Complete a simple test about Mansa Musa Marketplace to ensure you can represent us effectively.
              </p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="bg-mansablue text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold">3</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Receive Your Referral Code</h3>
              <p className="text-gray-600">
                Once approved, you'll get a unique referral code to share with businesses and customers.
              </p>
            </div>
          </li>
          
          <li className="flex gap-4">
            <div className="bg-mansablue text-white rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold">4</div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Start Earning</h3>
              <p className="text-gray-600">
                Every time someone signs up with your code, you'll earn a 10% commission on their subscription fees.
              </p>
            </div>
          </li>
        </ol>
      </div>

      {/* CTA section */}
      <div className="bg-mansablue py-12 px-4 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Join Our Sales Agent Team?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Sign up today and start earning commissions while helping to build wealth in Black communities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="outline" size="lg" className="bg-white text-mansablue hover:bg-gray-100" asChild>
            <a href="/login?redirect=/sales-agent">
              Login to Apply
            </a>
          </Button>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20" asChild>
            <a href="/signup">
              Create an Account
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuestView;
