
import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Handle intersection observer to trigger animations
  React.useEffect(() => {
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

  const faqs = [
    {
      question: "Why do I need to pay a subscription?",
      answer: "Your subscription directly supports the ongoing development and maintenance of the platform. It also enables us to provide valuable discounts, loyalty programs, and other services. Subscriptions help us create a sustainable model that benefits both customers and businesses in the community."
    },
    {
      question: "How do businesses get verified?",
      answer: "We verify businesses through a thorough process that includes confirming business registration documents, validating Black ownership (51% or more), and checking business address and contact information. This ensures that all businesses on our platform meet our standards for quality and authenticity."
    },
    {
      question: "Can I use the app in any city?",
      answer: "Yes! Our marketplace is designed to work anywhere, though the density of participating businesses will vary by location. We're actively expanding our network of businesses across the country, with a focus on major urban areas first."
    },
    {
      question: "How do I redeem my loyalty points?",
      answer: "Loyalty points can be redeemed directly through the app. Simply visit the Rewards section, browse available rewards from participating businesses, and select the one you'd like to redeem. You'll receive a confirmation code that can be used at the business."
    },
    {
      question: "What happens if a business closes or leaves the platform?",
      answer: "If a business closes or leaves the platform, we'll notify members who have earned points with that business. Typically, you'll have a grace period to redeem any accumulated points before they expire. We also work to connect members with similar businesses in the area."
    },
    {
      question: "Can non-Black individuals sign up as customers and business owners?",
      answer: "Absolutely YES! Everyone is welcome. As a customer, you'll get access to unique businesses, earn loyalty rewards, receive exclusive discounts, and track your economic impact. As a business owner, you'll gain visibility, marketing tools, community partnerships, and access to a motivated customer base committed to supporting businesses in our ecosystem."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-gradient-to-br from-purple-50 via-blue-50 to-amber-50">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="heading-lg mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-mansablue bg-clip-text text-transparent font-extrabold">
            Frequently Asked Questions
          </h2>
          <p className="text-lg font-semibold bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent max-w-2xl mx-auto">
            Find answers to common questions about Mansa Musa Marketplace.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`} 
                  className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-xl px-6 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <AccordionTrigger className="text-left text-lg font-bold bg-gradient-to-r from-mansablue to-purple-600 bg-clip-text text-transparent hover:from-mansagold hover:to-orange-500 transition-all duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 font-medium leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-10 text-center bg-white/80 backdrop-blur-sm rounded-xl p-8 border-2 border-gradient-to-r from-purple-200 to-blue-200 shadow-lg">
              <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Still have questions?
              </p>
              <Link to="/contact">
                <Button className="bg-gradient-to-r from-mansagold via-amber-500 to-orange-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-500 text-white font-bold px-8 py-3 text-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Contact our support team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
