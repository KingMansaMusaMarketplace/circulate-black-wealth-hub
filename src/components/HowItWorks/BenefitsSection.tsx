
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const BenefitsSection = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'businesses'>('customers');
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);

  const customerBenefits = [
    {
      title: 'Save Money',
      description: 'Save 10-20% every time you shop at participating Black-owned businesses.',
      details: 'Our partner businesses offer exclusive discounts to Mansa Musa members. These savings add up quickly, helping you keep more money in your pocket while supporting the community.'
    },
    {
      title: 'Earn Loyalty Points',
      description: 'Accumulate points with every purchase that can be redeemed for rewards.',
      details: 'The more you shop, the more you earn. Points can be redeemed for additional discounts, free products, or special services at participating businesses.'
    },
    {
      title: 'Exclusive Events',
      description: 'Get invited to "Circulate the Dollar" community events.',
      details: 'Network with like-minded individuals, entrepreneurs, and community leaders at our regular events focused on economic empowerment and community building.'
    },
    {
      title: 'Early Access',
      description: 'Be the first to know about new businesses, promotions, and deals.',
      details: 'Members receive notifications about new businesses joining the platform and get early access to limited-time offers before they're available to the general public.'
    },
  ];

  const businessBenefits = [
    {
      title: 'Greater Visibility',
      description: 'Get discovered by customers specifically looking to support Black-owned businesses.',
      details: 'Your business will be featured in our searchable directory, helping you reach customers who are already committed to supporting businesses like yours.'
    },
    {
      title: 'Customer Retention',
      description: 'Use our loyalty program to keep customers coming back.',
      details: 'Our built-in loyalty system helps you turn first-time visitors into repeat customers without having to build your own rewards program from scratch.'
    },
    {
      title: 'Valuable Analytics',
      description: 'Access data on customer engagement and purchasing patterns.',
      details: 'Gain insights into who your customers are, what they're buying, and when they're most likely to shop, helping you make informed business decisions.'
    },
    {
      title: 'Community Support',
      description: 'Join a network of Black entrepreneurs and business owners.',
      details: 'Connect with other business owners, share experiences, collaborate on projects, and support each other's growth through our business community.'
    },
  ];

  const currentBenefits = activeTab === 'customers' ? customerBenefits : businessBenefits;

  const toggleExpand = (index: number) => {
    setExpandedBenefit(expandedBenefit === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom px-4">
        <div className="text-center mb-12">
          <h2 className="heading-lg text-mansablue mb-4">Member Benefits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mansa Musa Marketplace offers unique advantages for both customers and business owners.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg p-1 bg-gray-200">
            <button
              onClick={() => setActiveTab('customers')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'customers' 
                  ? "bg-white text-mansablue shadow-sm" 
                  : "text-gray-600 hover:text-mansablue"
              )}
            >
              For Customers
            </button>
            <button
              onClick={() => setActiveTab('businesses')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'businesses' 
                  ? "bg-white text-mansablue shadow-sm" 
                  : "text-gray-600 hover:text-mansablue"
              )}
            >
              For Business Owners
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {currentBenefits.map((benefit, index) => (
            <Card 
              key={index} 
              className={cn(
                "transition-all duration-300 hover:shadow-md border-l-4",
                activeTab === 'customers' ? "border-l-mansablue" : "border-l-mansagold",
                expandedBenefit === index ? "shadow-md" : ""
              )}
            >
              <CardContent className="p-6">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleExpand(index)}
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 
                      className={cn(
                        "h-5 w-5 mt-1",
                        activeTab === 'customers' ? "text-mansablue" : "text-mansagold"
                      )} 
                    />
                    <div>
                      <h3 className="font-bold text-lg">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                  {expandedBenefit === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                
                {expandedBenefit === index && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t text-gray-600"
                  >
                    {benefit.details}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block rounded-lg bg-gradient-to-r from-mansablue to-mansablue-light p-1">
            <button className="bg-white text-mansablue font-medium py-2 px-8 rounded-md hover:bg-transparent hover:text-white transition-all">
              Join Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
