
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const BenefitsSection = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'businesses'>('customers');
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Intersection Observer to detect when section enters viewport
  useEffect(() => {
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
  }, []);

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
      details: 'Members receive notifications about new businesses joining the platform and get early access to limited-time offers before they\'re available to the general public.'
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
      details: 'Gain insights into who your customers are, what they\'re buying, and when they\'re most likely to shop, helping you make informed business decisions.'
    },
    {
      title: 'Community Support',
      description: 'Join a network of Black entrepreneurs and business owners.',
      details: 'Connect with other business owners, share experiences, collaborate on projects, and support each other\'s growth through our business community.'
    },
  ];

  const currentBenefits = activeTab === 'customers' ? customerBenefits : businessBenefits;

  const toggleExpand = (index: number) => {
    setExpandedBenefit(expandedBenefit === index ? null : index);
  };

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
        <div className="absolute top-1/4 right-10 w-20 h-0.5 bg-gradient-to-r from-mansablue/0 to-mansablue/20"></div>
        <div className="absolute bottom-1/4 left-10 w-16 h-0.5 bg-gradient-to-r from-mansagold/20 to-mansagold/0"></div>
      </div>

      <div className="container-custom px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg text-mansablue mb-4">Member Benefits</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mansa Musa Marketplace offers unique advantages for both customers and business owners.
          </p>
        </motion.div>

        <motion.div 
          className="flex justify-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="inline-flex rounded-lg p-1 bg-gray-200">
            <motion.button
              onClick={() => setActiveTab('customers')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'customers' 
                  ? "bg-white text-mansablue shadow-sm" 
                  : "text-gray-600 hover:text-mansablue"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              For Customers
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('businesses')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'businesses' 
                  ? "bg-white text-mansablue shadow-sm" 
                  : "text-gray-600 hover:text-mansablue"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              For Business Owners
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {currentBenefits.map((benefit, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card 
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
                    <motion.div 
                      whileHover={{ scale: 1.2 }} 
                      whileTap={{ scale: 0.9 }}
                    >
                      {expandedBenefit === index ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </motion.div>
                  </div>
                  
                  {expandedBenefit === index && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t text-gray-600"
                    >
                      {benefit.details}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

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
