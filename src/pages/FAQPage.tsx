
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
      answer: "Customers are ALWAYS FREE with full access to loyalty programs, QR scanning, and rewards. Businesses are 100% FREE until February 28, 2026, then will have affordable subscription plans. Corporate sponsorships (for companies wanting to support the platform) are available now starting at $500/month."
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-mansagold/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[32rem] h-[32rem] bg-mansablue/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-mansablue via-blue-700 to-blue-800 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mansagold via-amber-400 to-yellow-400"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-lg mb-3">
              Frequently Asked <span className="text-mansagold">Questions</span>
            </h1>
            <p className="text-white/90 text-center text-lg drop-shadow-md">
              Find answers to common questions about Mansa Musa Marketplace
            </p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-mansablue/20">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-mansablue/20">
                <AccordionTrigger className="text-left text-mansablue hover:text-blue-700 font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
