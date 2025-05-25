
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
      question: "Can non-Black consumers use the marketplace?",
      answer: "Absolutely! The marketplace is open to all consumers who want to support Black-owned businesses and participate in economic empowerment. Our loyalty systems reward all participants who help circulate dollars within the ecosystem."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-md text-mansablue mb-4">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-mansagold mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Common questions about our mission, operations, and impact.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left font-medium text-mansablue-dark hover:text-mansablue py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Have more questions about our platform or mission?
            </p>
            <Link to="/team-contact" className="text-mansablue font-medium hover:underline">
              Contact our team for more information →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
