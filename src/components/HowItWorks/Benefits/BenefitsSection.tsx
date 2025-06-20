import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BenefitsHeader from './BenefitsHeader';
import BenefitsTabSwitcher from './BenefitsTabSwitcher';
import BenefitsList from './BenefitsList';
import NearbyBusinessesFeature from './NearbyBusinessesFeature';
import { Benefit } from './BenefitCard';

const BenefitsSection = () => {
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState<'customers' | 'businesses'>('customers');
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Ensure React is properly initialized before proceeding
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Intersection Observer to detect when section enters viewport
  useEffect(() => {
    if (!isReady) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const section = document.getElementById('benefits');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, [isReady]);

  // Don't render until React is ready
  if (!isReady) {
    return (
      <section id="benefits" className="py-16 bg-gray-50 relative">
        <div className="container-custom px-4">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  const customerBenefits: Benefit[] = [
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
      details: 'Members receive notifications about new businesses joining the platform and get early access to limited-time offers before they\'re available to the general public.'
    },
  ];

  const businessBenefits: Benefit[] = [
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
      details: 'Gain insights into who your customers are, what they\'re buying, and when they\'re most likely to shop, helping you make informed business decisions.'
    },
    {
      title: 'Community Support',
      description: 'Join a network of Black entrepreneurs and business owners.',
      details: 'Connect with other business owners, share experiences, collaborate on projects, and support each other\'s growth through our business community.'
    },
  ];

  const currentBenefits = activeTab === 'customers' ? customerBenefits : businessBenefits;

  return (
    <section id="benefits" className="py-16 bg-gray-50 relative">
      {/* Add decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Background pattern */}
        <div className="absolute right-0 top-10 w-32 h-32 bg-mansablue/5 rounded-full"></div>
        <div className="absolute left-10 bottom-20 w-24 h-24 bg-mansagold/5 rounded-full"></div>
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-1/4 w-3 h-3 rounded-full bg-mansablue/30"></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 rounded-full bg-mansagold/40"></div>
        <div className="absolute top-1/2 left-16 w-2 h-2 rounded-full bg-mansablue/20"></div>
        
        {/* Decorative lines */}
        <div className="absolute top-1/4 right-10 w-20 h-0.5 bg-gradient-to-r from-transparent to-mansablue/20"></div>
        <div className="absolute bottom-1/4 left-10 w-16 h-0.5 bg-gradient-to-r from-mansagold/20 to-mansagold/0"></div>
      </div>

      <div className="container-custom px-4">
        <BenefitsHeader isVisible={isVisible} />
        
        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BenefitsTabSwitcher 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </motion.div>

        {/* Highlight Feature - Show only for customers tab */}
        {activeTab === 'customers' && (
          <div className="mb-8">
            <NearbyBusinessesFeature isVisible={isVisible} />
          </div>
        )}

        <BenefitsList 
          benefits={currentBenefits}
          expandedBenefitIndex={expandedBenefit}
          setExpandedBenefit={setExpandedBenefit}
          isCustomer={activeTab === 'customers'}
          isVisible={isVisible}
        />

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/signup">
            <motion.div 
              className="inline-block rounded-lg bg-gradient-to-r from-mansablue to-mansablue-light p-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button className="bg-white text-mansablue font-medium py-2 px-8 rounded-md hover:bg-transparent hover:text-white transition-all">
                Join Now
              </button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSection;
