
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
      answer: "Customers are ALWAYS FREE with full access to loyalty programs, QR scanning, and rewards. Businesses are 100% FREE until January 1, 2026, then will have affordable subscription plans. Corporate sponsorships (for companies wanting to support the platform) are available now starting at $500/month."
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
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-mansablue mb-8 text-center">Frequently Asked Questions</h1>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
