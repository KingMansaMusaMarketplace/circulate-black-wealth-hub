
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from 'react-router-dom';

const FAQSection = () => {
  const faqs = [
    {
      question: "How is Mansa Musa Marketplace different from other marketplaces?",
      answer: "Unlike traditional marketplaces that simply facilitate transactions, Mansa Musa Marketplace is designed with economic circulation as its core principle. We track, measure, and incentivize spending within Black-owned businesses, creating a virtuous cycle of economic empowerment."
    },
    {
      question: "Who was Mansa Musa and why name the platform after him?",
      answer: "Mansa Musa was the 10th Emperor of Mali who ruled in the 14th century and is widely considered to be the wealthiest person in history. His economic influence and strategic wealth building serves as inspiration for our mission of creating sustainable Black wealth circulation systems."
    },
    {
      question: "How are businesses vetted for inclusion in the marketplace?",
      answer: "We have a thorough verification process that confirms Black ownership (at least 51%), ensures businesses are properly registered, and reviews business standing. We also gather community feedback to ensure businesses align with our quality standards and mission."
    },
    {
      question: "What percentage of transaction fees go back to the community?",
      answer: "40% of our transaction fees are reinvested directly into community development programs, business grants, and financial literacy initiatives. Another 35% goes to platform development and expansion to serve more communities."
    },
    {
      question: "Can non-Black individuals sign up as customers and business owners?",
      answer: "Absolutely YES! The marketplace welcomes everyone. As a customer, you'll enjoy: • Access to unique Black-owned businesses and products • Loyalty rewards and exclusive discounts • Community event invitations • Impact tracking to see your economic contribution. As a business owner (of any background), you'll benefit from: • Access to a motivated customer base • Marketing and visibility tools • Community partnerships and networking • Support for businesses committed to economic empowerment."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-400/20 to-purple-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container-custom relative">
        <div className="text-center mb-12">
          <h2 className="heading-md bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto mb-6 shadow-lg shadow-purple-500/50"></div>
          <p className="text-lg font-medium bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent max-w-2xl mx-auto">
            Common questions about our mission, operations, and impact.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border-2 border-purple-200">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b-2 border-purple-100">
                <AccordionTrigger className="text-left font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 py-4 transition-all">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-gray-700 text-lg mb-4">
              Have more questions about our platform or mission?
            </p>
            <Link to="/team-contact" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold hover:from-purple-600 hover:to-pink-600 transition-all">
              Contact our team for more information →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
