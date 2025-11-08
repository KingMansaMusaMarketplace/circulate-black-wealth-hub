import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const SalesAgentFAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How do I become a sales agent?",
      answer: "To become a sales agent, you need to complete our application form, pass a qualification test, and get approved by our team. Once approved, you'll receive your unique referral code and can start earning commissions immediately."
    },
    {
      question: "What commission rates do you offer?",
      answer: "Sales agents earn 10-15% commission on business subscriptions only. Individual customer sign-ups do not earn commissions. For recurring business subscriptions, you'll continue earning monthly commissions for 2 years."
    },
    {
      question: "How and when do I get paid?",
      answer: "Commissions are paid monthly via direct deposit or check. Payments are processed on the 15th of each month for the previous month's earnings. You'll need to reach a minimum payout threshold of $50."
    },
    {
      question: "What support do you provide to sales agents?",
      answer: "We provide comprehensive support including marketing materials, training resources, a dedicated agent portal, regular webinars, and 24/7 customer support. You'll also have access to our agent community forum."
    },
    {
      question: "Can I track my referrals and earnings?",
      answer: "Yes! Our sales agent dashboard provides real-time tracking of your referrals, earnings, payout history, and performance analytics. You can see which referrals converted and track your monthly progress."
    },
    {
      question: "Are there any fees to become a sales agent?",
      answer: "No, there are absolutely no fees to become a sales agent. The program is completely free to join, and we provide all the necessary marketing materials and support at no cost to you."
    },
    {
      question: "What happens if my referral cancels their subscription?",
      answer: "If a referred customer cancels within their first month, the commission for that referral will be reversed. However, any commissions earned from previous months will remain yours. We encourage quality referrals to minimize cancellations."
    },
    {
      question: "Can I refer both businesses and individual customers?",
      answer: "Sales agents earn commissions only on business referrals (businesses listing products/services on our platform). Individual customer sign-ups do not earn commissions for sales agents. Focus on connecting with Black-owned businesses to maximize your earnings."
    },
    {
      question: "How do I share my referral code?",
      answer: "You can share your referral code through various channels: social media, email, text messages, QR codes, or in-person conversations. We provide marketing materials and templates to make sharing easier and more effective."
    },
    {
      question: "Is there a limit to how much I can earn?",
      answer: "There's no limit to your earning potential! The more quality referrals you bring in, the more you can earn. Our top-performing agents earn thousands of dollars per month through consistent referral activities."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-mansablue mb-4">Sales Agent FAQ</h2>
        <p className="text-gray-600">
          Frequently asked questions about our sales agent program
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
            <AccordionTrigger className="text-left font-medium hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="bg-blue-50 rounded-lg p-6 text-center">
        <h3 className="font-semibold text-mansablue mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">
          Can't find the answer you're looking for? Our support team is here to help.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="px-4 py-2 bg-mansablue text-white rounded-lg hover:bg-mansablue-dark transition-colors">
            Contact Agent Support
          </button>
          <button className="px-4 py-2 border border-mansablue text-mansablue rounded-lg hover:bg-mansablue hover:text-white transition-colors">
            Schedule a Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesAgentFAQSection;