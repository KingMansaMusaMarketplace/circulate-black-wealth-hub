import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';

const BusinessFAQ = () => {
  const faqs = [
    {
      question: "When do I receive payment from customer transactions?",
      answer: "Payments are processed instantly through Stripe. The money is available in your Stripe account immediately after the customer completes their payment. You can then transfer funds to your bank account, which typically takes 2-7 business days depending on your bank."
    },
    {
      question: "What fees do I pay as a business owner?",
      answer: "You pay a simple 7.5% platform commission that includes everything: payment processing, customer loyalty program, digital receipts, analytics dashboard, and customer support. There are no hidden fees, monthly charges, or setup costs. Stripe's processing fees (~2.9% + $0.30) are deducted separately, giving you approximately 89-90% of each transaction."
    },
    {
      question: "How do refunds and disputes work?",
      answer: "All refunds and disputes are handled through the MMM platform. If you need to issue a refund, you can do so directly from your dashboard. The platform commission is automatically refunded proportionally. For disputes, our support team works with you and Stripe to resolve issues fairly and quickly."
    },
    {
      question: "Can customers pay without downloading an app?",
      answer: "Yes! Customers can scan your QR code and pay directly through their mobile web browser - no app download required. However, if they want to track loyalty points and rewards, they can optionally create an account for a better experience."
    },
    {
      question: "Do I need special equipment or hardware?",
      answer: "No! All you need is the QR code we provide. You can display it on a table tent, poster, or sticker at your register. Customers scan it with their phone camera - it works with any smartphone. No card readers, terminals, or special equipment needed."
    },
    {
      question: "How does the loyalty program benefit my business?",
      answer: "The built-in loyalty program keeps customers coming back. Customers automatically earn points on every purchase, which they can redeem for rewards at your business. This increases repeat visits and customer lifetime value - all without you having to manage a separate loyalty system."
    },
    {
      question: "What customer data do I get access to?",
      answer: "You get valuable insights including: customer names and contact info (with consent), purchase history, visit frequency, average transaction size, and peak business hours. This helps you understand your customers better and make data-driven decisions - all while respecting customer privacy."
    },
    {
      question: "Is it secure? What about fraud protection?",
      answer: "Absolutely secure! Payments are processed through Stripe, the same trusted platform used by millions of businesses worldwide. All transactions use bank-level encryption and are PCI-DSS compliant. Stripe's fraud detection algorithms protect both you and your customers, and you're covered by Stripe's fraud protection policies."
    },
    {
      question: "Can I use this alongside my existing POS system?",
      answer: "Yes! MMM works alongside any existing payment system. Many businesses use it as an additional payment option for customers who prefer quick mobile payments. You can keep your current setup and add MMM to give customers more flexibility."
    },
    {
      question: "What if I have multiple locations?",
      answer: "Perfect! MMM supports multi-location businesses. Each location gets its own unique QR code, and you can view combined analytics across all locations or drill down into individual location performance. Manage everything from one centralized dashboard."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is simple: 1) Sign up and verify your business (takes 5 minutes), 2) Connect your Stripe account (or create one - it's free), 3) Generate your QR code, 4) Print and display it at your business. You can start accepting payments the same day!"
    },
    {
      question: "What support do you offer?",
      answer: "We offer comprehensive support including: live chat during business hours, email support with 24-hour response time, phone support for urgent issues, detailed help center with video tutorials, and dedicated account managers for high-volume businesses. We're here to help you succeed!"
    }
  ];

  return (
    <Card className="bg-slate-800/60 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <HelpCircle className="h-5 w-5 text-primary" />
          Frequently Asked Questions
        </CardTitle>
        <CardDescription className="text-blue-200/80">
          Everything you need to know about accepting payments with MMM
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-white/10">
              <AccordionTrigger className="text-left text-blue-100/90 hover:text-white">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-blue-200/80">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BusinessFAQ;
