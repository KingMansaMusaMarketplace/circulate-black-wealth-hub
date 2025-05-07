
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const FAQSection = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const section = document.getElementById('faq');
    if (section) observer.observe(section);
    
    return () => {
      if (section) observer.unobserve(section);
    };
  }, []);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Why do I need to pay a subscription?",
      answer: "Your subscription fee helps maintain the platform infrastructure and supports our ability to provide quality service without selling your data. It also ensures we're accountable to you, not advertisers."
    },
    {
      question: "How do businesses get verified?",
      answer: "Businesses go through a verification process to confirm they are Black-owned. This includes business registration documentation review and ownership confirmation."
    },
    {
      question: "Can I use the app in any city?",
      answer: "We're launching city by city to ensure quality. Check our current coverage areas in the app, and vote for your city to be included next!"
    },
    {
      question: "How do I redeem my loyalty points?",
      answer: "Loyalty points can be redeemed through the app for discounts, merchandise, or special offers from participating businesses once you reach point thresholds."
    },
    {
      question: "What happens if a business closes or leaves the platform?",
      answer: "We regularly update our directory to remove closed businesses. If you have loyalty points with that business specifically, we'll provide options to transfer them to another business."
    }
  ];

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

  return (
    <section id="faq" className="py-8">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg text-mansablue mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about Mansa Musa Marketplace.
          </p>
        </motion.div>
        
        <motion.div 
          className="max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              className={cn(
                "border-b border-gray-200 py-3 transition-all duration-300",
                expandedFaq === i ? "bg-gray-50 rounded-lg px-4 -mx-4" : ""
              )}
              variants={itemVariants}
            >
              <div 
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFaq(i)}
              >
                <h3 className={cn(
                  "text-xl font-bold transition-colors duration-300",
                  expandedFaq === i ? "text-mansablue" : "text-gray-800"
                )}>
                  {faq.question}
                </h3>
                <motion.div 
                  whileHover={{ scale: 1.2 }} 
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "rounded-full p-1 transition-colors duration-300",
                    expandedFaq === i ? "bg-mansablue/10 text-mansablue" : "text-gray-400"
                  )}
                >
                  {expandedFaq === i ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-600 mt-2">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-gray-600">
            Still have questions? 
            <motion.a 
              href="/contact" 
              className="text-mansablue font-medium ml-2 inline-block"
              whileHover={{ scale: 1.05 }}
            >
              Contact our support team
            </motion.a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
