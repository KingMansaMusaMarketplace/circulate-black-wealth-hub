
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SponsorshipFAQ = () => {
  const faqs = [
    {
      question: "What does my sponsorship money support?",
      answer: "Your sponsorship directly supports the Mansa Musa Marketplace platform and its mission to promote economic circulation in Black communities. Funds are used for technology development, community outreach, educational initiatives, and supporting businesses on our platform."
    },
    {
      question: "How long is the sponsorship commitment?",
      answer: "We offer both monthly and annual sponsorship options. Annual sponsors receive a 15% discount compared to monthly payments. The minimum commitment period is 3 months for all sponsorship tiers."
    },
    {
      question: "Can we customize our sponsorship package?",
      answer: "Yes! While we offer structured tiers, we understand that each organization has unique needs and goals. Our Platinum tier offers the most customization, but we're happy to discuss tailored solutions for any sponsor."
    },
    {
      question: "How will our brand be represented?",
      answer: "Your brand will be featured on our platform in alignment with your sponsorship tier. This includes logo placement, feature spotlights, and co-branded content opportunities. We work closely with sponsors to ensure brand representation meets your standards."
    },
    {
      question: "What metrics will be shared to measure impact?",
      answer: "Sponsors receive regular reports measuring community economic impact, including metrics on circulation dollars, businesses supported, transaction volume, and community engagement. Higher tier sponsors receive more detailed analytics and custom reporting."
    },
    {
      question: "How can we maximize our sponsorship value?",
      answer: "We encourage sponsors to actively engage with our community through events, content collaboration, and social media. Our team will work with you to develop strategies that align with your marketing and CSR goals to maximize visibility and impact."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Common questions about our corporate sponsorship program.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Have more questions? Contact our sponsorship team at{' '}
              <a href="mailto:sponsorships@mansamusamarketplace.com" className="text-mansablue font-medium">
                sponsorships@mansamusamarketplace.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorshipFAQ;
