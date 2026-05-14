
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { HelpCircle, Sparkles } from 'lucide-react';
import { FAQStructuredData } from '@/components/SEO/FAQStructuredData';

const FAQPage = () => {
  const faqs = [
    {
      question: "What is 1325.AI?",
      answer: "1325.AI is a platform that connects consumers with great businesses in their community, helping to strengthen community wealth through strategic economic circulation."
    },
    {
      question: "How do I sign up?",
      answer: "You can sign up by clicking the 'Sign Up' button in the top right corner of any page. Choose whether you're a customer or business owner and follow the registration process."
    },
    {
      question: "Is there a fee to use the platform?",
      answer: "Customers are ALWAYS FREE with full access to loyalty programs, QR scanning, and rewards. For businesses, we're running a Founding 100 Offer: the first 100 businesses lock in Pro at $149/mo — forever. After 100 spots are claimed, Pro is $249/mo. Corporate sponsorships (for companies wanting to support the platform) are also available starting at $500/month."
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Helmet>
        <title>FAQ - Frequently Asked Questions | 1325.AI</title>
        <meta name="description" content="Find answers to common questions about 1325.AI - how to sign up, use loyalty points, and support community businesses." />
      </Helmet>
      <FAQStructuredData faqs={faqs} />

      {/* Subtle ambient accent */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[600px] opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, hsl(var(--mansagold) / 0.06), transparent 70%)',
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-mansagold/10 border border-mansagold/30 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-mansagold" />
            <span className="font-semibold text-white">Help Center</span>
          </div>

          <div className="inline-block mb-6">
            <div className="p-5 bg-mansagold/10 ring-1 ring-mansagold/30 rounded-2xl">
              <HelpCircle className="h-16 w-16 text-mansagold" />
            </div>
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-white">Frequently Asked </span>
            <span className="text-mansagold">Questions</span>
          </h1>
          <p className="text-xl text-slate-400">
            Find answers to common questions about 1325.AI
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-8 md:p-10">
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
                    className="border border-white/10 rounded-xl overflow-hidden bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <AccordionTrigger className="text-left text-white hover:text-mansagold font-semibold px-6 py-5 text-lg hover:no-underline">
                      <span className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-mansagold/15 ring-1 ring-mansagold/40 flex items-center justify-center text-mansagold text-sm font-bold">
                          {index + 1}
                        </span>
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-300 px-6 pb-5 pt-0 leading-relaxed text-base">
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
          <div className="bg-slate-900/40 border border-mansagold/20 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="font-display text-2xl font-bold tracking-tight text-white mb-3">Still have questions?</h3>
            <p className="text-slate-400 mb-6">
              Our team is here to help. Reach out and we'll get back to you as soon as possible.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-mansagold text-black font-medium rounded-xl hover:bg-mansagold/90 transition-colors"
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
