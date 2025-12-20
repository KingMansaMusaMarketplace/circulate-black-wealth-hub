
import React from 'react';
import { Helmet } from 'react-helmet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { HelpCircle, Sparkles } from 'lucide-react';

const FAQPage = () => {
  const faqs = [
    {
      question: "What is Mansa Musa Marketplace?",
      answer: "Mansa Musa Marketplace is a platform that connects consumers with Black-owned businesses, helping to strengthen community wealth through strategic economic circulation."
    },
    {
      question: "How do I sign up?",
      answer: "You can sign up by clicking the 'Sign Up' button in the top right corner of any page. Choose whether you're a customer or business owner and follow the registration process."
    },
    {
      question: "Is there a fee to use the platform?",
      answer: "Customers are ALWAYS FREE with full access to loyalty programs, QR scanning, and rewards. Businesses are 100% FREE until March 31, 2026, then will have affordable subscription plans. Corporate sponsorships (for companies wanting to support the platform) are available now starting at $500/month."
    },
    {
      question: "How do I find businesses near me?",
      answer: "Use our directory page to search for businesses by location, category, or keywords. You can also enable location services to find businesses closest to you."
    },
    {
      question: "What are loyalty points?",
      answer: "Loyalty points are earned when you shop at participating businesses. You can redeem these points for discounts, rewards, and special offers."
    },
    {
      question: "How do I add my business to the platform?",
      answer: "Sign up as a business owner and complete your business profile. Once verified, your business will be listed in our directory."
    },
    {
      question: "Can non-Black individuals sign up as customers and business owners?",
      answer: "Absolutely YES! Everyone is welcome. As a customer, you'll get access to unique businesses, earn loyalty rewards, receive exclusive discounts, and track your economic impact. As a business owner, you'll gain visibility, marketing tools, community partnerships, and access to a motivated customer base committed to supporting businesses in our ecosystem."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-mansablue-dark via-mansablue to-mansablue-dark relative overflow-hidden">
      <Helmet>
        <title>FAQ - Frequently Asked Questions | Mansa Musa Marketplace</title>
        <meta name="description" content="Find answers to common questions about Mansa Musa Marketplace - how to sign up, use loyalty points, and support Black-owned businesses." />
      </Helmet>

      {/* Premium ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-mansagold/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-[150px]" />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-mansagold/10 backdrop-blur-sm border border-mansagold/30 rounded-full px-6 py-3 mb-8 shadow-lg shadow-mansagold/20"
          >
            <Sparkles className="w-5 h-5 text-mansagold animate-pulse" />
            <span className="font-semibold text-white">Help Center</span>
          </motion.div>

          <div className="inline-block mb-6">
            <motion.div 
              className="p-5 bg-gradient-to-br from-mansagold to-amber-600 rounded-2xl shadow-2xl shadow-mansagold/30"
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
              transition={{ duration: 0.5 }}
            >
              <HelpCircle className="h-16 w-16 text-mansablue-dark" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-playfair">
            <span className="text-white">Frequently Asked </span>
            <span className="bg-gradient-to-r from-mansagold via-amber-300 to-mansagold bg-clip-text text-transparent">
              Questions
            </span>
          </h1>
          <p className="text-xl text-white/80">
            Find answers to common questions about Mansa Musa Marketplace
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 md:p-10">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.4 }}
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className="border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left text-white hover:text-mansagold font-semibold px-6 py-5 text-lg hover:no-underline">
                      <span className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mansagold/20 flex items-center justify-center text-mansagold text-sm font-bold">
                          {index + 1}
                        </span>
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70 px-6 pb-5 pt-0 leading-relaxed text-base">
                      <div className="pl-11">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="backdrop-blur-xl bg-gradient-to-r from-mansagold/10 to-amber-500/10 border border-mansagold/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
            <p className="text-white/70 mb-6">
              Our team is here to help. Reach out and we'll get back to you as soon as possible.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-mansagold to-amber-500 text-mansablue-dark font-bold rounded-xl hover:shadow-lg hover:shadow-mansagold/30 transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQPage;
