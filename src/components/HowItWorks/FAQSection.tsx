
import React from 'react';

const FAQSection = () => {
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

  return (
    <section className="py-20">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="heading-lg text-mansablue mb-4">Frequently Asked Questions</h2>
        </div>
        
        <div className="max-w-3xl mx-auto divide-y">
          {faqs.map((faq, i) => (
            <div key={i} className="py-6">
              <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
